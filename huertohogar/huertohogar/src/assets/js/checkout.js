// assets/js/checkout.js
// =====================================================
// Checkout: carrito + validaciones + pago + confirmaciones
// Renderiza también pagoCorrecto.html y pagoError.html
// =====================================================

// (Opcional) intenta usar tu módulo de carrito si lo tienes.
let Cart = null;
try {
  const mod = await import('./cart.js');
  Cart = mod?.Cart || null;
} catch (_) {}

// ----------------- Utils -----------------
const $  = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);
const clp = (n) =>
  Number(n || 0).toLocaleString('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 });

const StorageCart = {
  key: 'hh_cart',
  get() {
    try { return JSON.parse(localStorage.getItem(this.key) || '[]'); }
    catch { return []; }
  },
  set(items) {
    localStorage.setItem(this.key, JSON.stringify(items || []));
    window.dispatchEvent(new Event('storage'));
  }
};

// Normalización carrito
function getItems() {
  if (Cart?.items) return Cart.items();
  if (Array.isArray(window.carritoGlobal)) return window.carritoGlobal;
  return StorageCart.get();
}
function setItems(items){
  if (Cart?.setAll) return Cart.setAll(items);
  if (Array.isArray(window.carritoGlobal)) window.carritoGlobal = items;
  StorageCart.set(items);
}
function setQty(id, qty) {
  qty = Math.max(1, parseInt(qty || 1, 10));
  if (Cart?.setQty) return Cart.setQty(id, qty);
  const items = getItems().map(it => it.id === id ? { ...it, cantidad: qty } : it);
  setItems(items);
}
function removeItem(id) {
  if (Cart?.remove) return Cart.remove(id);
  const items = getItems().filter(it => it.id !== id);
  setItems(items);
}
function clearCart(){
  if (Cart?.clear) return Cart.clear();
  setItems([]);
}
function getTotal() {
  if (Cart?.total) return Cart.total();
  return getItems().reduce((acc, it) => acc + (Number(it.precio) * Number(it.cantidad || 1)), 0);
}
function refreshBadge() {
  const el = $('#cartAmount');
  if (el) el.textContent = clp(getTotal());
}

// ----------------- Render en checkout.html -----------------
const tbody   = $('#tbodyCarrito');
const totalEl = $('#txtTotal');
const btnPay  = $('#btnPagar');

function renderCheckoutTable() {
  const items = getItems();
  if (!tbody) return;

  if (!items.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center text-muted py-4">
          Tu carrito está vacío 🛒
        </td>
      </tr>`;
  } else {
    tbody.innerHTML = items.map(it => {
      const cant = Number(it.cantidad || 1);
      const sub  = cant * Number(it.precio || 0);
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
    }).join('');
  }

  const total = getTotal();
  if (totalEl) totalEl.textContent = `Total a pagar: ${clp(total)}`;
  if (btnPay)  btnPay.textContent  = payFormInjected
    ? `Confirmar pago ${clp(total)}`
    : `Pagar ahora ${clp(total)}`;
  refreshBadge();
}

// Eventos tabla (checkout.html)
tbody?.addEventListener('click', (e) => {
  const tr = e.target.closest('tr[data-id]');
  if (!tr) return;
  const id = tr.dataset.id;

  if (e.target.classList.contains('btn-remove')) {
    removeItem(id);
    renderCheckoutTable();
    return;
  }

  if (e.target.classList.contains('btn-plus') || e.target.classList.contains('btn-minus')) {
    const input = tr.querySelector('input.qty');
    let v = parseInt(input.value || '1', 10);
    v = e.target.classList.contains('btn-plus') ? v + 1 : Math.max(1, v - 1);
    input.value = v;
    setQty(id, v);
    renderCheckoutTable();
  }
});
tbody?.addEventListener('change', (e) => {
  if (!e.target.classList.contains('qty')) return;
  const tr = e.target.closest('tr[data-id]');
  const id = tr.dataset.id;
  const v  = Math.max(1, parseInt(e.target.value || '1', 10));
  e.target.value = v;
  setQty(id, v);
  renderCheckoutTable();
});

// ----------------- Autofill de usuario -----------------
function readUser() {
  try {
    const u1 = JSON.parse(localStorage.getItem('hh_user') || 'null');
    if (u1) return u1;
    const auth = JSON.parse(localStorage.getItem('hh_auth') || 'null');
    if (auth?.user) return auth.user;
  } catch {}
  return null;
}
function autofillUser() {
  const u = readUser();
  if (!u) return;
  const set = (sel, val) => { const el = $(sel); if (el && val) el.value = val; };

  set('#inpNombre',    u.nombre);
  set('#inpApellidos', u.apellidos);
  set('#inpCorreo',    u.email);
  set('#inpCalle',     u.calle || u.direccion);
  set('#inpDepto',     u.depto);

  if (u.region && $('#selRegion'))  $('#selRegion').value = u.region;
  if (u.comuna && $('#selComuna'))  $('#selComuna').value = u.comuna;
  const ind = u.indicaciones || u.referencias;
  if (ind && $('#txtIndicaciones')) $('#txtIndicaciones').value = ind;
}

// ----------------- Validaciones formulario usuario -----------------
function markInvalid(el, msg = '') {
  if (!el) return;
  el.classList.add('is-invalid');
  let fb = el.parentElement?.querySelector('.invalid-feedback');
  if (!fb) {
    fb = document.createElement('div');
    fb.className = 'invalid-feedback';
    el.parentElement?.appendChild(fb);
  }
  fb.textContent = msg || 'Campo requerido';
}
function clearInvalid(sel) {
  $$(sel).forEach(el => {
    el.classList.remove('is-invalid');
    const fb = el.parentElement?.querySelector('.invalid-feedback');
    if (fb) fb.textContent = '';
  });
}
function validateUserForm() {
  clearInvalid('input, select, textarea');

  const nombre   = $('#inpNombre');
  const apellidos= $('#inpApellidos');
  const correo   = $('#inpCorreo');
  const calle    = $('#inpCalle');
  const region   = $('#selRegion');
  const comuna   = $('#selComuna');

  let ok = true;

  if (!nombre?.value.trim())   { markInvalid(nombre); ok = false; }
  if (!apellidos?.value.trim()){ markInvalid(apellidos); ok = false; }

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo?.value || '');
  if (!emailOk) { markInvalid(correo, 'Correo no válido'); ok = false; }

  if (!calle?.value.trim())    { markInvalid(calle); ok = false; }
  if (!region?.value?.trim())  { markInvalid(region); ok = false; }
  if (!comuna?.value?.trim())  { markInvalid(comuna); ok = false; }

  if (!ok) {
    const first = document.querySelector('.is-invalid');
    first?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  return ok;
}

// ----------------- UI del pago (inyectado) -----------------
let payFormInjected = false;
function ensurePaymentForm() {
  if (payFormInjected) return;

  const totalWrap = totalEl?.parentElement;
  const section = document.createElement('section');
  section.className = 'mb-4';
  section.id = 'secPago';

  section.innerHTML = `
    <h5 class="fw-bold mb-3" style="font-family:'Playfair Display',serif;">Pago con tarjeta</h5>
    <div class="row g-3">
      <div class="col-md-6">
        <label class="form-label small fw-semibold">Nombre en la tarjeta*</label>
        <input id="cardName" type="text" class="form-control" placeholder="Como aparece en la tarjeta">
      </div>
      <div class="col-md-6">
        <label class="form-label small fw-semibold">Número de tarjeta*</label>
        <input id="cardNumber" inputmode="numeric" maxlength="19" class="form-control" placeholder="XXXX XXXX XXXX XXXX">
      </div>
      <div class="col-md-4">
        <label class="form-label small fw-semibold">Vencimiento (MM/AA)*</label>
        <input id="cardExpiry" inputmode="numeric" maxlength="5" class="form-control" placeholder="MM/AA">
      </div>
      <div class="col-md-4">
        <label class="form-label small fw-semibold">CVV*</label>
        <input id="cardCVV" inputmode="numeric" maxlength="4" class="form-control" placeholder="3 o 4 dígitos">
      </div>
      <div class="col-md-4">
        <label class="form-label small fw-semibold">RUT/RUN (opcional)</label>
        <input id="cardRUT" class="form-control" placeholder="12.345.678-5">
      </div>
    </div>
  `;

  totalWrap?.after(section);
  payFormInjected = true;

  const cardNumber = $('#cardNumber');
  const cardExpiry = $('#cardExpiry');
  const cardCVV    = $('#cardCVV');

  cardNumber?.addEventListener('input', () => {
    const digits = cardNumber.value.replace(/\D/g, '').slice(0, 16);
    cardNumber.value = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  });
  cardExpiry?.addEventListener('input', () => {
    const digits = cardExpiry.value.replace(/\D/g, '').slice(0, 4);
    cardExpiry.value = digits.length <= 2 ? digits : digits.slice(0,2) + '/' + digits.slice(2);
  });
  cardCVV?.addEventListener('input', () => {
    cardCVV.value = cardCVV.value.replace(/\D/g,'').slice(0,4);
  });

  if (btnPay) btnPay.textContent = `Confirmar pago ${clp(getTotal())}`;
  section.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ----------------- Validación de tarjeta -----------------
function luhnValid(numStr) {
  const s = numStr.replace(/\s+/g,'');
  if (!/^\d{13,19}$/.test(s)) return false;
  let sum = 0, alt = false;
  for (let i = s.length - 1; i >= 0; i--) {
    let n = +s[i];
    if (alt) { n *= 2; if (n > 9) n -= 9; }
    sum += n; alt = !alt;
  }
  return sum % 10 === 0;
}
function expiryValid(mmYY) {
  if (!/^\d{2}\/\d{2}$/.test(mmYY)) return false;
  const [mm, yy] = mmYY.split('/').map(x => +x);
  if (mm < 1 || mm > 12) return false;
  const year = 2000 + yy;
  const now = new Date();
  const exp = new Date(year, mm, 0, 23, 59, 59);
  return exp >= new Date(now.getFullYear(), now.getMonth(), 1);
}
function validatePayment() {
  clearInvalid('#cardName, #cardNumber, #cardExpiry, #cardCVV');

  const name = $('#cardName');
  const num  = $('#cardNumber');
  const exp  = $('#cardExpiry');
  const cvv  = $('#cardCVV');

  let ok = true;
  if (!name?.value.trim()) { markInvalid(name); ok = false; }
  const rawNum = (num?.value || '').replace(/\s+/g,'');
  if (!luhnValid(rawNum)) { markInvalid(num, 'Número de tarjeta no válido'); ok = false; }
  if (!expiryValid(exp?.value || '')) { markInvalid(exp, 'Fecha inválida o expirada'); ok = false; }
  if (!/^\d{3,4}$/.test(cvv?.value || '')) { markInvalid(cvv, 'CVV inválido'); ok = false; }

  if (!ok) {
    // Guarda snapshot para mostrarlo en pagoError
    saveOrderSnapshot('ERROR');
    location.href = './pagoError.html';
    return false;
  }
  return true;
}

// ----------------- Snapshot de orden -----------------
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
function genOrderNumber(){
  const n = Date.now().toString().slice(-9);
  return `#${n}`;
}
function saveOrderSnapshot(status='OK') {
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
function readOrderSnapshot(){
  try { return JSON.parse(localStorage.getItem('hh_last_order') || 'null'); }
  catch { return null; }
}

// ----------------- Sincronización -----------------
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) renderCheckoutTable();
});
window.addEventListener('storage', () => renderCheckoutTable());

// ----------------- Init (checkout.html) -----------------
document.addEventListener('DOMContentLoaded', () => {
  // Si la página tiene la tabla => estamos en checkout.html
  if (tbody) {
    autofillUser();
    renderCheckoutTable();
  }
  // Si estamos en páginas de resultado, pinto el resumen:
  if (location.pathname.endsWith('pagoCorrecto.html')) {
    renderResultPage(false);
  } else if (location.pathname.endsWith('pagoError.html')) {
    renderResultPage(true);
  }
});

// --- añade esto arriba, junto a otras const DOM ---
const paymentSection = document.getElementById('paymentSection');

// --- reemplaza ensurePaymentForm por esto ---
function ensurePaymentForm() {
  // Si ya hay sección en el HTML, solo muéstrala y aplica máscaras
  if (paymentSection) {
    paymentSection.classList.remove('d-none');
    payFormInjected = true;

    const num = document.getElementById('cardNumber');
    const exp = document.getElementById('cardExp') || document.getElementById('cardExpiry'); // compat
    const cvv = document.getElementById('cardCvv') || document.getElementById('cardCVV');   // compat

    num?.addEventListener('input', () => {
      const digits = num.value.replace(/\D/g, '').slice(0, 16);
      num.value = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
    });
    exp?.addEventListener('input', () => {
      const digits = exp.value.replace(/\D/g, '').slice(0, 4);
      exp.value = digits.length <= 2 ? digits : digits.slice(0,2) + '/' + digits.slice(2);
    });
    cvv?.addEventListener('input', () => {
      cvv.value = cvv.value.replace(/\D/g,'').slice(0,4);
    });

    if (btnPay) btnPay.textContent = `Confirmar pago ${clp(getTotal())}`;
    paymentSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  // Fallback: si no existiera la sección en HTML, usa el inyector original
  const totalWrap = totalEl?.parentElement;
  const section = document.createElement('section');
  section.className = 'mt-5';
  section.innerHTML = `
    <h5 class="fw-bold">Pago con tarjeta</h5>
    <p class="text-muted">Ingresa los datos de tu tarjeta para completar la compra.</p>
    <div class="row g-3">
      <div class="col-md-6">
        <label class="form-label small">Titular de la tarjeta*</label>
        <input type="text" id="cardName" class="form-control" placeholder="Nombre como aparece en la tarjeta">
      </div>
      <div class="col-md-6">
        <label class="form-label small">Número de tarjeta*</label>
        <input type="text" id="cardNumber" inputmode="numeric" maxlength="19" class="form-control" placeholder="XXXX XXXX XXXX XXXX">
      </div>
      <div class="col-md-4">
        <label class="form-label small">Vencimiento* (MM/AA)</label>
        <input type="text" id="cardExpiry" class="form-control" placeholder="MM/AA" maxlength="5">
      </div>
      <div class="col-md-4">
        <label class="form-label small">CVV*</label>
        <input type="password" id="cardCVV" class="form-control" maxlength="4" inputmode="numeric" placeholder="***">
      </div>
    </div>`;
  totalWrap?.after(section);
  payFormInjected = true;

  const num = section.querySelector('#cardNumber');
  const exp = section.querySelector('#cardExpiry');
  const cvv = section.querySelector('#cardCVV');

  num?.addEventListener('input', () => {
    const digits = num.value.replace(/\D/g, '').slice(0, 16);
    num.value = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  });
  exp?.addEventListener('input', () => {
    const digits = exp.value.replace(/\D/g, '').slice(0, 4);
    exp.value = digits.length <= 2 ? digits : digits.slice(0,2) + '/' + digits.slice(2);
  });
  cvv?.addEventListener('input', () => {
    cvv.value = cvv.value.replace(/\D/g,'').slice(0,4);
  });

  if (btnPay) btnPay.textContent = `Confirmar pago ${clp(getTotal())}`;
  section.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// --- ajusta validatePayment para soportar tus IDs ---
function validatePayment() {
  clearInvalid('#cardName, #cardNumber, #cardExpiry, #cardExp, #cardCVV, #cardCvv');

  const name = document.getElementById('cardName');
  const num  = document.getElementById('cardNumber');
  const exp  = document.getElementById('cardExp') || document.getElementById('cardExpiry');
  const cvv  = document.getElementById('cardCvv') || document.getElementById('cardCVV');

  let ok = true;
  if (!name?.value.trim()) { markInvalid(name); ok = false; }
  const rawNum = (num?.value || '').replace(/\s+/g,'');
  if (!luhnValid(rawNum)) { markInvalid(num, 'Número de tarjeta no válido'); ok = false; }
  if (!expiryValid(exp?.value || '')) { markInvalid(exp, 'Fecha inválida o expirada'); ok = false; }
  if (!/^\d{3,4}$/.test(cvv?.value || '')) { markInvalid(cvv, 'CVV inválido'); ok = false; }

  if (!ok) {
    saveOrderSnapshot('ERROR');
    location.href = './pagoError.html';
    return false;
  }
  return true;
}


// ----------------- Render de pagoCorrecto / pagoError -----------------
function renderResultPage(isError) {
  const data = readOrderSnapshot();
  if (!data) return;

  // Título + orden
  const h = $('#resultTitle');
  const nro = $('#orderNumber');
  if (h) {
    h.textContent = isError
      ? 'No se pudo realizar el pago.'
      : 'Se ha realizado la compra.';
  }
  if (nro) nro.textContent = data.id;

  // Autorellena campos (solo lectura en esas páginas)
  const set = (sel, val) => { const el = $(sel); if (el) el.value = val || ''; };
  set('#inpNombre',    data.user?.nombre);
  set('#inpApellidos', data.user?.apellidos);
  set('#inpCorreo',    data.user?.email);
  set('#inpCalle',     data.user?.calle);
  set('#inpDepto',     data.user?.depto);
  if ($('#selRegion')) $('#selRegion').value = data.user?.region || '';
  if ($('#selComuna')) $('#selComuna').value = data.user?.comuna || '';
  set('#txtIndicaciones', data.user?.indicaciones);

  // Tabla de items
  const tbodyRes = $('#tbodyResumen');
  if (tbodyRes) {
    tbodyRes.innerHTML = (data.items || []).map(it => `
      <tr>
        <td><div class="rounded bg-light" style="width:60px;height:60px;background-image:url('${it.img||''}');
        background-size:cover;background-position:center;"></div></td>
        <td>${it.nombre||''}</td>
        <td class="text-end">${clp(it.precio)}</td>
        <td class="text-center">${it.cantidad||1}</td>
        <td class="text-end">${clp((it.cantidad||1)*Number(it.precio||0))}</td>
      </tr>
    `).join('');
  }
  const totalTxt = $('#txtTotal');
  if (totalTxt) totalTxt.textContent = `Total pagado: ${clp(data.total)}`;

  // Botones especiales
  $('#btnVolverPagar')?.addEventListener('click', () => {
    location.href = './checkout.html';
  });
  $('#btnImprimir')?.addEventListener('click', () => window.print());
  $('#btnEnviarEmail')?.addEventListener('click', () => {
    alert('📧 (demo) Boleta enviada a ' + (data.user?.email || 'tu correo'));
  });
}
