import { getApp, getApps, initializeApp, App } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import * as admin from "firebase-admin"; // Importing firebase-admin

const serviceKey = require("@/baatsheet-firebase-adminsdk-bsrdc-659225ba1a.json");

let app: App;

if (getApps().length === 0) {
  app = initializeApp({
    credential: admin.credential.cert(serviceKey),
  });
} else {
  app = getApp();
}

const adminDB = getFirestore(app);

export { adminDB, app as AdminApp };
