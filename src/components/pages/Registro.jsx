// src/pages/Registro.jsx
import React from "react";
import FormUsuario from "../molecules/FormUsuario";

const Registro = () => (
  <main
    className="container py-5"
    style={{
      background: "url('../assets/image/textura-papel-blanco_1194-5416.jpg')",
      backgroundSize: "cover",
      backgroundAttachment: "fixed",
      borderRadius: "12px"
    }}
  >
    <div className="register-box">
      <div className="register-header">Registro de usuario</div>
      <div className="register-body">
        <FormUsuario />
      </div>
    </div>

    <div className="text-center mt-3 mb-4">
      <p className="text-small mb-0">
        ¿Ya tienes cuenta?{" "}
        <a href="/login" className="text-success fw-semibold text-decoration-none">
          Inicia sesión aquí
        </a>
      </p>
    </div>
  </main>
);

export default Registro;
