const loraService = require("../services/loraService");

exports.startLoraTraining = async (req, res) => {
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
  try {
    const { trainingJobId } = req.params;
    if (!trainingJobId) {
      return res.status(400).json({ message: "Training job ID is required." });
    }
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
  try {
    const { modelId } = req.params;
    if (!modelId) {
      return res.status(400).json({ message: "Model ID is required." });
    }
    await loraService.deleteLoraModel(modelId);
    res.status(200).json({ message: "LoRA model deleted successfully." });
  } catch (error) {
    console.error("Error deleting LoRA model:", error);
    res.status(500).json({ message: "Failed to delete LoRA model." });
  }
};
