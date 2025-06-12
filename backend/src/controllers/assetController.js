const assetService = require("../services/assetService");

const getGeneratedImages = async (req, res) => {
  try {
    // 실제 프로젝트에서는 데이터베이스에서 가져오거나, 파일 시스템에서 읽어오는 로직이 필요합니다.
    // 현재는 임시 더미 데이터를 반환합니다.
    const images = await assetService.fetchImages(req.query.category);
    res.json(images);
  } catch (error) {
    console.error("Error fetching generated images:", error);
    res.status(500).json({ message: "Failed to fetch generated images" });
  }
};

const generateImage = async (req, res) => {
  try {
    const { prompt, projectId, negativePrompt, style, quality } = req.body;
    // 이미지 생성 로직 (예: AI 서비스 호출)
    const imageUrl = await assetService.generateImage({
      prompt,
      projectId,
      negativePrompt,
      style,
      quality,
    });
    res.status(201).json({ success: true, imageUrl });
  } catch (error) {
    console.error("Error generating image:", error);
    res.status(500).json({ message: "Failed to generate image" });
  }
};

module.exports = {
  getGeneratedImages,
  generateImage,
};
