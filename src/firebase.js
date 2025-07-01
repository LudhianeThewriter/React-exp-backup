// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
//import { getFirestore } from "firebase/firestore";
import { initializeFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDW15cNsNyC8atzFZ2ZnUZ96oX-bY5HOEw",
  authDomain: "expencer-342.firebaseapp.com",
  projectId: "expencer-342",
  storageBucket: "expencer-342.firebasestorage.app",
  messagingSenderId: "647568778898",
  appId: "1:647568778898:web:76b1646012216ce2e8684b",
  measurementId: "G-3CGVQH9Z12",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);

export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  useFetchStreams: false,
});
