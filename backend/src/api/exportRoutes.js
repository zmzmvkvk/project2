const express = require("express");
const router = express.Router();
const path = require("path");
const {
  generateImageSequence,
  generateVideo,
} = require("../controllers/exportController");

// 이미지 시퀀스 생성 라우트
router.post("/image-sequence", generateImageSequence);

// 비디오 생성 라우트
router.post("/video", generateVideo);

// ZIP 파일 다운로드 라우트
router.get("/download/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "../../temp", filename);

  res.download(filePath, filename, (err) => {
    if (err) {
      console.error("파일 다운로드 중 오류:", err);
      res.status(500).json({ error: "파일 다운로드 중 오류가 발생했습니다." });
    }
  });
});

module.exports = router;
