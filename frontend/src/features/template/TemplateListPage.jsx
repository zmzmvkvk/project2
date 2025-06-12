import { useNavigate } from "react-router-dom";
// import { useTemplates } from "./hooks/useTemplates"; // 더 이상 사용하지 않음
import TemplateCard from "./components/TemplateCard";

const categories = [
  // 이제 이 카테고리들이 템플릿 카드 자체가 됩니다.
  { value: "dance", label: "AI 댄스/모션 챌린지" },
  { value: "story", label: "AI 스토리 애니메이션" },
  { value: "beforeafter", label: "AI 변신 (Before/After)" },
  { value: "comedy", label: "AI 코미디/상황극" },
];

const TemplateListPage = () => {
  const navigate = useNavigate();
  // const { data: templates, isLoading, isError } = useTemplates(); // 더 이상 사용하지 않음

  // 카드 클릭 핸들러: 새 프로젝트 페이지로 이동하며 카테고리 정보 전달
  const handleCardClick = (category) => {
    navigate("/projects/new", { state: { category: category.value } });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-8">쇼츠 템플릿 목록</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <TemplateCard
            key={category.value}
            category={category} // category prop으로 전달
            onClick={() => handleCardClick(category)}
          />
        ))}
      </div>
      {/* 템플릿이 없을 때 메시지는 이제 필요 없음, 항상 카테고리 카드가 표시됨 */}
    </div>
  );
};

export default TemplateListPage;
