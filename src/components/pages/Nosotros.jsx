import React from "react";
import Header from "../organisms/Header";
import Footer from "../organisms/Footer";

const Nosotros = () => {
  return (
    <>
      <Header />
      <main className="container py-4" style={{ maxWidth: "850px" }}>
        <h2 style={{ color: "#2E8B57" }}>Nosotros</h2>
        <p className="text-muted mb-3">
          Huerto Hogar nace como un proyecto para acercar productos del campo a
          estudiantes, docentes y familias.
        </p>

        <h5>Misión</h5>
        <p>
          Entregar alimentos frescos, saludables y de origen conocido, con una
          experiencia de compra simple.
        </p>

        <h5>Visión</h5>
        <p>
          Ser la tienda digital de referencia en productos orgánicos y de
          pequeños productores.
        </p>

        <h5>Valores</h5>
        <ul>
          <li>Calidad y frescura</li>
          <li>Transparencia en los precios</li>
          <li>Apoyo a productores locales</li>
          <li>Servicio al cliente</li>
        </ul>
      </main>
      <Footer />
    </>
  );
};

export default Nosotros;
