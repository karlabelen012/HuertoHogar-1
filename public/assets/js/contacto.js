// =================== Huerto Hogar - CONTACTO.JS ===================
// Envío del formulario de contacto -> colección "contactos" en Firestore

// IMPORTS (siempre arriba)
import { db } from "./firebase.js";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { validateEmail, validateRequired } from "./validators.js";

// SELECTORES
const IDS = {
  form:   "#contactForm",
  nombre: "#nombre",
  email:  "#email",
  msg:    "#comentario",
};

const $ = (s) => document.querySelector(s);

document.addEventListener("DOMContentLoaded", () => {
  const form = $(IDS.form);
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre  = $(IDS.nombre)?.value?.trim();
    const correo  = $(IDS.email)?.value?.trim();
    const mensaje = $(IDS.msg)?.value?.trim();

    // ===== VALIDACIONES BÁSICAS =====
    if (
      !validateRequired(nombre) ||
      !validateRequired(correo) ||
      !validateRequired(mensaje)
    ) {
      alert("⚠️ Por favor completa todos los campos antes de enviar.");
      return;
    }

    if (!validateEmail(correo)) {
      alert("⚠️ El formato del correo no es válido.");
      return;
    }

    // ===== ENVÍO A FIRESTORE =====
    try {
      const idMensaje = "MSG" + Date.now();

      await addDoc(collection(db, "contactos"), {
        nombre,
        correo,
        comentario: mensaje,
        fecha: serverTimestamp(), // se ve como timestamp en Firestore
        respondido: false,        // boolean → se mostrará como true/false
        idMensaje,                // ej: MSG123456789
      });

      alert("📨 Tu mensaje ha sido enviado correctamente. ¡Gracias por contactarnos!");
      form.reset();
    } catch (err) {
      console.error("Error guardando contacto:", err);
      alert("❌ Ocurrió un error al enviar tu mensaje. Intenta nuevamente.");
    }
  });
});
