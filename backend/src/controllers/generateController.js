const { validationResult, check } = require("express-validator"); // express-validator 임포트

const {
  generateImage,
  getGenerationStatus,
  uploadImage,
  generateStoryPrompt,
  generateVideoFromImage,
  getGeneratedVideoStatus,
} = require("../services/generationService"); // generationService 임포트

// generateController.js에서 leonardoService, openaiService를 직접 임포트하지 않도록 변경
// const {
//   generateImage,
//   getGeneratedImage,
//   uploadImageToLeonardo,
//   generateVideoFromImage,
//   getGeneratedVideo,
// } = require("../services/leonardoService");
// const {
//   generateStoryPrompt: openaiGenerateStoryPrompt,
// } = require("../services/openaiService");

// 유효성 검사 미들웨어 정의
exports.validateGenerateImage = [
  check("prompt", "프롬프트는 필수입니다.").notEmpty(),
  // 필요하다면 다른 필드에 대한 유효성 검사도 추가
];

exports.validateGenerateStoryPrompt = [
  check("keywords", "키워드는 필수이며 배열 형태여야 합니다.")
    .isArray()
    .notEmpty(),
];

exports.validateGenerateVideo = [
  check("imageId", "영상을 생성할 이미지 ID는 필수입니다.").notEmpty(),
  // prompt, isPublic 등은 선택 사항이거나 백엔드에서 기본값 처리 가능
];

exports.validateGetVideoGenerationStatus = [
  check("generationId", "generationId는 필수입니다.").notEmpty(),
];

// 이미지 생성 함수
exports.generateImage = async (req, res, next) => {
  // 유효성 검사 오류 처리
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { prompt, isPublic, modelId } = req.body;
    const imageFile = req.file; // multer에 의해 업로드된 파일

    let initImageId = null;
    if (imageFile) {
      // 이미지가 업로드된 경우 Leonardo AI에 이미지 업로드 시뮬레이션
      initImageId = await uploadImage(imageFile.buffer, imageFile.originalname); // generationService.uploadImage 호출
      console.log("[GenerateController] Uploaded image ID:", initImageId);
    }

    // Leonardo AI에 이미지 생성 요청만 보내고 generationId를 즉시 반환
    const generationId = await generateImage(
      prompt,
      isPublic,
      modelId,
      initImageId
    ); // generationService.generateImage 호출

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
  // getGenerationStatus에는 현재 body/params 유효성 검사 로직이 없으므로 생략
  // 필요하다면 check('generationId', 'generationId는 필수입니다.').notEmpty() 추가 가능
  try {
    const { generationId } = req.params;

    if (!generationId) {
      return res.status(400).json({ message: "generationId는 필수입니다." });
    }

    const imageUrl = await getGenerationStatus(generationId); // generationService.getGenerationStatus 호출

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
  // 유효성 검사 오류 처리
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { keywords } = req.body;

    // 이전에 있던 수동 유효성 검사는 이제 express-validator가 처리
    // if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
    //   return res
    //     .status(400)
    //     .json({ message: "키워드는 필수이며 배열 형태여야 합니다." });
    // }

    const storyPrompt = await generateStoryPrompt(keywords); // generationService.generateStoryPrompt 호출
    res.status(200).json({ storyPrompt });
  } catch (err) {
    console.error("스토리 프롬프트 생성 컨트롤러 오류:", err);
    next(err);
  }
};

// 영상 생성 함수
exports.generateVideo = async (req, res, next) => {
  // 유효성 검사 오류 처리
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const {
      imageId,
      prompt,
      isPublic,
      resolution,
      frameInterpolation,
      promptEnhance,
    } = req.body;

    // if (!imageId) { // express-validator로 대체
    //   return res.status(400).json({ message: "이미지 ID는 필수입니다." });
    // }

    const generationId = await generateVideoFromImage(
      imageId,
      prompt,
      isPublic,
      resolution,
      frameInterpolation,
      promptEnhance
    ); // generationService.generateVideoFromImage 호출

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
  // 유효성 검사 오류 처리
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { generationId } = req.params;

    // if (!generationId) { // express-validator로 대체
    //   return res.status(400).json({ message: "generationId는 필수입니다." });
    // }

    const videoUrl = await getGeneratedVideoStatus(generationId); // generationService.getGeneratedVideoStatus 호출

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
