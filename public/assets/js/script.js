// ======================================================
// script.js → cosas globales de todas las páginas
// header, loader, fade, ocultar login/registro si hay sesión
// ======================================================
import { Auth } from './auth.js';
import { syncBadge } from './cart.js';

export const $  = (s,ctx=document)=>ctx.querySelector(s);
export const $$ = (s,ctx=document)=>Array.from(ctx.querySelectorAll(s));
export const clp = (n)=> Number(n||0).toLocaleString('es-CL',{style:'currency',currency:'CLP',maximumFractionDigits:0});

// loader
window.addEventListener('load', () => {
  const loader = $('#loader');
  if (loader) {
    loader.classList.add('hide');
    setTimeout(()=>loader.remove(),500);
  }
});

// fade-up
document.addEventListener('DOMContentLoaded', () => {
  const fades = $$('.fade-up');
  if (fades.length) {
    const obs = new IntersectionObserver((entries)=>{
      entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('show');
      });
    }, { threshold:0.2 });
    fades.forEach(el=>obs.observe(el));
  }
});

// scroll suave
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  const t = $(a.getAttribute('href'));
  if (t) {
    e.preventDefault();
    t.scrollIntoView({behavior:'smooth',block:'start'});
  }
});

// header según login
function applyAuthUI() {
  const user = Auth.current();
  const btnLogin = $('#btnLogin');
  const btnRegister = $('#btnRegister');
  const btnPerfil = $('#btnPerfil');
  const btnAdmin  = $('#btnAdmin');

  if (user) {
    btnLogin && (btnLogin.style.display = 'none');
    btnRegister && (btnRegister.style.display = 'none');
    btnPerfil && (btnPerfil.style.display = '');
    if (btnPerfil) btnPerfil.textContent = user.nombre || 'Mi perfil';

    if (btnAdmin) {
      btnAdmin.style.display = user.rol === 'admin' ? '' : 'none';
    }
  } else {
    btnLogin && (btnLogin.style.display = '');
    btnRegister && (btnRegister.style.display = '');
    btnPerfil && (btnPerfil.style.display = 'none');
    btnAdmin && (btnAdmin.style.display = 'none');
  }
}

// escuchar eventos de auth
window.addEventListener('auth:login', applyAuthUI);
window.addEventListener('auth:logout', applyAuthUI);

// init
document.addEventListener('DOMContentLoaded', () => {
  applyAuthUI();
  syncBadge();

  // botón "comprar ahora" que tengas en varias páginas
  const btnComprar = $('#btnComprarAhora');
  if (btnComprar) {
    btnComprar.addEventListener('click', () => {
      window.location.href = './checkout.html';
    });
  }
});

// animar cosas del blog
document.addEventListener('DOMContentLoaded', () => {
  const fades = document.querySelectorAll('.fade-up');
  fades.forEach((el, i) => {
    setTimeout(() => el.classList.add('show'), 200 * i);
  });
});

// assets/js/productos.js
import { PRODUCTOS } from "./data.js";

// por si usas el carrito global
import { Cart } from "./cart.js"; // si no lo tienes, quita esta línea

const grid = document.getElementById("gridProductos");
const badge = document.getElementById("cartBadge");

function formatCLP(n) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(n);
}

function renderProductos(lista) {
  if (!grid) return;
  grid.innerHTML = "";

  lista.forEach((p) => {
    const card = document.createElement("article");
    card.className = "hh-product-card";
    card.innerHTML = `
      <button class="hh-fav-btn" data-id="${p.id}" title="Favorito">♥</button>
      <img src="${p.img}" alt="${p.nombre}" class="hh-product-img" loading="lazy">
      <h3 class="hh-product-name">${p.nombre}</h3>
      <p class="hh-product-meta">${p.categoria || ""}</p>
      <p class="hh-product-price">${formatCLP(p.precio)}</p>
      <button class="hh-product-btn" data-add="${p.id}">Añadir</button>
    `;
    // clic en toda la card → ir a detalle
    card.addEventListener("click", (e) => {
      // si hicieron clic en el botón "Añadir", no redirigimos
      if (e.target.matches("[data-add]")) return;
      if (e.target.matches(".hh-fav-btn")) return;
      window.location.href = `./detalleProducto.html?id=${p.id}`;
    });
    grid.appendChild(card);
  });
}

function syncBadge() {
  if (!badge) return;
  try {
    const cart = JSON.parse(localStorage.getItem("hh_cart") || "[]");
    const total = cart.reduce((acc, it) => acc + it.cantidad, 0);
    badge.textContent = total;
  } catch {
    badge.textContent = "0";
  }
}

// escuchar clicks en “Añadir”
grid?.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-add]");
  if (!btn) return;
  const id = btn.dataset.add;
  const prod = PRODUCTOS.find((x) => x.id === id);
  if (!prod) return;

  // si tienes tu cart.js, úsalo
  if (typeof Cart !== "undefined") {
    Cart.add(prod, 1);
  } else {
    // fallback simple
    const cart = JSON.parse(localStorage.getItem("hh_cart") || "[]");
    const i = cart.findIndex((x) => x.id === id);
    if (i >= 0) cart[i].cantidad += 1;
    else
      cart.push({
        id: prod.id,
        nombre: prod.nombre,
        precio: prod.precio,
        img: prod.img,
        cantidad: 1,
      });
    localStorage.setItem("hh_cart", JSON.stringify(cart));
  }
  syncBadge();
});

// inicial
renderProductos(PRODUCTOS);
syncBadge();
