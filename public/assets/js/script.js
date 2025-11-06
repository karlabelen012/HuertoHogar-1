// ==========================================================
// 🌿 HUERTO HOGAR - Configuración Firebase
// ==========================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

// ----------------------------------------------------------
// 🔹 Configuración del proyecto Firebase
// ----------------------------------------------------------
const firebaseConfig = {
  apiKey: "AIzaSyBd4Axng1H3R8lolnkyfcACK-VEHbdweq4",
  authDomain: "huertohogar-7c6dd.firebaseapp.com",
  projectId: "huertohogar-7c6dd",
  storageBucket: "huertohogar-7c6dd.appspot.com",
  messagingSenderId: "1056561014185",
  appId: "1:1056561014185:web:2567bd85cd358b756d10b8",
  measurementId: "G-TDQVP4J40P"
};

// ----------------------------------------------------------
// 🔹 Inicialización
// ----------------------------------------------------------
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// ----------------------------------------------------------
// 🔹 Exportar para usar en otros módulos
// ----------------------------------------------------------


/**
 * Valida un RUN/RUT chileno con guion.
 * Ejemplos válidos: "12345678-5", "12.345.678-5", "1234567-K"
 * Devuelve true si el formato y el dígito verificador son correctos.
 */
function validarRun(run) {
  if (!run) return false;
  const limpio = run.replace(/\./g, '').replace(/\s+/g, '').toUpperCase();
  const match = limpio.match(/^(\d+)-([\dK])$/);
  if (!match) return false;

  const cuerpo = match[1];
  const dv = match[2];
  let suma = 0, multiplo = 2;

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo[i]) * multiplo;
    multiplo = multiplo === 7 ? 2 : multiplo + 1;
  }

  const dvEsperado = 11 - (suma % 11);
  const dvFinal = dvEsperado === 11 ? '0' : dvEsperado === 10 ? 'K' : String(dvEsperado);
  return dvFinal === dv;
}

// hacerlo global
window.validarRun = validarRun;

/**
 * Valida un correo básico:
 *  - Debe contener '@'
 *  - Largo mínimo 5 caracteres
 *  - Forma simple texto@texto.dominio
 */
export function validarCorreo(correo) {
  if (!correo || correo.length < 5) return false;

  const email = correo.trim();
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return regex.test(email);
}

/**
 * Comprueba si la fecha de nacimiento corresponde a una persona
 * de 18 años o más.
 *
 * @param {string} fechaStr - fecha en formato "YYYY-MM-DD"
 * @returns {boolean} true si es mayor o igual a 18 años.
 */
export function esMayorEdad(fechaStr) {
  if (!fechaStr) return false;

  const nacimiento = new Date(fechaStr);
  if (Number.isNaN(nacimiento.getTime())) return false;

  const hoy = new Date();
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();

  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad -= 1;
  }

  return edad >= 18;
}
