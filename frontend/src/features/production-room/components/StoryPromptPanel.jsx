import React from "react";
import { useStoryPromptGeneration } from "../hooks/useStoryPromptGeneration";

const StoryPromptPanel = () => {
  const {
    storyKeywords,
    setStoryKeywords,
    isGeneratingStory,
    storyError,
    handleGenerateStoryPrompt,
  } = useStoryPromptGeneration();

  return (
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
  );
};

export default StoryPromptPanel;
