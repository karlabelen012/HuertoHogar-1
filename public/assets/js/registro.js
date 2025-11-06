// public/assets/js/registro.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

// 👇 OJO: tiene que ser apiKey (K mayúscula), igual que en tu firebase.js
const firebaseConfig = {
  apiKey: "AIzaSyBgqQMt_O0193-SH7W6rhxNOPJgsTLzGWw",
  authDomain: "huertohogar-7c6dd.firebaseapp.com",
  projectId: "huertohogar-7c6dd",
  storageBucket: "huertohogar-7c6dd.appspot.com",
  messagingSenderId: "1056561014185",
  appId: "1:1056561014185:web:2567db85cd53b5756d10b8",
  measurementId: "G-TDQVPAJ40P",
};


console.log("🔥 registro.js usando apiKey:", firebaseConfig.apiKey);

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);

// ----------------- Helpers -----------------
const $ = (sel) => document.querySelector(sel);

const esMayorDeEdad = (fecha) => {
  if (!fecha) return false;
  const hoy = new Date();
  const nac = new Date(fecha);
  let edad = hoy.getFullYear() - nac.getFullYear();
  const m = hoy.getMonth() - nac.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) edad--;
  return edad >= 18;
};

const validarCorreo = (correo) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo || "");

// ----------------- Registro -----------------
document.addEventListener("DOMContentLoaded", () => {
  const form  = $("#registerForm");
  const msgEl = $("#registroMensaje");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    msgEl.textContent = "";
    msgEl.className = "mt-3 text-center text-muted";

    const nombre          = $("#nombre")?.value.trim();
    const email           = $("#email")?.value.trim();
    const email2          = $("#email2")?.value.trim();
    const fechaNacimiento = $("#fechaNacimiento")?.value;
    const password        = $("#password")?.value;
    const password2       = $("#password2")?.value;
    const rut             = $("#rut")?.value.trim();
    const telefono        = $("#telefono")?.value.trim();
    const region          = $("#region")?.value;
    const comuna          = $("#comuna")?.value;

    // Validaciones básicas
    if (!nombre)               return (msgEl.textContent = "El nombre es obligatorio.");
    if (!validarCorreo(email)) return (msgEl.textContent = "El correo no es válido.");
    if (email !== email2)      return (msgEl.textContent = "Los correos no coinciden.");
    if (!fechaNacimiento)      return (msgEl.textContent = "Debes ingresar tu fecha de nacimiento.");
    if (!esMayorDeEdad(fechaNacimiento))
      return (msgEl.textContent = "Debes ser mayor de edad para registrarte.");
    if (!password || password.length < 6)
      return (msgEl.textContent = "La contraseña debe tener al menos 6 caracteres.");
    if (password !== password2)
      return (msgEl.textContent = "Las contraseñas no coinciden.");
    if (!rut)                  return (msgEl.textContent = "Debes ingresar tu RUT/RUN.");
    if (!region)               return (msgEl.textContent = "Debes seleccionar una región.");
    if (!comuna)               return (msgEl.textContent = "Debes seleccionar una comuna.");

    try {
      msgEl.textContent = "Registrando usuario…";

      const cred = await createUserWithEmailAndPassword(auth, email, password);

      if (nombre) {
        await updateProfile(cred.user, { displayName: nombre });
      }

      const perfil = {
        uid: cred.user.uid,
        nombre,
        correo: email,
        fechaNacimiento,
        rut,
        telefono: telefono || null,
        region,
        comuna,
        createdAt: new Date().toISOString(),
      };

      await setDoc(doc(db, "usuarios", cred.user.uid), perfil, { merge: true });

      msgEl.className = "mt-3 text-center text-success";
      msgEl.textContent =
        "✅ Registro exitoso. Tu usuario ya está creado en Firebase.";

      form.reset();

      setTimeout(() => {
        window.location.href = "./login.html";
      }, 2000);
    } catch (error) {
      console.error("❌ Error Firebase:", error);
      let texto = "❌ Error al registrar usuario.";
      if (error.code === "auth/email-already-in-use") {
        texto = "Este correo ya está registrado.";
      }
      msgEl.className = "mt-3 text-center text-danger";
      msgEl.textContent = texto;
    }
  });
});
