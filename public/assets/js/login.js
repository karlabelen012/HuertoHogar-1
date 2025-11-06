// public/assets/js/login.js
import { Auth } from './auth.js';

// ========== CONST ==========
const IDS = {
  form:  '#loginForm,#formLogin',
  email: '#email,#loginEmail',
  pass:  '#password,#loginPassword',
  msg:   '#loginMsg'
};

// Selectores rápidos (primer elemento que exista)
const pick = (sel) =>
  sel
    .split(',')
    .map((s) => s.trim())
    .map(document.querySelector.bind(document))
    .find(Boolean);

// Regex para detectar dominio DUOC (para rol admin por dominio)
const DUOC_REGEX = /@(duoc\.cl|duocuc\.cl|profesor\.duoc\.cl|duocpro\.cl)$/i;

document.addEventListener('DOMContentLoaded', () => {
  const form   = pick(IDS.form);
  if (!form) return;

  const emailEl = pick(IDS.email);
  const passEl  = pick(IDS.pass);
  const msgBox  = pick(IDS.msg);

  // Mostrar mensaje en cuadro o alerta
  const show = (t, type = 'danger') => {
    if (!msgBox) {
      alert((type === 'success' ? '✅ ' : '⚠️ ') + t);
      return;
    }
    msgBox.className = `alert alert-${type}`;
    msgBox.textContent = t;
    msgBox.hidden = false;
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = emailEl?.value?.trim() || '';
    const pass  = passEl?.value || '';

    if (!email || pass.length < 4) {
      show('Completa correo y contraseña (mín. 4 caracteres).');
      return;
    }

    try {
      // Login: Auth se encarga de validar con Firebase / LocalStorage, etc.
      const user = await Auth.login(email, pass);

      if (!user) {
        show('No existe una cuenta asociada a este correo.', 'danger');
        return;
      }

      // Si viene rol desde la BD, se respeta; si no, se calcula por dominio.
      const rolDetectado = DUOC_REGEX.test(email) ? 'admin' : 'cliente';
      const rol = user.rol || rolDetectado;

      const userData = { ...user, email, correo: email, rol };

      // Guardar sesión para todo el sitio (HTML + React)
      localStorage.setItem('hh_auth', JSON.stringify(userData));

      show('Inicio de sesión correcto. Redirigiendo…', 'success');

      // Avisar a navbar / otros scripts
      window.dispatchEvent(
        new CustomEvent('auth:changed', { detail: { user: userData } })
      );

      // Redirección:
      //  - admin (dominio DUOC o rol admin) → perfilAdmin.html
      //  - resto → perfilCliente.html
      const isAdmin = rol === 'admin';
      const target = isAdmin
        ? './perfilAdmin.html'
        : './perfilCliente.html';

      setTimeout(() => {
        window.location.href = target;
      }, 800);
    } catch (err) {
      // Mensajes coherentes con reglas del caso
      const msg =
        err?.code === 'auth/user-not-found'
          ? 'No existe una cuenta con este correo.'
          : err?.code === 'auth/wrong-password'
          ? 'Contraseña incorrecta.'
          : err?.message || '❌ No se pudo iniciar sesión. Verifica tus datos.';

      show(msg, 'danger');
    }
  });
});
