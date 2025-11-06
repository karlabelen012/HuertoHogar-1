// ==========================================================
// 🌿 HUERTO HOGAR - PRODUCTOS (Firebase + Local + Carrito)
// ==========================================================
import React, { useEffect, useState } from 'react';
import { db } from '../../services/firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import './Productos.css';

// ==========================================================
// 🛒 Clave de carrito y función helper localStorage
// ==========================================================
const KEY_CART = 'hh_cart';

const clp = (n) =>
  Number(n || 0).toLocaleString('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0
  });

function addToCartLS(producto) {
  const raw = localStorage.getItem(KEY_CART);
  const items = raw ? JSON.parse(raw) : [];

  const idx = items.findIndex((it) => it.id === producto.id);
  if (idx >= 0) {
    items[idx].cantidad += 1;
  } else {
    items.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: Number(producto.precio) || 0,
      img: producto.imagen || producto.img,
      cantidad: 1
    });
  }

  localStorage.setItem(KEY_CART, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent('cart:changed'));
}

// ==========================================================
// 🥕 Respaldo local (por si Firebase falla o está vacío)
// ==========================================================
const PRODUCTOS_LOCAL = [
  {
    id: 'p1',
    activo: true,
    categoria: 'Verduras Orgánicas',
    nombre: 'Zanahorias Orgánicas',
    descripcion: 'Zanahorias frescas sin pesticidas, listas para ensaladas.',
    imagen: '/assets/image/zanahoria.png',
    origen: 'Región del Ñuble',
    oferta: false,
    precio: 900,
    stock: 40
  },
  {
    id: 'p2',
    activo: true,
    categoria: 'Frutas Frescas',
    nombre: 'Manzanas Rojas',
    descripcion: 'Manzanas dulces de huertos locales.',
    imagen: '/assets/image/manzanas.png',
    origen: 'Región del Maule',
    oferta: true,
    precio: 1200,
    precioAnterior: 1500,
    stock: 30
  },
  {
    id: 'p3',
    activo: true,
    categoria: 'Lácteos',
    nombre: 'Yogurt Artesanal',
    descripcion: 'Yogurt natural sin azúcar.',
    imagen: '/assets/image/yogurt.png',
    origen: 'Región de Los Lagos',
    oferta: false,
    precio: 1800,
    stock: 25
  },
  {
    id: 'p4',
    activo: true,
    categoria: 'Productos Orgánicos',
    nombre: 'Miel Orgánica',
    descripcion: 'Miel pura 100% natural, cosechada en bosques nativos.',
    imagen: '/assets/image/miel.png',
    origen: 'Región del Biobío',
    oferta: true,
    precio: 3500,
    precioAnterior: 4200,
    stock: 20
  }
];

// ==========================================================
// 🧩 Componente principal
// ==========================================================
const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  const user = JSON.parse(localStorage.getItem('hh_user') || '{}');
  const correo = user?.correo || user?.email || '';
  const isAdmin = correo.includes('@duoc');

  useEffect(() => {
    const cargar = async () => {
      try {
        const snap = await getDocs(collection(db, 'productos'));
        let items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

        // Si Firebase está vacío, usa respaldo local
        if (!items.length) {
          console.warn('⚠️ Firebase vacío — usando respaldo local');
          items = PRODUCTOS_LOCAL;
        }

        items = items.filter((p) => p.activo !== false);
        setProductos(items);
      } catch (err) {
        console.error('❌ Error al cargar productos:', err);
        // Fallback seguro
        setProductos(PRODUCTOS_LOCAL);
      } finally {
        setCargando(false);
      }
    };

    cargar();
  }, []);

  // ========================================================
  // 🛒 Agregar al carrito
  // ========================================================
  const handleAdd = (p) => {
    addToCartLS(p);
    // eslint-disable-next-line no-alert
    alert(`✅ "${p.nombre}" agregado al carrito`);
  };

  // ========================================================
  // 🗑 Eliminar (solo admin)
  // ========================================================
  const handleDelete = async (id) => {
    // eslint-disable-next-line no-restricted-globals
    const ok = window.confirm('¿Eliminar este producto?');
    if (!ok) return;
    try {
      await deleteDoc(doc(db, 'productos', id));
      setProductos((prev) => prev.filter((p) => p.id !== id));
      alert('🗑 Producto eliminado');
    } catch (err) {
      console.error('Error eliminando producto:', err);
    }
  };

  // ========================================================
  // 💬 Renderizado de la UI
  // ========================================================
  if (cargando) {
    return <p className="text-center mt-4">Cargando productos...</p>;
  }

  if (!productos.length) {
    return <p className="text-center mt-4">No hay productos disponibles.</p>;
  }

  return (
    <main className="productos-grid">
      {productos.map((p) => (
        <article
          key={p.id}
          className={`card-producto ${p.oferta ? 'oferta' : ''}`}
        >
          <div className="card-producto-img">
            <img src={p.imagen || p.img} alt={p.nombre} />
          </div>
          <div className="card-producto-body">
            <h4>{p.nombre}</h4>
            <p className="categoria">{p.categoria}</p>

            {p.oferta && p.precioAnterior ? (
              <p className="precio">
                <span className="precio-anterior">{clp(p.precioAnterior)}</span>
                <span className="precio-oferta">{clp(p.precio)}</span>
              </p>
            ) : (
              <p className="precio">{clp(p.precio)}</p>
            )}

            {isAdmin ? (
              <button
                type="button"
                onClick={() => handleDelete(p.id)}
                className="btn-eliminar"
              >
                🗑 Eliminar
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleAdd(p)}
                className="btn-agregar"
              >
                🛒 Añadir
              </button>
            )}
          </div>
        </article>
      ))}
    </main>
  );
};

export default Productos;
