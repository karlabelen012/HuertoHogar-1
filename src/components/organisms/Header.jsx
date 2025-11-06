// src/components/organisms/Header.jsx
import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/image/logo.png";


const Header = () => {
  return (
    <header className="border-bottom">
      <div className="bg-white">
        <div className="container py-2">
          <div className="row align-items-center g-2">
            {/* Logo */}
            <div className="col-6 col-md-2 d-flex align-items-center">
              <Link
                to="/"
                className="d-inline-flex align-items-center text-decoration-none"
              >
                <img
                  src={logo}
                  alt="Huerto Hogar"
                  className="me-2"
                  style={{ width: "auto", height: "55px", objectFit: "contain" }}
                />
              </Link>
            </div>

            {/* Buscador */}
            <div className="col-12 col-md-6 d-flex justify-content-md-center">
              <form className="d-flex w-100" style={{ maxWidth: "420px" }}>
                <input
                  className="form-control me-2"
                  type="search"
                  placeholder="Buscar"
                  aria-label="Buscar"
                  name="q"
                />
                <button className="btn btn-outline-success" type="submit">
                  Buscar
                </button>
              </form>
            </div>

            {/* Botones derecha */}
            <div className="col-6 col-md-4 d-flex justify-content-end align-items-center gap-2">
              <Link className="btn btn-outline-primary btn-sm" to="/login">
                Iniciar Sesión
              </Link>
              <Link className="btn btn-primary btn-sm" to="/registro">
                Crear Cuenta
              </Link>
              <Link
                className="btn btn-success btn-sm d-flex align-items-center"
                to="/carrito"
              >
                <span className="me-1">🛒</span>
                Carrito <span className="ms-1" id="cartAmount">$0</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Navbar */}
      <nav className="navbar navbar-expand-lg bg-white">
        <div className="container">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div id="mainNav" className="collapse navbar-collapse">
            <ul className="navbar-nav mx-auto">
              <li className="nav-item">
                <Link className="nav-link active fw-semibold" to="/">
                  Home
                </Link>
              </li>

              {/* Dropdown Productos */}
              <li className="nav-item dropdown d-flex align-items-center nav-categories">
                <Link className="nav-link" to="/productos">
                  Productos
                </Link>
                <Link
                  className="nav-link dropdown-toggle dropdown-toggle-split px-1"
                  to="#"
                  id="catToggle"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                ></Link>

                <ul className="dropdown-menu" aria-labelledby="catToggle">
                  <li>
                    <Link className="dropdown-item" to="/categorias?c=Frutas Frescas">
                      Frutas Frescas
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/categorias?c=Verduras Orgánicas">
                      Verduras Orgánicas
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/categorias?c=Productos Orgánicos">
                      Productos Orgánicos
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/categorias?c=Lácteos">
                      Lácteos
                    </Link>
                  </li>
                </ul>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/ofertas">
                  Ofertas
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/nosotros">
                  Nosotros
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/blogs">
                  Blog
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/contactos">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
