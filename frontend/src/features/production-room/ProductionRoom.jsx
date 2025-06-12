import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useProject } from "../project/hooks/useProjects";
import ImageGenerationForm from "../asset/components/ImageGenerationForm";
import ImageGrid from "../asset/components/ImageGrid";
import { useImages } from "../asset/hooks/useImages";

const ProductionRoom = () => {
  const { id: projectId } = useParams();
  const navigate = useNavigate();
  const { data: project, refetch: refetchProject } = useProject(projectId);
  const {
    data: images,
    isLoading: isImagesLoading,
    error: imagesError,
    refetch: refetchImages,
  } = useImages(projectId);

  const [activeTab, setActiveTab] = useState("generate");

  // 스토리 프롬프트 관련 상태
  const [storyKeywords, setStoryKeywords] = useState("");
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);
  const [storyError, setStoryError] = useState(null);

  // 영상 생성 관련 상태
  const [videoImageId, setVideoImageId] = useState("");
  const [videoPrompt, setVideoPrompt] = useState("");
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [videoError, setVideoError] = useState(null);
  const videoPollingIntervalRef = useRef(null);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (videoPollingIntervalRef.current) {
        clearInterval(videoPollingIntervalRef.current);
      }
    };
  }, []);

  // 생성된 콘텐츠를 프로젝트에 저장 (onImageGenerated prop으로 전달)
  const saveGeneratedContentToProject = async (contentUrl) => {
    try {
      const updatedContents = project.generatedContents
        ? [...project.generatedContents, contentUrl]
        : [contentUrl];
      await axios.patch(`/api/projects/${projectId}`, {
        generatedContents: updatedContents,
      });
      console.log(
        "Generated content saved to project successfully!",
        contentUrl
      );
      refetchProject();
      refetchImages();
    } catch (err) {
      console.error("Failed to save generated content to project:", err);
    }
  };

  // 영상 생성 폴링
  const startVideoPolling = (generationId) => {
    if (videoPollingIntervalRef.current) {
      clearInterval(videoPollingIntervalRef.current);
    }

    videoPollingIntervalRef.current = setInterval(async () => {
      try {
        const statusResponse = await axios.get(
          `/api/generate/video-status/${generationId}`
        );

        if (
          statusResponse.data.status === "COMPLETE" &&
          statusResponse.data.videoUrl
        ) {
          const videoUrl = statusResponse.data.videoUrl;
          setIsVideoLoading(false);
          clearInterval(videoPollingIntervalRef.current);
          videoPollingIntervalRef.current = null;
          saveGeneratedContentToProject(videoUrl);
        } else if (statusResponse.data.status === "PENDING") {
          // setGeneratedContent(`영상 생성 중... (ID: ${generationId})`);
        } else {
          setVideoError("영상 생성 상태를 확인할 수 없습니다.");
          setIsVideoLoading(false);
          clearInterval(videoPollingIntervalRef.current);
          videoPollingIntervalRef.current = null;
        }
      } catch (pollErr) {
        console.error("영상 폴링 중 오류 발생:", pollErr);
        setVideoError(
          "영상 상태 확인 중 오류 발생: " +
            (pollErr.response?.data?.message || pollErr.message)
        );
        setIsVideoLoading(false);
        clearInterval(videoPollingIntervalRef.current);
        videoPollingIntervalRef.current = null;
      }
    }, 3000);
  };

  // 스토리 프롬프트 생성
  const handleGenerateStoryPrompt = async () => {
    if (!storyKeywords.trim()) {
      alert("스토리 생성을 위한 키워드를 입력해주세요.");
      return;
    }

    setIsGeneratingStory(true);
    setStoryError(null);

    try {
      const keywordsArray = storyKeywords
        .split(",")
        .map((k) => k.trim())
        .filter((k) => k.length > 0);
      const response = await axios.post("/api/generate/story", {
        keywords: keywordsArray,
      });

      if (response.data.storyPrompt) {
        console.log("Generated Story Prompt:", response.data.storyPrompt);
        alert(
          "스토리 프롬프트가 생성되었습니다. 이미지 생성 탭에서 활용하세요."
        );
      } else {
        setStoryError(
          "스토리 프롬프트 생성 실패: 응답에서 스토리를 받지 못했습니다."
        );
      }
    } catch (err) {
      console.error("스토리 프롬프트 생성 오류:", err);
      setStoryError(
        "스토리 프롬프트 생성 중 오류 발생: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setIsGeneratingStory(false);
    }
  };

  // 영상 생성
  const handleGenerateVideo = async () => {
    if (!videoImageId) {
      alert("영상을 생성할 이미지 ID를 입력해주세요.");
      return;
    }

    setIsVideoLoading(true);
    setVideoError(null);

    try {
      const response = await axios.post("/api/generate/video", {
        imageId: videoImageId,
        prompt: videoPrompt,
      });

      if (response.data.generationId) {
        startVideoPolling(response.data.generationId);
      } else {
        setVideoError("영상 생성 요청 실패: generationId를 받지 못했습니다.");
        setIsVideoLoading(false);
      }
    } catch (err) {
      console.error("AI 영상 생성 요청 오류:", err);
      setVideoError(
        "AI 영상 생성 요청 중 오류가 발생했습니다: " +
          (err.response?.data?.message || err.message)
      );
      setIsVideoLoading(false);
    }
  };

  if (!project) {
    return <div>프로젝트 정보를 불러오는 중입니다...</div>;
  }

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* 프로젝트 헤더 */}
      <div className="flex items-center justify-between bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <button
            onClick={() => navigate(`/projects/${projectId}`)}
            className="text-blue-600 hover:text-blue-800 transition-colors"
            aria-label="프로젝트 상세 페이지로 이동"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7 inline-block align-middle"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z"
              />
            </svg>
          </button>
          <span>{project.name} 제작실</span>
        </h1>
        <p className="text-gray-600 max-w-md">{project.description}</p>
      </div>

      {/* 탭 네비게이션 */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <nav className="flex border-b border-gray-200" aria-label="Tabs">
          <button
            onClick={() => setActiveTab("generate")}
            className={`flex-1 text-center py-4 px-1 border-b-4 font-semibold text-base transition-colors duration-200 ease-in-out ${
              activeTab === "generate"
                ? "border-blue-500 text-blue-600 bg-blue-50"
                : "border-transparent text-gray-700 hover:text-gray-900 hover:border-gray-300"
            }`}
          >
            콘텐츠 생성
          </button>
          <button
            onClick={() => setActiveTab("assets")}
            className={`flex-1 text-center py-4 px-1 border-b-4 font-semibold text-base transition-colors duration-200 ease-in-out ${
              activeTab === "assets"
                ? "border-blue-500 text-blue-600 bg-blue-50"
                : "border-transparent text-gray-700 hover:text-gray-900 hover:border-gray-300"
            }`}
          >
            내 애셋
          </button>
        </nav>

        {/* 탭 콘텐츠 */}
        <div className="p-6">
          {activeTab === "generate" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* AI 이미지 생성 */}
              <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  AI 이미지 생성
                </h3>
                <ImageGenerationForm
                  projectId={projectId}
                  onImageGenerated={saveGeneratedContentToProject}
                />
              </div>

              <div className="space-y-6">
                {/* AI 스토리 프롬프트 생성 */}
                <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">
                    AI 스토리 프롬프트 생성
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="storyKeywords"
                        className="block text-sm font-medium text-gray-700"
                      >
                        스토리 키워드 (쉼표로 구분)
                      </label>
                      <input
                        type="text"
                        id="storyKeywords"
                        value={storyKeywords}
                        onChange={(e) => setStoryKeywords(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="예: 행복, 강아지, 공원, 모험"
                      />
                    </div>
                    <button
                      onClick={handleGenerateStoryPrompt}
                      disabled={isGeneratingStory}
                      className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 transition-colors"
                    >
                      {isGeneratingStory
                        ? "스토리 프롬프트 생성 중..."
                        : "스토리 프롬프트 생성"}
                    </button>
                    {storyError && (
                      <p className="text-red-500 text-sm mt-2">{storyError}</p>
                    )}
                  </div>
                </div>

                {/* AI 영상 생성 */}
                <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">
                    AI 영상 생성
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="videoImageId"
                        className="block text-sm font-medium text-gray-700"
                      >
                        영상을 생성할 이미지 선택
                      </label>
                      {images && images.length > 0 ? (
                        <select
                          id="videoImageId"
                          value={videoImageId}
                          onChange={(e) => setVideoImageId(e.target.value)}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                          <option value="">이미지를 선택해주세요</option>
                          {images.map((image) => (
                            <option key={image.id} value={image.id}>
                              {image.name || `Image ID: ${image.id}`}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <p className="mt-1 text-sm text-gray-500">
                          생성된 이미지가 없습니다. 먼저 이미지를 생성해주세요.
                        </p>
                      )}
                    </div>
                    {videoImageId && (
                      <div className="mt-2 p-4 border border-gray-200 rounded-md bg-gray-50">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                          선택된 이미지 미리보기:
                        </h4>
                        <img
                          src={
                            images.find((img) => img.id === videoImageId)?.url
                          }
                          alt="Selected for video"
                          className="max-w-full h-48 object-contain rounded-md shadow-sm"
                        />
                      </div>
                    )}
                    <div>
                      <label
                        htmlFor="videoPrompt"
                        className="block text-sm font-medium text-gray-700"
                      >
                        영상 프롬프트 (선택 사항)
                      </label>
                      <textarea
                        id="videoPrompt"
                        value={videoPrompt}
                        onChange={(e) => setVideoPrompt(e.target.value)}
                        rows={3}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="생성될 영상에 대한 추가 설명 (예: 강아지가 춤을 추는 발랄한 영상)"
                      ></textarea>
                    </div>
                    <button
                      onClick={handleGenerateVideo}
                      disabled={isVideoLoading || !videoImageId}
                      className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
                    >
                      {isVideoLoading ? "영상 생성 중..." : "영상 생성"}
                    </button>
                    {videoError && (
                      <p className="text-red-500 text-sm mt-2">{videoError}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "assets" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800">내 애셋</h2>
              {isImagesLoading ? (
                <div className="text-gray-500">애셋을 불러오는 중...</div>
              ) : imagesError ? (
                <div className="text-red-500">
                  애셋을 불러오는 중 오류 발생: {imagesError.message}
                </div>
              ) : images && images.length > 0 ? (
                <ImageGrid images={images} />
              ) : (
                <div className="text-gray-500">생성된 애셋이 없습니다.</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductionRoom;
