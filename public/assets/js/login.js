// assets/js/login.js
// ========== CONST ==========
const IDS = {
  form:  '#loginForm,#formLogin',
  email: '#email,#loginEmail',
  pass:  '#password,#loginPassword',
  msg:   '#loginMsg'
};

import { Auth } from './auth.js';

const $ = s => document.querySelector(s);
const pick = sel =>
  sel.split(',')
     .map(s => s.trim())
     .map(document.querySelector.bind(document))
     .find(Boolean);

// dominios DUOC (por si quieres usarlo), pero la verdad la toma de user.rol
const DUOC_REGEX = /@(duoc\.cl|duocuc\.cl|profesor\.duoc\.cl|duocpro\.cl)$/i;

document.addEventListener('DOMContentLoaded', () => {
  const form   = pick(IDS.form);  if (!form) return;
  const emailEl= pick(IDS.email);
  const passEl = pick(IDS.pass);
  const msgBox = pick(IDS.msg);

  const show = (t, type='danger') => {
    if (!msgBox) { 
      alert((type==='success'?'✅ ':'⚠️ ') + t); 
      return; 
    }
    msgBox.className = `alert alert-${type}`;
    msgBox.textContent = t;
    msgBox.hidden = false;
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = emailEl?.value?.trim() || '';
    const pass  = passEl?.value || '';

    if (!email || pass.length < 4) {
      show('Completa correo y contraseña (mín. 4).');
      return;
    }

    try {
      // Hace login y guarda sesión (Auth se encarga de localStorage)
      const user = Auth.login(email, pass);

      show('Inicio de sesión correcto. Redirigiendo…', 'success');

      // Redirección según rol guardado
      const target =
        user.rol === 'admin'
          ? '../page/perfilAdmin.html'
          : '../page/perfil.html';

      // dispara evento para que la navbar se actualice si tu script.js lo escucha
      window.dispatchEvent(new CustomEvent('auth:changed', { detail: { user } }));

      setTimeout(() => location.href = target, 500);
    } catch (err) {
      show(err?.message || 'No se pudo iniciar sesión');
    }
  });
});
