// =======================================
// 📦 VALIDACIONES DEL PROYECTO HUERTO HOGAR
// =======================================

// ✅ Validación de correo (solo dominios permitidos)
export function validarCorreo(correo) {
  // acepta @duoc.cl, @profesor.duoc.cl y @gmail.com
  const regex = /^[\w.+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i;
  return regex.test(String(correo).trim());
}

// ✅ Validación del RUN (sin puntos ni guión)
export function validarRun(run) {
  // ejemplo: 19011022K o 12345678-9 (sin guión)
  const regex = /^[0-9]{7,8}[0-9Kk]$/;
  return regex.test(String(run).trim());
}

// ✅ Validación de edad mínima (18 años o más)
export function esMayorEdad(fecha) {
  if (!fecha) return false;
  const hoy = new Date();
  const fNac = new Date(fecha);
  let edad = hoy.getFullYear() - fNac.getFullYear();
  const mes = hoy.getMonth() - fNac.getMonth();
  if (mes < 0 || (mes === 0 && hoy.getDate() < fNac.getDate())) {
    edad--;
  }
  return edad >= 18;
}

// ✅ Validación de texto (nombre, apellido) — solo letras y espacios
export function validarTexto(texto) {
  const regex = /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]{1,50}$/;
  return regex.test(String(texto).trim());
}

// ✅ Validación de dirección (requerido, máx. 300 caracteres)
export function validarDireccion(dir) {
  return dir.trim().length > 0 && dir.trim().length <= 300;
}

// ✅ Validación de comentario (requerido, máx. 500 caracteres)
export function validarComentario(texto) {
  return texto.trim().length > 0 && texto.trim().length <= 500;
}

// ✅ Validación de número (precio o stock)
export function validarNumero(valor) {
  const regex = /^[0-9]+(\.[0-9]{1,2})?$/; // solo números o decimales
  return regex.test(valor) && parseFloat(valor) >= 0;
}
