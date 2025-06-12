const loraService = require("../services/loraService");
const { validationResult, check } = require("express-validator");

// 유효성 검사 미들웨어 정의
exports.validateStartLoraTraining = [
  // multer로 파일이 업로드되었는지 여부는 미들웨어에서 직접 확인해야 함
  // 여기서는 req.body.trainingConfig의 유효성만 검사 (필요에 따라 확장)
  check("trainingConfig", "훈련 설정은 필수입니다.").notEmpty(),
];

exports.validateGetLoraTrainingStatus = [
  check("trainingJobId", "훈련 작업 ID는 필수입니다.").notEmpty(),
];

exports.validateDeleteLoraModel = [
  check("modelId", "모델 ID는 필수입니다.").notEmpty(),
];

exports.startLoraTraining = async (req, res) => {
  // 유효성 검사 오류 처리
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // req.files is populated by multer
    const uploadedFiles = req.files;
    if (!uploadedFiles || uploadedFiles.length === 0) {
      return res
        .status(400)
        .json({ message: "No images uploaded for LoRA training." });
    }

    // Get file paths from uploaded files
    const imagePaths = uploadedFiles.map((file) => file.path);

    // In a real application, you would pass these paths to the service for actual training
    // For now, we'll simulate training with these paths
    const trainingJobId = await loraService.startLoraTraining(
      imagePaths,
      req.body.trainingConfig
    );
    res
      .status(202)
      .json({ message: "LoRA training started successfully.", trainingJobId });
  } catch (error) {
    console.error("Error starting LoRA training:", error);
    res.status(500).json({ message: "Failed to start LoRA training." });
  }
};

exports.getLoraTrainingStatus = async (req, res) => {
  // 유효성 검사 오류 처리
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { trainingJobId } = req.params;
    const status = await loraService.getLoraTrainingStatus(trainingJobId);
    res.status(200).json(status);
  } catch (error) {
    console.error("Error getting LoRA training status:", error);
    res
      .status(500)
      .json({ message: "Failed to retrieve LoRA training status." });
  }
};

// Add controller functions for managing trained LoRA models
exports.getLoraModels = async (req, res) => {
  try {
    const models = await loraService.getLoraModels();
    res.status(200).json(models);
  } catch (error) {
    console.error("Error getting LoRA models:", error);
    res.status(500).json({ message: "Failed to retrieve LoRA models." });
  }
};

exports.deleteLoraModel = async (req, res) => {
  // 유효성 검사 오류 처리
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { modelId } = req.params;
    await loraService.deleteLoraModel(modelId);
    res.status(200).json({ message: "LoRA model deleted successfully." });
  } catch (error) {
    console.error("Error deleting LoRA model:", error);
    res.status(500).json({ message: "Failed to delete LoRA model." });
  }
};
