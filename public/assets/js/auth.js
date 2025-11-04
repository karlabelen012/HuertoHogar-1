// assets/js/auth.js
// ========== CONST ==========
const KEYS = { USERS:'hh_users', AUTH:'hh_auth' };

// ========== UTILS ==========
const readJSON  = (k,fb=null)=>{ 
  try{ 
    return JSON.parse(localStorage.getItem(k)??'null') ?? fb; 
  }catch{ 
    return fb; 
  } 
};
const writeJSON = (k,v)=> localStorage.setItem(k, JSON.stringify(v));
const hash = s => { 
  let h=0; 
  for(let i=0;i<String(s).length;i++){ 
    h=((h<<5)-h)+s.charCodeAt(i); 
    h|=0; 
  } 
  return String(h); 
};

// Rol según dominio: DUOC → admin, resto → cliente
const inferRole = email =>
  /@(duoc\.cl|duocuc\.cl|profesor\.duoc\.cl|duocpro\.cl)$/i
    .test(String(email||'').toLowerCase())
    ? 'admin'
    : 'cliente';

// ========== API ==========
export const Auth = {
  users: () => readJSON(KEYS.USERS, []),

  register(data){
    const users = readJSON(KEYS.USERS, []);
    const exists = users.some(
      u => (u.email||'').toLowerCase() === (data.email||'').toLowerCase()
    );
    if (exists) throw new Error('El correo ya está registrado');

    const user = {
      id: 'U'+Date.now(),
      nombre: (data.nombre||'').trim(),
      apellidos: (data.apellidos||'').trim(),
      email: (data.email||'').trim(),
      telefono: data.telefono||'',
      region: data.region||'',
      comuna: data.comuna||'',
      direccion: data.direccion||'',
      fechaNacimiento: data.fechaNacimiento || '',
      rol: inferRole(data.email),
      password: hash(data.password||''),
      createdAt: new Date().toISOString()
    };
    users.push(user);
    writeJSON(KEYS.USERS, users);
    return user;
  },

  login(email, password){
    const users = readJSON(KEYS.USERS, []);
    const u = users.find(
      x => (x.email||'').toLowerCase() === String(email).toLowerCase()
    );
    if (!u || u.password !== hash(password||'')) {
      throw new Error('Credenciales inválidas');
    }

    const auth = { 
      user: { ...u, password: undefined }, 
      loggedAt: new Date().toISOString() 
    };
    writeJSON(KEYS.AUTH, auth);
    localStorage.setItem('hh_user', JSON.stringify(auth.user)); // compat checkout
    window.dispatchEvent(new CustomEvent('auth:login', { detail: auth.user }));
    return auth.user;
  },

  logout(){
    localStorage.removeItem(KEYS.AUTH);
    localStorage.removeItem('hh_user');
    window.dispatchEvent(new Event('auth:logout'));
  },

  current(){ 
    return readJSON(KEYS.AUTH, null)?.user || null; 
  },

  isAdmin(){ 
    return Auth.current()?.rol === 'admin'; 
  }
};

window.Auth = Auth; // compat
