// =================== Huerto Hogar - CONTACTO.JS ===================
// Maneja el envío del formulario de contacto y valida los datos.

// ========== IMPORTS (deben ir SIEMPRE primero) ==========
import { validateEmail, validateRequired } from './validators.js';

// ========== SELECTORES Y CONSTANTES ==========
const IDS = {
  form:   '#contactForm',
  nombre: '#nombre',
  email:  '#email',
  msg:    '#comentario'
};

const $ = (s) => document.querySelector(s);

// ========== INICIO ==========
document.addEventListener('DOMContentLoaded', () => {
  const form = $(IDS.form);
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nombre  = $(IDS.nombre)?.value?.trim();
    const correo  = $(IDS.email)?.value?.trim();
    const mensaje = $(IDS.msg)?.value?.trim();

    // ===== Validaciones =====
    if (
      !validateRequired(nombre) ||
      !validateRequired(correo) ||
      !validateRequired(mensaje)
    ) {
      alert('⚠️ Por favor completa todos los campos antes de enviar.');
      return;
    }

    if (!validateEmail(correo)) {
      alert('⚠️ El formato del correo no es válido.');
      return;
    }

    // ===== Guardar en localStorage (simulación de envío) =====
    const key = 'hh_contact_messages';
    const list = JSON.parse(localStorage.getItem(key) || '[]');

    list.push({
      id: 'C' + Date.now(),
      nombre,
      correo,
      mensaje,
      when: new Date().toISOString()
    });

    localStorage.setItem(key, JSON.stringify(list));

    // ===== Feedback visual =====
    alert('📨 Tu mensaje ha sido enviado correctamente. ¡Gracias por contactarnos!');
    form.reset();
  });
});
