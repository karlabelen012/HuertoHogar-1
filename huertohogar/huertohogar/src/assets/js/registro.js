// assets/js/registro.js
// ========== CONST ==========
const IDS = {
  form:'#registerForm,#formRegistro',
  nombre:'#nombre', apellidos:'#apellidos',
  email:'#email', email2:'#email2',
  pass:'#password', pass2:'#password2',
  tel:'#telefono', region:'#region', comuna:'#comuna', dir:'#direccion',
  msg:'#regMsg'
};

import { Auth } from './auth.js';
import { validateEmail, validateMinLen, validateRequired, validatePhoneCL } from './validators.js';

const pick = sel => sel.split(',').map(s=>s.trim()).map(document.querySelector.bind(document)).find(Boolean);

document.addEventListener('DOMContentLoaded', () => {
  const form = pick(IDS.form); if(!form) return;
  const msgBox = pick(IDS.msg);
  const show = (t,type='danger') => { if(!msgBox) return alert('⚠️ '+t); msgBox.className=`alert alert-${type}`; msgBox.textContent=t; msgBox.hidden=false; };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = {
      nombre:    pick(IDS.nombre)?.value?.trim(),
      apellidos: pick(IDS.apellidos)?.value?.trim()||'',
      email:     pick(IDS.email)?.value?.trim(),
      email2:    pick(IDS.email2)?.value?.trim(),
      password:  pick(IDS.pass)?.value||'',
      password2: pick(IDS.pass2)?.value||'',
      telefono:  pick(IDS.tel)?.value?.trim(),
      region:    pick(IDS.region)?.value,
      comuna:    pick(IDS.comuna)?.value,
      direccion: pick(IDS.dir)?.value?.trim()||'',
    };

    if(!validateRequired(data.nombre))                 return show('Nombre obligatorio');
    if(!validateEmail(data.email))                     return show('Correo no válido');
    if(data.email !== data.email2)                     return show('Los correos no coinciden');
    if(!validateMinLen(data.password,4))              return show('Contraseña mínima 4 caracteres');
    if(data.password !== data.password2)              return show('Las contraseñas no coinciden');
    if(data.telefono && !validatePhoneCL(data.telefono)) return show('Teléfono chileno no válido');
    if(!validateRequired(data.region) || !validateRequired(data.comuna)) return show('Selecciona región y comuna');

    try{
      const u = Auth.register(data);
      Auth.login(u.email, data.password); // sesión inmediata
      show('Registro exitoso. ¡Bienvenida/o!','success');
      setTimeout(()=> location.href='../page/index.html',700);
    }catch(err){ show(err.message||'No se pudo registrar'); }
  });
});
