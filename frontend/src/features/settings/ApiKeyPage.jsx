import React, { useState, useEffect } from "react";
import axios from "axios";

const ApiKeyPage = () => {
  const [leonardoApiKey, setLeonardoApiKey] = useState("");
  const [openaiApiKey, setOpenaiApiKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // 컴포넌트 마운트 시 API 키 불러오기
  useEffect(() => {
    const fetchApiKeys = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          "http://localhost:3000/api/settings/api-keys"
        );
        if (response.data) {
          setLeonardoApiKey(response.data.leonardoApiKey || "");
          setOpenaiApiKey(response.data.openaiApiKey || "");
        }
      } catch (err) {
        console.error("Failed to fetch API keys:", err);
        setError(
          "API 키를 불러오는 데 실패했습니다: " +
            (err.response?.data?.message || err.message)
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchApiKeys();
  }, []);

  // API 키 저장 핸들러
  const handleSaveApiKeys = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await axios.patch(
        "http://localhost:3000/api/settings/api-keys",
        {
          leonardoApiKey,
          openaiApiKey,
        }
      );
      if (response.status === 200) {
        setSuccessMessage("API 키가 성공적으로 저장되었습니다!");
        // 필요하다면 다시 불러오기 (현재는 응답으로 업데이트된 키를 받음)
        setLeonardoApiKey(response.data.leonardoApiKey || "");
        setOpenaiApiKey(response.data.openaiApiKey || "");
      }
    } catch (err) {
      console.error("Failed to save API keys:", err);
      setError(
        "API 키 저장에 실패했습니다: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">API 키 관리</h2>
      <form
        onSubmit={handleSaveApiKeys}
        className="space-y-4 bg-white p-6 rounded shadow max-w-lg mx-auto"
      >
        <div>
          <label htmlFor="leonardoApiKey" className="block font-medium mb-1">
            Leonardo AI API 키
          </label>
          <input
            type="password" // 보안상 password 타입 사용
            id="leonardoApiKey"
            className="w-full border px-3 py-2 rounded"
            value={leonardoApiKey}
            onChange={(e) => setLeonardoApiKey(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <div>
          <label htmlFor="openaiApiKey" className="block font-medium mb-1">
            OpenAI API 키
          </label>
          <input
            type="password" // 보안상 password 타입 사용
            id="openaiApiKey"
            className="w-full border px-3 py-2 rounded"
            value={openaiApiKey}
            onChange={(e) => setOpenaiApiKey(e.target.value)}
            disabled={isLoading}
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {successMessage && (
          <p className="text-green-600 text-sm">{successMessage}</p>
        )}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          disabled={isLoading}
        >
          {isLoading ? "저장 중..." : "API 키 저장"}
        </button>
      </form>
    </div>
  );
};

export default ApiKeyPage;
