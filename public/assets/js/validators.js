// assets/js/validators.js
// ========== REGEX GLOBALES ==========
export const REGEX = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/i,
  phoneCL: /^\+?56\s?9\s?\d{4}\s?\d{4}$/,
  domainAllowed: /@(duoc\.cl|duocuc\.cl|profesor\.duoc\.cl|duocpro\.cl|gmail\.com)$/i
};

// ========== FUNCIONES BÁSICAS ==========
export const validateRequired = v =>
  !!(v && String(v).trim().length);

export const validateMinLen = (v, n = 1) =>
  String(v || '').length >= n;

export const validateEmail = v =>
  REGEX.email.test(String(v || '').trim());

export const validatePhoneCL = v =>
  REGEX.phoneCL.test(String(v || '').trim());

// ========== DOMINIO PERMITIDO ==========
export const validateDomain = email =>
  REGEX.domainAllowed.test(String(email || '').trim());

// ========== MAYOR DE EDAD ==========
/**
 * Valida si la fecha corresponde a una persona mayor o igual a minYears (por defecto 18)
 * @param {string} dateStr - Fecha en formato "YYYY-MM-DD" (input type="date")
 * @param {number} minYears - Edad mínima requerida
 * @returns {boolean}
 */
export const validateAdult = (dateStr, minYears = 18) => {
  if (!dateStr) return false;
  const dob = new Date(dateStr);
  if (Number.isNaN(dob.getTime())) return false;

  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age >= minYears;
};
