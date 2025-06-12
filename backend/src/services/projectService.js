const { db, FieldValue } = require("./firebaseService");

const PROJECTS_COLLECTION = "projects";

async function getAllProjects() {
  const snapshot = await db.collection(PROJECTS_COLLECTION).get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

async function getProjectById(id) {
  const doc = await db.collection(PROJECTS_COLLECTION).doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
}

async function createProject(data) {
  const ref = await db.collection(PROJECTS_COLLECTION).add(data);
  const doc = await ref.get();
  return { id: doc.id, ...doc.data() };
}

async function updateProject(id, data) {
  const projectRef = db.collection(PROJECTS_COLLECTION).doc(id);
  const doc = await projectRef.get();

  if (!doc.exists) {
    return null;
  }

  const updatePayload = { ...data };

  if (data.generatedContentUrl) {
    updatePayload.generatedContents = FieldValue.arrayUnion(
      data.generatedContentUrl
    );
    delete updatePayload.generatedContentUrl;
  }

  await projectRef.update(updatePayload);

  const updatedDoc = await projectRef.get();
  return { id: updatedDoc.id, ...updatedDoc.data() };
}

async function deleteProject(id) {
  await db.collection(PROJECTS_COLLECTION).doc(id).delete();
  return { id };
}

module.exports = {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};
