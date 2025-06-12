const express = require("express");
const router = express.Router();
const generateController = require("../controllers/generateController");
const multer = require("multer");

// multer 메모리 스토리지 설정 (파일을 메모리에 임시 저장)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// 이미지 생성 요청 라우트 (multer 미들웨어 추가)
router.post("/image", upload.single("image"), generateController.generateImage);

// 이미지 생성 상태 확인 라우트 (폴링용)
router.get("/status/:generationId", generateController.getGenerationStatus);

// 스토리 프롬프트 생성 요청 라우트
router.post("/story", generateController.generateStoryPrompt);

// 영상 생성 요청 라우트
router.post("/video", generateController.generateVideo);

// 영상 생성 상태 확인 라우트 (폴링용)
router.get(
  "/video-status/:generationId",
  generateController.getVideoGenerationStatus
);

// TODO: 추후 다른 AI 생성 유형(예: text, video) 추가 예정

module.exports = router;
