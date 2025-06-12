import { format, isValid } from "date-fns";
import { ko } from "date-fns/locale";

const categoryLabels = {
  dance: "AI 댄스/모션 챌린지",
  story: "AI 스토리 애니메이션",
  beforeafter: "AI 변신 (Before/After)",
  comedy: "AI 코미디/상황극",
};

const formatDate = (dateString) => {
  if (!dateString) return "날짜 정보 없음";

  const date = new Date(dateString);
  if (!isValid(date)) return "날짜 정보 없음";

  try {
    return format(date, "yyyy년 MM월 dd일", { locale: ko });
  } catch (error) {
    console.error("날짜 포맷팅 오류:", error);
    return "날짜 정보 없음";
  }
};

const ProjectListItem = ({ project, onDelete, onClick }) => {
  const displayCategory = project.category
    ? categoryLabels[project.category] || project.category
    : "카테고리 없음";

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete();
  };

  return (
    <div
      className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-1">{project.name}</h3>
          <p className="text-gray-600 text-sm mb-2 line-clamp-2">
            {project.description || "설명이 없습니다."}
          </p>
          <div className="flex items-center text-sm text-gray-500 space-x-4">
            <span>생성일: {formatDate(project.createdAt)}</span>
            {project.category && (
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                {displayCategory}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {project.generatedContents?.length > 0 && (
            <span className="text-sm text-gray-500">
              {project.generatedContents.length}개의 콘텐츠
            </span>
          )}
          <button
            onClick={handleDelete}
            className="text-red-600 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectListItem;
