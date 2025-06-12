import { useImageGeneration } from "../hooks/useImageGeneration";

const ImageGenerationForm = ({ projectId, onImageGenerated }) => {
  const {
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
  } = useImageGeneration(projectId, onImageGenerated);

  if (isLoadingPrompts) {
    return <div>프롬프트 로딩 중...</div>;
  }

  if (promptsError) {
    return <div>프롬프트 불러오기 오류: {promptsError.message}</div>;
  }

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
