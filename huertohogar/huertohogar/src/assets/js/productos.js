// assets/js/productos.js
import { PRODUCTOS } from './data.js';
import { Cart, syncBadge } from './cart.js';

const clp = n => n.toLocaleString('es-CL', { style:'currency', currency:'CLP', maximumFractionDigits:0 });

const qs   = new URLSearchParams(location.search);
const term = (qs.get('q') || '').trim().toLowerCase();

let items = PRODUCTOS.slice();
if (term) {
  items = items.filter(p =>
    p.nombre.toLowerCase().includes(term) ||
    (p.categoria || '').toLowerCase().includes(term)
  );
}

const grid = document.getElementById('gridProductos');
if (grid) {
  grid.innerHTML = items.map(p => `
    <div class="col-12 col-sm-6 col-lg-3">
      <div class="card shadow-sm h-100">
        <a href="./detalleProducto.html?id=${p.id}" class="d-block">
          <img src="${p.img}" alt="${p.nombre}" class="card-img-top" style="height:200px;object-fit:cover;">
        </a>
        <div class="card-body text-center pt-3">
          <a href="./detalleProducto.html?id=${p.id}" class="text-decoration-none d-block mb-1 fw-semibold">
            ${p.nombre}
          </a>
          <div class="mb-3 text-success">${clp(p.precio)}</div>
          <button class="btn btn-success btn-sm w-100" data-id="${p.id}">Añadir</button>
        </div>
      </div>
    </div>
  `).join('');
}

grid?.addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-id]');
  if (!btn) return;
  const id = btn.dataset.id;
  const producto = PRODUCTOS.find(p => p.id === id);
  if (!producto) return;

  Cart.add(producto, 1);   // guarda en LS y dispara cart:changed
  syncBadge();             // asegura refresco inmediato de “Carrito $…”
  btn.textContent = 'Añadido ✓';
  setTimeout(() => (btn.textContent = 'Añadir'), 900);
});
