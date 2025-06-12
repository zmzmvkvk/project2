import { useState } from "react";

const categories = [
  { value: "dance", label: "AI 댄스/모션 챌린지" },
  { value: "story", label: "AI 스토리 애니메이션" },
  { value: "beforeafter", label: "AI 변신 (Before/After)" },
  { value: "comedy", label: "AI 코미디/상황극" },
];

const TemplateForm = ({ onSubmit, loading }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(categories[0].value);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, description, category });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-6 rounded shadow max-w-md mx-auto"
    >
      <div>
        <label className="block font-medium mb-1">템플릿 이름</label>
        <input
          className="w-full border px-3 py-2 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block font-medium mb-1">설명</label>
        <textarea
          className="w-full border px-3 py-2 rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div>
        <label className="block font-medium mb-1">카테고리</label>
        <select
          className="w-full border px-3 py-2 rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>
      {/* 추후 장면, 요소, 플레이스홀더 등 템플릿 구조 확장 가능 */}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? "저장 중..." : "저장"}
      </button>
    </form>
  );
};

export default TemplateForm;
