// src/config/firebase.js  (o assets/js/firebase.js, según tu proyecto)
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBd4Axng1H3R8lolnkyfcACK-VEHbdweq4",   // 👈 NUEVA KEY
  authDomain: "huertohogar-7c6dd.firebaseapp.com",
  projectId: "huertohogar-7c6dd",
  storageBucket: "huertohogar-7c6dd.appspot.com",
  messagingSenderId: "1056561014185",
  appId: "1:1056561014185:web:2567bd85cd358b756d10b8",
  measurementId: "G-TDQVP4J40P"
};

const app  = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db   = getFirestore(app);
