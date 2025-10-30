import React, { useEffect, useState } from "react";
import { addOrden } from "../../services/firestoreService";

const Carrito = () => {
  const [items, setItems] = useState([]);

  // cargar carrito
  useEffect(() => {
    try {
      const raw = localStorage.getItem("hh_cart") || "[]";
      setItems(JSON.parse(raw));
    } catch (e) {
      setItems([]);
    }
  }, []);

  const total = items.reduce(
    (acc, it) => acc + (it.precio || 0) * (it.cantidad || 1),
    0
  );

  const handleCheckout = async () => {
    if (items.length === 0) return alert("Carrito vacío");

    const orden = {
      items: items.map((i) => ({
        id: i.id,
        nombre: i.nombre,
        precio: i.precio,
        cantidad: i.cantidad,
      })),
      total,
      estado: "Pagada", // lo mismo que en el video
    };

    await addOrden(orden);
    alert("Compra registrada 👌");
    localStorage.setItem("hh_cart", "[]");
    setItems([]);
  };

  return (
    <div className="container py-4">
      <h2>🛒 Carrito</h2>

      {items.length === 0 ? (
        <p>No tienes productos en el carrito.</p>
      ) : (
        <table className="table align-middle">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cant.</th>
              <th>Precio</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.id}>
                <td>{it.nombre}</td>
                <td>{it.cantidad}</td>
                <td>${it.precio}</td>
                <td>${it.precio * it.cantidad}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h4>Total: ${total}</h4>

      <button
        onClick={handleCheckout}
        className="btn btn-primary mt-3"
        disabled={items.length === 0}
      >
        Confirmar pago
      </button>
    </div>
  );
};

export default Carrito;
