// ======================================================
// auth.js → registro, login, logout, usuario actual
// usa validaciones.js (no valida aquí dentro)
// guarda también mensajes de contacto en hh_messages
// ======================================================
import { validarRegistro, validarLogin, validarContacto } from './validaciones.js';

const KEYS = {
  USERS:  'hh_users',
  AUTH:   'hh_auth',
  MSGS:   'hh_messages'
};

const readJSON  = (k,fb=null)=>{ try{ return JSON.parse(localStorage.getItem(k)??'null') ?? fb; }catch{ return fb; } };
const writeJSON = (k,v)=> localStorage.setItem(k, JSON.stringify(v));

// rol por dominio
const inferRole = email =>
  /@(duoc\.cl|duocuc\.cl|profesor\.duoc\.cl|duocpro\.cl)$/i.test(String(email||'').toLowerCase())
    ? 'admin'
    : 'cliente';

// password simple (hash pobre para demo)
const hash = s => {
  let h=0;
  for (let i=0;i<String(s).length;i++){
    h=((h<<5)-h)+s.charCodeAt(i);
    h|=0;
  }
  return String(h);
};

export const Auth = {
  users() {
    return readJSON(KEYS.USERS, []);
  },

  register(formData){
    const err = validarRegistro(formData);
    if (err) throw new Error(err);

    const users = readJSON(KEYS.USERS, []);
    const exists = users.some(u => (u.email||'').toLowerCase() === formData.email.toLowerCase());
    if (exists) throw new Error('El correo ya está registrado');

    const user = {
      id: 'U' + Date.now(),
      nombre: formData.nombre.trim(),
      apellidos: formData.apellidos.trim(),
      email: formData.email.trim().toLowerCase(),
      telefono: formData.telefono || '',
      fechaNac: formData.fechaNac,
      region: formData.region || '',
      comuna: formData.comuna || '',
      direccion: formData.direccion || '',
      rol: inferRole(formData.email),
      password: hash(formData.password),
      createdAt: new Date().toISOString()
    };

    users.push(user);
    writeJSON(KEYS.USERS, users);

    // dejarlo logeado de una
    const auth = { user: { ...user, password: undefined }, loggedAt: new Date().toISOString() };
    writeJSON(KEYS.AUTH, auth);
    localStorage.setItem('hh_user', JSON.stringify(auth.user));
    window.dispatchEvent(new CustomEvent('auth:login', { detail: auth.user }));

    return auth.user;
  },

  login(email, password){
    const err = validarLogin(email, password);
    if (err) throw new Error(err);

    const users = readJSON(KEYS.USERS, []);
    const u = users.find(x => (x.email||'').toLowerCase() === email.toLowerCase());
    if (!u) throw new Error('Usuario no encontrado');
    if (u.password !== hash(password)) throw new Error('Credenciales inválidas');

    const auth = { user: { ...u, password: undefined }, loggedAt: new Date().toISOString() };
    writeJSON(KEYS.AUTH, auth);
    localStorage.setItem('hh_user', JSON.stringify(auth.user));
    window.dispatchEvent(new CustomEvent('auth:login', { detail: auth.user }));
    return auth.user;
  },

  logout(){
    localStorage.removeItem(KEYS.AUTH);
    window.dispatchEvent(new Event('auth:logout'));
  },

  current(){
    return readJSON(KEYS.AUTH, null)?.user || null;
  },

  isAdmin(){
    return Auth.current()?.rol === 'admin';
  },

  // contacto desde contacto.html
  saveContact(data){
    const err = validarContacto(data);
    if (err) throw new Error(err);

    const msgs = readJSON(KEYS.MSGS, []);
    msgs.push({
      ...data,
      id: Date.now(),
      fecha: new Date().toISOString(),
      leido: false
    });
    writeJSON(KEYS.MSGS, msgs);
    return true;
  }
};

window.Auth = Auth; // compat para páginas viejas
