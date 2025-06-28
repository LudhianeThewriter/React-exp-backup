// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDqKohb2pRH69Grn-A7S_ytha55ZvHSnaw",
  authDomain: "expencer-daf5e.firebaseapp.com",
  projectId: "expencer-daf5e",
  storageBucket: "expencer-daf5e.firebasestorage.app",
  messagingSenderId: "173999324729",
  appId: "1:173999324729:web:3dc001cd3f30e8e87f57e8",
  measurementId: "G-LQ6SZ479BP",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);

export const db = getFirestore(app);
