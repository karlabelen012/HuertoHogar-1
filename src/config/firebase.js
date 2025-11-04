// src/config/firebase.js
// Configuración de Firebase para el proyecto Huerto Hogar

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Tu configuración de Firebase (sacada directamente de la consola)
const firebaseConfig = {
  apiKey: "AIzaSyBgqQMt_O0193-SH7W6rhxNOPJgsTLzGWw",
  authDomain: "huertohogar-7c6dd.firebaseapp.com",
  projectId: "huertohogar-7c6dd",
  storageBucket: "huertohogar-7c6dd.firebasestorage.app",
  messagingSenderId: "1056561014185",
  appId: "1:1056561014185:web:2567db85cd53b5756d10b8",
  measurementId: "G-TDQVPAJ40P"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Exporta los servicios que usará tu proyecto
export const db = getFirestore(app);
export const auth = getAuth(app);
