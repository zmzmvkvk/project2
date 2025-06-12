const express = require("express");
const router = express.Router();
const settingsController = require("../controllers/settingsController");

// API 키 조회 라우트
router.get("/api-keys", settingsController.getApiKeys);

// API 키 업데이트 라우트
router.patch("/api-keys", settingsController.updateApiKeys);

module.exports = router;
