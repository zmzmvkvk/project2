import { useNavigate } from "react-router-dom";
import { useCreateTemplate } from "./hooks/useTemplates";
import TemplateForm from "./components/TemplateForm";

const TemplateNewPage = () => {
  const navigate = useNavigate();
  const createTemplate = useCreateTemplate();

  const handleSubmit = async (data) => {
    await createTemplate.mutateAsync(data);
    navigate("/templates");
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">새 템플릿 생성</h2>
      <TemplateForm
        onSubmit={handleSubmit}
        loading={createTemplate.isLoading}
      />
    </div>
  );
};

export default TemplateNewPage;
