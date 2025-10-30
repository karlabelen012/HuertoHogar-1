import React, { useState } from "react";
import { registerUser } from "../../services/authService";
import { addUser } from "../../services/firestoreService";
import {
  validarCorreo,
  validarRun,
  esMayorEdad,
} from "../../utils/validaciones";

const Registro = () => {
  const [form, setForm] = useState({
    run: "",
    nombre: "",
    correo: "",
    clave: "",
    fecha: "",
  });
  const [msg, setMsg] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { run, nombre, correo, clave, fecha } = form;

    if (!validarRun(run)) return setMsg("RUN inválido");
    if (!nombre) return setMsg("Nombre requerido");
    if (!validarCorreo(correo)) return setMsg("Correo inválido (usa duoc.cl)");
    if (clave.length < 6) return setMsg("Clave mínimo 6 caracteres");
    if (!esMayorEdad(fecha)) return setMsg("Debes ser mayor de edad");

    try {
      // 1) crear usuario en auth
      await registerUser(correo, clave, nombre);
      // 2) guardar datos completos en firestore
      await addUser({ run, nombre, correo, fecha, rol: "cliente" });

      setMsg("Usuario registrado ✅, redirigiendo...");

      // 3) redirigir según correo
      setTimeout(() => {
        if (correo.toLowerCase() === "admin@duoc.cl") {
          window.location.href = "/perfil-admin?nombre=" + encodeURIComponent(nombre);
        } else {
          window.location.href = "/perfil-cliente?nombre=" + encodeURIComponent(nombre);
        }
      }, 1200);
    } catch (err) {
      console.error(err);
      setMsg("Error al registrar: " + err.message);
    }
  };

  return (
    <div className="container py-4">
      <h2>Registro</h2>
      <form onSubmit={handleSubmit} className="col-md-6">
        <div className="mb-2">
          <label>RUN</label>
          <input
            className="form-control"
            name="run"
            value={form.run}
            onChange={handleChange}
          />
        </div>
        <div className="mb-2">
          <label>Nombre</label>
          <input
            className="form-control"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
          />
        </div>
        <div className="mb-2">
          <label>Correo</label>
          <input
            className="form-control"
            type="email"
            name="correo"
            value={form.correo}
            onChange={handleChange}
          />
        </div>
        <div className="mb-2">
          <label>Clave</label>
          <input
            className="form-control"
            type="password"
            name="clave"
            value={form.clave}
            onChange={handleChange}
          />
        </div>
        <div className="mb-2">
          <label>Fecha nacimiento</label>
          <input
            className="form-control"
            type="date"
            name="fecha"
            value={form.fecha}
            onChange={handleChange}
          />
        </div>
        <button className="btn btn-success mt-2">Crear cuenta</button>
      </form>
      {msg && <p style={{ marginTop: 12, color: "crimson" }}>{msg}</p>}
    </div>
  );
};

export default Registro;
