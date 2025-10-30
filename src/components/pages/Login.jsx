import React, { useState } from "react";
import { loginUser } from "../../services/authService";

const Login = () => {
  const [email, setEmail] = useState("");
  const [clave, setClave] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await loginUser(email, clave);
      setMsg("Login correcto ✅");

      // si es admin
      if (user.email.toLowerCase() === "admin@duoc.cl") {
        window.location.href = "/perfil-admin?nombre=" + encodeURIComponent(user.displayName || "Admin");
      } else {
        window.location.href = "/perfil-cliente?nombre=" + encodeURIComponent(user.displayName || "Cliente");
      }
    } catch (err) {
      setMsg("Error al iniciar sesión: " + err.message);
    }
  };

  return (
    <div className="container py-4">
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleSubmit} className="col-md-4">
        <div className="mb-2">
          <label>Correo</label>
          <input
            className="form-control"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-2">
          <label>Clave</label>
          <input
            className="form-control"
            type="password"
            value={clave}
            onChange={(e) => setClave(e.target.value)}
          />
        </div>
        <button className="btn btn-primary mt-2">Entrar</button>
      </form>
      {msg && <p style={{ marginTop: 12, color: "crimson" }}>{msg}</p>}
    </div>
  );
};

export default Login;
