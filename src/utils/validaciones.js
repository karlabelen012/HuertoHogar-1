/*  aqui poner validaciones del proyecto pero solo los fution y ponerles export*/
/* comit : Se actulizar al formato react Validaciones */


// Validación del correo
export function validarCorreo(correo) {
  // acepta @duoc.cl, @profesor.duoc.cl y @gmail.com
  const regex = /^[\w.+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i;
  return regex.test(String(correo).trim());
}

// Validación del RUN (sin puntos ni guión, 7 u 8 números + dígito verificador)
export function validarRun(run) {
  // ejemplo que mostró la profe: 8 números y un dígito 0-9K
  const regex = /^[0-9]{7,8}[0-9Kk]$/;
  return regex.test(String(run).trim());
}

// Validación de edad mínima 18 años
export function esMayorEdad(fecha) {
  if (!fecha) return false;
  const hoy = new Date();
  const fNac = new Date(fecha);
  let edad = hoy.getFullYear() - fNac.getFullYear();
  const m = hoy.getMonth() - fNac.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < fNac.getDate())) {
    edad--;
  }
  return edad >= 18;
}
