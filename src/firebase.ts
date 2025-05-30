
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyC0R2Zrm_Yx505AyR1_hMv0RzMGy-LgbZw",
  authDomain: "recipe-sharing-platform-4c363.firebaseapp.com",
  projectId: "recipe-sharing-platform-4c363",
  storageBucket: "recipe-sharing-platform-4c363.firebasestorage.app",
  messagingSenderId: "929457224516",
  appId: "1:929457224516:web:a21f21d8a8ee1b9cdd7511"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const auth = getAuth(app);
export const db = getFirestore(app);