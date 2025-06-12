import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { generateImage } from "../api/assetApi";
import axios from "axios";

export const useImageGeneration = (projectId, onImageGenerated) => {
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [style, setStyle] = useState("realistic");
  const [selectedPromptId, setSelectedPromptId] = useState("");

  // 저장된 프롬프트 목록 조회
  const {
    data: savedPrompts = [],
    isLoading: isLoadingPrompts,
    error: promptsError,
  } = useQuery({
    queryKey: ["savedPrompts"],
    queryFn: async () => {
      const response = await axios.get("/api/prompts");
      return response.data;
    },
  });

  const generateMutation = useMutation({
    mutationFn: generateImage,
    onSuccess: (data) => {
      // 성공 시 폼 초기화
      setPrompt("");
      setNegativePrompt("");
      setSelectedPromptId("");
      if (onImageGenerated) {
        onImageGenerated(data.imageUrl); // 생성된 이미지 URL 전달
      }
    },
    onError: (error) => {
      console.error("Error generating image:", error);
      alert("이미지 생성에 실패했습니다.");
    },
  });

  // 저장된 프롬프트 선택 시 처리
  const handlePromptSelect = (promptId) => {
    const selectedPrompt = savedPrompts.find((p) => p.id === promptId);
    if (selectedPrompt) {
      setPrompt(selectedPrompt.content);
      setSelectedPromptId(promptId);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    generateMutation.mutate({
      prompt,
      projectId, // projectId 추가
      negativePrompt,
      aspectRatio,
      style,
      promptId: selectedPromptId, // 선택된 프롬프트 ID도 함께 전송
    });
  };

  return {
    prompt,
    setPrompt,
    negativePrompt,
    setNegativePrompt,
    aspectRatio,
    setAspectRatio,
    style,
    setStyle,
    selectedPromptId,
    setSelectedPromptId,
    savedPrompts,
    isLoadingPrompts,
    promptsError,
    generateMutation,
    handlePromptSelect,
    handleSubmit,
  };
};
