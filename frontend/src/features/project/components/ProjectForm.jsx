import { useForm } from "react-hook-form";

const categories = [
  { value: "", label: "카테고리 선택" }, // 기본값 추가
  { value: "dance", label: "AI 댄스/모션 챌린지" },
  { value: "story", label: "AI 스토리 애니메이션" },
  { value: "beforeafter", label: "AI 변신 (Before/After)" },
  { value: "comedy", label: "AI 코미디/상황극" },
];

const ProjectForm = ({ onSubmit, loading, selectedCategory }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <form
      id="projectForm"
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          프로젝트 이름 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          {...register("name", {
            required: "프로젝트 이름을 입력해주세요",
            minLength: {
              value: 2,
              message: "프로젝트 이름은 2자 이상이어야 합니다",
            },
            maxLength: {
              value: 50,
              message: "프로젝트 이름은 50자 이하여야 합니다",
            },
          })}
          className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
            errors.name ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="프로젝트 이름을 입력하세요"
          disabled={loading}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          프로젝트 설명
        </label>
        <textarea
          id="description"
          {...register("description", {
            maxLength: {
              value: 500,
              message: "프로젝트 설명은 500자 이하여야 합니다",
            },
          })}
          className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
            errors.description ? "border-red-500" : "border-gray-300"
          }`}
          rows="4"
          placeholder="프로젝트에 대한 설명을 입력하세요"
          disabled={loading}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-500">
            {errors.description.message}
          </p>
        )}
      </div>

      {selectedCategory && (
        <div className="p-4 bg-blue-50 rounded-md">
          <p className="text-sm text-blue-700">
            선택된 템플릿:{" "}
            {selectedCategory === "dance"
              ? "AI 댄스/모션 챌린지"
              : selectedCategory === "story"
              ? "AI 스토리 애니메이션"
              : selectedCategory === "beforeafter"
              ? "AI 변신 (Before/After)"
              : "AI 코미디/상황극"}
          </p>
        </div>
      )}

      {loading && (
        <div className="text-center text-gray-500">
          프로젝트를 생성하는 중입니다...
        </div>
      )}
    </form>
  );
};

export default ProjectForm;
