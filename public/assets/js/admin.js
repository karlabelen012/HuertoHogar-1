// ==========================================================
// 🧩 HUERTO HOGAR - ADMIN PANEL COMPLETO
// ==========================================================

// 🔹 Importar configuración base de Firebase
import { db, auth } from "./firebase.js";

// 🔹 Importar todas las funciones de Firestore desde el CDN
import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const secciones = {
  msg: document.getElementById("adminMsg"),
  usuarios: document.getElementById("tblUsuarios"),
  productos: document.getElementById("tblProductos"),
  pedidos: document.getElementById("tblPedidos"),
  ofertas: document.getElementById("tblOfertas"),
  contactos: document.getElementById("tblContactos"),
};

const formProd = document.getElementById("formProducto");
const formOferta = document.getElementById("formOferta");

// Helper para formatear precios CLP
const clp = n => Number(n || 0).toLocaleString("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });

// ----------------------------------------------------------
// 🔹 Verificar usuario administrador
// ----------------------------------------------------------


auth.onAuthStateChanged(async (user) => {
  if (!user) {
    secciones.msg.innerHTML = `
      <div class="alert alert-warning">
        Debes iniciar sesión como administrador.
      </div>`;
    return;
  }

  const ref = doc(db, "usuarios", user.uid);
  const snap = await getDoc(ref);

  if (!snap.exists() || snap.data().rol !== "admin") {
    secciones.msg.innerHTML = `
      <div class="alert alert-danger">
        Acceso denegado. Solo administradores.
      </div>`;
    return;
  }

  secciones.msg.innerHTML = `
    <div class="alert alert-success">
      Bienvenido, administrador.
    </div>`;

  cargarTodo(); // continúa con tus funciones
});

// ----------------------------------------------------------
// 📊 Cargar todas las colecciones
// ----------------------------------------------------------
async function cargarTodo() {
  await Promise.all([
    cargarUsuarios(),
    cargarProductos(),
    cargarPedidos(),
    cargarOfertas(),
    cargarContactos(),
  ]);
}

// ----------------------------------------------------------
// 👥 USUARIOS
// ----------------------------------------------------------
async function cargarUsuarios() {
  const snap = await getDocs(collection(db, "usuarios"));
  secciones.usuarios.innerHTML = snap.docs.map(d => {
    const u = d.data();
    return `
      <tr>
        <td>${u.nombre}</td>
        <td>${u.correo}</td>
        <td>${u.rol || "cliente"}</td>
        <td>
          <button class="btn btn-sm btn-warning" data-type="rol" data-id="${d.id}">Cambiar rol</button>
          <button class="btn btn-sm btn-danger" data-type="del" data-id="${d.id}">Eliminar</button>
        </td>
      </tr>`;
  }).join("");
}

secciones.usuarios?.addEventListener("click", async e => {
  const btn = e.target.closest("button[data-type]");
  if (!btn) return;
  const id = btn.dataset.id;
  const action = btn.dataset.type;

  if (action === "rol") {
    const ref = doc(db, "usuarios", id);
    const snap = await getDoc(ref);
    const u = snap.data();
    const nuevoRol = u.rol === "admin" ? "cliente" : "admin";
    await updateDoc(ref, { rol: nuevoRol });
    alert(`Rol actualizado a ${nuevoRol}`);
    cargarUsuarios();
  } else if (action === "del") {
    // eslint-disable-next-line no-restricted-globals
    if (confirm("¿Eliminar usuario?")) {
      await deleteDoc(doc(db, "usuarios", id));
      alert("Usuario eliminado");
      cargarUsuarios();
    }
  }
});

// ----------------------------------------------------------
// 🥦 PRODUCTOS
// ----------------------------------------------------------
async function cargarProductos() {
  const snap = await getDocs(collection(db, "productos"));
  secciones.productos.innerHTML = snap.docs.map(d => {
    const p = d.data();
    return `
      <tr>
        <td>${p.nombre}</td>
        <td>${p.categoria}</td>
        <td>${clp(p.precio)}</td>
        <td>${p.stock || 0}</td>
        <td>${p.descuento ? p.descuento * 100 + "%" : "-"}</td>
        <td>
          <button class="btn btn-sm btn-warning" data-type="edit" data-id="${d.id}">Editar</button>
          <button class="btn btn-sm btn-danger" data-type="del" data-id="${d.id}">Eliminar</button>
        </td>
      </tr>`;
  }).join("");
}

secciones.productos?.addEventListener("click", async e => {
  const btn = e.target.closest("button[data-type]");
  if (!btn) return;
  const id = btn.dataset.id;
  const act = btn.dataset.type;

  if (act === "del") {
    if (!window.confirm("¿Vaciar carrito?")) return;

    await deleteDoc(doc(db, "productos", id));
    cargarProductos();
  } else if (act === "edit") {
    const ref = doc(db, "productos", id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return;
    const p = snap.data();
    formProd.id.value = id;
    formProd.nombre.value = p.nombre;
    formProd.categoria.value = p.categoria;
    formProd.precio.value = p.precio;
    formProd.stock.value = p.stock || 0;
    formProd.descuento.value = p.descuento || 0;
    formProd.img.value = p.img || "";
    formProd.descripcion.value = p.descripcion || "";
    formProd.scrollIntoView({ behavior: "smooth" });
  }
});

formProd?.addEventListener("submit", async e => {
  e.preventDefault();
  const data = {
    nombre: formProd.nombre.value,
    categoria: formProd.categoria.value,
    precio: Number(formProd.precio.value),
    stock: Number(formProd.stock.value) || 0,
    descuento: Number(formProd.descuento.value) || 0,
    descripcion: formProd.descripcion.value,
    img: formProd.img.value,
  };
  try {
    if (formProd.id.value) {
      await updateDoc(doc(db, "productos", formProd.id.value), data);
      alert("Producto actualizado");
    } else {
      await addDoc(collection(db, "productos"), data);
      alert("Producto agregado");
    }
    formProd.reset();
    cargarProductos();
  } catch (err) {
    console.error(err);
    alert("Error guardando producto");
  }
});

// ----------------------------------------------------------
// 🧾 PEDIDOS
// ----------------------------------------------------------
async function cargarPedidos() {
  const snap = await getDocs(collection(db, "pedidos"));
  secciones.pedidos.innerHTML = snap.docs.map(d => {
    const p = d.data();
    return `
      <tr>
        <td>${p.cliente}</td>
        <td>${p.correo}</td>
        <td>${p.estado}</td>
        <td>${p.total}</td>
        <td>
          <select class="form-select form-select-sm estadoPedido" data-id="${d.id}">
            <option ${p.estado === "En preparación" ? "selected" : ""}>En preparación</option>
            <option ${p.estado === "Enviado" ? "selected" : ""}>Enviado</option>
            <option ${p.estado === "Entregado" ? "selected" : ""}>Entregado</option>
            <option ${p.estado === "Cancelado" ? "selected" : ""}>Cancelado</option>
          </select>
        </td>
      </tr>`;
  }).join("");
}

secciones.pedidos?.addEventListener("change", async e => {
  const sel = e.target.closest(".estadoPedido");
  if (!sel) return;
  await updateDoc(doc(db, "pedidos", sel.dataset.id), { estado: sel.value });
  alert("Estado del pedido actualizado");
});

// ----------------------------------------------------------
// 🎟️ OFERTAS
// ----------------------------------------------------------
async function cargarOfertas() {
  const snap = await getDocs(collection(db, "ofertas"));
  secciones.ofertas.innerHTML = snap.docs.map(d => {
    const o = d.data();
    return `
      <tr>
        <td>${o.titulo}</td>
        <td>${o.codigo}</td>
        <td>${o.descuento * 100}%</td>
        <td>${o.activo ? "✅" : "❌"}</td>
        <td>
          <button class="btn btn-sm btn-warning" data-type="edit" data-id="${d.id}">Editar</button>
          <button class="btn btn-sm btn-danger" data-type="del" data-id="${d.id}">Eliminar</button>
        </td>
      </tr>`;
  }).join("");
}

secciones.ofertas?.addEventListener("click", async e => {
  const btn = e.target.closest("button[data-type]");
  if (!btn) return;
  const id = btn.dataset.id;
  const act = btn.dataset.type;
  if (act === "del") {
    await deleteDoc(doc(db, "ofertas", id));
    cargarOfertas();
  } else if (act === "edit") {
    const snap = await getDoc(doc(db, "ofertas", id));
    const o = snap.data();
    formOferta.id.value = id;
    formOferta.titulo.value = o.titulo;
    formOferta.codigo.value = o.codigo;
    formOferta.descuento.value = o.descuento;
    formOferta.activo.checked = o.activo;
    formOferta.scrollIntoView({ behavior: "smooth" });
  }
});

formOferta?.addEventListener("submit", async e => {
  e.preventDefault();
  const data = {
    titulo: formOferta.titulo.value,
    codigo: formOferta.codigo.value,
    descuento: Number(formOferta.descuento.value),
    activo: formOferta.activo.checked,
  };
  if (formOferta.id.value) {
    await updateDoc(doc(db, "ofertas", formOferta.id.value), data);
    alert("Oferta actualizada");
  } else {
    await addDoc(collection(db, "ofertas"), data);
    alert("Oferta agregada");
  }
  formOferta.reset();
  cargarOfertas();
});

// ----------------------------------------------------------
// 💬 CONTACTOS
// ----------------------------------------------------------
async function cargarContactos() {
  const snap = await getDocs(collection(db, "contactos"));
  const lista = snap.docs.map(d => d.data());
  secciones.contactos.innerHTML = lista.map(c => `
    <tr>
      <td>${c.nombre}</td>
      <td>${c.correo}</td>
      <td>${c.mensaje}</td>
    </tr>`).join("");

  // Reporte
  const total = lista.length;
  document.getElementById("reporteContactos").textContent = `Total mensajes: ${total}`;
}
