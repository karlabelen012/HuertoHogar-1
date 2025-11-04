import { Cart } from './cart.js';
import { Auth } from './auth.js';

// ----------------- Helpers básicos -----------------
const $  = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

const clp = (n) =>
  Number(n || 0).toLocaleString('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0
  });

// DOM principales del checkout
const tbody        = $('#tbodyCarrito');
const totalEl      = $('#txtTotal');
const btnPay       = $('#btnPagar');
const amountBadge  = $('#cartAmount');

// Pago
const paymentSection = $('#paymentSection');
const btnConfirmPay  = $('#btnConfirmPay');

// ----------------- Carrito (usando Cart.js) -----------------
function getItems() {
  return Cart.items ? Cart.items() : [];
}

function setQty(id, qty) {
  if (Cart.setQty) {
    Cart.setQty(id, qty);
  } else {
    // Fallback por si tu Cart no tiene setQty
    const items = getItems().map(it =>
      it.id === id ? { ...it, cantidad: qty } : it
    );
    if (Cart.setAll) Cart.setAll(items);
  }
}

function removeItem(id) {
  if (Cart.remove) {
    Cart.remove(id);
  } else {
    const items = getItems().filter(it => it.id !== id);
    if (Cart.setAll) Cart.setAll(items);
  }
}

function clearCart() {
  if (Cart.clear) Cart.clear();
}

function getTotal() {
  return Cart.total
    ? Cart.total()
    : getItems().reduce(
        (acc, it) =>
          acc + Number(it.precio || 0) * Number(it.cantidad || 1),
        0
      );
}

// ----------------- Render tabla de checkout -----------------
function refreshBadge() {
  if (!amountBadge) return;
  amountBadge.textContent = clp(getTotal());
}

function renderCheckoutTable() {
  if (!tbody) return;
  const items = getItems();

  if (!items.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center text-muted py-4">
          Tu carrito está vacío 🛒
        </td>
      </tr>`;
  } else {
    tbody.innerHTML = items
      .map((it) => {
        const cant = Number(it.cantidad || 1);
        const sub = cant * Number(it.precio || 0);
        return `
        <tr data-id="${it.id}">
          <td>
            <img src="${it.img || ''}" alt="${it.nombre || ''}"
                 class="rounded" style="width:60px;height:60px;object-fit:cover;">
          </td>
          <td>${it.nombre || ''}</td>
          <td class="text-end">${clp(it.precio)}</td>
          <td class="text-center">
            <div class="input-group input-group-sm" style="max-width:160px;margin:auto;">
              <button class="btn btn-outline-secondary btn-minus" type="button">−</button>
              <input type="number" min="1" class="form-control text-center qty" value="${cant}">
              <button class="btn btn-outline-secondary btn-plus" type="button">+</button>
            </div>
          </td>
          <td class="text-end subtotal">${clp(sub)}</td>
          <td class="text-end">
            <button class="btn btn-link text-danger p-0 btn-remove" title="Eliminar">✕</button>
          </td>
        </tr>
      `;
      })
      .join('');
  }

  const total = getTotal();
  if (totalEl) totalEl.textContent = `Total a pagar: ${clp(total)}`;
  refreshBadge();
}

// Eventos de la tabla (sumar/restar/eliminar)
tbody?.addEventListener('click', (e) => {
  const tr = e.target.closest('tr[data-id]');
  if (!tr) return;
  const id = tr.dataset.id;

  if (e.target.classList.contains('btn-remove')) {
    removeItem(id);
    renderCheckoutTable();
    return;
  }

  if (
    e.target.classList.contains('btn-plus') ||
    e.target.classList.contains('btn-minus')
  ) {
    const input = tr.querySelector('input.qty');
    let v = parseInt(input.value || '1', 10);
    v = e.target.classList.contains('btn-plus')
      ? v + 1
      : Math.max(1, v - 1);
    input.value = v;
    setQty(id, v);
    renderCheckoutTable();
  }
});

tbody?.addEventListener('change', (e) => {
  if (!e.target.classList.contains('qty')) return;
  const tr = e.target.closest('tr[data-id]');
  if (!tr) return;
  const id = tr.dataset.id;
  const v = Math.max(1, parseInt(e.target.value || '1', 10));
  e.target.value = v;
  setQty(id, v);
  renderCheckoutTable();
});

// ----------------- Auto-relleno desde Auth -----------------
function setVal(sel, val) {
  const el = $(sel);
  if (el && val != null) el.value = val;
}

function autofillFromAuth() {
  if (!Auth?.current) return;
  const user = Auth.current();
  if (!user) return;

  // Campos de tu formulario
  setVal('#inpNombre', user.nombre);
  setVal('#inpApellidos', user.apellidos);
  setVal('#inpCorreo', user.email);

  // Dirección (puede cambiar los nombres según tu Auth)
  setVal('#inpCalle', user.direccion || user.calle);
  setVal('#inpDepto', user.depto);

  const reg = $('#region');
  const com = $('#comuna');
  if (reg && user.region) reg.value = user.region;
  if (com && user.comuna) com.value = user.comuna;

  setVal('#txtIndicaciones', user.indicaciones || user.referencias);
}

// ----------------- Validaciones simples de cliente -----------------
function markInvalid(el, msg = 'Campo requerido') {
  if (!el) return;
  el.classList.add('is-invalid');
  let fb = el.parentElement?.querySelector('.invalid-feedback');
  if (!fb) {
    fb = document.createElement('div');
    fb.className = 'invalid-feedback';
    el.parentElement?.appendChild(fb);
  }
  fb.textContent = msg;
}

function clearInvalid(sel) {
  $$(sel).forEach((el) => {
    el.classList.remove('is-invalid');
    const fb = el.parentElement?.querySelector('.invalid-feedback');
    if (fb) fb.textContent = '';
  });
}

function validateUserForm() {
  clearInvalid('.is-invalid');

  const nombre = $('#inpNombre');
  const apellidos = $('#inpApellidos');
  const correo = $('#inpCorreo');
  const calle = $('#inpCalle');
  const region = $('#region');
  const comuna = $('#comuna');

  let ok = true;

  if (!nombre?.value.trim()) {
    markInvalid(nombre);
    ok = false;
  }
  if (!apellidos?.value.trim()) {
    markInvalid(apellidos);
    ok = false;
  }

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo?.value || '');
  if (!emailOk) {
    markInvalid(correo, 'Correo no válido');
    ok = false;
  }

  if (!calle?.value.trim()) {
    markInvalid(calle);
    ok = false;
  }
  if (!region?.value) {
    markInvalid(region);
    ok = false;
  }
  if (!comuna?.value) {
    markInvalid(comuna);
    ok = false;
  }

  if (!ok) {
    document
      .querySelector('.is-invalid')
      ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  return ok;
}

// ----------------- Validación de tarjeta -----------------
function luhnValid(numStr) {
  const s = numStr.replace(/\s+/g, '');
  if (!/^\d{13,19}$/.test(s)) return false;
  let sum = 0,
    alt = false;
  for (let i = s.length - 1; i >= 0; i--) {
    let n = +s[i];
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
}

function expiryValid(mmYY) {
  if (!/^\d{2}\/\d{2}$/.test(mmYY)) return false;
  const [mm, yy] = mmYY.split('/').map(Number);
  if (mm < 1 || mm > 12) return false;
  const year = 2000 + yy;
  const now = new Date();
  const exp = new Date(year, mm, 0, 23, 59, 59);
  return exp >= new Date(now.getFullYear(), now.getMonth(), 1);
}

function validatePayment() {
  clearInvalid('#cardName, #cardNumber, #cardExp, #cardCvv');

  const name = $('#cardName');
  const num = $('#cardNumber');
  const exp = $('#cardExp');
  const cvv = $('#cardCvv');

  let ok = true;

  if (!name?.value.trim()) {
    markInvalid(name);
    ok = false;
  }

  const rawNum = (num?.value || '').replace(/\s+/g, '');
  if (!luhnValid(rawNum)) {
    markInvalid(num, 'Número de tarjeta no válido');
    ok = false;
  }

  if (!expiryValid(exp?.value || '')) {
    markInvalid(exp, 'Fecha inválida o expirada');
    ok = false;
  }

  if (!/^\d{3,4}$/.test(cvv?.value || '')) {
    markInvalid(cvv, 'CVV inválido');
    ok = false;
  }

  return ok;
}

// ----------------- Snapshot de orden para páginas de resultado -----------------
function buildUserFromForm() {
  return {
    nombre: $('#inpNombre')?.value?.trim() || '',
    apellidos: $('#inpApellidos')?.value?.trim() || '',
    email: $('#inpCorreo')?.value?.trim() || '',
    calle: $('#inpCalle')?.value?.trim() || '',
    depto: $('#inpDepto')?.value?.trim() || '',
    region: $('#region')?.value || '',
    comuna: $('#comuna')?.value || '',
    indicaciones: $('#txtIndicaciones')?.value?.trim() || ''
  };
}

function genOrderNumber() {
  const n = Date.now().toString().slice(-9);
  return `#${n}`;
}

function saveOrderSnapshot(status = 'OK') {
  const order = {
    id: genOrderNumber(),
    status,
    user: buildUserFromForm(),
    items: getItems(),
    total: getTotal(),
    when: new Date().toISOString()
  };
  localStorage.setItem('hh_last_order', JSON.stringify(order));
  return order;
}

function readOrderSnapshot() {
  try {
    return JSON.parse(localStorage.getItem('hh_last_order') || 'null');
  } catch {
    return null;
  }
}

// ----------------- Render de pagoCorrecto / pagoError -----------------
function renderResultPage(isError) {
  const data = readOrderSnapshot();
  if (!data) return;

  const title = $('#resultTitle');
  const nro = $('#orderNumber');
  if (title) {
    title.textContent = isError
      ? 'No se pudo realizar el pago.'
      : 'Se ha realizado la compra.';
  }
  if (nro) nro.textContent = data.id;

  // Rellenar datos de cliente en la página de resumen
  setVal('#inpNombre', data.user?.nombre);
  setVal('#inpApellidos', data.user?.apellidos);
  setVal('#inpCorreo', data.user?.email);
  setVal('#inpCalle', data.user?.calle);
  setVal('#inpDepto', data.user?.depto);
  if ($('#region')) $('#region').value = data.user?.region || '';
  if ($('#comuna')) $('#comuna').value = data.user?.comuna || '';
  setVal('#txtIndicaciones', data.user?.indicaciones);

  // Tabla de productos
  const tbodyRes = $('#tbodyResumen');
  if (tbodyRes) {
    tbodyRes.innerHTML = (data.items || [])
      .map(
        (it) => `
      <tr>
        <td>
          <div class="rounded bg-light"
               style="width:60px;height:60px;background-image:url('${it.img || ''}');
               background-size:cover;background-position:center;"></div>
        </td>
        <td>${it.nombre || ''}</td>
        <td class="text-end">${clp(it.precio)}</td>
        <td class="text-center">${it.cantidad || 1}</td>
        <td class="text-end">${clp(Number(it.precio || 0) * Number(it.cantidad || 1))}</td>
      </tr>
    `
      )
      .join('');
  }

  const totalTxt = $('#txtTotal');
  if (totalTxt) totalTxt.textContent = `Total pagado: ${clp(data.total)}`;

  // Botones
  $('#btnVolverPagar')?.addEventListener('click', () => {
    window.location.href = './checkout.html';
  });
  $('#btnImprimir')?.addEventListener('click', () => window.print());
  $('#btnEnviarEmail')?.addEventListener('click', () => {
    alert(
      '📧 (demo) Boleta enviada a ' + (data.user?.email || 'tu correo')
    );
  });
}

// ----------------- Mostrar sección de pago -----------------
function showPaymentSection() {
  if (!paymentSection) return;

  paymentSection.classList.remove('d-none');

  const num = $('#cardNumber');
  const exp = $('#cardExp');
  const cvv = $('#cardCvv');

  // Máscaras simples (solo se agregan una vez)
  if (num && !num.dataset.masked) {
    num.dataset.masked = '1';
    num.addEventListener('input', () => {
      const digits = num.value.replace(/\D/g, '').slice(0, 16);
      num.value = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
    });
  }

  if (exp && !exp.dataset.masked) {
    exp.dataset.masked = '1';
    exp.addEventListener('input', () => {
      const digits = exp.value.replace(/\D/g, '').slice(0, 4);
      exp.value =
        digits.length <= 2
          ? digits
          : digits.slice(0, 2) + '/' + digits.slice(2);
    });
  }

  if (cvv && !cvv.dataset.masked) {
    cvv.dataset.masked = '1';
    cvv.addEventListener('input', () => {
      cvv.value = cvv.value.replace(/\D/g, '').slice(0, 4);
    });
  }

  if (btnPay) {
    btnPay.textContent = `Confirmar datos ${clp(getTotal())}`;
  }

  paymentSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ----------------- INIT -----------------
document.addEventListener('DOMContentLoaded', () => {
  // Estamos en checkout.html si existe la tabla
  if (tbody) {
    renderCheckoutTable();
    autofillFromAuth();

    btnPay?.addEventListener('click', () => {
      if (!getItems().length) {
        alert('Tu carrito está vacío');
        return;
      }
      if (!validateUserForm()) return;
      showPaymentSection();
    });

    btnConfirmPay?.addEventListener('click', () => {
      if (!validateUserForm()) return;
      if (!validatePayment()) {
        // Guardamos snapshot de error y vamos a pagoError
        saveOrderSnapshot('ERROR');
        window.location.href = './pagoError.html';
        return;
      }
      saveOrderSnapshot('OK');
      clearCart();
      renderCheckoutTable();
      window.location.href = './pagoCorrecto.html';
    });
  }

  // Páginas de resultado
  const path = window.location.pathname;
  if (path.endsWith('pagoCorrecto.html')) {
    renderResultPage(false);
  } else if (path.endsWith('pagoError.html')) {
    renderResultPage(true);
  }
});
