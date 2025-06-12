const express = require("express");
const router = express.Router();
const promptController = require("../controllers/promptController");

// 프롬프트 목록 가져오기
router.get("/", promptController.getPrompts);

// 새 프롬프트 생성
router.post("/", promptController.createPrompt);

// 프롬프트 삭제
router.delete("/:id", promptController.deletePrompt);

module.exports = router;
