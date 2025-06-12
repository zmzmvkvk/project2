const express = require("express");
const router = express.Router();
const assetController = require("../controllers/assetController");

// 생성된 이미지 목록 가져오기
router.get("/", assetController.getGeneratedImages);

// 이미지 생성 요청
router.post("/generate", assetController.generateImage);

module.exports = router;
