const admin = require("firebase-admin");
const path = require("path");
require("dotenv").config();

const serviceAccount = require(path.resolve(
  process.env.FIREBASE_SERVICE_ACCOUNT_PATH ||
    "./firebase-service-account-key.json"
));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
}

const db = admin.firestore();

module.exports = { db };
