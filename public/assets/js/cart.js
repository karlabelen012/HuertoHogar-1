// ==========================================================
// 🛒 HUERTO HOGAR - CART.JS (LOCALSTORAGE + OFERTAS)
// ==========================================================
import { db } from "./firebase.js";

import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
import { validarCodigo } from "./oferta.js";

const CART_KEY = "hh_cart";

const clp = (n) =>
  Number(n || 0).toLocaleString("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  });

function readCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items || []));
  window.dispatchEvent(new Event("storage"));
}

// ----------------------------------------------------------
// 🔹 Export: actualizar badge de carrito
// ----------------------------------------------------------
export function syncBadge() {
  const items = readCart();
  const total = items.reduce(
    (acc, it) =>
      acc +
      (Number(it.precioFinal ?? it.precio) || 0) * Number(it.cantidad || 1),
    0
  );

  const badge =
    document.querySelector("[data-cart-total]") ||
    document.getElementById("cartTotal");
  if (badge) {
    badge.textContent = clp(total);
  }
}

// ----------------------------------------------------------
// 🔹 Export: agregar producto al carrito
// ----------------------------------------------------------
export async function addToCart(idProducto) {
  try {
    const ref = doc(db, "productos", idProducto);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      alert("Producto no encontrado");
      return;
    }

    const p = snap.data();
    const desc = Number(p.porcentajeDescuento || p.descuento || 0);
    const precioFinal = desc ? p.precio * (1 - desc) : p.precio;

    const cart = readCart();
    const idx = cart.findIndex((i) => i.id === idProducto);

    if (idx >= 0) {
      cart[idx].cantidad += 1;
    } else {
      cart.push({
        id: idProducto,
        nombre: p.nombre,
        precio: p.precio,
        precioFinal,
        imagen: p.imagen || p.img || "",
        cantidad: 1,
      });
    }

    writeCart(cart);
    syncBadge();
    alert(`✅ ${p.nombre} agregado al carrito`);
  } catch (err) {
    console.error("Error agregando al carrito:", err);
    alert("No se pudo agregar al carrito.");
  }
}

// ----------------------------------------------------------
// 🧾 Render de carrito.html
// ----------------------------------------------------------
function renderCartPage() {
  const tbody =
    document.getElementById("tbodyCarrito") ||
    document.querySelector("#tablaCarrito tbody");
  const totalEl =
    document.getElementById("totalCarrito") ||
    document.querySelector("[data-total-carrito]");

  if (!tbody || !totalEl) {
    // No estamos en carrito.html
    return;
  }

  const items = readCart();
  if (!items.length) {
    tbody.innerHTML =
      '<tr><td colspan="5" class="text-center">Tu carrito está vacío.</td></tr>';
    totalEl.textContent = clp(0);
    return;
  }

  let total = 0;
  tbody.innerHTML = items
    .map((i, idx) => {
      const subtotal = Number(i.precioFinal ?? i.precio) * i.cantidad;
      total += subtotal;
      return `
      <tr data-index="${idx}">
        <td><img src="${i.imagen}" alt="${i.nombre}" style="width:60px;height:60px;object-fit:cover;"></td>
        <td>${i.nombre}</td>
        <td>${clp(i.precioFinal ?? i.precio)}</td>
        <td>
          <input type="number" min="1" value="${i.cantidad}" class="form-control form-control-sm qty-input">
        </td>
        <td class="subtotal">${clp(subtotal)}</td>
        <td>
          <button class="btn btn-sm btn-outline-danger btn-remove">✕</button>
        </td>
      </tr>`;
    })
    .join("");

  totalEl.textContent = clp(total);
  syncBadge();
}

// ----------------------------------------------------------
// 🔹 Eventos en carrito (cambiar cantidad / eliminar)
// ----------------------------------------------------------
function attachCartEvents() {
  const tbody =
    document.getElementById("tbodyCarrito") ||
    document.querySelector("#tablaCarrito tbody");
  const totalEl =
    document.getElementById("totalCarrito") ||
    document.querySelector("[data-total-carrito]");
  if (!tbody || !totalEl) return;

  tbody.addEventListener("input", (e) => {
    const row = e.target.closest("tr[data-index]");
    if (!row) return;

    const idx = Number(row.dataset.index);
    const cart = readCart();
    if (!cart[idx]) return;

    if (e.target.classList.contains("qty-input")) {
      const nuevaCant = Math.max(1, Number(e.target.value || 1));
      cart[idx].cantidad = nuevaCant;
      writeCart(cart);
      // Recalcular subtotal y total
      const precio = Number(cart[idx].precioFinal ?? cart[idx].precio);
      const subtotal = precio * nuevaCant;
      row.querySelector(".subtotal").textContent = clp(subtotal);

      const total = cart.reduce(
        (acc, it) =>
          acc +
          (Number(it.precioFinal ?? it.precio) || 0) *
            Number(it.cantidad || 1),
        0
      );
      totalEl.textContent = clp(total);
      syncBadge();
    }
  });

  tbody.addEventListener("click", (e) => {
    const row = e.target.closest("tr[data-index]");
    if (!row) return;

    if (e.target.classList.contains("btn-remove")) {
      const idx = Number(row.dataset.index);
      const cart = readCart();
      cart.splice(idx, 1);
      writeCart(cart);
      renderCartPage();
    }
  });

  // Botón Vaciar carrito
  const btnVaciar = document.getElementById("btnVaciarCarrito");
  if (btnVaciar) {
    btnVaciar.addEventListener("click", () => {
      if (!window.confirm("¿Vaciar carrito?")) return;

      writeCart([]);
      renderCartPage();
    });
  }

  // Botón Aplicar código de descuento en carrito
  const inputCodigo =
    document.getElementById("codigoCarrito") ||
    document.getElementById("codigoDescuento");
  const btnCodigo =
    document.getElementById("btnCodigoCarrito") ||
    document.getElementById("btnAplicarCodigo");

  if (btnCodigo && inputCodigo) {
    btnCodigo.addEventListener("click", async () => {
      const code = inputCodigo.value.trim();
      if (!code) return alert("Ingresa un código");

      const desc = await validarCodigo(code); // porcentaje (0.1 = 10%)
      if (!desc) return alert("Código inválido o inactivo");

      const cart = readCart();
      const totalOriginal = cart.reduce(
        (acc, it) =>
          acc +
          (Number(it.precioFinal ?? it.precio) || 0) *
            Number(it.cantidad || 1),
        0
      );
      const nuevoTotal = totalOriginal * (1 - desc);
      totalEl.textContent = clp(nuevoTotal);
      alert(`🎉 Descuento aplicado de ${desc * 100}%`);
    });
  }
}

// ----------------------------------------------------------
// 🔚 Inicialización
// ----------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  renderCartPage();
  attachCartEvents();
  syncBadge();
});
