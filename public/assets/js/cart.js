// =================== Huerto Hogar - CARRITO.JS ===================
// Maneja el carrito (localStorage) y lo muestra en carrito.html

import { PRODUCTOS } from './data.js';

const KEY = 'hh_cart';

// Formato CLP
const clp = n => Number(n || 0).toLocaleString('es-CL', {
  style: 'currency',
  currency: 'CLP',
  maximumFractionDigits: 0
});

// ---------- helpers de almacenamiento ----------
function read() {
  try { return JSON.parse(localStorage.getItem(KEY)) || []; }
  catch { return []; }
}

function write(items) {
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent('cart:changed'));
  syncBadge();
}

// =================== API PRINCIPAL ===================
export const Cart = {
  items: () => read(),
  total: () => read().reduce((acc, it) => acc + it.precio * it.cantidad, 0),

  // Añadir producto al carrito
  add: (product, qty = 1) => {
    const items = read();
    const i = items.findIndex(x => x.id === product.id);
    if (i >= 0) items[i].cantidad += qty;
    else items.push({
      id: product.id,
      nombre: product.nombre,
      precio: product.precio,
      img: product.img,
      cantidad: qty
    });
    write(items);
  },

  // Eliminar producto completo
  remove: (id) => {
    write(read().filter(x => x.id !== id));
  },

  // Cambiar cantidad
  setQty: (id, qty) => {
    const items = read().map(x =>
      x.id === id ? { ...x, cantidad: Math.max(1, qty) } : x
    );
    write(items);
  },

  // Vaciar todo el carrito
  clear: () => write([]),
};

// =================== BADGE DEL HEADER ===================
export function syncBadge() {
  const el = document.getElementById('cartAmount');
  if (!el) return;
  const total = Cart.total();
  el.textContent = clp(total);
}

window.addEventListener('DOMContentLoaded', syncBadge);
window.addEventListener('cart:changed', syncBadge);

// =================== VISTA carrito.html ===================
document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.getElementById('cartTableBody');
  const totalEl   = document.getElementById('cartTotalMonto');
  const btnVaciar = document.getElementById('btnVaciarCarrito');

  const gridLista = document.getElementById('gridProductosCarrito');

  // ---------- RENDER LISTA DE PRODUCTOS (columna izquierda) ----------
  function renderListaProductos() {
    if (!gridLista) return;

    // Puedes filtrar o tomar solo algunos. Aquí tomo los primeros 8.
    const sample = PRODUCTOS.slice(0, 8);

    gridLista.innerHTML = sample.map(p => `
      <article class="col-6">
        <div class="card h-100 shadow-sm">
          <div class="ratio ratio-16x9 bg-light">
            <img src="${p.img}" class="object-fit-cover" alt="${p.nombre}">
          </div>
          <div class="card-body p-2">
            <h6 class="card-title mb-1 text-truncate">${p.nombre}</h6>
            <div class="d-flex align-items-center justify-content-between">
              <span class="fw-bold text-success">${clp(p.precio)}</span>
              <small class="text-muted">Stock disponible</small>
            </div>
            <button class="btn btn-success btn-sm w-100 mt-2" data-add="${p.id}">
              Añadir
            </button>
          </div>
        </div>
      </article>
    `).join('');
  }

  // Click en botón "Añadir" de la lista izquierda
  gridLista?.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-add]');
    if (!btn) return;
    const id = btn.dataset.add;
    const prod = PRODUCTOS.find(p => p.id === id);
    if (!prod) return;

    Cart.add(prod, 1);   // agrega al carrito
    renderCarrito();     // refresca tabla derecha
    btn.textContent = 'Añadido ✓';
    setTimeout(() => btn.textContent = 'Añadir', 900);
  });

  // ---------- RENDER TABLA DEL CARRITO (columna derecha) ----------
  if (!tableBody) {
    // Si no estamos en carrito.html, no seguimos.
    return;
  }

  function renderCarrito() {
    const items = read();

    if (!items.length) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="6" class="text-center text-muted py-4">
            Tu carrito está vacío 🛒
          </td>
        </tr>`;
      if (totalEl) totalEl.textContent = clp(0);
      return;
    }

    tableBody.innerHTML = items.map(it => `
      <tr>
        <td>
          <img src="${it.img}" alt="${it.nombre}"
               class="rounded" style="width:60px;height:60px;object-fit:cover">
        </td>
        <td>${it.nombre}</td>
        <td class="text-end">${clp(it.precio)}</td>
        <td class="text-center">
          <div class="btn-group btn-group-sm" role="group">
            <button class="btn btn-outline-secondary" data-dec="${it.id}">−</button>
            <input type="number" value="${it.cantidad}" min="1"
                   class="form-control text-center mx-1"
                   style="width:56px" data-qty="${it.id}">
            <button class="btn btn-outline-secondary" data-inc="${it.id}">+</button>
          </div>
        </td>
        <td class="text-end">${clp(it.precio * it.cantidad)}</td>
        <td class="text-center">
          <button class="btn btn-outline-danger btn-sm" data-del="${it.id}">
            Eliminar
          </button>
        </td>
      </tr>
    `).join('');

    const total = items.reduce((acc, it) => acc + it.precio * it.cantidad, 0);
    if (totalEl) totalEl.textContent = clp(total);
  }

  // Botones +  -  Eliminar  dentro de la tabla
  tableBody.addEventListener('click', e => {
    const btn = e.target.closest('button');
    if (!btn) return;

    const id = btn.dataset.dec || btn.dataset.inc || btn.dataset.del;
    if (!id) return;

    const items = read();
    const i = items.findIndex(x => x.id === id);
    if (i === -1) return;

    if (btn.dataset.dec) items[i].cantidad = Math.max(1, items[i].cantidad - 1);
    if (btn.dataset.inc) items[i].cantidad += 1;
    if (btn.dataset.del) items.splice(i, 1);

    write(items);
    renderCarrito();
  });

  // Cambio manual de cantidad en el input number
  tableBody.addEventListener('change', e => {
    if (!e.target.matches('input[data-qty]')) return;
    const id = e.target.dataset.qty;
    const val = Math.max(1, parseInt(e.target.value || '1', 10));
    Cart.setQty(id, val);
    renderCarrito();
  });

  // Botón "Limpiar"
  btnVaciar?.addEventListener('click', () => {
    Cart.clear();
    renderCarrito();
  });

  // Render inicial
  renderListaProductos(); // izquierda
  renderCarrito();        // derecha
});
