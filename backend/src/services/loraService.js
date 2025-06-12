const { db } = require("./firebaseService");
// TODO: 실제 AI 학습 API와 연동 필요

const LORA_TRAININGS_COLLECTION = "loraTrainings";

// LoRA 학습 시작을 시뮬레이션하는 함수
async function startLoraTraining(imagePaths, trainingConfig = {}) {
  console.log(
    `[LoraService] Simulating LoRA training for images: ${imagePaths.join(
      ", "
    )}`
  );
  // 실제 AI 학습 API 호출 로직 (예: AWS Sagemaker, Hugging Face API 등) 구현
  // 여기서는 임시로 학습 ID를 반환합니다.
  const trainingId = `lora-training-${Date.now()}`;

  // 학습 상태를 Firestore에 저장 (시뮬레이션)
  await db.collection(LORA_TRAININGS_COLLECTION).doc(trainingId).set({
    status: "PENDING", // PENDING, IN_PROGRESS, COMPLETED, FAILED
    progress: 0,
    imagePaths: imagePaths, // Store the actual file paths
    trainingConfig: trainingConfig, // Store any additional training configuration
    createdAt: new Date(),
    completedAt: null,
    modelUrl: null,
  });

  // 실제 AI 학습 API 호출 로직 (예: AWS Sagemaker, Hugging Face API 등) 구현
  // 여기서는 시뮬레이션을 위해 일정 시간이 지나면 COMPLETED로 변경
  setTimeout(async () => {
    await db
      .collection(LORA_TRAININGS_COLLECTION)
      .doc(trainingId)
      .update({
        status: "COMPLETED",
        progress: 100,
        completedAt: new Date(),
        modelUrl: `https://mockup-lora-model.com/${trainingId}.lora`, // 임시 모델 URL
      });
  }, 10000); // 10초 후 완료

  return trainingId;
}

// LoRA 학습 상태를 조회하는 함수
async function getLoraTrainingStatus(trainingId) {
  const doc = await db
    .collection(LORA_TRAININGS_COLLECTION)
    .doc(trainingId)
    .get();
  if (!doc.exists) return null;

  const data = doc.data();

  // 실제 AI 학습 API와 연동하여 학습 상태를 업데이트
  // 여기서는 시뮬레이션을 위해 일정 시간이 지나면 COMPLETED로 변경
  if (
    data.status === "PENDING" &&
    (new Date() - data.createdAt.toDate()) / 1000 > 10
  ) {
    // 10초 후 완료
    await db
      .collection(LORA_TRAININGS_COLLECTION)
      .doc(trainingId)
      .update({
        status: "COMPLETED",
        progress: 100,
        completedAt: new Date(),
        modelUrl: `https://mockup-lora-model.com/${trainingId}.lora`, // 임시 모델 URL
      });
    return {
      ...data,
      status: "COMPLETED",
      progress: 100,
      completedAt: new Date(),
      modelUrl: `https://mockup-lora-model.com/${trainingId}.lora`,
    };
  }

  return data;
}

// 학습된 LoRA 모델 목록을 조회하는 함수
async function getLoraModels() {
  const snapshot = await db
    .collection(LORA_TRAININGS_COLLECTION)
    .where("status", "==", "COMPLETED")
    .get();

  const models = [];
  snapshot.forEach((doc) => {
    models.push({
      id: doc.id,
      ...doc.data(),
    });
  });

  return models;
}

// 학습된 LoRA 모델을 삭제하는 함수
async function deleteLoraModel(modelId) {
  await db.collection(LORA_TRAININGS_COLLECTION).doc(modelId).delete();
}

module.exports = {
  startLoraTraining,
  getLoraTrainingStatus,
  getLoraModels,
  deleteLoraModel,
};
