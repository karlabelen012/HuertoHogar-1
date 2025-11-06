
import { Auth } from './auth.js'; 

// ========== CONST ==========
const IDS = {
  form:  '#loginForm,#formLogin',
  email: '#email,#loginEmail',
  pass:  '#password,#loginPassword',
  msg:   '#loginMsg'
};

// Selectores rápidos
const pick = (sel) =>
  sel
    .split(',')
    .map((s) => s.trim())
    .map(document.querySelector.bind(document))
    .find(Boolean);

// Regex para detectar dominio DUOC (admin)
const DUOC_REGEX = /@(duoc\.cl|duocuc\.cl|profesor\.duoc\.cl|duocpro\.cl)$/i;

document.addEventListener('DOMContentLoaded', () => {
  const form = pick(IDS.form);
  if (!form) return;

  const emailEl = pick(IDS.email);
  const passEl  = pick(IDS.pass);
  const msgBox  = pick(IDS.msg);

  // Muestra mensaje (alerta o cuadro)
  const show = (t, type = 'danger') => {
    if (!msgBox) {
      alert((type === 'success' ? '✅ ' : '⚠️ ') + t);
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
      show('Completa correo y contraseña (mín. 4 caracteres).');
      return;
    }

    try {
      // Login (Auth se encarga de validar y guardar usuario base)
      const user = Auth.login(email, pass);

      // Determinar rol según dominio del correo
      const isAdmin = DUOC_REGEX.test(email);   // duoc.cl, duocuc.cl, etc.
      const rol = isAdmin ? 'admin' : 'cliente';

      // Guardar rol junto con el usuario en la sesión (localStorage)
      const userData = { ...user, rol };
      localStorage.setItem('hh_auth', JSON.stringify(userData));

      show('Inicio de sesión correcto. Redirigiendo…', 'success');

      // 🔀 Redirección:
      //  - correos DUOC  → admin
      //  - Gmail u otros → perfilCliente
      const target =
        rol === 'admin'
          ? './perfilAdmin.html'
          : './perfilCliente.html';

      // avisar a la navbar u otros scripts
      window.dispatchEvent(
        new CustomEvent('auth:changed', { detail: { user: userData } })
      );

      setTimeout(() => {
        window.location.href = target;
      }, 800);
    } catch (err) {
      show(err?.message || '❌ No se pudo iniciar sesión. Verifica tus datos.');
    }
  });
});
