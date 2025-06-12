const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

const projectRoutes = require("./api/projectRoutes");
const templateRoutes = require("./api/templateRoutes");
const settingsRoutes = require("./api/settingsRoutes");
const loraRoutes = require("./api/loraRoutes");
const assetRoutes = require("./api/assetRoutes");
const promptRoutes = require("./api/promptRoutes");

// 환경 변수 설정
const PORT = process.env.PORT || 3000;

// Express 앱 생성
const app = express();

// 미들웨어 설정
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// API 라우트
app.use("/api/projects", projectRoutes);
app.use("/api/templates", templateRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/lora", loraRoutes);
app.use("/api/assets", assetRoutes);
app.use("/api/prompts", promptRoutes);

// 기본 라우트
app.get("/", (req, res) => {
  res.json({ message: "AI Shorts Automation Backend API" });
});

// 에러 핸들링 미들웨어
app.use((err, req, res, next) => {
  console.error(err);
  res
    .status(500)
    .json({ message: "Internal Server Error", error: err.message });
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
