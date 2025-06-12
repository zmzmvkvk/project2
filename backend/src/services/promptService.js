const prompts = []; // 임시 프롬프트 데이터
let nextPromptId = 1;

const fetchPrompts = async () => {
  // 실제 프로젝트에서는 데이터베이스에서 프롬프트를 가져와야 합니다.
  return prompts;
};

const createPrompt = async (promptData) => {
  // 실제 프로젝트에서는 데이터베이스에 프롬프트를 저장해야 합니다.
  const newPrompt = { id: String(nextPromptId++), ...promptData };
  prompts.push(newPrompt);
  return newPrompt;
};

const deletePrompt = async (id) => {
  // 실제 프로젝트에서는 데이터베이스에서 프롬프트를 삭제해야 합니다.
  const index = prompts.findIndex((p) => p.id === id);
  if (index > -1) {
    prompts.splice(index, 1);
    return true;
  }
  return false;
};

module.exports = {
  fetchPrompts,
  createPrompt,
  deletePrompt,
};
