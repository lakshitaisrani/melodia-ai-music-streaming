import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDD2eYMCdM4tSb-eeM6osg5-sCEB93AbSk",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "melodia-4dee8.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "melodia-4dee8",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "melodia-4dee8.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "229976296663",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:229976296663:web:ecc62cef38738dc4ba3492",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-0QL4YBHJTS"
};

const app = initializeApp(firebaseConfig);
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const storage = getStorage(app);

export { auth, googleProvider, analytics, storage, firebaseConfig };
