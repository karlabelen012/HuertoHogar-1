import React from "react";
import Header from "../organisms/Header";
import Footer from "../organisms/Footer";

const Home = () => {
  return (
    <>
      <Header />

      <main className="container py-4">
        <section className="mb-4 text-center">
          <h1 className="mb-2" style={{ color: "#2E8B57" }}>
            Bienvenida a Huerto Hogar 🍎
          </h1>
          <p className="text-muted">
            Compra productos frescos, orgánicos y de productores locales.
          </p>
        </section>

        {/* secciones tipo cards */}
        <section className="row g-3">
          <div className="col-md-3 col-sm-6">
            <div className="card h-100 shadow-sm">
              <div className="card-body text-center">
                <h5 className="card-title">Frutas frescas</h5>
                <p className="card-text small">
                  Manzana, naranja, plátano, uvas…
                </p>
                <a href="/productos" className="btn btn-success btn-sm">
                  Ver más
                </a>
              </div>
            </div>
          </div>

          <div className="col-md-3 col-sm-6">
            <div className="card h-100 shadow-sm">
              <div className="card-body text-center">
                <h5 className="card-title">Verduras</h5>
                <p className="card-text small">
                  Espinaca, zanahoria, pimientos…
                </p>
                <a href="/productos" className="btn btn-success btn-sm">
                  Ver más
                </a>
              </div>
            </div>
          </div>

          <div className="col-md-3 col-sm-6">
            <div className="card h-100 shadow-sm">
              <div className="card-body text-center">
                <h5 className="card-title">Lácteos</h5>
                <p className="card-text small">
                  Leche, yogurt artesanal, mantequilla.
                </p>
                <a href="/productos" className="btn btn-success btn-sm">
                  Ver más
                </a>
              </div>
            </div>
          </div>

          <div className="col-md-3 col-sm-6">
            <div className="card h-100 shadow-sm">
              <div className="card-body text-center">
                <h5 className="card-title">Ofertas</h5>
                <p className="card-text small">
                  Canastas mixtas y promos de temporada.
                </p>
                <a href="/productos" className="btn btn-outline-success btn-sm">
                  Ver ofertas
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Home;
