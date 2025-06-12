const templateService = require("../services/templateService");

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

exports.createTemplate = async (req, res, next) => {
  try {
    const template = await templateService.createTemplate(req.body);
    res.status(201).json(template);
  } catch (err) {
    next(err);
  }
};

exports.deleteTemplate = async (req, res, next) => {
  try {
    await templateService.deleteTemplate(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};
