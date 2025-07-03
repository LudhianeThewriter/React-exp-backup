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
  apiKey: "AIzaSyD__rN2GZw2PiuxLmkQ6pu-2UL1JUA7VDA",
  authDomain: "expense-a4a50.firebaseapp.com",
  projectId: "expense-a4a50",
  storageBucket: "expense-a4a50.firebasestorage.app",
  messagingSenderId: "558048247089",
  appId: "1:558048247089:web:537def4635cd7b2c238410",
  measurementId: "G-P6WWVYY933",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);

export const auth = getAuth(app);

export const db = getFirestore(app);
