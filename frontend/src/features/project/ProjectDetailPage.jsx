import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProject, useUpdateProject } from "./hooks/useProjects";
import { formatDate } from "./utils/dateUtils";

const categoryLabels = {
  dance: "AI 댄스/모션 챌린지",
  story: "AI 스토리 애니메이션",
  beforeafter: "AI 변신 (Before/After)",
  comedy: "AI 코미디/상황극",
};

const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: project, isLoading, error } = useProject(id);
  const updateProjectMutation = useUpdateProject();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedDescription, setEditedDescription] = useState("");

  // 편집 모드 시작
  const handleStartEdit = () => {
    setEditedName(project.name);
    setEditedDescription(project.description || "");
    setIsEditing(true);
  };

  // 편집 취소
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedName("");
    setEditedDescription("");
  };

  // 프로젝트 업데이트
  const handleUpdate = async () => {
    if (!editedName.trim()) {
      alert("프로젝트 이름을 입력해주세요.");
      return;
    }

    try {
      await updateProjectMutation.mutateAsync({
        id,
        data: {
          name: editedName,
          description: editedDescription,
        },
      });
      setIsEditing(false);
    } catch (error) {
      console.error("프로젝트 업데이트 중 오류 발생:", error);
      alert("프로젝트 업데이트 중 오류가 발생했습니다.");
    }
  };

  // 제작실로 이동
  const handleGoToProduction = () => {
    navigate(`/production/${id}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">프로젝트 정보를 불러오는 중...</div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">
          프로젝트 정보를 불러오는 중 오류가 발생했습니다.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 섹션 */}
      <div className="flex justify-between items-start">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 hover:underline mb-4"
          >
            &larr; 프로젝트 목록으로 돌아가기
          </button>
          {isEditing ? (
            <div className="space-y-4">
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="w-full px-4 py-2 text-2xl font-bold border rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="프로젝트 이름"
              />
              <textarea
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="프로젝트 설명"
                rows={3}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  저장
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                  취소
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h1 className="text-2xl font-bold mb-2">{project.name}</h1>
              <p className="text-gray-600">
                {project.description || "설명이 없습니다."}
              </p>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          {!isEditing && (
            <button
              onClick={handleStartEdit}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              수정
            </button>
          )}
          <button
            onClick={handleGoToProduction}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            제작실로 이동
          </button>
        </div>
      </div>

      {/* 프로젝트 정보 카드 */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4">프로젝트 정보</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">카테고리</p>
            <p className="font-medium">
              {project.category
                ? categoryLabels[project.category] || project.category
                : "카테고리 없음"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">생성일</p>
            <p className="font-medium">{formatDate(project.createdAt)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">생성된 콘텐츠</p>
            <p className="font-medium">
              {project.generatedContents?.length || 0}개
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">마지막 수정일</p>
            <p className="font-medium">{formatDate(project.updatedAt)}</p>
          </div>
        </div>
      </div>

      {/* 생성된 콘텐츠 섹션 */}
      {project.generatedContents?.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">생성된 콘텐츠</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {project.generatedContents.map((content, index) => (
              <div
                key={index}
                className="aspect-video bg-gray-100 rounded-lg overflow-hidden"
              >
                {content.endsWith(".mp4") ? (
                  <video
                    src={content}
                    controls
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={content}
                    alt={`Generated content ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetailPage;
