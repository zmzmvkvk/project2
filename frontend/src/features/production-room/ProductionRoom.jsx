import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useProject } from "../project/hooks/useProjects";
import ImageGenerationForm from "../asset/components/ImageGenerationForm";
import { useAssetManagement } from "../asset/hooks/useAssetManagement";
import StoryPromptPanel from "./components/StoryPromptPanel";
import VideoGenerationPanel from "./components/VideoGenerationPanel";
import AssetPreviewPanel from "./components/AssetPreviewPanel";

const ProductionRoom = () => {
  const { id: projectId } = useParams();
  const navigate = useNavigate();
  const { data: project, refetch: refetchProject } = useProject(projectId);

  const { images, isImagesLoading, imagesError, refetchImages } =
    useAssetManagement(projectId);

  const [activeTab, setActiveTab] = useState("generate");
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState(null);
  const [exportType, setExportType] = useState("image-sequence"); // 'image-sequence' 또는 'video'
  const [videoOptions, setVideoOptions] = useState({
    fps: 30,
    duration: 3,
    resolution: "1080p",
    format: "mp4",
    audioUrl: "", // 오디오 URL 상태 추가
  });

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      // 이곳의 정리 로직은 이제 VideoGenerationPanel 내부에 있습니다.
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

  // 이미지 시퀀스 내보내기
  const handleExportImageSequence = async () => {
    if (!images || images.length === 0) {
      setExportError("내보낼 이미지가 없습니다.");
      return;
    }

    setIsExporting(true);
    setExportError(null);

    try {
      const scenes = images.map((image, index) => ({
        imageUrl: image.url,
        order: index + 1,
      }));

      const response = await axios.post("/api/export/image-sequence", {
        scenes,
      });

      if (response.data.success) {
        // 다운로드 링크 생성 및 클릭
        const downloadUrl = response.data.downloadUrl;
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = `${project.name}_image_sequence.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error("이미지 시퀀스 내보내기 실패:", error);
      setExportError("이미지 시퀀스 내보내기에 실패했습니다.");
    } finally {
      setIsExporting(false);
    }
  };

  // 비디오 내보내기
  const handleExportVideo = async () => {
    if (!images || images.length === 0) {
      setExportError("내보낼 이미지가 없습니다.");
      return;
    }

    setIsExporting(true);
    setExportError(null);

    try {
      const scenes = images.map((image, index) => ({
        imageUrl: image.url,
        order: index + 1,
      }));

      const response = await axios.post("/api/export/video", {
        scenes,
        options: videoOptions,
      });

      if (response.data.success) {
        // 다운로드 링크 생성 및 클릭
        const downloadUrl = response.data.downloadUrl;
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = `${project.name}_video.${videoOptions.format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error("비디오 내보내기 실패:", error);
      setExportError("비디오 내보내기에 실패했습니다.");
    } finally {
      setIsExporting(false);
    }
  };

  // 내보내기 처리
  const handleExport = () => {
    if (exportType === "image-sequence") {
      handleExportImageSequence();
    } else {
      handleExportVideo();
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
        <div className="flex items-center gap-4">
          <p className="text-gray-600 max-w-md">{project.description}</p>
          <div className="flex items-center gap-2">
            <select
              value={exportType}
              onChange={(e) => setExportType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="image-sequence">이미지 시퀀스</option>
              <option value="video">비디오</option>
            </select>
            {exportType === "video" && (
              <div className="flex items-center gap-2">
                <select
                  value={videoOptions.resolution}
                  onChange={(e) =>
                    setVideoOptions((prev) => ({
                      ...prev,
                      resolution: e.target.value,
                    }))
                  }
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="720p">720p</option>
                  <option value="1080p">1080p</option>
                  <option value="4k">4K</option>
                </select>
                <select
                  value={videoOptions.fps}
                  onChange={(e) =>
                    setVideoOptions((prev) => ({
                      ...prev,
                      fps: Number(e.target.value),
                    }))
                  }
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="24">24 FPS</option>
                  <option value="30">30 FPS</option>
                  <option value="60">60 FPS</option>
                </select>
                <input
                  type="number"
                  value={videoOptions.duration}
                  onChange={(e) =>
                    setVideoOptions((prev) => ({
                      ...prev,
                      duration: Number(e.target.value),
                    }))
                  }
                  min="1"
                  max="10"
                  className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="장면 길이(초)"
                />
                <input
                  type="text"
                  value={videoOptions.audioUrl}
                  onChange={(e) =>
                    setVideoOptions((prev) => ({
                      ...prev,
                      audioUrl: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="배경 음악 URL (선택 사항)"
                />
              </div>
            )}
            <button
              onClick={handleExport}
              disabled={isExporting || !images || images.length === 0}
              className={`px-4 py-2 rounded-md font-semibold text-white transition-colors ${
                isExporting || !images || images.length === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isExporting ? "내보내는 중..." : "내보내기"}
            </button>
          </div>
        </div>
      </div>

      {exportError && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <span className="block sm:inline">{exportError}</span>
        </div>
      )}

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
                <StoryPromptPanel />

                {/* AI 영상 생성 */}
                <VideoGenerationPanel
                  images={images}
                  saveGeneratedContentToProject={saveGeneratedContentToProject}
                />
              </div>
            </div>
          )}

          {activeTab === "assets" && (
            <AssetPreviewPanel
              images={images}
              isImagesLoading={isImagesLoading}
              imagesError={imagesError}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductionRoom;
