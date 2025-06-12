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
router.post("/train", upload.array("images"), loraController.startLoraTraining);
router.get("/status/:trainingJobId", loraController.getLoraTrainingStatus);

// Add routes for managing trained LoRA models
router.get("/models", loraController.getLoraModels);
router.delete("/models/:modelId", loraController.deleteLoraModel);

module.exports = router;
