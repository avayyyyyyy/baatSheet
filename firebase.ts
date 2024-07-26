import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDCDXlY3oncXFTtPuNDZxwpUY-lUHrffZ0",
  authDomain: "baatsheet.firebaseapp.com",
  projectId: "baatsheet",
  storageBucket: "baatsheet.appspot.com",
  messagingSenderId: "341334781318",
  appId: "1:341334781318:web:c6ad69e01c0cdc5cfa5007",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);
export const storage = getStorage(app);
