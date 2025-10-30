// ======================================================
// admin.js → panel admin (usuarios, productos, categorías,
// órdenes, reportes/contacto, perfil, logout)
// Usa: data.js, auth.js, cart.js (para órdenes)
// ======================================================
import { CATEGORIAS as BASE_CATEGORIAS, PRODUCTOS as BASE_PRODUCTOS } from './data.js';

const KEYS = {
  USERS: 'hh_users',
  SESSION: 'hh_auth',            // usamos el mismo que auth.js
  PRODUCTS: 'hh_products',
  CATEGORIES: 'hh_categories',
  ORDERS: 'hh_orders',
  PROFILE: 'hh_admin_profile',
  EVENTS: 'hh_events',
  MSGS: 'hh_messages',
  PAY_ERR: 'hh_pay_errors'
};

const readJSON = (k, fb = null) => {
  try { return JSON.parse(localStorage.getItem(k) || 'null') ?? fb; }
  catch { return fb; }
};
const writeJSON = (k, v) => localStorage.setItem(k, JSON.stringify(v));

function seedIfEmpty() {
  if (!localStorage.getItem(KEYS.PRODUCTS)) {
    const mapped = BASE_PRODUCTOS.map(p => ({
      id: p.id,
      nombre: p.nombre,
      categoria: p.categoria,
      precio: p.precio,
      stock: 10,
      img: p.img,
      unidad: 'kg',
      descripcion: `Producto ${p.nombre} de Huerto Hogar.`
    }));
    writeJSON(KEYS.PRODUCTS, mapped);
  }
  if (!localStorage.getItem(KEYS.CATEGORIES)) {
    const mappedCat = BASE_CATEGORIAS.map(c => ({
      id: c.id,
      nombre: c.id,
      img: c.img,
      descripcion: `Productos de la categoría ${c.id}`
    }));
    writeJSON(KEYS.CATEGORIES, mappedCat);
  }
  if (!localStorage.getItem(KEYS.ORDERS)) {
    writeJSON(KEYS.ORDERS, [
      { id: 1, cliente: 'Cliente demo', fecha: new Date().toISOString().substring(0,10), total: 12990, estado: 'Pagada' }
    ]);
  }
  if (!localStorage.getItem(KEYS.PROFILE)) {
    writeJSON(KEYS.PROFILE, {
      nombres: 'Administrador',
      apellidos: '',
      correo: 'admin@huertohogar.cl',
      telefono: '',
      direccion: '',
      ultimoAcceso: new Date().toLocaleString('es-CL'),
      rol: 'Super Admin'
    });
  }
  if (!localStorage.getItem(KEYS.EVENTS)) {
    writeJSON(KEYS.EVENTS, [
      { id: 'ev1', titulo: 'Cyber Orgánico', fin: '2025-12-01', descripcion: 'Descuentos 30% orgánicos', img:'../assets/image/logo.png' }
    ]);
  }
}

function isAdminAuth() {
  const session = readJSON(KEYS.SESSION, null);
  if (!session?.user) return false;
  return /@(duoc\.cl|duocuc\.cl|profesor\.duoc\.cl|duocpro\.cl)$/i.test(session.user.email);
}

// ----- dashboard -----
function renderDashboard() {
  const orders = readJSON(KEYS.ORDERS, []);
  const products = readJSON(KEYS.PRODUCTS, []);
  const users = readJSON(KEYS.USERS, []);
  const totalStock = products.reduce((a,p)=>a+(p.stock||0),0);

  const kCompras = document.querySelector('#kpiCompras');
  const kProd = document.querySelector('#kpiProductos');
  const kUsr = document.querySelector('#kpiUsuarios');
  const kStock = document.querySelector('#kpiStock');

  kCompras && (kCompras.textContent = String(orders.length));
  kProd && (kProd.textContent = String(products.length));
  kUsr && (kUsr.textContent = String(users.length));
  kStock && (kStock.textContent = String(totalStock));
}

// ----- órdenes -----
function renderOrdenes() {
  const orders = readJSON(KEYS.ORDERS, []);
  const errs   = readJSON(KEYS.PAY_ERR, []);
  const tbody = document.querySelector('#tblOrdenes tbody');
  if (!tbody) return;
  const all = [
    ...orders.map(o => ({...o, tipo:'OK'})),
    ...errs.map(e => ({ id:e.id, cliente:e.user?.nombre || '—', fecha:e.when?.substring(0,10), total:e.total, estado:'Error de pago', tipo:'ERR' }))
  ];
  tbody.innerHTML = all.map(o => `
    <tr data-id="${o.id}">
      <td>${o.id}</td>
      <td>${o.cliente}</td>
      <td>${o.fecha}</td>
      <td>$${Number(o.total||0).toLocaleString('es-CL')}</td>
      <td>
        <select class="form-select form-select-sm ord-estado" data-id="${o.id}">
          <option ${o.estado==='Pagada'?'selected':''}>Pagada</option>
          <option ${o.estado==='En preparación'?'selected':''}>En preparación</option>
          <option ${o.estado==='Enviada'?'selected':''}>Enviada</option>
          <option ${o.estado==='Listo para entrega'?'selected':''}>Listo para entrega</option>
          <option ${o.estado==='Error de pago'?'selected':''}>Error de pago</option>
        </select>
      </td>
      <td><button class="btn btn-sm btn-danger ord-del" data-id="${o.id}">🗑</button></td>
    </tr>
  `).join('');
}

function setupFormOrden() {
  const form = document.querySelector('#formOrden');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const cliente = document.querySelector('#ordCliente').value.trim();
    const total = Number(document.querySelector('#ordTotal').value||0);
    const estado = document.querySelector('#ordEstado').value;
    const orders = readJSON(KEYS.ORDERS, []);
    const newId = orders.length ? Math.max(...orders.map(o=>o.id))+1 : 1;
    orders.push({
      id: newId,
      cliente,
      fecha: new Date().toISOString().substring(0,10),
      total,
      estado
    });
    writeJSON(KEYS.ORDERS, orders);
    renderOrdenes();
    renderDashboard();
    form.reset();
  });

  document.addEventListener('change', (e) => {
    if (!e.target.matches('.ord-estado')) return;
    const id = e.target.dataset.id;
    const orders = readJSON(KEYS.ORDERS, []);
    const idx = orders.findIndex(o => String(o.id) === String(id));
    if (idx>=0) {
      orders[idx].estado = e.target.value;
      writeJSON(KEYS.ORDERS, orders);
    }
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.ord-del')) return;
    const id = e.target.closest('.ord-del').dataset.id;
    const orders = readJSON(KEYS.ORDERS, []).filter(o => String(o.id)!==String(id));
    writeJSON(KEYS.ORDERS, orders);
    renderOrdenes();
    renderDashboard();
  });
}

// ----- productos -----
function renderProductos() {
  const products = readJSON(KEYS.PRODUCTS, []);
  const tbody = document.querySelector('#tblProductos tbody');
  if (!tbody) return;
  tbody.innerHTML = products.map(p => `
    <tr data-pid="${p.id}">
      <td>${p.id}</td>
      <td>${p.nombre}</td>
      <td>${p.categoria}</td>
      <td>$${Number(p.precio).toLocaleString('es-CL')}</td>
      <td>${p.stock ?? 0}</td>
    </tr>
  `).join('');
}

function renderCategorias() {
  const cats = readJSON(KEYS.CATEGORIES, []);
  const ul = document.querySelector('#lstCategorias');
  const sel = document.querySelector('#prodCat');
  if (ul) {
    ul.innerHTML = cats.map(c => `
      <li class="list-group-item d-flex justify-content-between align-items-center" data-cid="${c.id}">
        <span>${c.nombre}</span>
        <span class="badge bg-secondary">Activa</span>
      </li>
    `).join('');
  }
  if (sel) {
    sel.innerHTML = cats.map(c => `<option value="${c.nombre}">${c.nombre}</option>`).join('');
  }
}

function setupFormProducto() {
  const form = document.querySelector('#formProducto');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const nombre = document.querySelector('#prodNombre').value.trim();
    const precio = Number(document.querySelector('#prodPrecio').value||0);
    const stock  = Number(document.querySelector('#prodStock').value||0);
    const cat    = document.querySelector('#prodCat').value;
    const img    = document.querySelector('#prodImg').value.trim();
    const products = readJSON(KEYS.PRODUCTS, []);
    const newId = 'P' + String(Date.now()).slice(-5);
    products.push({
      id: newId,
      nombre,
      categoria: cat,
      precio,
      stock,
      img,
      unidad: 'kg',
      descripcion: `Producto ${nombre} de la categoría ${cat}.`
    });
    writeJSON(KEYS.PRODUCTS, products);
    renderProductos();
    renderDashboard();
    form.reset();
  });

  // click para ver detalle
  document.addEventListener('click', (e) => {
    const tr = e.target.closest('#tblProductos tbody tr');
    if (!tr) return;
    const pid = tr.dataset.pid;
    const products = readJSON(KEYS.PRODUCTS, []);
    const p = products.find(x => x.id === pid);
    if (!p) return;
    const card = document.querySelector('#prodDetail');
    if (!card) return;
    card.style.display = 'block';
    document.querySelector('#prodDetailId').textContent = p.id;
    document.querySelector('#prodDetailName').textContent = p.nombre;
    document.querySelector('#prodDetailCat').textContent = p.categoria;
    document.querySelector('#prodDetailPrice').textContent = Number(p.precio).toLocaleString('es-CL');
    document.querySelector('#prodDetailStock').textContent = p.stock ?? 0;
    document.querySelector('#prodDetailUnit').textContent = p.unidad || 'por kg';
    document.querySelector('#prodDetailDesc').textContent = p.descripcion || '—';
    const img = document.querySelector('#prodDetailImg');
    if (p.img) { img.src = p.img; img.style.display='block'; }
    else img.style.display='none';
  });
}

function setupFormCategoria() {
  const form = document.querySelector('#formCategoria');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const nombre = document.querySelector('#catNombre').value.trim();
    const img = document.querySelector('#catImg').value.trim();
    const cats = readJSON(KEYS.CATEGORIES, []);
    cats.push({ id:nombre, nombre, img, descripcion:`Productos relacionados a ${nombre}.` });
    writeJSON(KEYS.CATEGORIES, cats);
    renderCategorias();
    form.reset();
  });

  // ver detalle
  document.addEventListener('click', (e) => {
    const li = e.target.closest('#lstCategorias li');
    if (!li) return;
    const cid = li.dataset.cid;
    const cats = readJSON(KEYS.CATEGORIES, []);
    const c = cats.find(x => x.id === cid);
    if (!c) return;
    const card = document.querySelector('#catDetail');
    card.style.display = 'block';
    document.querySelector('#catDetailName').textContent = c.nombre;
    document.querySelector('#catDetailImg').textContent = c.img || '—';
    document.querySelector('#catDetailDesc').textContent = c.descripcion || '—';
  });
}

// ----- usuarios -----
function renderUsuarios() {
  const users = readJSON(KEYS.USERS, []);
  const tbody = document.querySelector('#tblUsuarios tbody');
  if (!tbody) return;
  tbody.innerHTML = users.map(u => `
    <tr>
      <td>${u.nombre || u.name || '(sin nombre)'}</td>
      <td>${u.email}</td>
      <td>${u.rol || 'cliente'}</td>
      <td>${u.createdAt ? u.createdAt.substring(0,10) : '—'}</td>
    </tr>
  `).join('');
}

function setupFormUsuario() {
  const form = document.querySelector('#formUsuario');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const nombre = document.querySelector('#usrNombre').value.trim();
    const email = document.querySelector('#usrEmail').value.trim().toLowerCase();
    const rol = document.querySelector('#usrRol').value;
    const users = readJSON(KEYS.USERS, []);
    if (users.find(u => u.email === email)) {
      alert('⚠️ Ese correo ya existe');
      return;
    }
    users.push({
      id: Date.now(),
      nombre,
      email,
      rol,
      password: btoa('1234'),
      createdAt: new Date().toISOString()
    });
    writeJSON(KEYS.USERS, users);
    renderUsuarios();
    renderDashboard();
    form.reset();
  });
}

// ----- reportes (mensajes de contacto) -----
function renderReportes() {
  const eventos = readJSON(KEYS.EVENTS, []);
  const msgs    = readJSON(KEYS.MSGS, []);
  const cont = document.querySelector('#reportesEventos');
  if (!cont) return;
  cont.innerHTML = `
    ${eventos.map(ev => `
      <div class="col-md-4">
        <div class="hh-card h-100">
          <div class="d-flex align-items-center gap-2 mb-2">
            <img src="${ev.img}" style="width:34px;height:34px;object-fit:contain;">
            <h5 class="mb-0">${ev.titulo}</h5>
          </div>
          <p class="small text-muted mb-2">${ev.descripcion}</p>
          <p class="mb-0"><strong>Termina:</strong> ${ev.fin}</p>
        </div>
      </div>
    `).join('')}

    ${msgs.map(m => `
      <div class="col-md-4">
        <div class="hh-card border-info h-100">
          <h6 class="mb-1">📨 ${m.asunto}</h6>
          <p class="mb-0 small text-muted">${m.nombre} — ${m.email}</p>
          <p class="small mt-2">${m.mensaje}</p>
          <p class="small text-muted mb-0">${m.fecha?.substring(0,10)}</p>
        </div>
      </div>
    `).join('')}
  `;
}

// ----- perfil -----
function renderPerfil() {
  const p = readJSON(KEYS.PROFILE, {});
  const $ = s => document.querySelector(s);
  $('#perfilCorreoText') && ($('#perfilCorreoText').textContent = p.correo || '');
  $('#perfilUltimoAcceso') && ($('#perfilUltimoAcceso').textContent = p.ultimoAcceso || '');
  $('#perfilNombres') && ($('#perfilNombres').value = p.nombres || '');
  $('#perfilApellidos') && ($('#perfilApellidos').value = p.apellidos || '');
  $('#perfilCorreo') && ($('#perfilCorreo').value = p.correo || '');
  $('#perfilTelefono') && ($('#perfilTelefono').value = p.telefono || '');
  $('#perfilDireccion') && ($('#perfilDireccion').value = p.direccion || '');
  $('#perfilRol') && ($('#perfilRol').textContent = 'Rol: ' + (p.rol || 'Admin'));
}

function setupFormPerfil() {
  const form = document.querySelector('#formPerfil');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const perfil = {
      nombres: document.querySelector('#perfilNombres').value,
      apellidos: document.querySelector('#perfilApellidos').value,
      correo: document.querySelector('#perfilCorreo').value,
      telefono: document.querySelector('#perfilTelefono').value,
      direccion: document.querySelector('#perfilDireccion').value,
      ultimoAcceso: new Date().toLocaleString('es-CL'),
      rol: 'Admin'
    };
    writeJSON(KEYS.PROFILE, perfil);
    renderPerfil();
    alert('✅ Perfil actualizado');
  });
}

// ----- navegación lateral -----
function setupNavigation() {
  const btns = document.querySelectorAll('.hh-admin-item[data-view]');
  const views = document.querySelectorAll('.hh-view');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const view = btn.dataset.view;
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      views.forEach(v => {
        if (v.dataset.view === view) v.classList.remove('d-none');
        else v.classList.add('d-none');
      });
    });
  });
}

// ----- logout -----
function setupLogout() {
  const btn1 = document.querySelector('#btnLogout');
  const btn2 = document.querySelector('#perfilCerrar');
  const doLogout = () => {
    localStorage.removeItem(KEYS.SESSION);
    window.location.href = '../page/login.html';
  };
  btn1 && btn1.addEventListener('click', doLogout);
  btn2 && btn2.addEventListener('click', doLogout);
}

// ----- INIT -----
seedIfEmpty();
renderDashboard();
renderOrdenes();
renderProductos();
renderCategorias();
renderUsuarios();
renderReportes();
renderPerfil();
setupFormOrden();
setupFormProducto();
setupFormCategoria();
setupFormUsuario();
setupFormPerfil();
setupNavigation();
setupLogout();
