// src/utils/scripts.js
// ======================================================
//  Utilidades de validación para Huerto Hogar (React)
//  - Sin acceso al DOM
//  - Sin imports de ui.js, auth.js, cart.js
//  - Listas para usar en Karma/Jasmine o en componentes
// ======================================================

/**
 * Valida un RUN/RUT chileno básico.
 * Acepta formatos:
 *   12345678-5
 *   12.345.678-5  (se limpian puntos)
 */
export function validarRun(run) {
  if (!run || typeof run !== "string") return false;

  // Limpiar puntos y espacios
  const limpio = run.replace(/\./g, "").trim();

  // Debe tener un guion
  if (!/^\d{7,8}-[\dkK]$/.test(limpio)) return false;

  const [cuerpoStr, dvIngresado] = limpio.split("-");
  

  // Cálculo de dígito verificador (módulo 11)
  let suma = 0;
  let multiplicador = 2;

  for (let i = cuerpoStr.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpoStr[i], 10) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }

  const resto = suma % 11;
  const dvCalc = 11 - resto;

  let dv;
  if (dvCalc === 11) dv = "0";
  else if (dvCalc === 10) dv = "K";
  else dv = String(dvCalc);

  return dv.toUpperCase() === dvIngresado.toUpperCase();
}

/**
 * Valida un correo electrónico simple.
 */
export function validarCorreo(correo) {
  if (!correo || typeof correo !== "string") return false;

  const email = correo.trim();
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return regex.test(email);
}

/**
 * Verifica si la persona es mayor o igual a 18 años
 * a partir de una fecha en formato "YYYY-MM-DD" o "YYYY/MM/DD".
 */
export function esMayorEdad(fechaStr) {
  if (!fechaStr || typeof fechaStr !== "string") return false;

  const normalizada = fechaStr.replace(/\//g, "-");
  const partes = normalizada.split("-");
  if (partes.length !== 3) return false;

  const [y, m, d] = partes.map((p) => parseInt(p, 10));
  if (!y || !m || !d) return false;

  const hoy = new Date();
  const fechaNac = new Date(y, m - 1, d);

  if (Number.isNaN(fechaNac.getTime())) return false;

  let edad = hoy.getFullYear() - fechaNac.getFullYear();
  const mes = hoy.getMonth() - fechaNac.getMonth();

  if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
    edad--;
  }

  return edad >= 18;
}

// Puedes agregar más helpers aquí si los necesitas,
// pero recuerda NO importar ui.js, auth.js ni cart.js
// dentro de este archivo para evitar errores en React.
