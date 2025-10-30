// assets/js/admin.js

// ======= Datos de prueba para localStorage =======
const LS_KEY = 'hh_admin_data_v1';

function seedData() {
  if (localStorage.getItem(LS_KEY)) return;

  const data = {
    ordenes: [
      { id: 1, cliente: 'María Pérez', fecha: '2025-10-01', total: 25990, estado: 'Pagada' },
      { id: 2, cliente: 'Juan Soto', fecha: '2025-10-02', total: 17990, estado: 'En preparación' },
      { id: 3, cliente: 'Huerto Hogar Cliente', fecha: '2025-10-03', total: 35990, estado: 'Enviada' },
    ],
    productos: [
      { id: 'HH-001', nombre: 'Miel de abeja 1kg', categoria: 'Orgánicos', precio: 5990, stock: 28 },
      { id: 'HH-002', nombre: 'Lechuga hidropónica', categoria: 'Verduras', precio: 1990, stock: 56 },
      { id: 'HH-003', nombre: 'Frutillas 500gr', categoria: 'Frutas', precio: 2990, stock: 33 },
      { id: 'HH-004', nombre: 'Yogurt artesanal', categoria: 'Lácteos', precio: 3490, stock: 14 },
    ],
    categorias: [
      'Frutas',
      'Verduras',
      'Lácteos',
      'Orgánicos',
      'Semillas',
    ],
    usuarios: [
      { nombre: 'Admin Principal', correo: 'admin@huertohogar.cl', rol: 'Super Admin', acceso: '08/10/2025 09:34' },
      { nombre: 'Karla Herrera', correo: 'karla@huertohogar.cl', rol: 'Administrador', acceso: '08/10/2025 10:12' },
      { nombre: 'Bryan Muñoz', correo: 'bryan@huertohogar.cl', rol: 'Vendedor', acceso: '08/10/2025 10:27' },
    ],
    perfil: {
      nombres: 'Karla / Bryan / Admin',
      apellidos: '',
      correo: 'admin@huertohogar.cl',
      telefono: '+56 9 1234 5678',
      direccion: 'Calle 123, depto 45',
      region: 'Región Metropolitana',
      comuna: 'Maipú',
      ultimoAcceso: '08/10/2025 09:34'
    }
  };

  localStorage.setItem(LS_KEY, JSON.stringify(data));
}

function readData() {
  return JSON.parse(localStorage.getItem(LS_KEY) || '{}');
}
function writeData(data) {
  localStorage.setItem(LS_KEY, JSON.stringify(data));
}

// ======= Renderizar tablas =======
function renderOrdenes() {
  const data = readData();
  const tbody = document.querySelector('#tblOrdenes');
  if (!tbody) return;
  tbody.innerHTML = (data.ordenes || []).map(o => `
    <tr>
      <td>${o.id}</td>
      <td>${o.cliente}</td>
      <td>${o.fecha}</td>
      <td>$${o.total.toLocaleString('es-CL')}</td>
      <td><span class="badge bg-success">${o.estado}</span></td>
    </tr>
  `).join('');
}
function renderProductos() {
  const data = readData();
  const tbody = document.querySelector('#tblProductos');
  if (!tbody) return;
  tbody.innerHTML = (data.productos || []).map(p => `
    <tr>
      <td>${p.id}</td>
      <td>${p.nombre}</td>
      <td>${p.categoria}</td>
      <td>$${p.precio.toLocaleString('es-CL')}</td>
      <td>${p.stock}</td>
    </tr>
  `).join('');
}
function renderCategorias() {
  const data = readData();
  const ul = document.querySelector('#lstCategorias');
  if (!ul) return;
  ul.innerHTML = (data.categorias || []).map(c => `
    <li class="list-group-item d-flex justify-content-between align-items-center">
      ${c}
      <span class="badge bg-secondary rounded-pill">Activa</span>
    </li>
  `).join('');
}
function renderUsuarios() {
  const data = readData();
  const tbody = document.querySelector('#tblUsuarios');
  if (!tbody) return;
  tbody.innerHTML = (data.usuarios || []).map(u => `
    <tr>
      <td>${u.nombre}</td>
      <td>${u.correo}</td>
      <td>${u.rol}</td>
      <td>${u.acceso}</td>
    </tr>
  `).join('');
}
function renderPerfil() {
  const data = readData();
  const p = data.perfil || {};
  const $ = s => document.querySelector(s);
  $('#perfilNombres') && ($('#perfilNombres').value = p.nombres || '');
  $('#perfilApellidos') && ($('#perfilApellidos').value = p.apellidos || '');
  $('#perfilCorreo') && ($('#perfilCorreo').value = p.correo || '');
  $('#perfilTelefono') && ($('#perfilTelefono').value = p.telefono || '');
  $('#perfilDireccion') && ($('#perfilDireccion').value = p.direccion || '');
  $('#perfilUltimoAcceso') && ($('#perfilUltimoAcceso').textContent = p.ultimoAcceso || '');
}

// ======= Navegación entre vistas =======
function setupNavigation() {
  const menu = document.querySelectorAll('.hh-admin-item[data-view]');
  const views = document.querySelectorAll('.hh-view');

  menu.forEach(btn => {
    btn.addEventListener('click', () => {
      const view = btn.dataset.view;

      // activar botón
      menu.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // mostrar vista
      views.forEach(v => {
        if (v.dataset.view === view) v.classList.remove('d-none');
        else v.classList.add('d-none');
      });
    });
  });
}

// ======= Logout =======
function setupLogout() {
  const btn1 = document.querySelector('#btnLogout');
  const btn2 = document.querySelector('#perfilCerrar');

  const doLogout = () => {
    // si tienes otros keys de auth, los limpias aquí
    // localStorage.removeItem('hh_auth');
    // pero dejamos los datos del admin
    window.location.href = '../login.html';
  };

  btn1 && btn1.addEventListener('click', doLogout);
  btn2 && btn2.addEventListener('click', doLogout);
}

// ======= Guardar perfil =======
function setupPerfilForm() {
  const form = document.querySelector('#formPerfil');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const data = readData();
    data.perfil = {
      nombres: document.querySelector('#perfilNombres').value,
      apellidos: document.querySelector('#perfilApellidos').value,
      correo: document.querySelector('#perfilCorreo').value,
      telefono: document.querySelector('#perfilTelefono').value,
      direccion: document.querySelector('#perfilDireccion').value,
      region: document.querySelector('#perfilRegion').value,
      comuna: document.querySelector('#perfilComuna').value,
      ultimoAcceso: data.perfil?.ultimoAcceso || new Date().toLocaleString('es-CL')
    };
    writeData(data);
    alert('Perfil actualizado ✅');
  });
}

// ======= INIT =======
seedData();
renderOrdenes();
renderProductos();
renderCategorias();
renderUsuarios();
renderPerfil();
setupNavigation();
setupLogout();
setupPerfilForm();
