const { db } = require("./firebaseService");

const SETTINGS_COLLECTION = "settings";
const API_KEYS_DOC_ID = "apiKeys"; // API 키를 저장할 단일 문서 ID

// API 키를 Firestore에서 가져오는 함수
async function getApiKeys() {
  try {
    const docRef = db.collection(SETTINGS_COLLECTION).doc(API_KEYS_DOC_ID);
    const doc = await docRef.get();

    if (doc.exists) {
      return doc.data();
    } else {
      console.log("API Keys document does not exist, returning empty object.");
      return {}; // 문서가 없으면 빈 객체 반환
    }
  } catch (error) {
    console.error("Error getting API keys from Firestore:", error);
    throw new Error("Failed to retrieve API keys.");
  }
}

// API 키를 Firestore에 업데이트하는 함수
async function updateApiKeys(newApiKeys) {
  try {
    const docRef = db.collection(SETTINGS_COLLECTION).doc(API_KEYS_DOC_ID);
    await docRef.set(newApiKeys, { merge: true }); // 기존 필드는 유지하고 새 필드만 추가/업데이트
    console.log("API Keys updated successfully.");
    return await getApiKeys(); // 업데이트된 전체 키 반환
  } catch (error) {
    console.error("Error updating API keys in Firestore:", error);
    throw new Error("Failed to update API keys.");
  }
}

module.exports = {
  getApiKeys,
  updateApiKeys,
};
