// assets/js/contacto.js
// ========== CONST ==========
const IDS = { form:'#contactForm', nombre:'#nombre', email:'#email', msg:'#comentario' };

import { validateEmail, validateRequired } from './validators.js';
const $ = s => document.querySelector(s);

document.addEventListener('DOMContentLoaded', () => {
  const form = $(IDS.form); if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre = $(IDS.nombre)?.value?.trim();
    const correo = $(IDS.email)?.value?.trim();
    const mensaje= $(IDS.msg)?.value?.trim();

    if (!validateRequired(nombre) || !validateRequired(correo) || !validateRequired(mensaje))
      return alert('⚠️ Completa todos los campos');

    if (!validateEmail(correo)) return alert('⚠️ Correo no válido');

    const key='hh_contact_messages';
    const list = JSON.parse(localStorage.getItem(key) || '[]');
    list.push({ id:'C'+Date.now(), nombre, correo, mensaje, when:new Date().toISOString() });
    localStorage.setItem(key, JSON.stringify(list));

    alert('📨 Tu mensaje ha sido enviado. ¡Gracias!');
    form.reset();
  });
});
