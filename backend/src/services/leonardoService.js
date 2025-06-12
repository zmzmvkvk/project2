const axios = require("axios");
const FormData = require("form-data");

const API_KEY = process.env.LEONARDO_API_KEY;
const BASE_URL = "https://cloud.leonardo.ai/api/rest/v1";

// 이미지 파일을 Leonardo AI에 업로드하고 init_image_id를 반환하는 함수
async function uploadImageToLeonardo(imageData, filename) {
  try {
    // 1. 사전 서명된 URL 요청
    const initImageResponse = await axios.post(
      `${BASE_URL}/init-image`,
      { fileName: filename },
      {
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          authorization: `Bearer ${API_KEY}`,
        },
      }
    );

    const { id, fields, url } = initImageResponse.data.uploadInitImage;
    const parsedFields = JSON.parse(fields); // fields는 문자열이므로 파싱

    // 2. 사전 서명된 URL에 실제 이미지 업로드
    const formData = new FormData();
    Object.entries(parsedFields).forEach(([key, value]) => {
      formData.append(key, value);
    });
    formData.append("file", imageData, { filename: filename }); // 이미지 데이터 추가

    await axios.post(url, formData, {
      headers: {
        ...formData.getHeaders(), // FormData의 Content-Type 헤더를 자동으로 설정
      },
      maxContentLength: Infinity, // 큰 파일 업로드 시 필요할 수 있음
      maxBodyLength: Infinity,
    });

    console.log(
      `[LeonardoService] Image uploaded successfully. Init Image ID: ${id}`
    );
    return id; // 업로드된 이미지의 ID 반환
  } catch (error) {
    console.error(
      "Error uploading image to Leonardo AI:",
      error.response?.data || error.message
    );
    throw new Error("Failed to upload image to Leonardo AI.");
  }
}

// 이미지 생성을 요청하는 함수 (Text2Img 및 Img2Img 지원)
async function generateImage(
  prompt,
  isPublic = false,
  modelId = "6bef9f1b-29cb-40c7-b9df-32b51c1f67d3",
  init_image_id = null
) {
  try {
    const payload = {
      prompt: prompt,
      modelId: modelId,
      public: isPublic,
      sd_version: "v2", // 예시 파라미터
    };

    if (init_image_id) {
      payload.init_image_id = init_image_id; // init_image_id 사용
      // Img2Img 시 필요한 다른 파라미터 (예: strength, guidance_scale 등) 여기에 추가
    }

    console.log("[LeonardoService] Sending payload to Leonardo AI:", payload);

    const generationResponse = await axios.post(
      `${BASE_URL}/generations`,
      payload,
      {
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          authorization: `Bearer ${API_KEY}`,
        },
      }
    );
    console.log(
      "[LeonardoService] Received response from Leonardo AI:",
      generationResponse.data
    );
    return generationResponse.data.sdGenerationJob.generationId;
  } catch (error) {
    console.error(
      "Error calling Leonardo API for image generation:",
      error.response?.data || error.message
    );
    throw new Error("Failed to start image generation.");
  }
}

// 이미지로부터 영상 생성을 요청하는 함수
async function generateVideoFromImage(
  imageId,
  prompt = "",
  isPublic = false,
  resolution = "RESOLUTION_480",
  frameInterpolation = true,
  promptEnhance = true
) {
  try {
    const payload = {
      imageId: imageId,
      prompt: prompt,
      isPublic: isPublic,
      resolution: resolution,
      frameInterpolation: frameInterpolation,
      promptEnhance: promptEnhance,
      imageType: "UPLOADED", // 업로드된 이미지 또는 기존 생성 이미지 (GENERATED)에 따라 설정
    };

    const videoGenerationResponse = await axios.post(
      `${BASE_URL}/generations-image-to-video`,
      payload,
      {
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          authorization: `Bearer ${API_KEY}`,
        },
      }
    );

    // Leonardo API는 'id'를 직접 반환합니다.
    return videoGenerationResponse.data.motionGenerationJob.id;
  } catch (error) {
    console.error(
      "Error calling Leonardo API for video generation:",
      error.response?.data || error.message
    );
    throw new Error("Failed to start video generation.");
  }
}

// 생성된 이미지의 URL을 가져오는 함수
async function getGeneratedImage(generationId) {
  try {
    const response = await axios.get(
      `${BASE_URL}/generations/${generationId}`,
      {
        headers: {
          accept: "application/json",
          authorization: `Bearer ${API_KEY}`,
        },
      }
    );

    const generationData = response.data.generations_by_pk;
    if (generationData && generationData.status === "COMPLETE") {
      return generationData.generated_images[0]?.url || null;
    }
    return null; // 아직 생성 중이거나 오류
  } catch (error) {
    console.error("Error fetching generated image:", error.response?.data);
    throw new Error("Failed to fetch generated image.");
  }
}

// 생성된 영상의 URL을 가져오는 함수
async function getGeneratedVideo(generationId) {
  try {
    const response = await axios.get(
      `${BASE_URL}/generations/${generationId}`,
      {
        headers: {
          accept: "application/json",
          authorization: `Bearer ${API_KEY}`,
        },
      }
    );

    const generationData = response.data.generations_by_pk; // 이미지와 동일한 generation endpoint 사용
    if (generationData && generationData.status === "COMPLETE") {
      // 영상 URL은 generated_images 배열 내 각 이미지 객체의 motionMP4URL 필드에 있을 수 있습니다.
      // 또는 generation_by_pk.motion_generations[0].video_url 등에 있을 수 있습니다.
      // API 문서에 따라 정확한 경로를 확인해야 합니다.
      // 현재는 첫 번째 이미지의 motionMP4URL을 시도합니다.
      return generationData.generated_images[0]?.motionMP4URL || null;
    }
    return null; // 아직 생성 중이거나 오류
  } catch (error) {
    console.error("Error fetching generated video:", error.response?.data);
    throw new Error("Failed to fetch generated video.");
  }
}

module.exports = {
  generateImage,
  getGeneratedImage,
  uploadImageToLeonardo,
  generateVideoFromImage,
  getGeneratedVideo,
};
