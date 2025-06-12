import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const VideoGenerationPanel = ({ images, saveGeneratedContentToProject }) => {
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

  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">AI 영상 생성</h3>
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
              src={images.find((img) => img.id === videoImageId)?.url}
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
  );
};

export default VideoGenerationPanel;
