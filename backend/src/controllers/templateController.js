const templateService = require("../services/templateService");
const { validationResult, check } = require("express-validator");

exports.getAllTemplates = async (req, res, next) => {
  try {
    const templates = await templateService.getAllTemplates();
    res.json(templates);
  } catch (err) {
    next(err);
  }
};

exports.getTemplateById = async (req, res, next) => {
  try {
    const template = await templateService.getTemplateById(req.params.id);
    if (!template) return res.status(404).json({ message: "Not found" });
    res.json(template);
  } catch (err) {
    next(err);
  }
};

exports.validateCreateTemplate = [
  check("name", "템플릿 이름은 필수입니다.").notEmpty(),
  check("description", "템플릿 설명은 필수입니다.").notEmpty(),
  check("content", "템플릿 내용은 필수입니다.").notEmpty(),
];

exports.createTemplate = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const template = await templateService.createTemplate(req.body);
    res.status(201).json(template);
  } catch (err) {
    next(err);
  }
};

exports.validateDeleteTemplate = [
  check("id", "템플릿 ID는 필수입니다.").notEmpty(),
];

exports.deleteTemplate = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    await templateService.deleteTemplate(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};
