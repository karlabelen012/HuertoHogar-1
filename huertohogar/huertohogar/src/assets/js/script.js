/* ==========================================================
   🌿 HUERTOHOGAR - SCRIPT GENERAL DEL SITIO
   ==========================================================
   Archivo JS unificado del proyecto.
   Contiene TODO el comportamiento de los HTML:
   - Validaciones y funciones base
   - Login y Registro
   - Contacto
   - Suscripción al boletín
   - Carrito
   - Efectos y animaciones
   - Sección de productos y blogs
   ========================================================== */



/* ==========================================================
   1️⃣ VALIDACIONES Y FUNCIONES BASE (SE APLICAN EN TODO EL SITIO)
   ========================================================== */

/**
 * Verifica que el dominio del correo sea válido.
 */
function esDominioValido(email) {
  return /@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i.test(email);
}

/**
 * Muestra un mensaje de error genérico (alert clásico).
 */
function mostrarError(mensaje) {
  alert("⚠️ " + mensaje);
}

/**
 * Limpia los campos de un formulario luego de una acción correcta.
 */
function limpiarFormulario(form) {
  form.reset();
}

/**
 * Validar formato de correo electrónico genérico.
 */
function correoValido(email) {
  return /^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/i.test(email);
}

/**
 * Validar formato de teléfono chileno (+56 9 XXXX XXXX).
 */
function telefonoValido(tel) {
  return /^\+?56\s?9\s?\d{4}\s?\d{4}$/.test(tel);
}



/* ==========================================================
   2️⃣ ANIMACIONES GENERALES (fade-in / scroll suave)
   ========================================================== */

/**
 * Efecto de entrada suave al hacer scroll (fade-up).
 */
document.addEventListener("DOMContentLoaded", () => {
  const fadeEls = document.querySelectorAll(".fade-up");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("show");
    });
  }, { threshold: 0.2 });
  fadeEls.forEach((el) => observer.observe(el));
});

/**
 * Scroll suave en todos los enlaces con anclas (#)
 */
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const destino = document.querySelector(link.getAttribute("href"));
    if (destino) {
      e.preventDefault();
      destino.scrollIntoView({ behavior: "smooth" });
    }
  });
});



/* ==========================================================
   3️⃣ FORMULARIO DE LOGIN (login.html)
   ==========================================================
   Validaciones:
   - Campos vacíos
   - Correo válido y permitido
   - Autenticación real con usuarios guardados
   ========================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  if (!loginForm) return;

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const pass = document.getElementById("password").value.trim();

    if (!email || !pass) {
      mostrarError("Por favor, completa todos los campos.");
      return;
    }

    if (!correoValido(email)) {
      mostrarError("Formato de correo no válido.");
      return;
    }

    if (!esDominioValido(email)) {
      mostrarError("Solo se permiten correos @duoc.cl, @profesor.duoc.cl o @gmail.com");
      return;
    }

    if (pass.length < 6) {
      mostrarError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    // 🔍 Obtener usuarios guardados en localStorage
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const usuarioEncontrado = usuarios.find(u => u.email === email && u.password === pass);

    if (usuarioEncontrado) {
      // ✅ Inicia sesión real
      localStorage.setItem("usuarioActivo", JSON.stringify(usuarioEncontrado));
      alert(`✅ Bienvenido/a ${usuarioEncontrado.nombre} 🌿`);
      window.location.href = "index.html";
    } else {
      mostrarError("Correo o contraseña incorrectos.");
    }
  });
});

/* ==========================================================
   4️⃣ FORMULARIO DE REGISTRO (registro.html)
   ==========================================================
   Validaciones:
   - Campos obligatorios
   - Confirmaciones
   - Dominio permitido
   - Teléfono chileno
   - Guarda el usuario en localStorage
   ========================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm");
  if (!registerForm) return;

  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const email = document.getElementById("email").value.trim();
    const email2 = document.getElementById("email2").value.trim();
    const pass1 = document.getElementById("password").value.trim();
    const pass2 = document.getElementById("password2").value.trim();
    const tel = document.getElementById("telefono").value.trim();
    const region = document.getElementById("region").value;
    const comuna = document.getElementById("comuna").value;

    if (!nombre || !email || !email2 || !pass1 || !pass2 || !region || !comuna) {
      return mostrarError("Completa todos los campos obligatorios.");
    }
    if (!correoValido(email)) return mostrarError("Correo inválido.");
    if (email !== email2) return mostrarError("Los correos no coinciden.");
    if (pass1.length < 6) return mostrarError("La contraseña debe tener al menos 6 caracteres.");
    if (pass1 !== pass2) return mostrarError("Las contraseñas no coinciden.");

    // 🧩 Determinar el rol según el dominio
    let rol = "Cliente";
    if (/@(duoc\.cl|duocuc\.cl|profesor\.duoc\.cl|duocpro\.cl)$/i.test(email)) {
      rol = "Administrador";
    }

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const existe = usuarios.find(u => u.email === email);
    if (existe) return mostrarError("Ya existe un usuario registrado con ese correo.");

    usuarios.push({ nombre, email, password: pass1, telefono: tel, region, comuna, rol });
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    alert("✅ Registro exitoso. ¡Bienvenido/a a HuertoHogar 🌿!");
    limpiarFormulario(registerForm);
    window.location.href = "login.html";
  });
});


/* ==========================================================
   🧩 FUNCIONES AUXILIARES GLOBALES
   ========================================================== */
function mostrarError(msg) {
  alert("⚠️ " + msg);
}

function limpiarFormulario(form) {
  form.reset();
}

function correoValido(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function esDominioValido(email) {
  return /@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i.test(email);
}

function telefonoValido(tel) {
  return /^\+56\s?9\s?\d{4}\s?\d{4}$/.test(tel);
}


// assets/js/script.js
// ========== CONST ==========
const IDS = { count:'cartCount', amount:'cartAmount' };
const NAV = { login:'#navLogin', register:'#navRegister', profile:'#navProfile', admin:'#navAdmin', logout:'#navLogout' };

import { $, $$, setCurrentYear, bindSearchForm } from './ui.js';
import { Auth } from './auth.js';
import { Cart } from './cart.js';

// ---- Animaciones (fade-up) ----
document.addEventListener('DOMContentLoaded', () => {
  const els = $$('.fade-up');
  if (els.length){
    const obs = new IntersectionObserver(ents => ents.forEach(e => e.isIntersecting && e.target.classList.add('show')), { threshold:.2 });
    els.forEach(el => obs.observe(el));
  }
});

// ---- Scroll suave ----
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#"]'); if (!a) return;
  const dst = document.querySelector(a.getAttribute('href'));
  if (dst){ e.preventDefault(); dst.scrollIntoView({ behavior:'smooth' }); }
});

// ---- Loader ----
window.addEventListener('load', () => { const l = $('#loader'); if (l){ l.classList.add('hide'); setTimeout(()=>l.remove(),600); } });

// ---- Año y búsqueda ----
document.addEventListener('DOMContentLoaded', () => { setCurrentYear(); bindSearchForm('#formBuscar','#q'); });

// ---- Badges de carrito (cuenta y monto) ----
function syncCartBadges(){
  const items = Cart.items();
  const count = items.reduce((a,it)=>a+Number(it.cantidad||1),0);
  const total = Cart.total();
  const elCount = document.getElementById(IDS.count);
  const elAmount= document.getElementById(IDS.amount);
  if (elCount)  elCount.textContent = count;
  if (elAmount) elAmount.textContent = total.toLocaleString('es-CL',{style:'currency',currency:'CLP',maximumFractionDigits:0});
}
window.addEventListener('cart:changed', syncCartBadges);
document.addEventListener('DOMContentLoaded', syncCartBadges);

// ---- Navbar según sesión/rol ----
function paintNavbarByAuth(){
  const u = Auth.current();
  const isAdmin = !!u && u.rol === 'admin';
  const show = (sel, v) => { const el=$(sel); if(el){ el.classList.toggle('d-none', !v); el.hidden = !v; } };

  show(NAV.login,   !u);
  show(NAV.register,!u);
  show(NAV.profile, !!u && !isAdmin);
  show(NAV.admin,   !!u && isAdmin);
  show(NAV.logout,  !!u);

  const np = $(NAV.profile);
  if (np && u) np.querySelector('span')?.replaceChildren(document.createTextNode(u.nombre||'Perfil'));
}
document.addEventListener('DOMContentLoaded', paintNavbarByAuth);
window.addEventListener('auth:login',  paintNavbarByAuth);
window.addEventListener('auth:logout', paintNavbarByAuth);

// ---- Cerrar sesión (si existe el botón) ----
document.addEventListener('click', (e) => {
  if (e.target.closest(NAV.logout)){
    e.preventDefault();
    Auth.logout();
    alert('👋 Sesión cerrada');
    location.reload();
  }
});

// ---- Suscripción (footer simple) ----
document.addEventListener('DOMContentLoaded', () => {
  const f = document.getElementById('subscribeForm');
  if (!f) return;
  f.addEventListener('submit',(e)=>{
    e.preventDefault();
    const email = document.getElementById('emailSub')?.value?.trim();
    if(!email) return alert('Ingresa tu correo');
    localStorage.setItem('hh_sub_'+Date.now(), JSON.stringify({email, when:new Date().toISOString()}));
    alert('✅ ¡Gracias por suscribirte!');
    f.reset();
  });
});


/* ==========================================================
   5️⃣ FORMULARIO DE CONTACTO (contactos.html)
   ==========================================================
   Validaciones:
   - Campos requeridos
   - Correo válido y dominio permitido
   ========================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("contactForm");
  if (!contactForm) return;

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const correo = document.getElementById("email").value.trim();
    const mensaje = document.getElementById("comentario").value.trim();

    if (!nombre || !correo || !mensaje) {
      mostrarError("Por favor, completa todos los campos.");
      return;
    }

    if (!correoValido(correo) || !esDominioValido(correo)) {
      mostrarError("Correo inválido o dominio no permitido.");
      return;
    }

    alert("📨 Tu mensaje ha sido enviado correctamente. ¡Gracias por contactarnos!");
    limpiarFormulario(contactForm);
  });
});



/* ==========================================================
   6️⃣ FORMULARIO DE SUSCRIPCIÓN (footer de todos los HTML)
   ==========================================================
   Validación de correo y simulación de registro exitoso.
   ========================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const subscribeForm = document.getElementById("subscribeForm");
  if (!subscribeForm) return;

  subscribeForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const correo = document.getElementById("emailSub").value.trim();

    if (!correo) {
      mostrarError("Ingresa tu correo para suscribirte.");
      return;
    }

    if (!correoValido(correo) || !esDominioValido(correo)) {
      mostrarError("Correo inválido o dominio no permitido.");
      return;
    }

    alert("✅ ¡Gracias por suscribirte al boletín de HuertoHogar!");
    limpiarFormulario(subscribeForm);
  });
});


/* ==========================================================
   7️⃣ SECCIÓN DE PRODUCTOS (productos.html)
   ==========================================================
   - Muestra tarjetas de productos.
   - Botón "Añadir al carrito" funcional.
   - Actualiza el contador del carrito en el menú.
   - Usa solo variables en memoria (no localStorage).
   ========================================================== */
/* ==========================================================
   🌿 SECCIÓN DE PRODUCTOS (productos.html)
   ==========================================================
   - Muestra todas las tarjetas de productos reales.
   - Botón "Añadir al carrito" funcional en memoria.
   - Contador de carrito sincronizado durante la sesión.
   ========================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const productosContainer = document.getElementById("productos-container");
  const cartCount = document.getElementById("cartCount");

  // 🧺 Carrito temporal (solo mientras la página está abierta)
  let carrito = [];

  if (productosContainer) {
    const productos = [
      // 🥭 FRUTAS FRESCAS
      { id: "FR001", nombre: "Manzanas Fuji", precio: 1200, unidad: "/ kg", descripcion: "Manzanas crujientes y dulces, del Valle del Maule.", img: "../assets/image/manzanafuji.png" },
      { id: "FR002", nombre: "Naranjas Valencia", precio: 1000, unidad: "/ kg", descripcion: "Jugosas y ricas en vitamina C, ideales para jugos frescos.", img: "../assets/image/naranja.png" },
      { id: "FR003", nombre: "Plátanos Cavendish", precio: 800, unidad: "/ kg", descripcion: "Maduros y dulces, perfectos para un snack energético.", img: "../assets/image/platano.png" },

      // 🥬 VERDURAS ORGÁNICAS
      { id: "VR001", nombre: "Zanahorias Orgánicas", precio: 900, unidad: "/ kg", descripcion: "Cultivadas sin pesticidas, ideales para ensaladas o jugos.", img: "../assets/image/zanahoria.png" },
      { id: "VR002", nombre: "Espinacas Frescas", precio: 700, unidad: "/ bolsa 500g", descripcion: "Hojas verdes y tiernas, perfectas para batidos y ensaladas.", img: "../assets/image/espinaca.png" },
      { id: "VR003", nombre: "Pimientos Tricolores", precio: 1500, unidad: "/ kg", descripcion: "Rojos, amarillos y verdes, ideales para salteados y guisos.", img: "../assets/image/pimientos.png" },

      // 🍯 PRODUCTOS ORGÁNICOS
      { id: "PO001", nombre: "Miel Orgánica", precio: 5000, unidad: "/ frasco 500g", descripcion: "Miel pura y orgánica producida por apicultores locales.", img: "../assets/image/miel.png" },
      { id: "PO003", nombre: "Quinua Orgánica", precio: 4200, unidad: "/ bolsa 1kg", descripcion: "Grano andino rico en proteínas, ideal para una alimentación saludable.", img: "../assets/image/quinua.png" },

      // 🥛 PRODUCTOS LÁCTEOS
      { id: "LE001", nombre: "Leche HuertoHogar", precio: 1400, unidad: "/ litro", descripcion: "Leche fresca del campo, natural y sin conservantes.", img: "../assets/image/leche.png" }
    ];

    // 🧱 Renderizar productos
    productos.forEach((p) => {
      const card = document.createElement("div");
      card.className = "producto-card card shadow-sm";
      card.innerHTML = `
        <img src="${p.img}" alt="${p.nombre}" class="card-img-top" style="height:200px;object-fit:cover;border-radius:8px 8px 0 0;">
        <div class="card-body text-center">
          <h5 class="card-title" style="color:#2E8B57;font-family:'Playfair Display',serif;">${p.nombre}</h5>
          <p class="card-text">${p.descripcion}</p>
          <p class="fw-semibold text-success">$${p.precio.toLocaleString("es-CL")} ${p.unidad}</p>
          <p style="font-size:13px;color:#888;">${p.id}</p>
          <button class="btn btn-success btn-add" data-id="${p.id}">Añadir al carrito</button>
        </div>
      `;
      productosContainer.appendChild(card);
    });

    // 🧩 Evento: añadir al carrito
    productosContainer.addEventListener("click", (e) => {
      if (e.target.classList.contains("btn-add")) {
        const id = e.target.dataset.id;
        const prod = productos.find((p) => p.id === id);
        if (!prod) return;

        const existente = carrito.find((item) => item.id === id);
        if (existente) {
          existente.cantidad++;
        } else {
          carrito.push({ ...prod, cantidad: 1 });
        }

        actualizarContador();
        alert(`✅ ${prod.nombre} añadido al carrito.`);
      }
    });
  }

  // 🔢 Actualizar contador
  function actualizarContador() {
    const total = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    if (cartCount) cartCount.textContent = total;
  }

  // ✅ Exportar carrito a window para carrito.html
  window.getCarrito = () => carrito;
  window.setCarrito = (nuevo) => { carrito = nuevo; actualizarContador(); };
});


/* ==========================================================
   🛍️ CARRITO DE COMPRAS (carrito.html)
   ==========================================================
   - Lee el carrito de la memoria global (window.getCarrito()).
   - Permite modificar, eliminar o pagar.
   ========================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const carritoLista = document.getElementById("carrito-lista");
  const carritoTotal = document.getElementById("carritoTotal");
  const btnPagar = document.getElementById("btnPagar");
  if (!carritoLista) return;

  // 🔁 Obtener carrito temporal
  let carrito = window.getCarrito ? window.getCarrito() : [];

  // 🧮 Renderizar carrito
  function renderCarrito() {
    carritoLista.innerHTML = "";
    let total = 0;

    if (carrito.length === 0) {
      carritoLista.innerHTML = `<p class="text-muted">Tu carrito está vacío 🛒</p>`;
      carritoTotal.textContent = "$ 0";
      return;
    }

    carrito.forEach((item, index) => {
      total += item.precio * item.cantidad;

      const fila = document.createElement("div");
      fila.className = "carrito-item mb-3";
      fila.innerHTML = `
        <div class="d-flex align-items-center justify-content-between border p-2 rounded">
          <div class="d-flex align-items-center">
            <img src="${item.img}" alt="${item.nombre}" style="width:70px;height:70px;margin-right:10px;border-radius:8px;object-fit:contain;">
            <div>
              <strong>${item.nombre}</strong><br>
              <small>$${item.precio.toLocaleString("es-CL")} c/u</small>
            </div>
          </div>
          <div>
            <input type="number" min="1" value="${item.cantidad}" class="cantidad form-control d-inline-block" style="width:70px;text-align:center;">
            <button class="btn btn-link text-danger btn-eliminar" data-index="${index}">Eliminar</button>
          </div>
        </div>
      `;
      carritoLista.appendChild(fila);
    });

    carritoTotal.textContent = "$ " + total.toLocaleString("es-CL");
  }

  // 🧩 Cambiar cantidad
  carritoLista.addEventListener("change", (e) => {
    if (e.target.classList.contains("cantidad")) {
      const index = Array.from(carritoLista.children).indexOf(e.target.closest(".carrito-item"));
      carrito[index].cantidad = parseInt(e.target.value) || 1;
      renderCarrito();
      window.setCarrito(carrito);
    }
  });

  // ❌ Eliminar producto
  carritoLista.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-eliminar")) {
      const index = parseInt(e.target.dataset.index);
      const nombre = carrito[index].nombre;
      carrito.splice(index, 1);
      alert(`🗑️ ${nombre} eliminado del carrito.`);
      renderCarrito();
      window.setCarrito(carrito);
    }
  });

  // 💳 Pagar
  if (btnPagar) {
    btnPagar.addEventListener("click", () => {
      alert("💳 ¡Gracias por tu compra! 🥕");
      carrito = [];
      renderCarrito();
      window.setCarrito(carrito);
    });
  }

  renderCarrito();
});

/* ==========================================================
   🧺 CARRITO GLOBAL COMPARTIDO ENTRE PÁGINAS (sin localStorage)
   ========================================================== */
if (!window.carritoGlobal) window.carritoGlobal = [];

/* ==========================================================
   📦 FUNCIÓN PARA AÑADIR PRODUCTO DESDE DETALLE O LISTA
   ========================================================== */
window.agregarAlCarrito = function (producto) {
  const existente = window.carritoGlobal.find(p => p.id === producto.id);
  if (existente) {
    existente.cantidad++;
  } else {
    window.carritoGlobal.push({ ...producto, cantidad: 1 });
  }

  // actualizar contador si existe
  const cartCount = document.getElementById("cartCount");
  if (cartCount) {
    const total = window.carritoGlobal.reduce((acc, p) => acc + p.cantidad, 0);
    cartCount.textContent = total;
  }
};



/* ==========================================================
   1️⃣1️⃣ EFECTOS VISUALES ADICIONALES
   ==========================================================
   - Hover sobre productos
   - Pequeño loader inicial
   ========================================================== */

// Hover animado para productos
document.addEventListener("mouseover", (e) => {
  if (e.target.closest(".producto-card")) {
    e.target.closest(".producto-card").classList.add("hover");
  }
});
document.addEventListener("mouseout", (e) => {
  if (e.target.closest(".producto-card")) {
    e.target.closest(".producto-card").classList.remove("hover");
  }
});

// Loader inicial (opcional)
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  if (loader) {
    loader.classList.add("hide");
    setTimeout(() => loader.remove(), 600);
  }
});
/* ================================
   ADMIN PERFIL – LÓGICA
   ================================ */

/* ====== ADMIN THEME (negro + gris) ====== */
/* ==========================================================
   HuertoHogar – Admin Panel (Simulado con localStorage)
   Secciones: dashboard, productos, usuarios, pedidos, reportes,
              empleados, clientes, settings, profile, search, help
   ========================================================== */

/* ---------- Helpers localStorage ---------- */
const store = {
  get: (k, fallback) => {
    try { const v = JSON.parse(localStorage.getItem(k)); return v ?? fallback; }
    catch { return fallback; }
  },
  set: (k, v) => localStorage.setItem(k, JSON.stringify(v))
};

/* ---------- Seeds (solo si no existen) ---------- */
(function seedIfEmpty(){
  if(!localStorage.getItem('hh_usuarios')){
    const seed = [
      {fecha:'2024-06-01', run:'19011022K', nombre:'Juan Pérez',    correo:'juan@gmail.com',                rol:'Cliente'},
      {fecha:'2024-06-02', run:'17012345K', nombre:'María González',correo:'maria@duoc.cl',                 rol:'Vendedor'},
      {fecha:'2024-06-03', run:'15555111K', nombre:'Carlos Soto',   correo:'carlos@profesor.duoc.cl',       rol:'Administrador'},
      {fecha:'2024-06-04', run:'13333444K', nombre:'Ana López',     correo:'ana@gmail.com',                 rol:'Cliente'},
      {fecha:'2024-06-05', run:'14444222K', nombre:'Pedro Rojas',   correo:'pedro@duoc.cl',                 rol:'Cliente'},
      {fecha:'2024-06-06', run:'16666111K', nombre:'Sofía Díaz',    correo:'sofia@gmail.com',               rol:'Cliente'},
      {fecha:'2024-06-07', run:'17777222K', nombre:'Luis Herrera',  correo:'luis@profesor.duoc.cl',         rol:'Administrador'},
      {fecha:'2024-06-08', run:'18888333K', nombre:'Carla Muñoz',   correo:'carla@gmail.com',               rol:'Cliente'},
      {fecha:'2024-06-09', run:'19999444K', nombre:'Diego Torres',  correo:'diego@gmail.com',               rol:'Cliente'},
      {fecha:'2024-06-10',run:'12222333K',  nombre:'Valentina Cruz',correo:'valentina@gmail.com',           rol:'Cliente'},
      {fecha:'2024-06-11',run:'13333455K',  nombre:'Gonzalo Vega',  correo:'gonzalo@duoc.cl',               rol:'Vendedor'},
      {fecha:'2024-06-12',run:'14444566K',  nombre:'Daniela Silva', correo:'daniela@gmail.com',             rol:'Cliente'},
      {fecha:'2024-06-13',run:'15555677K',  nombre:'Ignacio Reyes', correo:'ignacio@gmail.com',             rol:'Cliente'},
      {fecha:'2024-06-14',run:'16666788K',  nombre:'Camila Pardo',  correo:'camila@gmail.com',              rol:'Cliente'},
      {fecha:'2024-06-15',run:'17777899K',  nombre:'Matías Fuentes',correo:'matias@gmail.com',              rol:'Cliente'},
      {fecha:'2024-06-16',run:'18888900K',  nombre:'Isabel Campos', correo:'isabel@duoc.cl',                rol:'Vendedor'},
      {fecha:'2024-06-17',run:'19999001K',  nombre:'Rodrigo Álvarez',correo:'rodrigo@gmail.com',            rol:'Cliente'},
      {fecha:'2024-06-18',run:'12222111K',  nombre:'Fernanda Mora', correo:'fernanda@gmail.com',            rol:'Cliente'},
      {fecha:'2024-06-19',run:'13333222K',  nombre:'Tomás Morales', correo:'tomas@gmail.com',               rol:'Cliente'},
      {fecha:'2024-06-20',run:'14444333K',  nombre:'Karla Herrera', correo:'karla@gmail.com',               rol:'Cliente'}
    ];
    store.set('hh_usuarios', seed);
  }

  if(!localStorage.getItem('hh_pedidos')){
    const pedidos = [
      {id:'HH-001', cliente:'Juan Pérez', fecha:'2024-06-20', estado:'En preparación', total:5700},
      {id:'HH-002', cliente:'María González', fecha:'2024-06-20', estado:'Entregado', total:12500},
      {id:'HH-003', cliente:'Carlos Soto', fecha:'2024-06-21', estado:'Cancelado', total:8900},
      {id:'HH-004', cliente:'Ana López', fecha:'2024-06-21', estado:'Entregado', total:4300}
    ];
    store.set('hh_pedidos', pedidos);
  }

  if(!localStorage.getItem('hh_empleados')){
    store.set('hh_empleados', [
      {nombre:'Ricardo Palma', cargo:'Bodeguero', correo:'ricardo@huertohogar.cl'},
      {nombre:'Lorena Sáez', cargo:'Vendedora', correo:'lorena@huertohogar.cl'},
      {nombre:'Javier Ruiz', cargo:'Repartidor', correo:'javier@huertohogar.cl'}
    ]);
  }

  if(!localStorage.getItem('hh_settings')){
    store.set('hh_settings', {nombre:'HuertoHogar', correo:'contacto@huertohogar.cl', direccion:'Santiago, Chile', logo:''});
  }

  if(!localStorage.getItem('hh_admin')){
    store.set('hh_admin', {nombre:'Admin HuertoHogar', correo:'admin@huertohogar.cl', rol:'Administrador'});
  }

  if(!localStorage.getItem('hh_notifs')){
    store.set('hh_notifs', [
      {id: Date.now(), texto:'Sistema iniciado', fecha: new Date().toLocaleString()}
    ]);
  }
})();

/* ---------- Estado global ---------- */
let usuarios = store.get('hh_usuarios', []);
let pedidos  = store.get('hh_pedidos', []);
let empleados= store.get('hh_empleados', []);
let settings = store.get('hh_settings', {});
let admin    = store.get('hh_admin', {});
let notifs   = store.get('hh_notifs', []);

const kpi = {
  productos: 7, // placeholder
  get usuarios(){ return usuarios.length; },
  get pedidos(){ return pedidos.filter(p=>p.estado==='En preparación').length; }
};

/* ---------- Util ---------- */
const $ = (sel, ctx=document) => ctx.querySelector(sel);
const $$= (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));
const hhTitle = $('#hh-title');

function pushNotif(texto){
  notifs.unshift({id:Date.now(), texto, fecha:new Date().toLocaleString()});
  store.set('hh_notifs', notifs);
  paintNotifs();
}

/* ==========================================================
   NAV
   ========================================================== */
const links = $$('.hh-link[data-section]');
const sections = $$('.hh-section');

links.forEach(btn=>{
  btn.addEventListener('click', ()=>{
    links.forEach(x=>x.classList.remove('active')); btn.classList.add('active');
    const id = btn.dataset.section;
    sections.forEach(s=>s.classList.remove('active'));
    $('#'+id)?.classList.add('active');
    hhTitle.textContent = btn.querySelector('span')?.textContent || 'Admin';
    // Al entrar a cada sección podemos refrescar vistas
    if(id==='reportes') renderReportes();
  });
});

/* ==========================================================
   DASHBOARD
   ========================================================== */
function pintarKPI(){
  $('#kpiProductos').textContent = kpi.productos;
  $('#kpiUsuarios').textContent  = kpi.usuarios;
  $('#kpiPedidos').textContent   = kpi.pedidos;
}

let chartVentas, chartPedidos, chartUsuarios, chartVentasLine;
function renderChartsDashboard(){
  const ventasMes = [3,4,5,6,8,10,7,9,6,5,4,8].map(n=>n*10000);
  const pedidosMes = [20,22,30,28,35,40,38,36,30,26,22,34];
  const labels = ['E','F','M','A','M','J','J','A','S','O','N','D'];

  if(chartVentas) chartVentas.destroy();
  if(chartPedidos) chartPedidos.destroy();

  chartVentas = new Chart($('#chartVentas'), {
    type:'bar',
    data:{labels, datasets:[{label:'Ventas (CLP)', data:ventasMes}]},
    options:{plugins:{legend:{display:false}}, scales:{y:{beginAtZero:true}}}
  });

  chartPedidos = new Chart($('#chartPedidos'), {
    type:'line',
    data:{labels, datasets:[{label:'Pedidos', data:pedidosMes}]},
    options:{plugins:{legend:{display:false}}, tension:.3, scales:{y:{beginAtZero:true}}}
  });
}

/* ==========================================================
   USUARIOS + Paginación + Form
   ========================================================== */
const tbodyUsuarios = $('#tablaUsuarios tbody');
const pageNumbers = $('#hh-page-numbers');
const pageButtons = $$('.hh-page');
const statePag = { page:1, perPage:10, total: usuarios.length };

function renderUsuarios(){
  statePag.total = usuarios.length;
  const start = (statePag.page-1)*statePag.perPage;
  const items = usuarios.slice(start, start+statePag.perPage);

  tbodyUsuarios.innerHTML = items.map(u=>`
    <tr>
      <td>${u.fecha}</td><td>${u.run}</td><td>${u.nombre}</td><td>${u.correo}</td><td>${u.rol}</td>
    </tr>
  `).join('');

  const totalPages = Math.max(1, Math.ceil(statePag.total/statePag.perPage));
  pageNumbers.innerHTML = '';
  for(let i=1;i<=totalPages;i++){
    const b = document.createElement('button');
    b.textContent = i; if(i===statePag.page) b.classList.add('active');
    b.addEventListener('click',()=>{statePag.page=i; renderUsuarios();});
    pageNumbers.appendChild(b);
  }
}

pageButtons.forEach(b=>{
  b.addEventListener('click', ()=>{
    const total = Math.max(1, Math.ceil(statePag.total/statePag.perPage));
    const t=b.dataset.page;
    if(t==='first') statePag.page=1;
    if(t==='prev')  statePag.page=Math.max(1,statePag.page-1);
    if(t==='next')  statePag.page=Math.min(total,statePag.page+1);
    if(t==='last')  statePag.page=total;
    renderUsuarios();
  });
});

$('#btnNuevoUsuario').addEventListener('click', ()=>{
  $('#panelNuevoUsuario').classList.toggle('d-none');
  $('#panelNuevoUsuario').scrollIntoView({behavior:'smooth', block:'start'});
});

/* Regiones coherentes */
const regionesComunas = {
  "Región Metropolitana de Santiago": ["La Florida","Maipú","Las Condes","Ñuñoa","Santiago Centro","Puente Alto"],
  "Región del Biobío": ["Concepción","Laja","Los Ángeles","Talcahuano","Chiguayante"],
  "Región de Valparaíso": ["Viña del Mar","Valparaíso","Quilpué","San Felipe","Quillota"],
  "Región de Los Lagos": ["Puerto Montt","Osorno","Llanquihue","Castro"],
  "Región de La Araucanía": ["Temuco","Padre Las Casas","Villarrica","Pucón"]
};
const selRegion = $('#uRegion'), selComuna = $('#uComuna');
Object.keys(regionesComunas).forEach(r=>{ const op=document.createElement('option'); op.value=r; op.textContent=r; selRegion.appendChild(op); });
selRegion.addEventListener('change', ()=>{
  selComuna.innerHTML = '<option value="">— Seleccione comuna —</option>';
  const list = regionesComunas[selRegion.value] || [];
  list.forEach(c=>{ const op=document.createElement('option'); op.value=c; op.textContent=c; selComuna.appendChild(op); });
  selComuna.disabled = list.length===0;
});

/* Validaciones */
const dominiosPermitidos = /@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i;
const correoOK = (c)=>dominiosPermitidos.test(c);
function runValido(run){
  let clean = run.replace(/[^0-9kK]/g,'').toUpperCase();
  if(clean.length<7||clean.length>9) return false;
  const cuerpo=clean.slice(0,-1), dv=clean.slice(-1);
  let suma=0, mult=2;
  for(let i=cuerpo.length-1;i>=0;i--){ suma += parseInt(cuerpo[i],10)*mult; mult = mult===7 ? 2 : mult+1; }
  const r = 11 - (suma%11);
  const dvEsperado = r===11?'0':(r===10?'K':String(r));
  return dvEsperado===dv;
}

$('#formUsuario').addEventListener('submit', (e)=>{
  e.preventDefault();
  const nombre=$('#uNombre').value.trim();
  const correo=$('#uCorreo').value.trim();
  const correo2=$('#uCorreo2').value.trim();
  const pass=$('#uPass').value.trim();
  const pass2=$('#uPass2').value.trim();
  const run=$('#uRun').value.trim();
  const region=selRegion.value, comuna=selComuna.value;
  const dir=$('#uDireccion').value.trim();

  if(!nombre) return alert('Nombre requerido');
  if(!correoOK(correo)) return alert('Solo correos @duoc.cl, @profesor.duoc.cl o @gmail.com');
  if(correo!==correo2) return alert('El correo y su confirmación no coinciden');
  if(pass.length<4||pass.length>10) return alert('La contraseña debe tener entre 4 y 10 caracteres');
  if(pass!==pass2) return alert('La contraseña y su confirmación no coinciden');
  if(!runValido(run)) return alert('RUN inválido');
  if(!region) return alert('Seleccione una región');
  if(!comuna) return alert('Seleccione una comuna');
  if(!dir) return alert('Dirección requerida');

  const nuevo={fecha:new Date().toISOString().slice(0,10), run, nombre, correo, rol:'Cliente'};
  usuarios.unshift(nuevo);
  store.set('hh_usuarios', usuarios);
  renderUsuarios(); pintarKPI();
  e.target.reset(); selComuna.disabled=true;
  pushNotif(`Nuevo usuario registrado: ${nombre}`);
  alert('Usuario registrado correctamente.');
});

/* ==========================================================
   PEDIDOS (lista + filtro + nuevo)
   ========================================================== */
const tbodyPedidos = $('#tablaPedidos tbody');
const filtroEstado = $('#filtroEstado');
function badgeEstado(estado){
  if(estado==='Entregado') return `<span class="badge-estado badge-ok">Entregado</span>`;
  if(estado==='Cancelado') return `<span class="badge-estado badge-cancel">Cancelado</span>`;
  return `<span class="badge-estado badge-prep">En preparación</span>`;
}
function renderPedidos(){
  const est = filtroEstado.value;
  const data = est==='TODOS' ? pedidos : pedidos.filter(p=>p.estado===est);
  tbodyPedidos.innerHTML = data.map(p=>`
    <tr><td>${p.id}</td><td>${p.cliente}</td><td>${p.fecha}</td><td>${badgeEstado(p.estado)}</td><td>$${p.total.toLocaleString('es-CL')}</td></tr>
  `).join('');
}
filtroEstado.addEventListener('change', renderPedidos);
$('#btnNuevoPedido').addEventListener('click', ()=>{
  const id='HH-'+String(Math.floor(Math.random()*900+100));
  const cli=['Juan Pérez','María González','Carlos Soto','Ana López','Pedro Rojas'][Math.floor(Math.random()*5)];
  const est=['En preparación','Entregado','Cancelado'][Math.floor(Math.random()*3)];
  const total=Math.floor(Math.random()*40000)+3000;
  pedidos.unshift({id, cliente:cli, fecha:new Date().toISOString().slice(0,10), estado:est, total});
  store.set('hh_pedidos', pedidos);
  renderPedidos(); pintarKPI();
  pushNotif(`Nuevo pedido ${id} (${est})`);
});

/* ==========================================================
   EMPLEADOS (tabla + modal)
   ========================================================== */
const tbodyEmpl = $('#tablaEmpleados tbody');
function renderEmpleados(){
  tbodyEmpl.innerHTML = empleados.map(e=>`<tr><td>${e.nombre}</td><td>${e.cargo}</td><td>${e.correo}</td></tr>`).join('');
}
$('#formEmpleado').addEventListener('submit', (e)=>{
  e.preventDefault();
  const nombre=$('#eNombre').value.trim(), cargo=$('#eCargo').value.trim(), correo=$('#eCorreo').value.trim();
  if(!nombre||!cargo||!correo) return;
  empleados.push({nombre,cargo,correo});
  store.set('hh_empleados', empleados);
  renderEmpleados();
  pushNotif(`Nuevo empleado: ${nombre}`);
  bootstrap.Modal.getInstance($('#modalEmpleado')).hide();
  e.target.reset();
});

/* ==========================================================
   SETTINGS
   ========================================================== */
$('#formSettings').addEventListener('submit', (e)=>{
  e.preventDefault();
  settings.nombre = $('#sNombre').value.trim();
  settings.correo = $('#sCorreo').value.trim();
  settings.direccion = $('#sDireccion').value.trim();
  settings.logo = $('#sLogo').value.trim();
  store.set('hh_settings', settings);
  pushNotif('Configuración actualizada');
  alert('Configuración guardada');
});

/* ==========================================================
   PROFILE + PASS
   ========================================================== */
function renderProfile(){
  $('#pNombre').textContent = admin.nombre;
  $('#pCorreo').textContent = admin.correo;
  $('#pRol').textContent    = admin.rol;
}
$('#formPass').addEventListener('submit', (e)=>{
  e.preventDefault();
  const p1=$('#nuevaPass').value, p2=$('#nuevaPass2').value;
  if(p1.length<6) return alert('La nueva contraseña debe tener al menos 6 caracteres');
  if(p1!==p2) return alert('Las contraseñas no coinciden');
  pushNotif('Contraseña de administrador actualizada');
  bootstrap.Modal.getInstance($('#modalPass')).hide();
  e.target.reset();
  alert('Contraseña actualizada');
});

/* ==========================================================
   REPORTES (Chart.js + KPIs)
   ========================================================== */
function renderReportes(){
  const ventasMes = pedidos.filter(p=>p.estado==='Entregado').reduce((acc,p)=>acc+p.total,0);
  const ok = pedidos.filter(p=>p.estado==='Entregado').length;
  const nuevos = Math.max(0, usuarios.filter(u=> new Date(u.fecha) >= new Date(new Date().getFullYear(), new Date().getMonth(),1)).length);

  $('#repVentasMes').textContent = '$'+ventasMes.toLocaleString('es-CL');
  $('#repPedidosOk').textContent = ok;
  $('#repUsuariosNuevos').textContent = nuevos;

  // Usuarios por mes (fake con fechas de la seed)
  const meses = ['E','F','M','A','M','J','J','A','S','O','N','D'];
  const serieUsuarios = new Array(12).fill(0);
  usuarios.forEach(u=>{
    const m = new Date(u.fecha+'T00:00:00').getMonth();
    if(!isNaN(m)) serieUsuarios[m] += 1;
  });

  if(chartUsuarios) chartUsuarios.destroy();
  if(chartVentasLine) chartVentasLine.destroy();

  chartUsuarios = new Chart($('#chartUsuarios'),{type:'bar',data:{labels:meses,datasets:[{label:'Usuarios',data:serieUsuarios}]} ,options:{plugins:{legend:{display:false}},scales:{y:{beginAtZero:true}}}});
  chartVentasLine = new Chart($('#chartVentasLine'),{type:'line',data:{labels:meses,datasets:[{label:'Ventas (CLP)',data:serieUsuarios.map(n=>n*12000)}]},options:{plugins:{legend:{display:false}},tension:.3,scales:{y:{beginAtZero:true}}}});
}

/* ==========================================================
   NOTIFICACIONES (dropdown con badge)
   ========================================================== */
function paintNotifs(){
  const ul = $('#listNotifs'), badge = $('#badgeNotifs');
  ul.innerHTML = notifs.length
    ? notifs.map(n=>`<li class="hh-notif-item"><span class="dot"></span><div><div>${n.texto}</div><small class="text-muted">${n.fecha}</small></div>
        <button class="btn btn-sm btn-link ms-auto" data-id="${n.id}">Quitar</button></li>`).join('') +
      `<li class="hh-notif-actions"><button id="btnClearNotifs" class="btn btn-sm btn-outline-secondary">Limpiar todo</button></li>`
    : `<li class="px-3 py-2 text-muted">Sin notificaciones</li>`;

  badge.textContent = notifs.length;
  badge.classList.toggle('d-none', notifs.length===0);

  // acciones
  $$('#listNotifs [data-id]').forEach(b=>{
    b.addEventListener('click', ()=>{ const id=Number(b.dataset.id); notifs = notifs.filter(x=>x.id!==id); store.set('hh_notifs', notifs); paintNotifs(); });
  });
  const clearBtn = $('#btnClearNotifs');
  if(clearBtn) clearBtn.addEventListener('click', ()=>{ notifs=[]; store.set('hh_notifs', notifs); paintNotifs(); });
}

/* ==========================================================
   INIT
   ========================================================== */
document.addEventListener('DOMContentLoaded', ()=>{
  // Settings → precargar
  $('#sNombre').value = settings.nombre || '';
  $('#sCorreo').value = settings.correo || '';
  $('#sDireccion').value = settings.direccion || '';
  $('#sLogo').value = settings.logo || '';

  renderProfile();
  pintarKPI();
  renderChartsDashboard();
  renderUsuarios();
  renderPedidos();
  renderEmpleados();
  paintNotifs();
});
/* ==========================================================
   SETTINGS (Cerrar sesión y cambio de contraseña)
   ========================================================== */
function renderSettings() {
  $('#confNombre').textContent = admin.nombre;
  $('#confCorreo').textContent = admin.correo;
  $('#confRol').textContent = admin.rol;
}

$('#formSettingsPass').addEventListener('submit', (e) => {
  e.preventDefault();
  const p1 = $('#confPass1').value.trim();
  const p2 = $('#confPass2').value.trim();
  if (p1.length < 6) return alert('La nueva contraseña debe tener al menos 6 caracteres');
  if (p1 !== p2) return alert('Las contraseñas no coinciden');
  pushNotif('Contraseña de administrador actualizada');
  alert('✅ Contraseña actualizada con éxito');
  e.target.reset();
});

$('#btnCerrarSesion').addEventListener('click', () => {
  // 🔒 Limpia sesión activa del administrador
  localStorage.removeItem('usuarioActivo');

  // 🧹 Opcional: Limpia variables relacionadas si lo deseas
  // localStorage.removeItem('hh_notifs');

  pushNotif('Sesión cerrada');
  alert('👋 Sesión cerrada correctamente. Volviendo al inicio...');
  window.location.href = '../page/index.html'; // Redirige al inicio público
});

