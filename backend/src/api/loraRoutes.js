const express = require("express");
const multer = require("multer");
const loraController = require("../controllers/loraController");

const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Ensure this directory exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Use multer middleware for the /train route
router.post(
  "/train",
  upload.array("images"),
  loraController.validateStartLoraTraining,
  loraController.startLoraTraining
);
router.get(
  "/status/:trainingJobId",
  loraController.validateGetLoraTrainingStatus,
  loraController.getLoraTrainingStatus
);

// Add routes for managing trained LoRA models
router.get("/models", loraController.getLoraModels);
router.delete(
  "/models/:modelId",
  loraController.validateDeleteLoraModel,
  loraController.deleteLoraModel
);

module.exports = router;
