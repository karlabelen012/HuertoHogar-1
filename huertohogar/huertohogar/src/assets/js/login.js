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
  sel.split(',').map(s => s.trim())
     .map(document.querySelector.bind(document))
     .find(Boolean);

// dominios DUOC que mandan a perfilAdmin
const DUOC_REGEX = /@(duoc\.cl|duocuc\.cl|profesor\.duoc\.cl|duocpro\.cl)$/i;

document.addEventListener('DOMContentLoaded', () => {
  const form   = pick(IDS.form);  if (!form) return;
  const emailEl= pick(IDS.email);
  const passEl = pick(IDS.pass);
  const msgBox = pick(IDS.msg);

  const show = (t, type='danger') => {
    if (!msgBox) { alert((type==='success'?'✅ ':'⚠️ ') + t); return; }
    msgBox.className = `alert alert-${type}`;
    msgBox.textContent = t;
    msgBox.hidden = false;
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = emailEl?.value?.trim() || '';
    const pass  = passEl?.value || '';

    if (!email || pass.length < 4) {
      show('Completa correo y contraseña (mín. 4).');
      return;
    }

    try {
      // Hace login y guarda sesión (Auth debe encargarse de localStorage)
      // Se recomienda que Auth.login retorne el usuario autenticado.
      const user = await Auth.login(email, pass);

      // fallback por si Auth.login no retorna usuario:
      const u = user || (() => {
        try {
          const active = JSON.parse(localStorage.getItem('usuarioActivo') || 'null');
          if (active) return active;
          const auth = JSON.parse(localStorage.getItem('hh_auth') || 'null');
          return auth?.user || null;
        } catch { return null; }
      })();

      show('Inicio de sesión correcto. Redirigiendo…', 'success');

      // Redirección según dominio
      const isDuoc = DUOC_REGEX.test(email);
      const target = isDuoc
        ? '../page/perfilAdmin.html'
        : '../page/perfil.html';

      // dispara evento para que la navbar se actualice si tu script.js lo escucha
      window.dispatchEvent(new CustomEvent('auth:changed', { detail: { user: u }}));

      setTimeout(() => location.href = target, 500);
    } catch (err) {
      show(err?.message || 'No se pudo iniciar sesión');
    }
  });
});
