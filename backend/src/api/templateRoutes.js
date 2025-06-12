const express = require("express");
const router = express.Router();
const templateController = require("../controllers/templateController");

router.get("/", templateController.getAllTemplates);
router.get("/:id", templateController.getTemplateById);
router.post(
  "/",
  templateController.validateCreateTemplate,
  templateController.createTemplate
);
router.delete(
  "/:id",
  templateController.validateDeleteTemplate,
  templateController.deleteTemplate
);

module.exports = router;
