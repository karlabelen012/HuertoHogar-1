// assets/js/perfil.js
console.log('✅ perfil.js cargado');

const KEYS = {
  AUTH: 'hh_auth',
  USERS: 'hh_users',
  ORDERS: 'hh_orders',
  CART: 'hh_cart'
};

// ================== Utils localStorage ==================
const readJSON = (k, fb = null) => {
  try {
    const raw = localStorage.getItem(k);
    return raw ? JSON.parse(raw) : fb;
  } catch {
    return fb;
  }
};

const writeJSON = (k, v) => localStorage.setItem(k, JSON.stringify(v ?? null));

// ================== Usuario autenticado ==================
function getCurrentUser() {
  const authRaw = readJSON(KEYS.AUTH, null);
  if (!authRaw) return null;

  // Soporta las 2 formas: auth = user plano, o auth = { user, loggedAt }
  const authUser = authRaw.user || authRaw;

  const users = readJSON(KEYS.USERS, []);
  const user =
    users.find(u => u.id === authUser.id) ||
    users.find(
      u =>
        (u.email || '').toLowerCase() === (authUser.email || '').toLowerCase()
    ) ||
    authUser;

  return user;
}

// ================== Render de cabecera ==================
function renderWelcome(user) {
  const titulo = document.getElementById('perfilTitulo');
  if (!titulo) return;

  const nombre = user.nombre || user.name || user.email || 'Cliente';
  titulo.textContent = `Perfil del Cliente — Bienvenido/a, ${nombre}`;
}

// ================== Datos personales ==================
function renderProfileForm(user) {
  const nombreInput   = document.getElementById('perfilNombre');
  const correoInput   = document.getElementById('perfilCorreo');
  const rutInput      = document.getElementById('perfilRut');
  const fechaInput    = document.getElementById('perfilFecha');
  const telInput      = document.getElementById('perfilTelefono');
  const regionInput   = document.getElementById('perfilRegion');
  const comunaInput   = document.getElementById('perfilComuna');
  const dirInput      = document.getElementById('perfilDireccion');

  if (nombreInput) nombreInput.value = (user.nombre || user.name || '').trim();
  if (correoInput) correoInput.value = user.email || '';
  if (rutInput)    rutInput.value    = user.run || user.rut || '';
  if (fechaInput)  fechaInput.value  = user.fechaNacimiento || '';
  if (telInput)    telInput.value    = user.telefono || user.phone || '';
  if (regionInput) regionInput.value = user.region || '';
  if (comunaInput) comunaInput.value = user.comuna || '';
  if (dirInput)    dirInput.value    = user.direccion || user.calle || '';
}


function setupProfileForm(user) {
  const form = document.getElementById('perfilForm');
  const msg  = document.getElementById('perfilMsg');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    const telInput = document.getElementById('perfilTelefono');
    const dirInput = document.getElementById('perfilDireccion');

    const telefono  = telInput?.value.trim() || '';
    const direccion = dirInput?.value.trim() || '';

    // 1) Actualizar en hh_users
    const users = readJSON(KEYS.USERS, []);
    const idx = users.findIndex(
      u =>
        u.id === user.id ||
        (u.email || '').toLowerCase() === (user.email || '').toLowerCase()
    );

    let updatedUser = { ...user, telefono, direccion };

    if (idx >= 0) {
      users[idx] = { ...users[idx], telefono, direccion };
      updatedUser = users[idx];
      writeJSON(KEYS.USERS, users);
    }

    // 2) Actualizar en hh_auth
    const auth = readJSON(KEYS.AUTH, null);
    if (auth) {
      const authUser = auth.user ? { ...auth.user, telefono, direccion } : { ...auth, telefono, direccion };
      const newAuth  = auth.user ? { ...auth, user: authUser } : authUser;
      writeJSON(KEYS.AUTH, newAuth);
    }

    // 3) Actualizar hh_user (que usa checkout)
    localStorage.setItem('hh_user', JSON.stringify(updatedUser));

    if (msg) {
      msg.textContent = 'Datos guardados localmente (simulación backend)';
      setTimeout(() => (msg.textContent = ''), 3000);
    }
  });
}


// ================== Historial de compras ==================
function renderHistorial(user) {
  const tbody = document.getElementById('historialBody');
  if (!tbody) return;

  const orders = readJSON(KEYS.ORDERS, []);
  const userOrders = orders.filter(
    o => o.userId === user.id || o.email === user.email
  );

  tbody.innerHTML = '';

  if (userOrders.length === 0) {
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.colSpan = 4;
    td.style.padding = '8px';
    td.textContent = 'Aún no tienes compras registradas.';
    tr.appendChild(td);
    tbody.appendChild(tr);
    return;
  }

  userOrders.forEach(order => {
    const tr = document.createElement('tr');

    const tdFecha = document.createElement('td');
    tdFecha.style.padding = '8px';
    tdFecha.style.border = '1px solid #ccc';
    tdFecha.textContent = order.fecha || order.date || '';

    const tdProd = document.createElement('td');
    tdProd.style.padding = '8px';
    tdProd.style.border = '1px solid #ccc';
    const firstItem = order.items?.[0];
    if (firstItem) {
      const extra =
        order.items.length > 1 ? ` (+${order.items.length - 1} productos)` : '';
      tdProd.textContent = `${firstItem.nombre || firstItem.name}${extra}`;
    } else {
      tdProd.textContent = 'Pedido sin detalle';
    }

    const tdTotal = document.createElement('td');
    tdTotal.style.padding = '8px';
    tdTotal.style.border = '1px solid #ccc';
    tdTotal.textContent =
      typeof order.total === 'number'
        ? `$${order.total.toLocaleString('es-CL')}`
        : order.total || '';

    const tdAccion = document.createElement('td');
    tdAccion.style.padding = '8px';
    tdAccion.style.border = '1px solid #ccc';
    tdAccion.style.textAlign = 'center';

    const btnRep = document.createElement('button');
    btnRep.className = 'btn';
    btnRep.textContent = 'Repetir';
    btnRep.addEventListener('click', () => {
      if (order.items) {
        writeJSON(KEYS.CART, order.items);
      }
      alert('Pedido repetido, revisa tu carrito.');
      window.location.href = './carrito.html';
    });

    tdAccion.appendChild(btnRep);

    tr.appendChild(tdFecha);
    tr.appendChild(tdProd);
    tr.appendChild(tdTotal);
    tr.appendChild(tdAccion);
    tbody.appendChild(tr);
  });
}

// ================== Tabla de pedidos con estado ==================
function formatearEstado(estado) {
  switch ((estado || '').toLowerCase()) {
    case 'pendiente':    return 'Pendiente';
    case 'preparacion':  return 'Preparación';
    case 'en_camino':
    case 'en camino':    return 'En camino';
    case 'entregado':    return 'Entregado';
    default:             return estado || 'Sin estado';
  }
}

function renderPedidos(user) {
  const tbody = document.getElementById('pedidosBody');
  if (!tbody) return;

  const orders = readJSON(KEYS.ORDERS, []);
  const userOrders = orders.filter(
    o => o.userId === user.id || o.email === user.email
  );

  tbody.innerHTML = '';

  if (userOrders.length === 0) {
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.colSpan = 4;
    td.style.padding = '8px';
    td.textContent = 'No hay pedidos para mostrar.';
    tr.appendChild(td);
    tbody.appendChild(tr);
    return;
  }

  userOrders.forEach(order => {
    const tr = document.createElement('tr');

    const tdId = document.createElement('td');
    tdId.style.padding = '8px';
    tdId.style.border = '1px solid #ccc';
    tdId.textContent = order.codigo || order.id || '';

    const tdFecha = document.createElement('td');
    tdFecha.style.padding = '8px';
    tdFecha.style.border = '1px solid #ccc';
    tdFecha.textContent = order.fecha || order.date || '';

    const tdEstado = document.createElement('td');
    tdEstado.style.padding = '8px';
    tdEstado.style.border = '1px solid #ccc';
    tdEstado.textContent = formatearEstado(order.estado);

    const tdAcc = document.createElement('td');
    tdAcc.style.padding = '8px';
    tdAcc.style.border = '1px solid #ccc';
    tdAcc.style.textAlign = 'center';

    // Confirmar solo si no está entregado
    if ((order.estado || '').toLowerCase() !== 'entregado') {
      const btnConf = document.createElement('button');
      btnConf.className = 'btn';
      btnConf.textContent = 'Confirmar';
      btnConf.style.marginRight = '8px';
      btnConf.addEventListener('click', () => {
        order.estado = 'entregado';
        writeJSON(KEYS.ORDERS, orders);
        renderPedidos(user);
        alert(`Pedido ${order.codigo || order.id} marcado como entregado.`);
      });
      tdAcc.appendChild(btnConf);
    }

    const btnBoleta = document.createElement('button');
    btnBoleta.className = 'btn';
    btnBoleta.textContent = 'Boleta';
    btnBoleta.addEventListener('click', () => {
      alert('Simulación: aquí se mostraría / descargaría la boleta.');
    });

    tdAcc.appendChild(btnBoleta);

    tr.appendChild(tdId);
    tr.appendChild(tdFecha);
    tr.appendChild(tdEstado);
    tr.appendChild(tdAcc);
    tbody.appendChild(tr);
  });
}

// ================== Seguimiento por código ==================
function setupTracking(user) {
  const btnTrack = document.getElementById('btnTrack');
  if (!btnTrack) return;

  btnTrack.addEventListener('click', () => {
    const input = document.getElementById('trackCode');
    const code = (input?.value || '').trim();
    if (!code) {
      alert('Ingresa un código de seguimiento.');
      return;
    }

    const orders = readJSON(KEYS.ORDERS, []);
    const order = orders.find(o => {
      const id  = String(o.id ?? '');
      const cod = String(o.codigo ?? '');
      return (
        code === id ||
        code === cod ||
        code === `#${id}` ||
        code === `#${cod}`
      );
    });

    if (!order) {
      alert('No se encontró un pedido con ese código.');
      return;
    }

    alert(
      `Pedido ${code} está en estado: ${formatearEstado(order.estado)}.`
    );
  });
}

// ================== Fecha de entrega ==================
function setupDeliveryDate() {
  const btn = document.getElementById('btnSaveDelivery');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const input = document.getElementById('deliveryDate');
    const value = input?.value;
    if (!value) {
      alert('Selecciona una fecha de entrega.');
      return;
    }

    const auth = readJSON(KEYS.AUTH, null);
    if (auth) {
      auth.deliveryDate = value;
      writeJSON(KEYS.AUTH, auth);
    }

    alert('Fecha de entrega guardada (simulación).');
  });
}

// ================== Cerrar sesión ==================
function setupLogout() {
  const btn = document.getElementById('btnLogout');
  if (!btn) return;

  btn.addEventListener('click', () => {
    localStorage.removeItem(KEYS.AUTH);
    alert('Sesión cerrada.');
    window.location.href = './login.html';
  });
}

// ================== Init ==================
document.addEventListener('DOMContentLoaded', () => {
  const user = getCurrentUser();
  if (!user) {
    alert('Debes iniciar sesión para ver tu perfil.');
    window.location.href = './login.html';
    return;
  }

  renderWelcome(user);
  renderProfileForm(user);
  setupProfileForm(user);
  renderHistorial(user);
  renderPedidos(user);
  setupTracking(user);
  setupDeliveryDate();
  setupLogout();
});
