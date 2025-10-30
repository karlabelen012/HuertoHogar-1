// ======================================================
// cart.js → carrito + checkout + pago correcto / error
// escucha todo el proyecto
// ======================================================

import { Auth } from './auth.js';

const CART_KEY = 'hh_cart';
const ORDER_KEY = 'hh_orders';
const PAY_ERRORS_KEY = 'hh_pay_errors';

const $  = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);
const clp = (n) => Number(n||0).toLocaleString('es-CL',{style:'currency',currency:'CLP',maximumFractionDigits:0});

// ---------- storage básico ----------
function readCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); }
  catch { return []; }
}
function writeCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items || []));
  window.dispatchEvent(new CustomEvent('cart:changed', { detail: items }));
}

export const Cart = {
  items: () => readCart(),
  total: () => readCart().reduce((acc,it)=> acc + (Number(it.precio)||0)*(Number(it.cantidad)||1), 0),
  add: (product, qty=1) => {
    const items = readCart();
    const i = items.findIndex(x => x.id === product.id);
    if (i>=0) items[i].cantidad += qty;
    else items.push({ id:product.id, nombre:product.nombre, precio:product.precio, img:product.img, cantidad:qty });
    writeCart(items);
  },
  remove: (id) => {
    writeCart(readCart().filter(x => x.id !== id));
  },
  setQty: (id, qty) => {
    qty = Math.max(1, Number(qty)||1);
    writeCart(readCart().map(x => x.id===id ? { ...x, cantidad:qty } : x));
  },
  clear: () => writeCart([]),
};

// badge en header
export function syncBadge() {
  const el = $('#cartAmount');
  if (!el) return;
  const total = Cart.total();
  el.textContent = clp(total);
}

// ------------------- CHECKOUT PAGE ---------------------
const tbody   = $('#tbodyCarrito');
const totalEl = $('#txtTotal');
const btnPay  = $('#btnPagar');

function renderCheckoutTable() {
  if (!tbody) return;
  const items = Cart.items();

  if (!items.length) {
    tbody.innerHTML = `
      <tr><td colspan="6" class="text-center text-muted py-4">Tu carrito está vacío 🛒</td></tr>
    `;
  } else {
    tbody.innerHTML = items.map(it => {
      const cant = Number(it.cantidad||1);
      const sub = cant * Number(it.precio||0);
      return `
        <tr data-id="${it.id}">
          <td><img src="${it.img||''}" style="width:60px;height:60px;object-fit:cover;" class="rounded"></td>
          <td>${it.nombre}</td>
          <td class="text-end">${clp(it.precio)}</td>
          <td class="text-center">
            <div class="input-group input-group-sm" style="max-width:160px;margin:auto;">
              <button class="btn btn-outline-secondary btn-minus" type="button">−</button>
              <input type="number" class="form-control text-center qty" min="1" value="${cant}">
              <button class="btn btn-outline-secondary btn-plus" type="button">+</button>
            </div>
          </td>
          <td class="text-end">${clp(sub)}</td>
          <td class="text-end">
            <button class="btn btn-link text-danger btn-remove">✕</button>
          </td>
        </tr>
      `;
    }).join('');
  }

  const total = Cart.total();
  if (totalEl) totalEl.textContent = `Total a pagar: ${clp(total)}`;
  if (btnPay)  btnPay.textContent  = `Pagar ahora ${clp(total)}`;
  syncBadge();
}

// eventos de la tabla
tbody?.addEventListener('click', (e) => {
  const tr = e.target.closest('tr[data-id]');
  if (!tr) return;
  const id = tr.dataset.id;

  if (e.target.classList.contains('btn-remove')) {
    Cart.remove(id);
    renderCheckoutTable();
    return;
  }
  if (e.target.classList.contains('btn-plus') || e.target.classList.contains('btn-minus')) {
    const input = tr.querySelector('input.qty');
    let v = Number(input.value)||1;
    v = e.target.classList.contains('btn-plus') ? v+1 : Math.max(1, v-1);
    input.value = v;
    Cart.setQty(id, v);
    renderCheckoutTable();
  }
});
tbody?.addEventListener('change', (e)=>{
  if (!e.target.classList.contains('qty')) return;
  const tr = e.target.closest('tr[data-id]');
  const id = tr.dataset.id;
  const v  = Math.max(1, Number(e.target.value)||1);
  Cart.setQty(id, v);
  renderCheckoutTable();
});

// --------- AUTOFILL DE USUARIO EN CHECKOUT ----------
function autofillUser() {
  const u = Auth.current();
  if (!u) return;
  const set = (sel, val) => { const el = $(sel); if (el && val) el.value = val; };
  set('#inpNombre', u.nombre);
  set('#inpApellidos', u.apellidos);
  set('#inpCorreo', u.email);
  set('#inpCalle', u.direccion);
  if (u.region && $('#selRegion')) $('#selRegion').value = u.region;
  if (u.comuna && $('#selComuna')) $('#selComuna').value = u.comuna;
}

// --------- VALIDACIÓN Y PAGO ----------
function buildUserFromForm() {
  return {
    nombre:    $('#inpNombre')?.value?.trim() || '',
    apellidos: $('#inpApellidos')?.value?.trim() || '',
    email:     $('#inpCorreo')?.value?.trim() || '',
    calle:     $('#inpCalle')?.value?.trim() || '',
    depto:     $('#inpDepto')?.value?.trim() || '',
    region:    $('#selRegion')?.value || '',
    comuna:    $('#selComuna')?.value || '',
    indicaciones: $('#txtIndicaciones')?.value?.trim() || ''
  };
}

function saveOrderSnapshot(status='OK') {
  const order = {
    id: '#'+Date.now().toString().slice(-7),
    status,
    user: buildUserFromForm(),
    items: Cart.items(),
    total: Cart.total(),
    when: new Date().toISOString()
  };
  localStorage.setItem('hh_last_order', JSON.stringify(order));
  return order;
}

// para admin
function pushOrderToList(order) {
  const orders = JSON.parse(localStorage.getItem(ORDER_KEY) || '[]');
  orders.push(order);
  localStorage.setItem(ORDER_KEY, JSON.stringify(orders));
}
function pushPayError(order) {
  const errs = JSON.parse(localStorage.getItem(PAY_ERRORS_KEY) || '[]');
  errs.push(order);
  localStorage.setItem(PAY_ERRORS_KEY, JSON.stringify(errs));
}

// botón pagar
btnPay?.addEventListener('click', () => {
  // validaciones rápidas de tarjeta
  const name = $('#cardName')?.value?.trim();
  const num  = $('#cardNumber')?.value?.replace(/\s+/g,'');
  const exp  = $('#cardExpiry')?.value;
  const cvv  = $('#cardCVV')?.value;

  if (!name || !num || !exp || !cvv) {
    const snap = saveOrderSnapshot('ERROR');
    pushPayError(snap);
    location.href = './pagoError.html';
    return;
  }

  // pago ok
  const snap = saveOrderSnapshot('OK');
  pushOrderToList(snap);
  Cart.clear();
  location.href = './pagoCorrecto.html';
});

// --------- PÁGINAS DE RESULTADO ----------
function renderResultPage(isError) {
  const data = JSON.parse(localStorage.getItem('hh_last_order') || 'null');
  if (!data) return;
  const h = $('#resultTitle');
  const nro = $('#orderNumber');
  if (h) h.textContent = isError ? 'No se pudo realizar el pago.' : 'Se ha realizado la compra.';
  if (nro) nro.textContent = data.id;

  const tbodyRes = $('#tbodyResumen');
  if (tbodyRes) {
    tbodyRes.innerHTML = (data.items||[]).map(it => `
      <tr>
        <td><div style="width:60px;height:60px;background:url('${it.img||''}') center/cover;"></div></td>
        <td>${it.nombre}</td>
        <td class="text-end">${clp(it.precio)}</td>
        <td class="text-center">${it.cantidad||1}</td>
        <td class="text-end">${clp((it.cantidad||1)*Number(it.precio||0))}</td>
      </tr>
    `).join('');
  }
  const txtT = $('#txtTotal');
  if (txtT) txtT.textContent = `Total pagado: ${clp(data.total)}`;
}

// init
document.addEventListener('DOMContentLoaded', () => {
  if (tbody) {
    autofillUser();
    renderCheckoutTable();
  }
  if (location.pathname.endsWith('pagoCorrecto.html')) renderResultPage(false);
  if (location.pathname.endsWith('pagoError.html'))    renderResultPage(true);
});

// si cambia carrito en otra pestaña
window.addEventListener('cart:changed', () => {
  renderCheckoutTable();
  syncBadge();
});
