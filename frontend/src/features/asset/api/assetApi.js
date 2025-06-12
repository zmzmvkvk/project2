import axios from "axios";

const API_BASE_URL = "/api/assets";

// 이미지 생성
export const generateImage = async (data) => {
  const response = await axios.post(`${API_BASE_URL}/generate`, {
    ...data,
    // 프롬프트 ID가 있으면 함께 전송
    promptId: data.promptId || undefined,
  });
  return response.data;
};

// 생성된 이미지 목록 조회
export const fetchGeneratedImages = async (category = "all") => {
  const response = await axios.get(`${API_BASE_URL}`, {
    params: { category },
  });
  return response.data;
};

// 이미지 삭제
export const deleteImage = async (imageId) => {
  const response = await axios.delete(`${API_BASE_URL}/${imageId}`);
  return response.data;
};

// 이미지 상세 정보 조회
export const fetchImageDetails = async (imageId) => {
  const response = await axios.get(`${API_BASE_URL}/${imageId}`);
  return response.data;
};

// 프롬프트로 생성된 이미지 목록 조회
export const fetchImagesByPrompt = async (promptId) => {
  const response = await axios.get(`${API_BASE_URL}/by-prompt/${promptId}`);
  return response.data;
};
