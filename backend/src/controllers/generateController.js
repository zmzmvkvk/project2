const {
  generateImage,
  getGeneratedImage,
  uploadImageToLeonardo,
  generateVideoFromImage,
  getGeneratedVideo,
} = require("../services/leonardoService");
const {
  generateStoryPrompt: openaiGenerateStoryPrompt,
} = require("../services/openaiService");
// TODO: 추후 다른 AI 서비스 (예: openaiService) 임포트 예정

exports.generateImage = async (req, res, next) => {
  try {
    const { prompt, isPublic, modelId } = req.body;
    const imageFile = req.file; // multer에 의해 업로드된 파일

    if (!prompt) {
      return res.status(400).json({ message: "프롬프트는 필수입니다." });
    }

    let initImageId = null;
    if (imageFile) {
      // 이미지가 업로드된 경우 Leonardo AI에 이미지 업로드 시뮬레이션
      initImageId = await uploadImageToLeonardo(
        imageFile.buffer,
        imageFile.originalname
      );
      console.log("[GenerateController] Uploaded image ID:", initImageId);
    }

    // Leonardo AI에 이미지 생성 요청만 보내고 generationId를 즉시 반환
    const generationId = await generateImage(
      prompt,
      isPublic,
      modelId,
      initImageId
    ); // initImageId 전달

    res.status(200).json({
      message: "이미지 생성 요청 성공, 상태를 폴링해주세요.",
      generationId: generationId,
    });
  } catch (err) {
    console.error("이미지 생성 요청 컨트롤러 오류:", err);
    next(err);
  }
};

// 생성 상태를 확인하고 이미지 URL을 반환하는 함수
exports.getGenerationStatus = async (req, res, next) => {
  try {
    const { generationId } = req.params;

    if (!generationId) {
      return res.status(400).json({ message: "generationId는 필수입니다." });
    }

    const imageUrl = await getGeneratedImage(generationId);

    if (imageUrl) {
      res.status(200).json({ status: "COMPLETE", imageUrl: imageUrl });
    } else {
      res.status(200).json({ status: "PENDING" }); // 아직 완료되지 않았음을 알림
    }
  } catch (err) {
    console.error("이미지 생성 상태 확인 컨트롤러 오류:", err);
    next(err);
  }
};

// 스토리 프롬프트 생성 함수
exports.generateStoryPrompt = async (req, res, next) => {
  try {
    const { keywords } = req.body;

    if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
      return res
        .status(400)
        .json({ message: "키워드는 필수이며 배열 형태여야 합니다." });
    }

    const storyPrompt = await openaiGenerateStoryPrompt(keywords);
    res.status(200).json({ storyPrompt });
  } catch (err) {
    console.error("스토리 프롬프트 생성 컨트롤러 오류:", err);
    next(err);
  }
};

// 영상 생성 함수
exports.generateVideo = async (req, res, next) => {
  try {
    const {
      imageId,
      prompt,
      isPublic,
      resolution,
      frameInterpolation,
      promptEnhance,
    } = req.body;

    if (!imageId) {
      return res.status(400).json({ message: "이미지 ID는 필수입니다." });
    }

    const generationId = await generateVideoFromImage(
      imageId,
      prompt,
      isPublic,
      resolution,
      frameInterpolation,
      promptEnhance
    );

    res.status(200).json({
      message: "영상 생성 요청 성공, 상태를 폴링해주세요.",
      generationId: generationId,
    });
  } catch (err) {
    console.error(
      "영상 생성 요청 컨트롤러 오류:",
      err.response?.data || err.message
    );
    next(err);
  }
};

// 영상 생성 상태 확인 함수
exports.getVideoGenerationStatus = async (req, res, next) => {
  try {
    const { generationId } = req.params;

    if (!generationId) {
      return res.status(400).json({ message: "generationId는 필수입니다." });
    }

    const videoUrl = await getGeneratedVideo(generationId);

    if (videoUrl) {
      res.status(200).json({ status: "COMPLETE", videoUrl: videoUrl });
    } else {
      res.status(200).json({ status: "PENDING" });
    }
  } catch (err) {
    console.error(
      "영상 생성 상태 확인 컨트롤러 오류:",
      err.response?.data || err.message
    );
    next(err);
  }
};

// TODO: 다른 생성 유형(text, video)을 위한 컨트롤러 함수 추가 예정
