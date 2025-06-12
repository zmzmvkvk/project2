import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { generateImage } from "../api/assetApi";
import axios from "axios";

const ImageGenerationForm = () => {
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [style, setStyle] = useState("realistic");
  const [selectedPromptId, setSelectedPromptId] = useState("");

  // 저장된 프롬프트 목록 조회
  const { data: savedPrompts = [] } = useQuery({
    queryKey: ["savedPrompts"],
    queryFn: async () => {
      const response = await axios.get("/api/prompts");
      return response.data;
    },
  });

  const generateMutation = useMutation({
    mutationFn: generateImage,
    onSuccess: () => {
      // 성공 시 폼 초기화
      setPrompt("");
      setNegativePrompt("");
      setSelectedPromptId("");
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
      negativePrompt,
      aspectRatio,
      style,
      promptId: selectedPromptId, // 선택된 프롬프트 ID도 함께 전송
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-6 rounded-lg shadow"
    >
      <h2 className="text-xl font-semibold mb-4">이미지 생성</h2>

      {/* 저장된 프롬프트 선택 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          저장된 프롬프트
        </label>
        <select
          value={selectedPromptId}
          onChange={(e) => handlePromptSelect(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
        >
          <option value="">프롬프트 선택...</option>
          {savedPrompts.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          프롬프트
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
          rows={3}
          placeholder="원하는 이미지를 설명해주세요..."
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          네거티브 프롬프트
        </label>
        <textarea
          value={negativePrompt}
          onChange={(e) => setNegativePrompt(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
          rows={2}
          placeholder="제외하고 싶은 요소를 설명해주세요..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          이미지 비율
        </label>
        <select
          value={aspectRatio}
          onChange={(e) => setAspectRatio(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
        >
          <option value="1:1">1:1 (정사각형)</option>
          <option value="16:9">16:9 (와이드스크린)</option>
          <option value="9:16">9:16 (세로)</option>
          <option value="4:3">4:3 (표준)</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          스타일
        </label>
        <select
          value={style}
          onChange={(e) => setStyle(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
        >
          <option value="realistic">사실적</option>
          <option value="anime">애니메이션</option>
          <option value="painting">회화</option>
          <option value="sketch">스케치</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={generateMutation.isLoading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
      >
        {generateMutation.isLoading ? "생성 중..." : "이미지 생성"}
      </button>
    </form>
  );
};

export default ImageGenerationForm;
