import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateProject } from "./hooks/useProjects";
import { useForm } from "react-hook-form";

const categoryOptions = [
  {
    id: "dance",
    name: "AI 댄스/모션 챌린지",
    description: "AI를 활용한 댄스와 모션 챌린지 콘텐츠를 제작합니다.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    id: "story",
    name: "AI 스토리 애니메이션",
    description: "AI를 활용한 스토리 기반 애니메이션을 제작합니다.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
        />
      </svg>
    ),
  },
  {
    id: "beforeafter",
    name: "AI 변신 (Before/After)",
    description: "AI를 활용한 변신 콘텐츠를 제작합니다.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    id: "comedy",
    name: "AI 코미디/상황극",
    description: "AI를 활용한 코미디와 상황극 콘텐츠를 제작합니다.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
];

const ProjectNewPage = () => {
  const navigate = useNavigate();
  const createProjectMutation = useCreateProject();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    if (!selectedCategory) {
      alert("템플릿을 선택해주세요.");
      return;
    }

    try {
      const newProject = await createProjectMutation.mutateAsync({
        ...data,
        category: selectedCategory,
      });
      navigate(`/projects/${newProject.id}`);
    } catch (error) {
      console.error("프로젝트 생성 중 오류 발생:", error);
      alert("프로젝트 생성 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">새 프로젝트 만들기</h1>
        <button
          onClick={() => navigate(-1)}
          className="text-gray-600 hover:text-gray-900"
        >
          취소
        </button>
      </div>

      {/* 템플릿 선택 섹션 */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4">템플릿 선택</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categoryOptions.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`p-4 border rounded-lg text-left transition-all ${
                selectedCategory === category.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`p-2 rounded-lg ${
                    selectedCategory === category.id
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {category.icon}
                </div>
                <div>
                  <h3 className="font-medium">{category.name}</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    {category.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 프로젝트 정보 입력 폼 */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">프로젝트 정보</h2>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                프로젝트 이름
              </label>
              <input
                type="text"
                id="name"
                {...register("name", {
                  required: "프로젝트 이름을 입력해주세요.",
                  maxLength: {
                    value: 50,
                    message: "프로젝트 이름은 50자 이내로 입력해주세요.",
                  },
                })}
                className={`mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="프로젝트 이름을 입력하세요"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                프로젝트 설명
              </label>
              <textarea
                id="description"
                {...register("description", {
                  maxLength: {
                    value: 200,
                    message: "프로젝트 설명은 200자 이내로 입력해주세요.",
                  },
                })}
                rows={3}
                className={`mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  errors.description ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="프로젝트에 대한 설명을 입력하세요"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 선택된 템플릿 표시 */}
        {selectedCategory && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-blue-700">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>
                선택된 템플릿:{" "}
                {categoryOptions.find((c) => c.id === selectedCategory)?.name}
              </span>
            </div>
          </div>
        )}

        {/* 제출 버튼 */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={createProjectMutation.isLoading}
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createProjectMutation.isLoading
              ? "프로젝트 생성 중..."
              : "프로젝트 생성"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectNewPage;
