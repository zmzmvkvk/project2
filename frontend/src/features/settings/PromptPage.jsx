import React, { useState, useEffect } from "react";
import axios from "axios";

const PromptPage = () => {
  const [prompts, setPrompts] = useState([]);
  const [newPrompt, setNewPrompt] = useState({ name: "", content: "" });
  const [activeTab, setActiveTab] = useState("list"); // 'list' or 'create'

  useEffect(() => {
    fetchPrompts();
  }, []);

  const fetchPrompts = async () => {
    try {
      const response = await axios.get("/api/prompts");
      setPrompts(response.data);
    } catch (error) {
      console.error("Error fetching prompts:", error);
    }
  };

  const handleCreatePrompt = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/prompts", newPrompt);
      setNewPrompt({ name: "", content: "" });
      fetchPrompts();
      setActiveTab("list");
    } catch (error) {
      console.error("Error creating prompt:", error);
      alert("Failed to create prompt.");
    }
  };

  const handleDeletePrompt = async (promptId) => {
    if (!window.confirm("Are you sure you want to delete this prompt?")) {
      return;
    }

    try {
      await axios.delete(`/api/prompts/${promptId}`);
      fetchPrompts();
    } catch (error) {
      console.error("Error deleting prompt:", error);
      alert("Failed to delete prompt.");
    }
  };

  return (
    <div className="space-y-6">
      {/* 탭 네비게이션 */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("list")}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${
                activeTab === "list"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }
            `}
          >
            프롬프트 목록
          </button>
          <button
            onClick={() => setActiveTab("create")}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${
                activeTab === "create"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }
            `}
          >
            새 프롬프트 추가
          </button>
        </nav>
      </div>

      {/* 프롬프트 목록 탭 */}
      {activeTab === "list" && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">저장된 프롬프트</h3>
          {prompts.length === 0 ? (
            <p className="text-gray-500">저장된 프롬프트가 없습니다.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {prompts.map((prompt) => (
                <div
                  key={prompt.id}
                  className="bg-white shadow rounded-lg p-4 space-y-2"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        {prompt.name}
                      </h4>
                      <p className="mt-1 text-sm text-gray-500">
                        {prompt.content}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeletePrompt(prompt.id)}
                      className="text-red-600 hover:text-red-500 text-sm"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 새 프롬프트 추가 탭 */}
      {activeTab === "create" && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">
            새 프롬프트 추가
          </h3>
          <form onSubmit={handleCreatePrompt} className="space-y-4">
            <div>
              <label
                htmlFor="prompt-name"
                className="block text-sm font-medium text-gray-700"
              >
                프롬프트 이름
              </label>
              <input
                type="text"
                id="prompt-name"
                value={newPrompt.name}
                onChange={(e) =>
                  setNewPrompt({ ...newPrompt, name: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label
                htmlFor="prompt-content"
                className="block text-sm font-medium text-gray-700"
              >
                프롬프트 내용
              </label>
              <textarea
                id="prompt-content"
                value={newPrompt.content}
                onChange={(e) =>
                  setNewPrompt({ ...newPrompt, content: e.target.value })
                }
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              프롬프트 저장
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default PromptPage;
