import React from "react";
import Header from "../organisms/Header";
import Footer from "../organisms/Footer";

const Contacto = () => {
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

        <form className="row g-3 mt-1">
          <div className="col-md-6">
            <label className="form-label">Nombre</label>
            <input type="text" className="form-control" required />
          </div>
          <div className="col-md-6">
            <label className="form-label">Correo</label>
            <input type="email" className="form-control" required />
          </div>
          <div className="col-12">
            <label className="form-label">Mensaje</label>
            <textarea className="form-control" rows="4" required />
          </div>
          <div className="col-12">
            <button className="btn btn-success" type="submit">
              Enviar
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
