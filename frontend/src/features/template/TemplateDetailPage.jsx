import { useParams, useNavigate } from "react-router-dom";
import { useTemplate } from "./hooks/useTemplates";

const TemplateDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: template, isLoading, isError } = useTemplate(id);

  if (isLoading) return <div>로딩 중...</div>;
  if (isError || !template) return <div>템플릿 정보를 불러올 수 없습니다.</div>;

  return (
    <div>
      <button className="mb-4 text-blue-600" onClick={() => navigate(-1)}>
        &larr; 목록으로
      </button>
      <h2 className="text-2xl font-bold mb-2">{template.name}</h2>
      <div className="mb-2 text-gray-700">{template.description}</div>
      <div className="text-gray-400 text-sm">ID: {template.id}</div>
    </div>
  );
};

export default TemplateDetailPage;
