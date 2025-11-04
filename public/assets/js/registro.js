// assets/js/registro.js
// ==========================================================
// 🌿 Registro de usuarios - HuertoHogar
// - Guarda usuario en localStorage (hh_users) vía Auth.register()
// - Inicia sesión automática con Auth.login()
// - Redirige:
//     DUOC → perfilAdmin.html
//     Gmail → perfil.html
// - Valida dominio, teléfono, mayor de edad, etc.
// ==========================================================

// ========== SELECTORES Y CONST ==========
const IDS = {
  form:      '#registerForm,#formRegistro',
  nombre:    '#nombre',
  apellidos: '#apellidos',          // opcional
  email:     '#email',
  email2:    '#email2',
  pass:      '#password',
  pass2:     '#password2',
  tel:       '#telefono',
  region:    '#region',
  comuna:    '#comuna',
  dir:       '#direccion',          // opcional
  fecha:     '#fechaNacimiento',    // fecha de nacimiento
  msg:       '#regMsg'              // div de mensajes (si no existe, usa alert)
};

// ====== IMPORTS ======
import { Auth } from './auth.js';
import {
  validateEmail,
  validateMinLen,
  validateRequired,
  validatePhoneCL,
  validateDomain,
  validateAdult
} from './validators.js';

// ====== HELPERS ======
const pick = sel =>
  sel
    .split(',')
    .map(s => s.trim())
    .map(document.querySelector.bind(document))
    .find(Boolean);

// ==========================================================
// MAIN LOGIC
// ==========================================================
document.addEventListener('DOMContentLoaded', () => {
  const form = pick(IDS.form);
  if (!form) return;

  const msgBox = pick(IDS.msg);

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

    const data = {
      nombre:          pick(IDS.nombre)?.value?.trim(),
      apellidos:       pick(IDS.apellidos)?.value?.trim() || '',
      email:           pick(IDS.email)?.value?.trim(),
      email2:          pick(IDS.email2)?.value?.trim(),
      password:        pick(IDS.pass)?.value || '',
      password2:       pick(IDS.pass2)?.value || '',
      telefono:        pick(IDS.tel)?.value?.trim(),
      region:          pick(IDS.region)?.value,
      comuna:          pick(IDS.comuna)?.value,
      direccion:       pick(IDS.dir)?.value?.trim() || '',
      fechaNacimiento: pick(IDS.fecha)?.value || ''
    };

    // ==========================================================
    // VALIDACIONES
    // ==========================================================
    if (!validateRequired(data.nombre))
      return show('Nombre obligatorio');

    if (!validateEmail(data.email))
      return show('Correo no válido');

    if (!validateDomain(data.email))
      return show('Solo se permiten correos @duoc.cl, @duocuc.cl, @profesor.duoc.cl, @duocpro.cl o @gmail.com');

    if (data.email !== data.email2)
      return show('Los correos no coinciden');

    if (!validateMinLen(data.password, 4))
      return show('Contraseña mínima 4 caracteres');

    if (data.password !== data.password2)
      return show('Las contraseñas no coinciden');

    if (data.telefono && !validatePhoneCL(data.telefono))
      return show('Teléfono chileno no válido (+56 9 XXXX XXXX)');

    if (!validateRequired(data.region) || !validateRequired(data.comuna))
      return show('Selecciona región y comuna');

    if (!validateRequired(data.fechaNacimiento))
      return show('Fecha de nacimiento obligatoria');

    if (!validateAdult(data.fechaNacimiento, 18))
      return show('Debes ser mayor de 18 años para registrarte');

    // ==========================================================
    // REGISTRO E INICIO DE SESIÓN
    // ==========================================================
    try {
      // 1️⃣ Registrar usuario (se guarda en hh_users con rol inferido)
      const nuevo = Auth.register(data);

      // 2️⃣ Iniciar sesión inmediatamente
      const loggedUser = Auth.login(nuevo.email, data.password);

      // 3️⃣ Mensaje
      show(`Registro exitoso. ¡Bienvenida/o, ${loggedUser.nombre}!`, 'success');

      // 4️⃣ Redirigir según rol (ya viene en loggedUser.rol)
      const target =
        loggedUser.rol === 'admin'
          ? '../page/perfilAdmin.html'
          : '../page/perfil.html';

      setTimeout(() => {
        location.href = target;
      }, 700);

    } catch (err) {
      show(err.message || 'No se pudo registrar');
    }
  });
});
