import { useState } from "react";
import axios from "axios";

export const useStoryPromptGeneration = () => {
  const [storyKeywords, setStoryKeywords] = useState("");
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);
  const [storyError, setStoryError] = useState(null);

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

  return {
    storyKeywords,
    setStoryKeywords,
    isGeneratingStory,
    storyError,
    handleGenerateStoryPrompt,
  };
};
