// /assets/js/categorias.js
import { PRODUCTOS, CATEGORIAS } from './data.js';
import { Cart } from './cart.js';

// Obtener categoría desde la URL
const qs = new URLSearchParams(window.location.search);
const categoria = qs.has('c') ? decodeURIComponent(qs.get('c')) : null;

// Elementos del DOM
const $titulo = document.getElementById('tituloCategoria');
const $grid = document.getElementById('gridProductos');
const $btnAll = document.getElementById('btnVerTodos');
const $listaCategorias = document.getElementById('listaCategorias');

// Función para formatear moneda CLP
const clp = (n) => n.toLocaleString('es-CL', {
  style: 'currency',
  currency: 'CLP',
  maximumFractionDigits: 0
});

// ====== RENDERIZAR CATEGORÍAS (parte superior) ======
$listaCategorias.innerHTML = CATEGORIAS.map(cat => `
  <a href="./categorias.html?c=${encodeURIComponent(cat.id)}"
     class="card card-cat text-center text-decoration-none shadow-sm"
     data-cat="${cat.id}" style="width:170px;">
    <div class="card-body">
      <img src="${cat.img}" alt="${cat.id}" 
           class="img-fluid rounded mb-2" 
           style="width:100px;height:100px;object-fit:cover;">
      <div class="fw-semibold">${cat.id}</div>
    </div>
  </a>
`).join('');

// ====== RENDERIZAR PRODUCTOS ======
function renderProductos(filtro = null) {
  const items = filtro ? PRODUCTOS.filter(p => p.categoria === filtro) : PRODUCTOS;
  $titulo.textContent = filtro || 'Todos los productos';
  $btnAll.style.display = filtro ? '' : 'none';

  if (!items.length) {
    $grid.innerHTML = `<div class="col-12"><div class="alert alert-warning text-center">
      No hay productos disponibles en esta categoría.</div></div>`;
    return;
  }

  $grid.innerHTML = items.map(p => `
    <div class="col-12 col-md-6 col-lg-3">
      <div class="card shadow-sm h-100">
        <img src="${p.img}" alt="${p.nombre}" class="card-img-top" 
             style="height:300px;object-fit:cover;">
        <div class="card-body text-center">
          <h6 class="fw-semibold mb-1">${p.nombre}</h6>
          <p class="text-success mb-2">${clp(p.precio)}</p>
          <div class="d-grid gap-2">
            <a href="./detalleProducto.html?id=${p.id}" 
               class="btn btn-outline-success btn-sm">Ver Detalle</a>
            <button class="btn btn-success btn-sm" data-id="${p.id}">
              Añadir al carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

// Render inicial (si no hay ?c, mostrar todos)
renderProductos(categoria);

// ====== EVENTO: Añadir al carrito ======
$grid.addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-id]');
  if (!btn) return;
  const id = btn.dataset.id;
  const prod = PRODUCTOS.find(p => p.id === id);
  if (!prod) return;
  Cart.add(prod, 1);
  btn.textContent = 'Añadido ✓';
  setTimeout(() => btn.textContent = 'Añadir al carrito', 1200);
});
