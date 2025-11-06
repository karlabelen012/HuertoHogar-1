// ==========================================================
// 🌿 HUERTO HOGAR - CHECKOUT COMPLETO (sin scripts en HTML)
// ==========================================================

import { db } from "./firebase.js";  // 👈 solo usamos db

import {
  addDoc,
  collection,
  updateDoc,
  doc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";

const $ = (s) => document.querySelector(s);
// ❗ AQUÍ VIENE EL CAMBIO IMPORTANTE DEL CARRITO:
const CART_KEY = "hh_cart";   // 👈 antes tenías "carrito", por eso estaba vacío

// -------------------- MONEDA --------------------
const clp = (n) =>
  Number(n || 0).toLocaleString("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  });

// -------------------- CARRITO --------------------
function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}
function clearCart() {
  localStorage.removeItem(CART_KEY);
}

// -------------------- RENDER TABLA --------------------
function renderCheckout() {
  const tbody = $("#tbodyCarrito");
  const totalTxt = $("#txtTotal");
  const btnPagar = $("#btnPagar");
  const cart = getCart();

  if (!tbody || !totalTxt || !btnPagar) return;

  if (!cart.length) {
    tbody.innerHTML =
      "<tr><td colspan='6' class='text-center text-muted py-3'>No hay productos en el carrito 🛒</td></tr>";
    totalTxt.textContent = "Total a pagar: $0";
    btnPagar.disabled = true;
    return;
  }

  tbody.innerHTML = cart
    .map(
      (p) => `
      <tr>
        <td><img src="${p.imagen ||
          p.img}" style="width:60px;height:60px;object-fit:cover" class="rounded"></td>
        <td>${p.nombre}</td>
        <td class="text-end">${clp(p.precio)}</td>
        <td class="text-center">${p.cantidad}</td>
        <td class="text-end">${clp(p.precio * p.cantidad)}</td>
        <td></td>
      </tr>`
    )
    .join("");

  const total = cart.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
  totalTxt.textContent = `Total a pagar: ${clp(total)}`;
  btnPagar.textContent = `Pagar ahora ${clp(total)}`;
}

// -------------------- VALIDACIONES --------------------
function validarCliente() {
  const nombre = $("#inpNombre")?.value.trim();
  const apellidos = $("#inpApellidos")?.value.trim();
  const correo = $("#inpCorreo")?.value.trim();
  const calle = $("#inpCalle")?.value.trim();
  const region = $("#region")?.value;
  const comuna = $("#comuna")?.value;

  if (
    !nombre ||
    !apellidos ||
    !correo.includes("@") ||
    !calle ||
    !region ||
    !comuna
  ) {
    alert("⚠️ Completa todos los campos obligatorios.");
    return false;
  }
  return true;
}

function validarTarjeta() {
  const num = $("#cardNumber")?.value.replace(/\s+/g, "");
  const exp = $("#cardExp")?.value.trim();
  const cvv = $("#cardCvv")?.value.trim();

  if (!num || num.length !== 16) {
    alert("Número de tarjeta inválido");
    return false;
  }
  if (!/^\d{2}\/\d{2}$/.test(exp)) {
    alert("Formato de vencimiento inválido (MM/AA)");
    return false;
  }
  const [mm, aa] = exp.split("/").map(Number);
  const hoy = new Date();
  const valido =
    aa + 2000 > hoy.getFullYear() ||
    (aa + 2000 === hoy.getFullYear() && mm >= hoy.getMonth() + 1);
  if (!valido) {
    alert("Tarjeta vencida");
    return false;
  }
  if (!cvv || cvv.length !== 3) {
    alert("CVV inválido");
    return false;
  }
  return true;
}

// -------------------- GUARDAR PEDIDO --------------------
async function guardarPedido(data) {
  const ref = await addDoc(collection(db, "pedidos"), data);
  await updateDoc(doc(db, "pedidos", ref.id), { idPedido: ref.id });
  return ref.id;
}

// -------------------- PAGO --------------------
async function procesarPago() {
  if (!validarCliente()) return;
  if (!validarTarjeta()) {
    localStorage.setItem("estadoPago", "error");
    window.location.href = "./pagoError.html";
    return;
  }

  const carrito = getCart();
  if (!carrito.length) {
    alert("Carrito vacío.");
    return;
  }

  const total = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);

  const orden = {
    numeroOrden:
      "ORD" + Date.now().toString().slice(-6) + Math.floor(Math.random() * 90),
    fecha: new Date(),
    fechaServidor: serverTimestamp(),
    cliente: {
      nombre: $("#inpNombre").value.trim(),
      apellidos: $("#inpApellidos").value.trim(),
      correo: $("#inpCorreo").value.trim(),
    },
    direccion: {
      calle: $("#inpCalle").value.trim(),
      departamento: $("#inpDepto").value.trim(),
      region: $("#region").value,
      comuna: $("#comuna").value,
      indicaciones: $("#txtIndicaciones").value.trim(),
    },
    productos: carrito,
    total,
    estado: "pendiente",
    metodoPago: "tarjeta",
  };

  // Simulación de aprobación/rechazo (para pruebas)
  const exito = Math.random() > 0.15;
  const id = await guardarPedido(orden);
  orden.idPedido = id;
  orden.pagoExitoso = exito;

  localStorage.setItem("ultimaCompra", JSON.stringify(orden));
  clearCart();

  localStorage.setItem("estadoPago", exito ? "ok" : "error");
  window.location.href = exito ? "./pagoCorrecto.html" : "./pagoError.html";
}

// -------------------- RENDER DETALLE (OK/ERROR) --------------------
function renderResultadoPago() {
  const estado = localStorage.getItem("estadoPago");
  const data = JSON.parse(localStorage.getItem("ultimaCompra") || "null");
  if (!data) return;

  const isOk = estado === "ok";
  const page = window.location.pathname.split("/").pop();

  if (
    (isOk && page !== "pagoCorrecto.html") ||
    (!isOk && page !== "pagoError.html")
  )
    return;

  const c = data.cliente || {};
  const d = data.direccion || {};
  const productos = data.productos || [];

  // Carga campos generales si existen
  [
    ["#orderId", data.idPedido || "—"],
    ["#orderCode", data.numeroOrden || "—"],
    ["#orderNumber", data.numeroOrden || "—"],
    ["#totalOk", clp(data.total)],
    ["#txtTotal", `Total pagado: ${clp(data.total)}`],
  ].forEach(([sel, val]) => {
    const el = document.querySelector(sel);
    if (el) el.textContent = val;
  });

  // Datos cliente (si hay inputs)
  [
    ["#cNombre", c.nombre],
    ["#cApellidos", c.apellidos],
    ["#cCorreo", c.correo],
    ["#cCalle", d.calle],
    ["#cDepto", d.departamento],
    ["#cRegion", d.region],
    ["#cComuna", d.comuna],
    ["#cInd", d.indicaciones],
    ["#inpNombre", c.nombre],
    ["#inpApellidos", c.apellidos],
    ["#inpCorreo", c.correo],
    ["#inpCalle", d.calle],
    ["#inpDepto", d.departamento],
    ["#txtIndicaciones", d.indicaciones],
    ["#region", d.region],
    ["#comuna", d.comuna],
  ].forEach(([sel, val]) => {
    const el = document.querySelector(sel);
    if (el && val !== undefined) el.value = val;
  });

  // Render productos
  const tb = document.querySelector("#tbodyOk, #tbodyResumen");
  if (tb)
    tb.innerHTML = productos
      .map(
        (p) => `
      <tr>
        <td><img src="${p.imagen ||
          p.img}" style="width:60px;height:60px;object-fit:cover" class="rounded"></td>
        <td>${p.nombre}</td>
        <td class="text-end">${clp(p.precio)}</td>
        <td class="text-center">${p.cantidad}</td>
        <td class="text-end">${clp(p.precio * p.cantidad)}</td>
      </tr>`
      )
      .join("");

  // Botones específicos
  const btnPDF = document.querySelector("#btnPDF");
  const btnEmail = document.querySelector("#btnEmail");
  const btnVolver = document.querySelector("#btnVolverPagar");

  if (btnPDF)
    btnPDF.addEventListener("click", () => window.print());

  if (btnEmail)
    btnEmail.addEventListener("click", () =>
      alert(`📧 Boleta enviada a ${c.correo}`)
    );

  if (btnVolver)
    btnVolver.addEventListener("click", () => {
      window.location.href = "./checkout.html";
    });
}

// -------------------- INIT --------------------
document.addEventListener("DOMContentLoaded", () => {
  const file = window.location.pathname.split("/").pop();

  if (file === "checkout.html") {
    renderCheckout();
    const btn = $("#btnPagar");
    if (btn) btn.addEventListener("click", procesarPago);
  }

  if (file === "pagoCorrecto.html" || file === "pagoError.html") {
    renderResultadoPago();
  }
});
