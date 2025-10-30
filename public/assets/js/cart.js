// assets/js/cart.js
const KEY = 'hh_cart';

function read() {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); }
  catch { return []; }
}
function write(items) {
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent('cart:changed'));
  syncBadge();
  // compat con páginas antiguas
  window.carritoGlobal = items.map(it => ({ ...it })); 
}

export const Cart = {
  items: () => read(),
  total: () => read().reduce((acc, it) => acc + it.precio * it.cantidad, 0),
  add: (product, qty=1) => {
    const items = read();
    const i = items.findIndex(x => x.id === product.id);
    if (i>=0) items[i].cantidad += qty;
    else items.push({ id:product.id, nombre:product.nombre, precio:product.precio, img:product.img, cantidad:qty });
    write(items);
  },
  remove: (id) => { write(read().filter(x => x.id !== id)); },
  setQty: (id, qty) => {
    const items = read().map(x => x.id===id ? { ...x, cantidad: Math.max(1, qty) } : x);
    write(items);
  },
  clear: () => write([]),
};

export function syncBadge(){
  const el = document.getElementById('cartAmount');
  if (!el) return;
  const total = Cart.total();
  el.textContent = total.toLocaleString('es-CL', { style:'currency', currency:'CLP', maximumFractionDigits:0 });
}

// init
window.addEventListener('DOMContentLoaded', syncBadge);
window.addEventListener('cart:changed', syncBadge);
// exponer por si alguna página lo usa
window.Cart = Cart;
window.carritoGlobal = read();
