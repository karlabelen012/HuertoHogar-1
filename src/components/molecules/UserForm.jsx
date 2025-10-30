import React, { useState } from "react";
import Input from "../atoms/Input";
import Button from "../atoms/Button";
import {validarRun, validarCorreo, esMayorEdad as validarMayoriaEdad} from "../../utils/validaciones"; // <- la renombramos aquí para que calce con tu nombre
import { addUser } from "../../service/firestoreService";
import { useHistory } from "react-router-dom";

const UserForm = () => {
  // estado con los mismos nombres que tus inputs
  const [form, setForm] = useState({run: "",  nombre: "", correo: "", clave: "",  fecha: "", });

  const [msg, setMsg] = useState("");
  const history = useHistory();

  const handleChange = (e) =>
    setForm({
      ...form,
      [e.target.id]: e.target.value, // usa id = run, nombre, correo, clave, fecha
    });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { run, nombre, correo, clave, fecha } = form;

    if (!validarRun(run)) return setMsg("Run inválido");
    if (!nombre) return setMsg("Nombre es obligatorio");
    if (!validarCorreo(correo)) return setMsg("Correo inválido");
    if (clave.length < 6)
      return setMsg("La clave debe tener al menos 6 caracteres");
    if (!validarMayoriaEdad(fecha))
      return setMsg("Debes ser mayor de edad");

    // si todo ok, guardamos
    await addUser(form);
    setMsg("Formulario enviado con éxito ✅");

    // redirección según correo
    setTimeout(() => {
      if (correo === "admin@duoc.cl") {
        history.push("/perfilAdmin?nombre=" + nombre);
      } else {
        history.push("/profileCliente?nombre=" + nombre);
      }
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        id="run"
        label="RUN"
        type="text"
        value={form.run}
        onChange={handleChange}
        required
      />
      <Input
        id="nombre"
        label="Nombre"
        type="text"
        value={form.nombre}
        onChange={handleChange}
        required
      />
      <Input
        id="correo"
        label="Correo"
        type="email"
        value={form.correo}
        onChange={handleChange}
        required
      />
      <Input
        id="clave"
        label="Clave"
        type="password"
        value={form.clave}
        onChange={handleChange}
        required
      />
      <Input
        id="fecha"
        label="Fecha de nacimiento"
        type="date"
        value={form.fecha}
        onChange={handleChange}
        required
      />
      <Button type="submit">Enviar</Button>

      {/* mensaje de error/éxito */}
      {msg && <p style={{ color: "crimson", marginTop: "1rem" }}>{msg}</p>}
    </form>
  );
};

export default UserForm;
