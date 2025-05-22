// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC0R2Zrm_Yx505AyR1_hMv0RzMGy-LgbZw",
  authDomain: "recipe-sharing-platform-4c363.firebaseapp.com",
  projectId: "recipe-sharing-platform-4c363",
  storageBucket: "recipe-sharing-platform-4c363.firebasestorage.app",
  messagingSenderId: "929457224516",
  appId: "1:929457224516:web:a21f21d8a8ee1b9cdd7511"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);