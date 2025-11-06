// ==========================================================
// 🌿 Firebase Config (versión compatible con navegador sin bundler)
// ==========================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";

// ✅ Configuración de tu proyecto Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBd4Axng1H3R8lolnkyfcACK-VEHbdweq4",
  authDomain: "huertohogar-7c6dd.firebaseapp.com",
  projectId: "huertohogar-7c6dd",
  storageBucket: "huertohogar-7c6dd.appspot.com",
  messagingSenderId: "1056561014185",
  appId: "1:1056561014185:web:2567bd85cd358b756d10b8",
  measurementId: "G-TDQVP4J40P"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Exporta Firestore y Auth para otros scripts
export const db = getFirestore(app);
export const auth = getAuth(app);
