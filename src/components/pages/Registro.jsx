import React, { useState } from "react";
import Header from "../organisms/Header";
import Footer from "../organisms/Footer";
import { registerUser } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";

const Registro = () => {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    email2: "",
    fechaNacimiento: "",
    password: "",
    password2: "",
    rut: "",
    telefono: "",
    region: "",
    comuna: "",
  });

  const [msg, setMsg] = useState("");
  const [tipoMsg, setTipoMsg] = useState("info"); // "error" | "ok"
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { setUser } = useUser();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const esMayorDeEdad = (fecha) => {
    if (!fecha) return false;
    const hoy = new Date();
    const nac = new Date(fecha);
    let edad = hoy.getFullYear() - nac.getFullYear();
    const m = hoy.getMonth() - nac.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) edad--;
    return edad >= 18;
  };

  const validarCorreoBasico = (correo) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setTipoMsg("error");

    const {
      nombre,
      email,
      email2,
      fechaNacimiento,
      password,
      password2,
      rut,
      region,
      comuna,
    } = form;

    if (!nombre.trim()) return setMsg("El nombre es obligatorio.");

    if (!validarCorreoBasico(email)) return setMsg("Correo no válido.");
    if (email !== email2) return setMsg("Los correos no coinciden.");

    if (!fechaNacimiento) return setMsg("Debes ingresar tu fecha de nacimiento.");
    if (!esMayorDeEdad(fechaNacimiento))
      return setMsg("Debes ser mayor de edad para registrarte.");

    if (password.length < 6)
      return setMsg("La contraseña debe tener al menos 6 caracteres.");
    if (password !== password2)
      return setMsg("Las contraseñas no coinciden.");

    if (!rut.trim()) return setMsg("Debes ingresar tu RUT/RUN.");
    if (!region) return setMsg("Selecciona una región.");
    if (!comuna) return setMsg("Selecciona una comuna.");

    try {
      setLoading(true);

      // usamos tu servicio de Firebase
      const session = await registerUser({
        nombre,
        run: rut,
        correo: email,
        clave: password,
        fecha: fechaNacimiento,
      });

      setUser(session);
      setTipoMsg("ok");
      setMsg("Registro exitoso. Redirigiendo…");

      // redirigir según rol
      setTimeout(() => {
        if (session.role === "admin") navigate("/admin");
        else navigate("/perfil");
      }, 1500);
    } catch (err) {
      console.error(err);
      setMsg(err.message || "Error al registrar usuario.");
      setTipoMsg("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main
        className="container py-5"
        style={{
          background:
            "url('../assets/image/textura-papel-blanco_1194-5416.jpg')",
          backgroundSize: "cover",
          backgroundAttachment: "fixed",
          borderRadius: "12px",
        }}
      >
        <div className="register-box">
          <div className="register-header">Registro de usuario</div>
          <div className="register-body">
            {msg && (
              <div
                className={`alert ${
                  tipoMsg === "ok" ? "alert-success" : "alert-danger"
                } text-center`}
              >
                {msg}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="nombre" className="form-label">
                  NOMBRE COMPLETO
                </label>
                <input
                  type="text"
                  id="nombre"
                  className="form-control"
                  placeholder="Ej: Ana Pérez"
                  value={form.nombre}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  CORREO
                </label>
                <input
                  type="email"
                  id="email"
                  className="form-control"
                  placeholder="Ej: ana@mail.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="email2" className="form-label">
                  CONFIRMAR CORREO
                </label>
                <input
                  type="email"
                  id="email2"
                  className="form-control"
                  placeholder="Repite tu correo"
                  value={form.email2}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="fechaNacimiento" className="form-label">
                  FECHA DE NACIMIENTO
                </label>
                <input
                  type="date"
                  id="fechaNacimiento"
                  className="form-control"
                  value={form.fechaNacimiento}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  CONTRASEÑA
                </label>
                <input
                  type="password"
                  id="password"
                  className="form-control"
                  placeholder="********"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="password2" className="form-label">
                  CONFIRMAR CONTRASEÑA
                </label>
                <input
                  type="password"
                  id="password2"
                  className="form-control"
                  placeholder="********"
                  value={form.password2}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="rut" className="form-label">
                  RUT / RUN
                </label>
                <input
                  type="text"
                  id="rut"
                  className="form-control"
                  placeholder="Ej: 19011022K"
                  maxLength={9}
                  minLength={7}
                  value={form.rut}
                  onChange={handleChange}
                  required
                />
                <div className="form-text">
                  Sin puntos ni guion, solo números y dígito verificador.
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="telefono" className="form-label">
                  TELÉFONO (opcional)
                </label>
                <input
                  type="tel"
                  id="telefono"
                  className="form-control"
                  placeholder="+56 9 1234 5678"
                  value={form.telefono}
                  onChange={handleChange}
                />
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label htmlFor="region" className="form-label">
                    REGIÓN
                  </label>
                  <select
                    id="region"
                    className="form-select"
                    value={form.region}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Seleccione la región --</option>
                    <option value="metropolitana">
                      Región Metropolitana de Santiago
                    </option>
                    <option value="valparaiso">Región de Valparaíso</option>
                    <option value="biobio">Región del Biobío</option>
                    <option value="araucania">Región de La Araucanía</option>
                    {/* si quieres, agrega todas igual que en el HTML */}
                  </select>
                </div>

                <div className="col-md-6">
                  <label htmlFor="comuna" className="form-label">
                    COMUNA
                  </label>
                  <input
                    id="comuna"
                    className="form-control"
                    placeholder="Ej: La Florida"
                    value={form.comuna}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  className="btn px-4 py-2 btn-success"
                  disabled={loading}
                >
                  {loading ? "Registrando..." : "REGISTRAR"}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="text-center mt-3 mb-4">
          <p className="text-small mb-0">
            ¿Ya tienes cuenta?
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="btn btn-link text-success fw-semibold text-decoration-none"
            >
              Inicia sesión aquí
            </button>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Registro;
