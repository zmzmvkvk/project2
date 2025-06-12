const { db } = require("./firebaseService");

const TEMPLATES_COLLECTION = "templates";

async function getAllTemplates() {
  const snapshot = await db.collection(TEMPLATES_COLLECTION).get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

async function getTemplateById(id) {
  const doc = await db.collection(TEMPLATES_COLLECTION).doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
}

async function createTemplate(data) {
  const ref = await db.collection(TEMPLATES_COLLECTION).add(data);
  const doc = await ref.get();
  return { id: doc.id, ...doc.data() };
}

async function deleteTemplate(id) {
  await db.collection(TEMPLATES_COLLECTION).doc(id).delete();
  return { id };
}

module.exports = {
  getAllTemplates,
  getTemplateById,
  createTemplate,
  deleteTemplate,
};
