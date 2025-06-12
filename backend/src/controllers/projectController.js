const projectService = require("../services/projectService");
const { validationResult, check } = require("express-validator");

exports.getAllProjects = async (req, res, next) => {
  try {
    const projects = await projectService.getAllProjects();
    res.json(projects);
  } catch (err) {
    next(err);
  }
};

exports.getProjectById = async (req, res, next) => {
  try {
    const project = await projectService.getProjectById(req.params.id);
    if (!project) return res.status(404).json({ message: "Not found" });
    res.json(project);
  } catch (err) {
    next(err);
  }
};

exports.validateCreateProject = [
  check("name", "프로젝트 이름은 필수입니다.").notEmpty(),
  check("description", "프로젝트 설명은 필수입니다.").notEmpty(),
];

exports.createProject = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const project = await projectService.createProject(req.body);
    res.status(201).json(project);
  } catch (err) {
    next(err);
  }
};

exports.validateUpdateProject = [
  check("id", "프로젝트 ID는 필수입니다.").notEmpty(),
  check("name", "프로젝트 이름은 비어 있을 수 없습니다.").optional().notEmpty(),
  check("description", "프로젝트 설명은 비어 있을 수 없습니다.")
    .optional()
    .notEmpty(),
];

exports.updateProject = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id } = req.params;
    const updatedData = req.body;
    const updatedProject = await projectService.updateProject(id, updatedData);
    if (!updatedProject) return res.status(404).json({ message: "Not found" });
    res.status(200).json(updatedProject);
  } catch (err) {
    next(err);
  }
};

exports.deleteProject = async (req, res, next) => {
  try {
    await projectService.deleteProject(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};
