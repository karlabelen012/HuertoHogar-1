// ../assets/js/validaciones.js
// =====================================================
//  Huerto Hogar — Validaciones globales (puras)
// =====================================================

// ---------- Helpers básicos ----------
export function isRequired(v) {
  return v !== undefined && v !== null && String(v).trim().length > 0;
}

export function isEmail(v) {
  if (!v) return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(v).trim());
}

export function isAllowedDomain(email) {
  if (!email) return false;
  return /@(duoc\.cl|duocuc\.cl|profesor\.duoc\.cl|duocpro\.cl|gmail\.com)$/i.test(
    String(email).trim()
  );
}

export function isClPhone(tel) {
  if (!tel) return true;
  return /^\+?56\s?9\s?\d{4}\s?\d{4}$/.test(String(tel).trim());
}

export function isPasswordOk(pass, min = 4) {
  return pass && String(pass).length >= min;
}

export function isSame(a, b) {
  return String(a || '') === String(b || '');
}

// --- fecha ---
export function isValidBirthdate(v) {
  if (!v) return false;
  return /^\d{4}-\d{2}-\d{2}$/.test(v);
}

export function isAdult(v, minYears = 18) {
  if (!isValidBirthdate(v)) return false;
  const [y, m, d] = v.split('-').map(Number);
  const born = new Date(y, m - 1, d);
  const now = new Date();
  const diff = now.getFullYear() - born.getFullYear();
  if (diff > minYears) return true;
  if (diff < minYears) return false;
  // mismo año de cumple
  if (now.getMonth() > born.getMonth()) return true;
  if (now.getMonth() < born.getMonth()) return false;
  return now.getDate() >= born.getDate();
}

// =====================================================
// 1) Registro
// =====================================================
export function validateRegisterForm(data) {
  if (!isRequired(data.nombre)) return 'Nombre obligatorio';
  if (!isEmail(data.email)) return 'Correo no válido';
  if (!isAllowedDomain(data.email)) return 'Solo correos DUOC o Gmail';
  if (!isSame(data.email, data.email2)) return 'Los correos no coinciden';

  if (!isPasswordOk(data.password, 4)) return 'Contraseña mínima 4 caracteres';
  if (!isSame(data.password, data.password2)) return 'Las contraseñas no coinciden';

  if (!isClPhone(data.telefono)) return 'Teléfono chileno no válido';

  if (!isRequired(data.region) || !isRequired(data.comuna))
    return 'Selecciona región y comuna';

  // fecha obligatoria + mayor de edad
  if (!data.fechaNacimiento) return 'La fecha de nacimiento es obligatoria';
  if (!isValidBirthdate(data.fechaNacimiento)) return 'Fecha de nacimiento no válida';
  if (!isAdult(data.fechaNacimiento, 18)) return 'Debes ser mayor de edad (18+)';

  return null;
}

// =====================================================
// 2) Login
// =====================================================
export function validateLoginForm(email, pass) {
  if (!isEmail(email)) return 'Correo no válido';
  if (!isAllowedDomain(email)) return 'Dominio no permitido';
  if (!isRequired(pass)) return 'Contraseña requerida';
  return null;
}

// =====================================================
// 3) Contacto
// =====================================================
export function validateContactForm(data) {
  if (!isRequired(data.nombre)) return 'Nombre es requerido';
  if (!isEmail(data.email)) return 'Email no válido';
  if (data.telefono && !isClPhone(data.telefono)) return 'Teléfono no válido';
  if (!isRequired(data.asunto)) return 'Asunto es requerido';
  if (!isRequired(data.mensaje)) return 'Mensaje es requerido';
  return null;
}

// =====================================================
// 4) Checkout
// =====================================================
export function validateCheckoutUser(data) {
  if (!isRequired(data.nombre)) return 'Nombre es obligatorio';
  if (!isRequired(data.apellidos)) return 'Apellidos son obligatorios';
  if (!isEmail(data.correo)) return 'Correo no válido';
  if (!isRequired(data.calle)) return 'Dirección / calle es obligatoria';
  if (!isRequired(data.region)) return 'Selecciona una región';
  if (!isRequired(data.comuna)) return 'Selecciona una comuna';
  return null;
}

// =====================================================
// 5) Pago / tarjeta
// =====================================================
export function luhnValid(numStr) { /* igual que antes */ }
export function expiryValid(mmYY) { /* igual que antes */ }

export function validateCardForm(card) {
  if (!isRequired(card.name)) return 'Nombre en la tarjeta es obligatorio';
  const rawNum = String(card.number || '').replace(/\s+/g, '');
  if (!luhnValid(rawNum)) return 'Número de tarjeta no válido';
  if (!expiryValid(card.expiry || '')) return 'Fecha de vencimiento inválida';
  if (!/^\d{3,4}$/.test(String(card.cvv || ''))) return 'CVV inválido';
  return null;
}

// =====================================================
// 6) Rol por correo
// =====================================================
export function roleFromEmail(email) {
  return /@(duoc\.cl|duocuc\.cl|profesor\.duoc\.cl|duocpro\.cl)$/i.test(
    String(email || '').toLowerCase()
  )
    ? 'admin'
    : 'cliente';
}
