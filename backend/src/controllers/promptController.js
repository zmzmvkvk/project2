const promptService = require("../services/promptService");

const getPrompts = async (req, res) => {
  try {
    const prompts = await promptService.fetchPrompts();
    res.json(prompts);
  } catch (error) {
    console.error("Error fetching prompts:", error);
    res.status(500).json({ message: "Failed to fetch prompts" });
  }
};

const createPrompt = async (req, res) => {
  try {
    const newPrompt = await promptService.createPrompt(req.body);
    res.status(201).json(newPrompt);
  } catch (error) {
    console.error("Error creating prompt:", error);
    res.status(500).json({ message: "Failed to create prompt" });
  }
};

const deletePrompt = async (req, res) => {
  try {
    const { id } = req.params;
    await promptService.deletePrompt(id);
    res.status(204).send(); // No Content
  } catch (error) {
    console.error("Error deleting prompt:", error);
    res.status(500).json({ message: "Failed to delete prompt" });
  }
};

module.exports = {
  getPrompts,
  createPrompt,
  deletePrompt,
};
