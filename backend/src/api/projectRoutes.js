const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");

router.get("/", projectController.getAllProjects);
router.get("/:id", projectController.getProjectById);
router.post(
  "/",
  projectController.validateCreateProject,
  projectController.createProject
);
router.patch(
  "/:id",
  projectController.validateUpdateProject,
  projectController.updateProject
);
router.delete("/:id", projectController.deleteProject);

module.exports = router;
