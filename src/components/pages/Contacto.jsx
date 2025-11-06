import React, { useState } from "react";
import Header from "../organisms/Header";
import Footer from "../organisms/Footer";

import { db } from "../../firebase"; // 👈 ajusta la ruta a tu firebase.js
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const Contacto = () => {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombre.trim() || !correo.trim() || !mensaje.trim()) {
      alert("⚠️ Por favor completa todos los campos.");
      return;
    }

    // Validación sencilla de correo (puedes usar tu misma función de validators.js si la expones)
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(correo.trim())) {
      alert("⚠️ El formato del correo no es válido.");
      return;
    }

    try {
      setLoading(true);
      const idMensaje = "MSG" + Date.now();

      await addDoc(collection(db, "contactos"), {
        nombre: nombre.trim(),
        correo: correo.trim(),
        comentario: mensaje.trim(),
        fecha: serverTimestamp(),
        respondido: false,
        idMensaje,
      });

      alert("📨 Tu mensaje ha sido enviado. ¡Muchas gracias!");
      setNombre("");
      setCorreo("");
      setMensaje("");
    } catch (err) {
      console.error("Error guardando contacto:", err);
      alert("❌ Ocurrió un error al enviar tu mensaje.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="container py-4" style={{ maxWidth: "720px" }}>
        <h2 className="mb-3" style={{ color: "#2E8B57" }}>
          Contáctanos
        </h2>
        <p className="text-muted">
          Si tienes dudas sobre tu pedido, envíos o productos, escríbenos.
        </p>

        <form className="row g-3 mt-1" onSubmit={handleSubmit}>
          <div className="col-md-6">
            <label className="form-label">Nombre</label>
            <input
              type="text"
              className="form-control"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Correo</label>
            <input
              type="email"
              className="form-control"
              required
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
            />
          </div>
          <div className="col-12">
            <label className="form-label">Mensaje</label>
            <textarea
              className="form-control"
              rows="4"
              required
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
            />
          </div>
          <div className="col-12">
            <button className="btn btn-success" type="submit" disabled={loading}>
              {loading ? "Enviando..." : "Enviar"}
            </button>
          </div>
        </form>

        <div className="mt-4">
          <p className="mb-1">
            <strong>Email:</strong> contacto@huertohogar.cl
          </p>
          <p className="mb-1">
            <strong>Teléfono:</strong> +56 9 1234 5678
          </p>
          <p className="mb-0">
            <strong>Horario:</strong> Lunes a viernes 9:00 – 18:00
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Contacto;
