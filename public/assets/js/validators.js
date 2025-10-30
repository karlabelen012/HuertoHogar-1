// assets/js/validators.js
// ========== CONST ==========
export const REGEX = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/i,
  phoneCL: /^\+?56\s?9\s?\d{4}\s?\d{4}$/,
};

// ========== FNS ==========
export const validateRequired = v => !!(v && String(v).trim().length);
export const validateMinLen   = (v,n=1) => String(v||'').length >= n;
export const validateEmail    = v => REGEX.email.test(String(v||'').trim());
export const validatePhoneCL  = v => REGEX.phoneCL.test(String(v||'').trim());
