import React, { useState, useEffect } from "react";
import axios from "axios";

const LoraPage = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [trainingStatus, setTrainingStatus] = useState(null);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [loraModels, setLoraModels] = useState([]);
  const [activeTab, setActiveTab] = useState("train"); // 'train' or 'models'
  const [instancePrompt, setInstancePrompt] = useState(""); // 인스턴스 프롬프트 추가
  const [classPrompt, setClassPrompt] = useState(""); // 클래스 프롬프트 추가
  const [numEpochs, setNumEpochs] = useState(10); // 에포크 수 (기본값 10)

  useEffect(() => {
    fetchLoraModels();
  }, []);

  const fetchLoraModels = async () => {
    try {
      const response = await axios.get("/api/lora/models");
      setLoraModels(response.data);
    } catch (error) {
      console.error("Error fetching LoRA models:", error);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  const startTraining = async () => {
    if (selectedFiles.length === 0) {
      alert("Please select at least one image file.");
      return;
    }
    if (!instancePrompt.trim()) {
      alert("인스턴스 프롬프트를 입력해주세요.");
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("images", file);
    });
    formData.append("instancePrompt", instancePrompt);
    formData.append("classPrompt", classPrompt);
    formData.append("numEpochs", numEpochs);

    try {
      const response = await axios.post("/api/lora/train", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const { trainingJobId } = response.data;
      setTrainingStatus("PENDING");
      setTrainingProgress(0);

      // Poll for training status
      const pollInterval = setInterval(async () => {
        try {
          const statusResponse = await axios.get(
            `/api/lora/status/${trainingJobId}`
          );
          const { status, progress } = statusResponse.data;

          setTrainingStatus(status);
          setTrainingProgress(progress);

          if (status === "COMPLETED" || status === "FAILED") {
            clearInterval(pollInterval);
            if (status === "COMPLETED") {
              fetchLoraModels(); // Refresh the list of models
            }
          }
        } catch (error) {
          console.error("Error polling training status:", error);
          clearInterval(pollInterval);
        }
      }, 2000);
    } catch (error) {
      console.error("Error starting LoRA training:", error);
      alert("Failed to start LoRA training.");
    }
  };

  const deleteModel = async (modelId) => {
    if (!window.confirm("Are you sure you want to delete this model?")) {
      return;
    }

    try {
      await axios.delete(`/api/lora/models/${modelId}`);
      fetchLoraModels(); // Refresh the list after deletion
    } catch (error) {
      console.error("Error deleting LoRA model:", error);
      alert("Failed to delete LoRA model.");
    }
  };

  return (
    <div className="space-y-6">
      {/* 탭 네비게이션 */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("train")}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${
                activeTab === "train"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }
            `}
          >
            LoRA 학습
          </button>
          <button
            onClick={() => setActiveTab("models")}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${
                activeTab === "models"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }
            `}
          >
            학습된 모델
          </button>
        </nav>
      </div>

      {/* LoRA 학습 탭 */}
      {activeTab === "train" && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              학습 이미지 선택
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1 block w-full"
            />
          </div>

          {/* 선택된 이미지 미리보기 */}
          {selectedFiles.length > 0 && (
            <div className="mt-2 grid grid-cols-4 gap-2">
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  className="relative w-24 h-24 rounded-md overflow-hidden shadow-sm"
                >
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Selected ${index}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() =>
                      setSelectedFiles(
                        selectedFiles.filter((_, i) => i !== index)
                      )
                    }
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs leading-none opacity-80 hover:opacity-100"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          )}

          <div>
            <label
              htmlFor="instancePrompt"
              className="block text-sm font-medium text-gray-700"
            >
              인스턴스 프롬프트
            </label>
            <input
              type="text"
              id="instancePrompt"
              value={instancePrompt}
              onChange={(e) => setInstancePrompt(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="예: a photo of a sks dog"
            />
          </div>

          <div>
            <label
              htmlFor="classPrompt"
              className="block text-sm font-medium text-gray-700"
            >
              클래스 프롬프트 (선택 사항)
            </label>
            <input
              type="text"
              id="classPrompt"
              value={classPrompt}
              onChange={(e) => setClassPrompt(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="예: a photo of a dog"
            />
          </div>

          <div>
            <label
              htmlFor="numEpochs"
              className="block text-sm font-medium text-gray-700"
            >
              에포크 수
            </label>
            <input
              type="number"
              id="numEpochs"
              value={numEpochs}
              onChange={(e) => setNumEpochs(Number(e.target.value))}
              min="1"
              step="1"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <button
            onClick={startTraining}
            disabled={
              selectedFiles.length === 0 ||
              trainingStatus === "PENDING" ||
              !instancePrompt.trim()
            }
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
          >
            LoRA 학습 시작
          </button>

          {trainingStatus && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700">
                학습 상태: {trainingStatus}
              </p>
              {trainingStatus === "PENDING" && (
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-indigo-600 h-2.5 rounded-full"
                      style={{ width: `${trainingProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 학습된 모델 탭 */}
      {activeTab === "models" && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">
            학습된 LoRA 모델 목록
          </h3>
          {loraModels.length === 0 ? (
            <p className="text-gray-500">학습된 모델이 없습니다.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {loraModels.map((model) => (
                <div
                  key={model.id}
                  className="bg-white shadow rounded-lg p-4 space-y-2"
                >
                  <p className="text-sm font-medium text-gray-900">
                    모델 ID: {model.id}
                  </p>
                  <p className="text-sm text-gray-500">
                    생성일: {new Date(model.createdAt).toLocaleDateString()}
                  </p>
                  {model.modelUrl && (
                    <a
                      href={model.modelUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-500 text-sm"
                    >
                      모델 다운로드
                    </a>
                  )}
                  <button
                    onClick={() => deleteModel(model.id)}
                    className="text-red-600 hover:text-red-500 text-sm"
                  >
                    삭제
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LoraPage;
