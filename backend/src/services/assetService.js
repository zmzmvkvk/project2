const generationService = require("./generationService");

// 이 함수는 실제 데이터베이스나 스토리지에서 이미지를 가져오는 로직으로 대체되어야 합니다.
// 현재는 임시 더미 데이터를 반환합니다.
const fetchImages = async (category) => {
  console.log(`Fetching images for category: ${category}`);
  return [
    // { id: '1', url: 'https://via.placeholder.com/150', projectId: 'project1', createdAt: new Date() },
    // { id: '2', url: 'https://via.placeholder.com/150', projectId: 'project1', createdAt: new Date() },
  ];
};

const generateImage = async ({
  prompt,
  projectId,
  negativePrompt,
  style,
  quality,
}) => {
  // 실제 이미지 생성은 generationService를 통해 이루어집니다.
  console.log("Generating image with:", {
    prompt,
    projectId,
    negativePrompt,
    style,
    quality,
  });
  const result = await generationService.generateImage({
    prompt,
    projectId,
    negativePrompt,
    style,
    quality,
  });
  return result.imageUrl; // generationService에서 반환하는 imageUrl을 사용
};

module.exports = {
  fetchImages,
  generateImage,
};
