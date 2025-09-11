/* script.js */
const onlyAllowedDomains = (email) => {
  return /@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/.test(email);
};
const showError = (el, message) => {
  let wrapper = el.closest('.field');
  if (!wrapper) return;
  let err = wrapper.querySelector('.error');
  if (!err){
    err = document.createElement('div');
    err.className = 'error';
    wrapper.appendChild(err);
  }
  err.textContent = message;
};
const clearError = (el) => {
  let wrapper = el.closest('.field');
  if (!wrapper) return;
  let err = wrapper.querySelector('.error');
  if (err) err.textContent = '';
};
function initLoginForm(){
  const form = document.getElementById('loginForm');
  if (!form) return;
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const email = form.querySelector('input[name="email"]');
    const pass = form.querySelector('input[name="password"]');
    let ok = true;
    if (!email.value.trim()){
      showError(email, 'El correo es requerido.');
      ok=false;
    } else if (email.value.length > 100){
      showError(email, 'Máximo 100 caracteres.');
      ok=false;
    } else if (!onlyAllowedDomains(email.value.trim())){
      showError(email, 'Solo se permiten @duoc.cl, @profesor.duoc.cl o @gmail.com');
      ok=false;
    } else { clearError(email); }
    if (!pass.value.trim()){
      showError(pass, 'La contraseña es requerida.');
      ok=false;
    } else if (pass.value.length < 4 || pass.value.length > 10){
      showError(pass, 'La contraseña debe tener entre 4 y 10 caracteres.');
      ok=false;
    } else { clearError(pass); }
    if (ok){
      alert('Login validado (solo front). En la próxima evaluación conectaremos el backend.');
      form.reset();
    }
  });
}
function initRegisterForm(){
  const form = document.getElementById('registerForm');
  if (!form) return;
  form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const name = form.querySelector('input[name="nombre"]');
    const email = form.querySelector('input[name="email"]');
    const pass = form.querySelector('input[name="password"]');
    let ok = true;
    if (!name.value.trim()){
      showError(name,'El nombre es requerido.');
      ok=false;
    } else if (name.value.length > 50){
      showError(name,'Máximo 50 caracteres.');
      ok=false;
    } else { clearError(name); }
    if (!email.value.trim()){
      showError(email,'El correo es requerido.');
      ok=false;
    } else if (!onlyAllowedDomains(email.value.trim())){
      showError(email, 'Solo se permiten @duoc.cl, @profesor.duoc.cl o @gmail.com');
      ok=false;
    } else { clearError(email); }
    if (!pass.value.trim()){
      showError(pass,'La contraseña es requerida.');
      ok=false;
    } else if (pass.value.length < 4 || pass.value.length > 10){
      showError(pass,'La contraseña debe tener entre 4 y 10 caracteres.');
      ok=false;
    } else { clearError(pass); }
    if (ok){
      alert('Registro validado (solo front). No se guardó información.');
      form.reset();
    }
  });
}
function initContactForm(){
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const name = form.querySelector('input[name="nombre"]');
    const email = form.querySelector('input[name="email"]');
    const comment = form.querySelector('textarea[name="comentario"]');
    let ok = true;
    if (!name.value.trim()){
      showError(name,'El nombre es requerido.');
      ok=false;
    } else { clearError(name); }
    if (!email.value.trim()){
      showError(email,'El correo es requerido.');
      ok=false;
    } else if (!onlyAllowedDomains(email.value.trim())){
      showError(email, 'Solo se permiten @duoc.cl, @profesor.duoc.cl o @gmail.com');
      ok=false;
    } else { clearError(email); }
    if (!comment.value.trim()){
      showError(comment,'El comentario es requerido.');
      ok=false;
    } else if (comment.value.length > 500){
      showError(comment,'Máximo 500 caracteres.');
      ok=false;
    } else { clearError(comment); }
    if (ok){
      alert('Mensaje enviado (simulado). En la próxima entrega implementaremos envío real.');
      form.reset();
    }
  });
}
const CART_KEY = 'huerto_carrito';
function getCart(){ const raw = localStorage.getItem(CART_KEY); return raw ? JSON.parse(raw) : []; }
function saveCart(cart){ localStorage.setItem(CART_KEY, JSON.stringify(cart)); document.dispatchEvent(new CustomEvent('cartUpdated', {detail: cart})); }
function addToCart(product){ const cart = getCart(); const found = cart.find(p => p.id === product.id); if (found){ found.cantidad = found.cantidad + 1; } else { product.cantidad = 1; cart.push(product); } saveCart(cart); }
function renderCartCount(){ const badge = document.getElementById('cartCount'); if (!badge) return; const cart = getCart(); const total = cart.reduce((s,p)=>s+p.cantidad,0); badge.textContent = total; }
function initAddToCartButtons(){ const buttons = document.querySelectorAll('.add-to-cart'); buttons.forEach(btn=>{ btn.addEventListener('click', ()=>{ const id = btn.dataset.id || String(Math.random()).slice(2,8); const name = btn.dataset.name || btn.dataset.title || 'Producto'; const price = parseFloat(btn.dataset.price || btn.dataset.precio || 0) || 0; const img = btn.dataset.img || ''; addToCart({id, nombre:name, precio:price, img}); renderCartCount(); btn.textContent = 'Añadido ✓'; setTimeout(()=> btn.textContent = 'Añadir', 900); }); }); }
function renderCartPage(){ const table = document.getElementById('cartTableBody'); const totalEl = document.getElementById('cartTotal'); if (!table) return; const cart = getCart(); table.innerHTML = ''; let total = 0; cart.forEach(item=>{ const tr = document.createElement('tr'); tr.innerHTML = ` <td><img src="../assets/image/${item.img}" alt="${item.nombre}" style="width:64px;height:48px;object-fit:cover;border-radius:6px"></td> <td>${item.nombre}</td> <td>$ ${item.precio.toLocaleString()}</td> <td><input type="number" min="1" value="${item.cantidad}" class="qty" data-id="${item.id}" style="width:70px"></td> <td>$ ${(item.precio * item.cantidad).toLocaleString()}</td> <td><button class="remove" data-id="${item.id}">Eliminar</button></td> `; table.appendChild(tr); total += item.precio * item.cantidad; }); totalEl.textContent = `$ ${total.toLocaleString()}`; table.querySelectorAll('.qty').forEach(input=>{ input.addEventListener('change',(e)=>{ const id = input.dataset.id; const val = parseInt(input.value) || 1; const cart = getCart(); const found = cart.find(p=>p.id===id); if (found){ found.cantidad = val; saveCart(cart); renderCartPage(); renderCartCount(); } }); }); table.querySelectorAll('.remove').forEach(btn=>{ btn.addEventListener('click', ()=>{ const id = btn.dataset.id; let cart = getCart(); cart = cart.filter(p=>p.id!==id); saveCart(cart); renderCartPage(); renderCartCount(); }); }); }
document.addEventListener('DOMContentLoaded', ()=>{ initLoginForm(); initRegisterForm(); initContactForm(); initAddToCartButtons(); renderCartCount(); renderCartPage(); });
