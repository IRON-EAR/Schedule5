// Import the functions you need from the SDKs you need
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB52Upha-z1CR6Ohhczilkj72Hz_GDGte8",
  authDomain: "schedule5.firebaseapp.com",
  projectId: "schedule5",
  storageBucket: "schedule5.firebasestorage.app",
  messagingSenderId: "851390550893",
  appId: "1:851390550893:web:1f09284dfab21438adc064"
};



// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// Initialize Firebase Auth
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);