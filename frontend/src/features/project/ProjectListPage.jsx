import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useProjects, useDeleteProject } from "./hooks/useProjects";
import { formatDate } from "./utils/dateUtils";

const categoryOptions = [
  { id: "dance", name: "AI 댄스/모션 챌린지" },
  { id: "story", name: "AI 스토리 애니메이션" },
  { id: "beforeafter", name: "AI 변신 (Before/After)" },
  { id: "comedy", name: "AI 코미디/상황극" },
];

const sortOptions = [
  { id: "newest", name: "최신순" },
  { id: "oldest", name: "오래된순" },
  { id: "name", name: "이름순" },
];

const ProjectListPage = () => {
  const { data: projects = [], isLoading, error } = useProjects();
  const deleteProjectMutation = useDeleteProject();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");

  // 필터링 및 정렬된 프로젝트 목록
  const filteredProjects = useMemo(() => {
    return projects
      .filter((project) => {
        const matchesSearch = project.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        const matchesCategory =
          selectedCategory === "all" || project.category === selectedCategory;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "newest":
            return new Date(b.createdAt) - new Date(a.createdAt);
          case "oldest":
            return new Date(a.createdAt) - new Date(b.createdAt);
          case "name":
            return a.name.localeCompare(b.name);
          default:
            return 0;
        }
      });
  }, [projects, selectedCategory, sortBy, searchQuery]);

  // 프로젝트 삭제
  const handleDelete = async (id) => {
    if (window.confirm("정말로 이 프로젝트를 삭제하시겠습니까?")) {
      try {
        await deleteProjectMutation.mutateAsync(id);
      } catch (error) {
        console.error("프로젝트 삭제 중 오류 발생:", error);
        alert("프로젝트 삭제 중 오류가 발생했습니다.");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">프로젝트 목록을 불러오는 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">
          프로젝트 목록을 불러오는 중 오류가 발생했습니다.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 섹션 */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">프로젝트 목록</h1>
        <Link
          to="/projects/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          새 프로젝트 만들기
        </Link>
      </div>

      {/* 필터 및 검색 섹션 */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 검색 */}
          <div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="프로젝트 검색..."
              className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* 카테고리 필터 */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">모든 카테고리</option>
              {categoryOptions.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* 정렬 */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              {sortOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 프로젝트 목록 */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {filteredProjects.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {searchQuery || selectedCategory !== "all"
              ? "검색 결과가 없습니다."
              : "프로젝트가 없습니다. 새 프로젝트를 만들어보세요!"}
          </div>
        ) : (
          <div className="divide-y">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <Link
                      to={`/projects/${project.id}`}
                      className="text-lg font-semibold text-blue-600 hover:underline"
                    >
                      {project.name}
                    </Link>
                    <p className="mt-1 text-gray-600">
                      {project.description || "설명이 없습니다."}
                    </p>
                    <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                      <span>
                        {categoryOptions.find((c) => c.id === project.category)
                          ?.name || "카테고리 없음"}
                      </span>
                      <span>•</span>
                      <span>생성일: {formatDate(project.createdAt)}</span>
                      <span>•</span>
                      <span>
                        생성된 콘텐츠: {project.generatedContents?.length || 0}
                        개
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      to={`/production/${project.id}`}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      제작실로 이동
                    </Link>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectListPage;
