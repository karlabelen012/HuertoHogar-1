/* global Chart, bootstrap */
// ==========================================================
// HuertoHogar – Script general del sitio
// ==========================================================

// ===== IMPORTS (deben ir SIEMPRE arriba) ==================
import { $, $$, setCurrentYear, bindSearchForm } from './ui.js';
import { Auth } from './auth.js';
import { Cart } from './cart.js';

// ===== HELPERS GLOBALES ===================================
// (Usados por contacto, suscripción, etc.)
function mostrarError(msg) {
  alert('⚠️ ' + msg);
}

function limpiarFormulario(form) {
  if (form) form.reset();
}

function correoValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function esDominioValido(email) {
  return /@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i.test(email);
}



// ===== CONST PARA NAV / CARRITO ===========================
const IDS = { count: 'cartCount', amount: 'cartAmount' };
const NAV = {
  login: '#navLogin',
  register: '#navRegister',
  profile: '#navProfile',
  admin: '#navAdmin',
  logout: '#navLogout'
};

// ==========================================================
// 2️⃣ ANIMACIONES GENERALES (fade-in / scroll suave)
// ==========================================================

// ---- Animaciones (fade-up) ----
document.addEventListener('DOMContentLoaded', () => {
  const els = $$('.fade-up');
  if (els.length) {
    const obs = new IntersectionObserver(
      ents =>
        ents.forEach(e => e.isIntersecting && e.target.classList.add('show')),
      { threshold: 0.2 }
    );
    els.forEach(el => obs.observe(el));
  }
});

// ---- Scroll suave en anclas (#) ----
document.addEventListener('click', e => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  const dst = document.querySelector(a.getAttribute('href'));
  if (dst) {
    e.preventDefault();
    dst.scrollIntoView({ behavior: 'smooth' });
  }
});

// ---- Loader global ----
window.addEventListener('load', () => {
  const l = $('#loader');
  if (l) {
    l.classList.add('hide');
    setTimeout(() => l.remove(), 600);
  }
});

// ---- Año actual + buscador principal ----
document.addEventListener('DOMContentLoaded', () => {
  setCurrentYear();
  bindSearchForm('#formBuscar', '#q');
});

// ==========================================================
// 3️⃣ CARRITO (badge en topbar)
// ==========================================================
function syncCartBadges() {
  const items = Cart.items();
  const count = items.reduce((a, it) => a + Number(it.cantidad || 1), 0);
  const total = Cart.total();
  const elCount = document.getElementById(IDS.count);
  const elAmount = document.getElementById(IDS.amount);
  if (elCount) elCount.textContent = count;
  if (elAmount)
    elAmount.textContent = total.toLocaleString('es-CL', {
      style: 'currency',
      currency: 'CLP',
      maximumFractionDigits: 0
    });
}
window.addEventListener('cart:changed', syncCartBadges);
document.addEventListener('DOMContentLoaded', syncCartBadges);

// ==========================================================
// 4️⃣ NAVBAR SEGÚN SESIÓN / ROL
// ==========================================================
function paintNavbarByAuth() {
  const u = Auth.current();
  const isAdmin = !!u && u.rol === 'admin';
  const show = (sel, v) => {
    const el = $(sel);
    if (el) {
      el.classList.toggle('d-none', !v);
      el.hidden = !v;
    }
  };

  show(NAV.login, !u);
  show(NAV.register, !u);
  show(NAV.profile, !!u && !isAdmin);
  show(NAV.admin, !!u && isAdmin);
  show(NAV.logout, !!u);

  const np = $(NAV.profile);
  if (np && u) {
    np.querySelector('span')?.replaceChildren(
      document.createTextNode(u.nombre || 'Perfil')
    );
  }
}

document.addEventListener('DOMContentLoaded', paintNavbarByAuth);
window.addEventListener('auth:login', paintNavbarByAuth);
window.addEventListener('auth:logout', paintNavbarByAuth);

// ---- Cerrar sesión (botón nav) ----
document.addEventListener('click', e => {
  if (e.target.closest(NAV.logout)) {
    e.preventDefault();
    Auth.logout();
    alert('👋 Sesión cerrada');
    window.location.reload();
  }
});

// ==========================================================
// 5️⃣ FORMULARIO DE CONTACTO (contactos.html)
// ==========================================================
document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;

  contactForm.addEventListener('submit', e => {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value.trim();
    const correo = document.getElementById('email').value.trim();
    const mensaje = document.getElementById('comentario').value.trim();

    if (!nombre || !correo || !mensaje) {
      mostrarError('Por favor, completa todos los campos.');
      return;
    }

    if (!correoValido(correo) || !esDominioValido(correo)) {
      mostrarError('Correo inválido o dominio no permitido.');
      return;
    }

    alert(
      '📨 Tu mensaje ha sido enviado correctamente. ¡Gracias por contactarnos!'
    );
    limpiarFormulario(contactForm);
  });
});

// ==========================================================
// 6️⃣ FORMULARIO DE SUSCRIPCIÓN (footer)
// ==========================================================
document.addEventListener('DOMContentLoaded', () => {
  const subscribeForm = document.getElementById('subscribeForm');
  if (!subscribeForm) return;

  subscribeForm.addEventListener('submit', e => {
    e.preventDefault();
    const correo = document.getElementById('emailSub').value.trim();

    if (!correo) {
      mostrarError('Ingresa tu correo para suscribirte.');
      return;
    }

    if (!correoValido(correo) || !esDominioValido(correo)) {
      mostrarError('Correo inválido o dominio no permitido.');
      return;
    }

    alert('✅ ¡Gracias por suscribirte al boletín de HuertoHogar!');
    limpiarFormulario(subscribeForm);
  });
});

// ==========================================================
// 7️⃣ SECCIÓN DE PRODUCTOS (productos-container - versión demo)
//   * Esta parte usa un carrito SOLO en memoria.
//   * Tu nueva página productos.html usa productos.js + data.js.
//   * Si no usas este contenedor, no pasa nada.
// ==========================================================
document.addEventListener('DOMContentLoaded', () => {
  const productosContainer = document.getElementById('productos-container');
  const cartCount = document.getElementById('cartCount');

  let carrito = [];

  if (productosContainer) {
    const productos = [
      // 🥭 FRUTAS FRESCAS
      {
        id: 'FR001',
        nombre: 'Manzanas Fuji',
        precio: 1200,
        unidad: '/ kg',
        descripcion: 'Manzanas crujientes y dulces, del Valle del Maule.',
        img: '../assets/image/manzanafuji.png'
      },
      {
        id: 'FR002',
        nombre: 'Naranjas Valencia',
        precio: 1000,
        unidad: '/ kg',
        descripcion:
          'Jugosas y ricas en vitamina C, ideales para jugos frescos.',
        img: '../assets/image/naranja.png'
      },
      {
        id: 'FR003',
        nombre: 'Plátanos Cavendish',
        precio: 800,
        unidad: '/ kg',
        descripcion: 'Maduros y dulces, perfectos para un snack energético.',
        img: '../assets/image/platano.png'
      },

      // 🥬 VERDURAS ORGÁNICAS
      {
        id: 'VR001',
        nombre: 'Zanahorias Orgánicas',
        precio: 900,
        unidad: '/ kg',
        descripcion:
          'Cultivadas sin pesticidas, ideales para ensaladas o jugos.',
        img: '../assets/image/zanahoria.png'
      },
      {
        id: 'VR002',
        nombre: 'Espinacas Frescas',
        precio: 700,
        unidad: '/ bolsa 500g',
        descripcion: 'Hojas verdes y tiernas, perfectas para batidos y ensaladas.',
        img: '../assets/image/espinaca.png'
      },
      {
        id: 'VR003',
        nombre: 'Pimientos Tricolores',
        precio: 1500,
        unidad: '/ kg',
        descripcion: 'Rojos, amarillos y verdes, ideales para salteados y guisos.',
        img: '../assets/image/pimientos.png'
      },

      // 🍯 PRODUCTOS ORGÁNICOS
      {
        id: 'PO001',
        nombre: 'Miel Orgánica',
        precio: 5000,
        unidad: '/ frasco 500g',
        descripcion: 'Miel pura y orgánica producida por apicultores locales.',
        img: '../assets/image/miel.png'
      },
      {
        id: 'PO003',
        nombre: 'Quinua Orgánica',
        precio: 4200,
        unidad: '/ bolsa 1kg',
        descripcion:
          'Grano andino rico en proteínas, ideal para una alimentación saludable.',
        img: '../assets/image/quinua.png'
      },

      // 🥛 PRODUCTOS LÁCTEOS
      {
        id: 'LE001',
        nombre: 'Leche HuertoHogar',
        precio: 1400,
        unidad: '/ litro',
        descripcion: 'Leche fresca del campo, natural y sin conservantes.',
        img: '../assets/image/leche.png'
      }
    ];

    // Render tarjetas
    productos.forEach(p => {
      const card = document.createElement('div');
      card.className = 'producto-card card shadow-sm';
      card.innerHTML = `
        <img src="${p.img}" alt="${p.nombre}" class="card-img-top"
             style="height:200px;object-fit:cover;border-radius:8px 8px 0 0;">
        <div class="card-body text-center">
          <h5 class="card-title" style="color:#2E8B57;font-family:'Playfair Display',serif;">
            ${p.nombre}
          </h5>
          <p class="card-text">${p.descripcion}</p>
          <p class="fw-semibold text-success">$${p.precio.toLocaleString('es-CL')} ${p.unidad}</p>
          <p style="font-size:13px;color:#888;">${p.id}</p>
          <button class="btn btn-success btn-add" data-id="${p.id}">Añadir al carrito</button>
        </div>
      `;
      productosContainer.appendChild(card);
    });

    // Añadir al carrito
    productosContainer.addEventListener('click', e => {
      if (!e.target.classList.contains('btn-add')) return;
      const id = e.target.dataset.id;
      const prod = productos.find(p => p.id === id);
      if (!prod) return;

      const existente = carrito.find(item => item.id === id);
      if (existente) existente.cantidad++;
      else carrito.push({ ...prod, cantidad: 1 });

      actualizarContador();
      alert(`✅ ${prod.nombre} añadido al carrito.`);
    });
  }

  function actualizarContador() {
    const total = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    if (cartCount) cartCount.textContent = total;
  }

  // Exponer para carrito.html (demo)
  window.getCarrito = () => carrito;
  window.setCarrito = nuevo => {
    carrito = nuevo;
    actualizarContador();
  };
});

// ==========================================================
// 8️⃣ CARRITO DE COMPRAS (carrito.html - demo en memoria)
// ==========================================================
document.addEventListener('DOMContentLoaded', () => {
  const carritoLista = document.getElementById('carrito-lista');
  const carritoTotal = document.getElementById('carritoTotal');
  const btnPagar = document.getElementById('btnPagar');
  if (!carritoLista) return;

  let carrito = window.getCarrito ? window.getCarrito() : [];

  function renderCarrito() {
    carritoLista.innerHTML = '';
    let total = 0;

    if (!carrito.length) {
      carritoLista.innerHTML =
        '<p class="text-muted">Tu carrito está vacío 🛒</p>';
      if (carritoTotal) carritoTotal.textContent = '$ 0';
      return;
    }

    carrito.forEach((item, index) => {
      total += item.precio * item.cantidad;

      const fila = document.createElement('div');
      fila.className = 'carrito-item mb-3';
      fila.innerHTML = `
        <div class="d-flex align-items-center justify-content-between border p-2 rounded">
          <div class="d-flex align-items-center">
            <img src="${item.img}" alt="${item.nombre}"
                 style="width:70px;height:70px;margin-right:10px;border-radius:8px;object-fit:contain;">
            <div>
              <strong>${item.nombre}</strong><br>
              <small>$${item.precio.toLocaleString('es-CL')} c/u</small>
            </div>
          </div>
          <div>
            <input type="number" min="1" value="${item.cantidad}"
                   class="cantidad form-control d-inline-block"
                   style="width:70px;text-align:center;">
            <button class="btn btn-link text-danger btn-eliminar" data-index="${index}">
              Eliminar
            </button>
          </div>
        </div>
      `;
      carritoLista.appendChild(fila);
    });

    if (carritoTotal)
      carritoTotal.textContent = '$ ' + total.toLocaleString('es-CL');
  }

  carritoLista.addEventListener('change', e => {
    if (!e.target.classList.contains('cantidad')) return;
    const idx = Array.from(carritoLista.children).indexOf(
      e.target.closest('.carrito-item')
    );
    carrito[idx].cantidad = parseInt(e.target.value, 10) || 1;
    renderCarrito();
    window.setCarrito(carrito);
  });

  carritoLista.addEventListener('click', e => {
    if (!e.target.classList.contains('btn-eliminar')) return;
    const index = parseInt(e.target.dataset.index, 10);
    const nombre = carrito[index].nombre;
    carrito.splice(index, 1);
    alert(`🗑️ ${nombre} eliminado del carrito.`);
    renderCarrito();
    window.setCarrito(carrito);
  });

  if (btnPagar) {
    btnPagar.addEventListener('click', () => {
      alert('💳 ¡Gracias por tu compra! 🥕');
      carrito = [];
      renderCarrito();
      window.setCarrito(carrito);
    });
  }

  renderCarrito();
});

// ==========================================================
// 9️⃣ CARRITO GLOBAL SIMPLE (por si alguna vista lo usa)
// ==========================================================
if (!window.carritoGlobal) window.carritoGlobal = [];

window.agregarAlCarrito = function (producto) {
  const existente = window.carritoGlobal.find(p => p.id === producto.id);
  if (existente) existente.cantidad++;
  else window.carritoGlobal.push({ ...producto, cantidad: 1 });

  const cartCount = document.getElementById('cartCount');
  if (cartCount) {
    const total = window.carritoGlobal.reduce(
      (acc, p) => acc + p.cantidad,
      0
    );
    cartCount.textContent = total;
  }
};

// ==========================================================
// 🔟 EFECTOS VISUALES EXTRA (hover tarjetas + loader)
// ==========================================================
document.addEventListener('mouseover', e => {
  const card = e.target.closest('.producto-card');
  if (card) card.classList.add('hover');
});
document.addEventListener('mouseout', e => {
  const card = e.target.closest('.producto-card');
  if (card) card.classList.remove('hover');
});

// Loader ya se maneja arriba con #loader (global)

// ==========================================================
// 1️⃣1️⃣ ADMIN PERFIL – PANEL (localStorage + Chart.js)
// ==========================================================

/* ---------- Helpers localStorage ---------- */
const store = {
  get: (k, fallback) => {
    try {
      const v = JSON.parse(localStorage.getItem(k));
      return v ?? fallback;
    } catch {
      return fallback;
    }
  },
  set: (k, v) => localStorage.setItem(k, JSON.stringify(v))
};

/* ---------- Seeds (solo si no existen) ---------- */
(function seedIfEmpty() {
  if (!localStorage.getItem('hh_usuarios')) {
    const seed = [
      {
        fecha: '2024-06-01',
        run: '19011022K',
        nombre: 'Juan Pérez',
        correo: 'juan@gmail.com',
        rol: 'Cliente'
      },
      {
        fecha: '2024-06-02',
        run: '17012345K',
        nombre: 'María González',
        correo: 'maria@duoc.cl',
        rol: 'Vendedor'
      },
      {
        fecha: '2024-06-03',
        run: '15555111K',
        nombre: 'Carlos Soto',
        correo: 'carlos@profesor.duoc.cl',
        rol: 'Administrador'
      },
      {
        fecha: '2024-06-04',
        run: '13333444K',
        nombre: 'Ana López',
        correo: 'ana@gmail.com',
        rol: 'Cliente'
      },
      {
        fecha: '2024-06-05',
        run: '14444222K',
        nombre: 'Pedro Rojas',
        correo: 'pedro@duoc.cl',
        rol: 'Cliente'
      },
      {
        fecha: '2024-06-06',
        run: '16666111K',
        nombre: 'Sofía Díaz',
        correo: 'sofia@gmail.com',
        rol: 'Cliente'
      },
      {
        fecha: '2024-06-07',
        run: '17777222K',
        nombre: 'Luis Herrera',
        correo: 'luis@profesor.duoc.cl',
        rol: 'Administrador'
      },
      {
        fecha: '2024-06-08',
        run: '18888333K',
        nombre: 'Carla Muñoz',
        correo: 'carla@gmail.com',
        rol: 'Cliente'
      },
      {
        fecha: '2024-06-09',
        run: '19999444K',
        nombre: 'Diego Torres',
        correo: 'diego@gmail.com',
        rol: 'Cliente'
      },
      {
        fecha: '2024-06-10',
        run: '12222333K',
        nombre: 'Valentina Cruz',
        correo: 'valentina@gmail.com',
        rol: 'Cliente'
      },
      {
        fecha: '2024-06-11',
        run: '13333455K',
        nombre: 'Gonzalo Vega',
        correo: 'gonzalo@duoc.cl',
        rol: 'Vendedor'
      },
      {
        fecha: '2024-06-12',
        run: '14444566K',
        nombre: 'Daniela Silva',
        correo: 'daniela@gmail.com',
        rol: 'Cliente'
      },
      {
        fecha: '2024-06-13',
        run: '15555677K',
        nombre: 'Ignacio Reyes',
        correo: 'ignacio@gmail.com',
        rol: 'Cliente'
      },
      {
        fecha: '2024-06-14',
        run: '16666788K',
        nombre: 'Camila Pardo',
        correo: 'camila@gmail.com',
        rol: 'Cliente'
      },
      {
        fecha: '2024-06-15',
        run: '17777899K',
        nombre: 'Matías Fuentes',
        correo: 'matias@gmail.com',
        rol: 'Cliente'
      },
      {
        fecha: '2024-06-16',
        run: '18888900K',
        nombre: 'Isabel Campos',
        correo: 'isabel@duoc.cl',
        rol: 'Vendedor'
      },
      {
        fecha: '2024-06-17',
        run: '19999001K',
        nombre: 'Rodrigo Álvarez',
        correo: 'rodrigo@gmail.com',
        rol: 'Cliente'
      },
      {
        fecha: '2024-06-18',
        run: '12222111K',
        nombre: 'Fernanda Mora',
        correo: 'fernanda@gmail.com',
        rol: 'Cliente'
      },
      {
        fecha: '2024-06-19',
        run: '13333222K',
        nombre: 'Tomás Morales',
        correo: 'tomas@gmail.com',
        rol: 'Cliente'
      },
      {
        fecha: '2024-06-20',
        run: '14444333K',
        nombre: 'Karla Herrera',
        correo: 'karla@gmail.com',
        rol: 'Cliente'
      }
    ];
    store.set('hh_usuarios', seed);
  }

  if (!localStorage.getItem('hh_pedidos')) {
    const pedidos = [
      {
        id: 'HH-001',
        cliente: 'Juan Pérez',
        fecha: '2024-06-20',
        estado: 'En preparación',
        total: 5700
      },
      {
        id: 'HH-002',
        cliente: 'María González',
        fecha: '2024-06-20',
        estado: 'Entregado',
        total: 12500
      },
      {
        id: 'HH-003',
        cliente: 'Carlos Soto',
        fecha: '2024-06-21',
        estado: 'Cancelado',
        total: 8900
      },
      {
        id: 'HH-004',
        cliente: 'Ana López',
        fecha: '2024-06-21',
        estado: 'Entregado',
        total: 4300
      }
    ];
    store.set('hh_pedidos', pedidos);
  }

  if (!localStorage.getItem('hh_empleados')) {
    store.set('hh_empleados', [
      {
        nombre: 'Ricardo Palma',
        cargo: 'Bodeguero',
        correo: 'ricardo@huertohogar.cl'
      },
      {
        nombre: 'Lorena Sáez',
        cargo: 'Vendedora',
        correo: 'lorena@huertohogar.cl'
      },
      {
        nombre: 'Javier Ruiz',
        cargo: 'Repartidor',
        correo: 'javier@huertohogar.cl'
      }
    ]);
  }

  if (!localStorage.getItem('hh_settings')) {
    store.set('hh_settings', {
      nombre: 'HuertoHogar',
      correo: 'contacto@huertohogar.cl',
      direccion: 'Santiago, Chile',
      logo: ''
    });
  }

  if (!localStorage.getItem('hh_admin')) {
    store.set('hh_admin', {
      nombre: 'Admin HuertoHogar',
      correo: 'admin@huertohogar.cl',
      rol: 'Administrador'
    });
  }

  if (!localStorage.getItem('hh_notifs')) {
    store.set('hh_notifs', [
      { id: Date.now(), texto: 'Sistema iniciado', fecha: new Date().toLocaleString() }
    ]);
  }
})();

/* ---------- Estado global ---------- */
let usuarios = store.get('hh_usuarios', []);
let pedidos = store.get('hh_pedidos', []);
let empleados = store.get('hh_empleados', []);
let settings = store.get('hh_settings', {});
let admin = store.get('hh_admin', {});
let notifs = store.get('hh_notifs', []);

const kpi = {
  productos: 7,
  get usuarios() {
    return usuarios.length;
  },
  get pedidos() {
    return pedidos.filter(p => p.estado === 'En preparación').length;
  }
};

/* ---------- Util admin ---------- */
const hhTitle = $('#hh-title');

function pushNotif(texto) {
  notifs.unshift({
    id: Date.now(),
    texto,
    fecha: new Date().toLocaleString()
  });
  store.set('hh_notifs', notifs);
  paintNotifs();
}

/* ==========================================================
   NAV ADMIN
   ========================================================== */
const links = $$('.hh-link[data-section]');
const sections = $$('.hh-section');

links.forEach(btn => {
  btn.addEventListener('click', () => {
    links.forEach(x => x.classList.remove('active'));
    btn.classList.add('active');
    const id = btn.dataset.section;
    sections.forEach(s => s.classList.remove('active'));
    $('#' + id)?.classList.add('active');
    hhTitle.textContent =
      btn.querySelector('span')?.textContent || 'Admin';
    if (id === 'reportes') renderReportes();
  });
});

// ==========================================================
// DASHBOARD (KPI + charts)
// ==========================================================
function pintarKPI() {
  $('#kpiProductos').textContent = kpi.productos;
  $('#kpiUsuarios').textContent = kpi.usuarios;
  $('#kpiPedidos').textContent = kpi.pedidos;
}

let chartVentas, chartPedidos, chartUsuarios, chartVentasLine;

function renderChartsDashboard() {
  const ventasMes = [3, 4, 5, 6, 8, 10, 7, 9, 6, 5, 4, 8].map(
    n => n * 10000
  );
  const pedidosMes = [20, 22, 30, 28, 35, 40, 38, 36, 30, 26, 22, 34];
  const labels = ['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];

  if (chartVentas) chartVentas.destroy();
  if (chartPedidos) chartPedidos.destroy();

  chartVentas = new Chart($('#chartVentas'), {
    type: 'bar',
    data: { labels, datasets: [{ label: 'Ventas (CLP)', data: ventasMes }] },
    options: {
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true } }
    }
  });

  chartPedidos = new Chart($('#chartPedidos'), {
    type: 'line',
    data: { labels, datasets: [{ label: 'Pedidos', data: pedidosMes }] },
    options: {
      plugins: { legend: { display: false } },
      tension: 0.3,
      scales: { y: { beginAtZero: true } }
    }
  });
}

// ==========================================================
// USUARIOS (tabla + paginación + alta)
// ==========================================================
const tbodyUsuarios = $('#tablaUsuarios tbody');
const pageNumbers = $('#hh-page-numbers');
const pageButtons = $$('.hh-page');
const statePag = { page: 1, perPage: 10, total: usuarios.length };

function renderUsuarios() {
  statePag.total = usuarios.length;
  const start = (statePag.page - 1) * statePag.perPage;
  const items = usuarios.slice(start, start + statePag.perPage);

  tbodyUsuarios.innerHTML = items
    .map(
      u => `
    <tr>
      <td>${u.fecha}</td>
      <td>${u.run}</td>
      <td>${u.nombre}</td>
      <td>${u.correo}</td>
      <td>${u.rol}</td>
    </tr>`
    )
    .join('');

  const totalPages = Math.max(1, Math.ceil(statePag.total / statePag.perPage));
  pageNumbers.innerHTML = '';
  for (let i = 1; i <= totalPages; i++) {
    const b = document.createElement('button');
    b.textContent = i;
    if (i === statePag.page) b.classList.add('active');
    b.addEventListener('click', () => {
      statePag.page = i;
      renderUsuarios();
    });
    pageNumbers.appendChild(b);
  }
}

pageButtons.forEach(b => {
  b.addEventListener('click', () => {
    const total = Math.max(
      1,
      Math.ceil(statePag.total / statePag.perPage)
    );
    const t = b.dataset.page;
    if (t === 'first') statePag.page = 1;
    if (t === 'prev') statePag.page = Math.max(1, statePag.page - 1);
    if (t === 'next') statePag.page = Math.min(total, statePag.page + 1);
    if (t === 'last') statePag.page = total;
    renderUsuarios();
  });
});

$('#btnNuevoUsuario').addEventListener('click', () => {
  $('#panelNuevoUsuario').classList.toggle('d-none');
  $('#panelNuevoUsuario').scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
});

// Regiones y comunas demo
const regionesComunas = {
  'Región Metropolitana de Santiago': [
    'La Florida',
    'Maipú',
    'Las Condes',
    'Ñuñoa',
    'Santiago Centro',
    'Puente Alto'
  ],
  'Región del Biobío': [
    'Concepción',
    'Laja',
    'Los Ángeles',
    'Talcahuano',
    'Chiguayante'
  ],
  'Región de Valparaíso': [
    'Viña del Mar',
    'Valparaíso',
    'Quilpué',
    'San Felipe',
    'Quillota'
  ],
  'Región de Los Lagos': ['Puerto Montt', 'Osorno', 'Llanquihue', 'Castro'],
  'Región de La Araucanía': [
    'Temuco',
    'Padre Las Casas',
    'Villarrica',
    'Pucón'
  ]
};

const selRegion = $('#uRegion');
const selComuna = $('#uComuna');
Object.keys(regionesComunas).forEach(r => {
  const op = document.createElement('option');
  op.value = op.textContent = r;
  selRegion.appendChild(op);
});
selRegion.addEventListener('change', () => {
  selComuna.innerHTML = '<option value="">— Seleccione comuna —</option>';
  const list = regionesComunas[selRegion.value] || [];
  list.forEach(c => {
    const op = document.createElement('option');
    op.value = op.textContent = c;
    selComuna.appendChild(op);
  });
  selComuna.disabled = !list.length;
});

const dominiosPermitidos = /@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i;
const correoOK = c => dominiosPermitidos.test(c);

function runValido(run) {
  let clean = run.replace(/[^0-9kK]/g, '').toUpperCase();
  if (clean.length < 7 || clean.length > 9) return false;
  const cuerpo = clean.slice(0, -1);
  const dv = clean.slice(-1);
  let suma = 0;
  let mult = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo[i], 10) * mult;
    mult = mult === 7 ? 2 : mult + 1;
  }
  const r = 11 - (suma % 11);
  const dvEsperado = r === 11 ? '0' : r === 10 ? 'K' : String(r);
  return dvEsperado === dv;
}

$('#formUsuario').addEventListener('submit', e => {
  e.preventDefault();
  const nombre = $('#uNombre').value.trim();
  const correo = $('#uCorreo').value.trim();
  const correo2 = $('#uCorreo2').value.trim();
  const pass = $('#uPass').value.trim();
  const pass2 = $('#uPass2').value.trim();
  const run = $('#uRun').value.trim();
  const region = selRegion.value;
  const comuna = selComuna.value;
  const dir = $('#uDireccion').value.trim();

  if (!nombre) return alert('Nombre requerido');
  if (!correoOK(correo))
    return alert('Solo correos @duoc.cl, @profesor.duoc.cl o @gmail.com');
  if (correo !== correo2)
    return alert('El correo y su confirmación no coinciden');
  if (pass.length < 4 || pass.length > 10)
    return alert('La contraseña debe tener entre 4 y 10 caracteres');
  if (pass !== pass2)
    return alert('La contraseña y su confirmación no coinciden');
  if (!runValido(run)) return alert('RUN inválido');
  if (!region) return alert('Seleccione una región');
  if (!comuna) return alert('Seleccione una comuna');
  if (!dir) return alert('Dirección requerida');

  const nuevo = {
    fecha: new Date().toISOString().slice(0, 10),
    run,
    nombre,
    correo,
    rol: 'Cliente'
  };
  usuarios.unshift(nuevo);
  store.set('hh_usuarios', usuarios);
  renderUsuarios();
  pintarKPI();
  e.target.reset();
  selComuna.disabled = true;
  pushNotif(`Nuevo usuario registrado: ${nombre}`);
  alert('Usuario registrado correctamente.');
});

// ==========================================================
// PEDIDOS
// ==========================================================
const tbodyPedidos = $('#tablaPedidos tbody');
const filtroEstado = $('#filtroEstado');

function badgeEstado(estado) {
  if (estado === 'Entregado')
    return `<span class="badge-estado badge-ok">Entregado</span>`;
  if (estado === 'Cancelado')
    return `<span class="badge-estado badge-cancel">Cancelado</span>`;
  return `<span class="badge-estado badge-prep">En preparación</span>`;
}

function renderPedidos() {
  const est = filtroEstado.value;
  const data =
    est === 'TODOS' ? pedidos : pedidos.filter(p => p.estado === est);
  tbodyPedidos.innerHTML = data
    .map(
      p => `
    <tr>
      <td>${p.id}</td>
      <td>${p.cliente}</td>
      <td>${p.fecha}</td>
      <td>${badgeEstado(p.estado)}</td>
      <td>$${p.total.toLocaleString('es-CL')}</td>
    </tr>`
    )
    .join('');
}

filtroEstado.addEventListener('change', renderPedidos);

$('#btnNuevoPedido').addEventListener('click', () => {
  const id = 'HH-' + String(Math.floor(Math.random() * 900 + 100));
  const cli = [
    'Juan Pérez',
    'María González',
    'Carlos Soto',
    'Ana López',
    'Pedro Rojas'
  ][Math.floor(Math.random() * 5)];
  const est = ['En preparación', 'Entregado', 'Cancelado'][
    Math.floor(Math.random() * 3)
  ];
  const total = Math.floor(Math.random() * 40000) + 3000;
  pedidos.unshift({
    id,
    cliente: cli,
    fecha: new Date().toISOString().slice(0, 10),
    estado: est,
    total
  });
  store.set('hh_pedidos', pedidos);
  renderPedidos();
  pintarKPI();
  pushNotif(`Nuevo pedido ${id} (${est})`);
});

// ==========================================================
// EMPLEADOS
// ==========================================================
const tbodyEmpl = $('#tablaEmpleados tbody');

function renderEmpleados() {
  tbodyEmpl.innerHTML = empleados
    .map(
      e => `
    <tr>
      <td>${e.nombre}</td>
      <td>${e.cargo}</td>
      <td>${e.correo}</td>
    </tr>`
    )
    .join('');
}

$('#formEmpleado').addEventListener('submit', e => {
  e.preventDefault();
  const nombre = $('#eNombre').value.trim();
  const cargo = $('#eCargo').value.trim();
  const correo = $('#eCorreo').value.trim();
  if (!nombre || !cargo || !correo) return;

  empleados.push({ nombre, cargo, correo });
  store.set('hh_empleados', empleados);
  renderEmpleados();
  pushNotif(`Nuevo empleado: ${nombre}`);
  bootstrap.Modal.getInstance($('#modalEmpleado')).hide();
  e.target.reset();
});

// ==========================================================
// SETTINGS (panel admin, datos tienda)
// ==========================================================
$('#formSettings').addEventListener('submit', e => {
  e.preventDefault();
  settings.nombre = $('#sNombre').value.trim();
  settings.correo = $('#sCorreo').value.trim();
  settings.direccion = $('#sDireccion').value.trim();
  settings.logo = $('#sLogo').value.trim();
  store.set('hh_settings', settings);
  pushNotif('Configuración actualizada');
  alert('Configuración guardada');
});

// ==========================================================
// PROFILE + PASS (admin)
// ==========================================================
function renderProfile() {
  $('#pNombre').textContent = admin.nombre;
  $('#pCorreo').textContent = admin.correo;
  $('#pRol').textContent = admin.rol;
}

$('#formPass').addEventListener('submit', e => {
  e.preventDefault();
  const p1 = $('#nuevaPass').value;
  const p2 = $('#nuevaPass2').value;
  if (p1.length < 6)
    return alert('La nueva contraseña debe tener al menos 6 caracteres');
  if (p1 !== p2) return alert('Las contraseñas no coinciden');
  pushNotif('Contraseña de administrador actualizada');
  bootstrap.Modal.getInstance($('#modalPass')).hide();
  e.target.reset();
  alert('Contraseña actualizada');
});

// ==========================================================
// REPORTES (Chart.js + KPIs)
// ==========================================================
function renderReportes() {
  const ventasMes = pedidos
    .filter(p => p.estado === 'Entregado')
    .reduce((acc, p) => acc + p.total, 0);
  const ok = pedidos.filter(p => p.estado === 'Entregado').length;
  const nuevos = Math.max(
    0,
    usuarios.filter(
      u => new Date(u.fecha) >= new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    ).length
  );

  $('#repVentasMes').textContent = '$' + ventasMes.toLocaleString('es-CL');
  $('#repPedidosOk').textContent = ok;
  $('#repUsuariosNuevos').textContent = nuevos;

  const meses = ['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
  const serieUsuarios = new Array(12).fill(0);
  usuarios.forEach(u => {
    const m = new Date(u.fecha + 'T00:00:00').getMonth();
    if (!isNaN(m)) serieUsuarios[m] += 1;
  });

  if (chartUsuarios) chartUsuarios.destroy();
  if (chartVentasLine) chartVentasLine.destroy();

  chartUsuarios = new Chart($('#chartUsuarios'), {
    type: 'bar',
    data: { labels: meses, datasets: [{ label: 'Usuarios', data: serieUsuarios }] },
    options: {
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true } }
    }
  });

  chartVentasLine = new Chart($('#chartVentasLine'), {
    type: 'line',
    data: {
      labels: meses,
      datasets: [
        { label: 'Ventas (CLP)', data: serieUsuarios.map(n => n * 12000) }
      ]
    },
    options: {
      plugins: { legend: { display: false } },
      tension: 0.3,
      scales: { y: { beginAtZero: true } }
    }
  });
}

// ==========================================================
// NOTIFICACIONES (dropdown)
// ==========================================================
function paintNotifs() {
  const ul = $('#listNotifs');
  const badge = $('#badgeNotifs');
  ul.innerHTML = notifs.length
    ? notifs
        .map(
          n => `
      <li class="hh-notif-item">
        <span class="dot"></span>
        <div>
          <div>${n.texto}</div>
          <small class="text-muted">${n.fecha}</small>
        </div>
        <button class="btn btn-sm btn-link ms-auto" data-id="${n.id}">Quitar</button>
      </li>`
        )
        .join('') +
      `<li class="hh-notif-actions">
          <button id="btnClearNotifs" class="btn btn-sm btn-outline-secondary">
            Limpiar todo
          </button>
        </li>`
    : '<li class="px-3 py-2 text-muted">Sin notificaciones</li>';

  badge.textContent = notifs.length;
  badge.classList.toggle('d-none', !notifs.length);

  $$('#listNotifs [data-id]').forEach(b => {
    b.addEventListener('click', () => {
      const id = Number(b.dataset.id);
      notifs = notifs.filter(x => x.id !== id);
      store.set('hh_notifs', notifs);
      paintNotifs();
    });
  });

  const clearBtn = $('#btnClearNotifs');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      notifs = [];
      store.set('hh_notifs', notifs);
      paintNotifs();
    });
  }
}

// ==========================================================
// INIT ADMIN
// ==========================================================
document.addEventListener('DOMContentLoaded', () => {
  // Precargar settings en el panel
  if ($('#sNombre')) {
    $('#sNombre').value = settings.nombre || '';
    $('#sCorreo').value = settings.correo || '';
    $('#sDireccion').value = settings.direccion || '';
    $('#sLogo').value = settings.logo || '';
  }

  renderProfile();
  pintarKPI();
  renderChartsDashboard();
  renderUsuarios();
  renderPedidos();
  renderEmpleados();
  paintNotifs();
});

// ==========================================================
// SETTINGS EXTRA (cerrar sesión admin + cambio pass settings)
// ==========================================================
function renderSettings() {
  $('#confNombre').textContent = admin.nombre;
  $('#confCorreo').textContent = admin.correo;
  $('#confRol').textContent = admin.rol;
}

$('#formSettingsPass').addEventListener('submit', e => {
  e.preventDefault();
  const p1 = $('#confPass1').value.trim();
  const p2 = $('#confPass2').value.trim();
  if (p1.length < 6)
    return alert('La nueva contraseña debe tener al menos 6 caracteres');
  if (p1 !== p2) return alert('Las contraseñas no coinciden');
  pushNotif('Contraseña de administrador actualizada');
  alert('✅ Contraseña actualizada con éxito');
  e.target.reset();
});

$('#btnCerrarSesion').addEventListener('click', () => {
  localStorage.removeItem('usuarioActivo');
  pushNotif('Sesión cerrada');
  alert('👋 Sesión cerrada correctamente. Volviendo al inicio...');
  window.location.href = '../page/index.html';
});
