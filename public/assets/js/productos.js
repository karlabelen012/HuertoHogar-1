// ==========================================================
// 🥦 HUERTO HOGAR - PRODUCTOS (Firebase + Carrito)
// ==========================================================

// 🔹 Importar Firestore y helpers
import { db } from "./firebase.js";
import {
  getDocs,
  collection
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

import { addToCart, syncBadge } from "./cart.js";

const grid = document.getElementById("gridProductos");
const clp = n =>
  Number(n || 0).toLocaleString("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0
  });

// ----------------------------------------------------------
// 🔹 Cargar productos desde Firestore
// ----------------------------------------------------------

async function cargarProductos() {
  if (!grid) return;

  try {
    // ✅ Asegúrate que db es un Firestore válido
    console.log("Firestore conectado:", db);

    // ✅ Esta es la línea importante
    const snap = await getDocs(collection(db, "productos"));

    const productos = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    renderProductos(productos);
    syncBadge();
  } catch (err) {
    console.error("❌ Error al cargar productos:", err);
    grid.innerHTML = `<div class="alert alert-danger">Error al cargar productos.</div>`;
  }
}

// ----------------------------------------------------------
// 🔹 Mostrar los productos en la página
// ----------------------------------------------------------
function renderProductos(lista) {
  if (!grid) return;
  grid.innerHTML = lista.map(p => {
    const desc = Number(p.descuento || 0);
    const precioFinal = desc ? p.precio * (1 - desc) : p.precio;
    const badge = desc ? `<span class="badge bg-success">-${desc * 100}%</span>` : "";

    return `
      <div class="col-12 col-sm-6 col-lg-3 mb-3">
        <div class="card h-100 shadow-sm">
          <img src="${p.img || "../assets/img/placeholder.jpg"}" class="card-img-top" alt="${p.nombre}" style="height:200px;object-fit:cover;">
          <div class="card-body">
            <h5 class="card-title d-flex justify-content-between align-items-center">
              ${p.nombre} ${badge}
            </h5>
            <p class="text-muted small">${p.categoria || ""}</p>
            <p class="fw-bold">${clp(precioFinal)}</p>
            <div class="d-grid gap-2">
              <button class="btn btn-outline-success btn-sm" data-id="${p.id}" data-action="detalle">Ver detalle</button>
              <button class="btn btn-success btn-sm" data-id="${p.id}" data-action="agregar">Agregar al carrito</button>
            </div>
          </div>
        </div>
      </div>`;
  }).join("");
}

// ----------------------------------------------------------
// 🔹 Escuchar eventos de botones
// ----------------------------------------------------------
grid?.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-id]");
  if (!btn) return;

  const id = btn.dataset.id;
  const action = btn.dataset.action;

  if (action === "detalle") {
    window.location.href = `./detalleProducto.html?id=${id}`;
  } else if (action === "agregar") {
    addToCart(id);
  }
});

cargarProductos();
