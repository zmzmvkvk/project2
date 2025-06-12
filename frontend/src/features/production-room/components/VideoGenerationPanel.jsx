import React from "react";
import { useVideoGeneration } from "../hooks/useVideoGeneration";

const VideoGenerationPanel = ({ images, saveGeneratedContentToProject }) => {
  const {
    videoImageId,
    setVideoImageId,
    videoPrompt,
    setVideoPrompt,
    isVideoLoading,
    videoError,
    transitionType,
    setTransitionType,
    transitionDuration,
    setTransitionDuration,
    textOverlayContent,
    setTextOverlayContent,
    textOverlayPosition,
    setTextOverlayPosition,
    enableSubtitles,
    setEnableSubtitles,
    subtitleLanguage,
    setSubtitleLanguage,
    backgroundMusicUrl,
    setBackgroundMusicUrl,
    handleGenerateVideo,
  } = useVideoGeneration(images, saveGeneratedContentToProject);

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

        {/* 전환 효과 선택 */}
        <div>
          <label
            htmlFor="transitionType"
            className="block text-sm font-medium text-gray-700"
          >
            전환 효과
          </label>
          <select
            id="transitionType"
            value={transitionType}
            onChange={(e) => setTransitionType(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="fade">페이드</option>
            <option value="dissolve">디졸브</option>
            <option value="slide">슬라이드</option>
            {/* 추가 전환 효과 옵션 */}
          </select>
        </div>

        {/* 전환 효과 지속 시간 */}
        <div>
          <label
            htmlFor="transitionDuration"
            className="block text-sm font-medium text-gray-700"
          >
            전환 효과 지속 시간 (초)
          </label>
          <input
            type="number"
            id="transitionDuration"
            value={transitionDuration}
            onChange={(e) => setTransitionDuration(Number(e.target.value))}
            min="0.1"
            step="0.1"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        {/* 텍스트 오버레이 내용 */}
        <div>
          <label
            htmlFor="textOverlayContent"
            className="block text-sm font-medium text-gray-700"
          >
            텍스트 오버레이 내용 (선택 사항)
          </label>
          <textarea
            id="textOverlayContent"
            value={textOverlayContent}
            onChange={(e) => setTextOverlayContent(e.target.value)}
            rows={2}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="영상에 추가할 텍스트를 입력하세요."
          ></textarea>
        </div>

        {/* 텍스트 오버레이 위치 */}
        <div>
          <label
            htmlFor="textOverlayPosition"
            className="block text-sm font-medium text-gray-700"
          >
            텍스트 오버레이 위치
          </label>
          <select
            id="textOverlayPosition"
            value={textOverlayPosition}
            onChange={(e) => setTextOverlayPosition(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="top">상단</option>
            <option value="bottom">하단</option>
            <option value="center">중앙</option>
            {/* 추가 위치 옵션 */}
          </select>
        </div>

        {/* 자막 생성 옵션 */}
        <div className="flex items-center">
          <input
            id="enableSubtitles"
            type="checkbox"
            checked={enableSubtitles}
            onChange={(e) => setEnableSubtitles(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label
            htmlFor="enableSubtitles"
            className="ml-2 block text-sm font-medium text-gray-700"
          >
            자막 생성 활성화
          </label>
        </div>

        {/* 자막 언어 선택 */}
        {enableSubtitles && (
          <div>
            <label
              htmlFor="subtitleLanguage"
              className="block text-sm font-medium text-gray-700"
            >
              자막 언어
            </label>
            <select
              id="subtitleLanguage"
              value={subtitleLanguage}
              onChange={(e) => setSubtitleLanguage(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="ko-KR">한국어</option>
              <option value="en-US">영어</option>
              {/* 추가 언어 옵션 */}
            </select>
          </div>
        )}

        {/* 배경 음악 URL */}
        <div>
          <label
            htmlFor="backgroundMusicUrl"
            className="block text-sm font-medium text-gray-700"
          >
            배경 음악 URL (선택 사항)
          </label>
          <input
            type="text"
            id="backgroundMusicUrl"
            value={backgroundMusicUrl}
            onChange={(e) => setBackgroundMusicUrl(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="배경 음악 파일의 URL을 입력하세요."
          />
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
