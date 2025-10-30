import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBGqQMt_O01Y3-SH7Wr6HxNOPJgsTLzWGw",
  authDomain: "huertohogar-7c6dd.firebaseapp.com",
  projectId: "huertohogar-7c6dd",
  storageBucket: "huertohogar-7c6dd.firebasestorage.app",
  messagingSenderId: "1056561014185",
  appId: "1:1056561014185:web:2567bd85cd358b756d10b8",
  measurementId: "G-TDQVP4J40P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);