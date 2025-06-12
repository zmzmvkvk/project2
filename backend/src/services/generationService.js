import * as leonardoService from "./leonardoService";
import * as openaiService from "./openaiService";
// import * as comfyUIService from "./comfyUIService"; // 향후 ComfyUI 통합을 위해 주석 처리

const AI_PROVIDER = process.env.AI_PROVIDER || "LEONARDO"; // 기본값 설정

// 이미지 생성 요청
export const generateImage = async (prompt, isPublic, modelId, initImageId) => {
  switch (AI_PROVIDER) {
    case "LEONARDO":
      return leonardoService.generateImage(
        prompt,
        isPublic,
        modelId,
        initImageId
      );
    // case "COMFYUI":
    //   return comfyUIService.generateImage(prompt, isPublic, modelId, initImageId);
    default:
      throw new Error(
        `Unsupported AI_PROVIDER for image generation: ${AI_PROVIDER}`
      );
  }
};

// 생성된 이미지 상태 확인 및 URL 가져오기
export const getGenerationStatus = async (generationId) => {
  switch (AI_PROVIDER) {
    case "LEONARDO":
      return leonardoService.getGeneratedImage(generationId);
    // case "COMFYUI":
    //   return comfyUIService.getGenerationStatus(generationId);
    default:
      throw new Error(
        `Unsupported AI_PROVIDER for image status: ${AI_PROVIDER}`
      );
  }
};

// 이미지 파일 Leonardo AI에 업로드 (현재는 Leonardo만 지원)
export const uploadImage = async (imageData, filename) => {
  switch (AI_PROVIDER) {
    case "LEONARDO":
      return leonardoService.uploadImageToLeonardo(imageData, filename);
    default:
      throw new Error(
        `Unsupported AI_PROVIDER for image upload: ${AI_PROVIDER}`
      );
  }
};

// 스토리 프롬프트 생성 요청 (현재는 OpenAI만 지원)
export const generateStoryPrompt = async (keywords) => {
  // 스토리 프롬프트는 현재 OpenAI만 지원
  // 추후 다른 LLM 서비스가 추가될 경우 switch-case로 확장
  return openaiService.generateStoryPrompt(keywords);
};

// 영상 생성 요청
export const generateVideoFromImage = async (
  imageId,
  prompt,
  isPublic,
  resolution,
  frameInterpolation,
  promptEnhance
) => {
  switch (AI_PROVIDER) {
    case "LEONARDO":
      return leonardoService.generateVideoFromImage(
        imageId,
        prompt,
        isPublic,
        resolution,
        frameInterpolation,
        promptEnhance
      );
    // case "COMFYUI":
    //   return comfyUIService.generateVideoFromImage(...args);
    default:
      throw new Error(
        `Unsupported AI_PROVIDER for video generation: ${AI_PROVIDER}`
      );
  }
};

// 생성된 영상 상태 확인 및 URL 가져오기
export const getGeneratedVideoStatus = async (generationId) => {
  switch (AI_PROVIDER) {
    case "LEONARDO":
      return leonardoService.getGeneratedVideo(generationId);
    // case "COMFYUI":
    //   return comfyUIService.getGeneratedVideoStatus(generationId);
    default:
      throw new Error(
        `Unsupported AI_PROVIDER for video status: ${AI_PROVIDER}`
      );
  }
};
