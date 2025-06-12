const settingsService = require("../services/settingsService");
const { validationResult, check } = require("express-validator");

exports.getApiKeys = async (req, res, next) => {
  try {
    const apiKeys = await settingsService.getApiKeys();
    // 보안을 위해 실제 API 키는 반환하지 않거나, 마스킹 처리할 수 있습니다.
    // 여기서는 편의상 그대로 반환하지만, 실제 프로덕션에서는 주의해야 합니다.
    res.status(200).json(apiKeys);
  } catch (err) {
    console.error("Error in getApiKeys controller:", err);
    next(err);
  }
};

exports.validateUpdateApiKeys = [
  check("leonardoApiKey", "Leonardo AI API 키는 문자열이어야 합니다.")
    .optional()
    .isString(),
  check("openaiApiKey", "OpenAI API 키는 문자열이어야 합니다.")
    .optional()
    .isString(),
  // 키가 비어있는지 여부는 비즈니스 로직에서 필요에 따라 추가 검사 가능
];

exports.updateApiKeys = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { leonardoApiKey, openaiApiKey } = req.body; // 업데이트할 API 키
    const updatedApiKeys = await settingsService.updateApiKeys({
      leonardoApiKey,
      openaiApiKey,
    });
    res.status(200).json(updatedApiKeys);
  } catch (err) {
    console.error("Error in updateApiKeys controller:", err);
    next(err);
  }
};
