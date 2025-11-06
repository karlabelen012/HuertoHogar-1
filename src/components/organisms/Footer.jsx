// src/components/organisms/Footer.jsx
import React from "react";
import logo from "../../assets/image/logo.png";
import instagram from "../../assets/image/instagram.png";
import whatsapp from "../../assets/image/whatsapp.png";
import facebook from "../../assets/image/facebook.png";
import visa from "../../assets/image/visa.png";
import mastercard from "../../assets/image/master card.png";
import paypal from "../../assets/image/paypal.png";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer bg-light mt-5 py-4">
      <div className="container">
        {/* Parte superior */}
        <div className="footer-top d-flex flex-column flex-md-row justify-content-between align-items-start mb-4">
          <div className="footer-left mb-3">
            <h2>HuertoHogar</h2>
            <div className="foot-links">
              <Link to="/">Inicio</Link> | <Link to="/productos">Productos</Link> |{" "}
              <Link to="/nosotros">Nosotros</Link> | <Link to="/contactos">Contacto</Link>
            </div>
          </div>

          <div className="footer-right">
            <p>¡Mantente en contacto! Únete a nuestro boletín.</p>
            <form className="subscribe-form d-flex">
              <input
                type="email"
                id="emailSub"
                name="emailSub"
                className="form-control me-2"
                placeholder="Ingresa tu correo"
                required
              />
              <button type="submit" className="btn btn-success">
                Suscribirse
              </button>
            </form>
          </div>
        </div>

        {/* Parte inferior */}
        <div className="footer-bottom row text-center text-md-start g-4">
          <div className="col-md-4 footer-column contacto">
            <h3>Contacto</h3>
            <p>
              Email:{" "}
              <a href="mailto:contacto@huertohogar.cl">contacto@huertohogar.cl</a>
            </p>
            <p>
              Teléfono: <a href="tel:+56912345678">+56 9 1234 5678</a>
            </p>
          </div>

          <div className="col-md-4 footer-column redes">
            <h3>Síguenos en redes sociales:</h3>
            <div className="social-icons d-flex gap-3 justify-content-center justify-content-md-start">
              <a href="https://www.instagram.com" target="_blank" rel="noreferrer">
                <img src={instagram} alt="Instagram" style={{ width: "28px" }} />
              </a>
              <a href="https://wa.me/56912345678" target="_blank" rel="noreferrer">
                <img src={whatsapp} alt="WhatsApp" style={{ width: "28px" }} />
              </a>
              <a href="https://www.facebook.com" target="_blank" rel="noreferrer">
                <img src={facebook} alt="Facebook" style={{ width: "28px" }} />
              </a>
            </div>
          </div>

          <div className="col-md-4 footer-column pagos">
            <h3>Pagos seguros:</h3>
            <div className="pay-icons d-flex gap-3 justify-content-center justify-content-md-start">
              <img src={visa} alt="Visa" style={{ width: "50px" }} />
              <img src={mastercard} alt="MasterCard" style={{ width: "50px" }} />
              <img src={paypal} alt="PayPal" style={{ width: "50px" }} />
            </div>
          </div>
        </div>

        <div className="footer-logo text-center mt-4">
          <img
            src={logo}
            alt="Logo HuertoHogar"
            style={{ width: "120px", height: "auto" }}
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
