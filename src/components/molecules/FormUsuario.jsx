import React, { useState } from "react";
import Input from "../atoms/Input";
import Button from "../atoms/Button";
import { validarCorreo, validarRun, esMayorEdad} from "../../utils/script";
import { addUser } from "../../services/firestoreService";
import { useHistory } from "react-router-dom";

const FormUsuario = () => {
    const [form, setForm] = useState({run:"", nombre:"", correo:"", clave:"", fecha:""})
    const [msg, setMsg ] = useState("");
    const history = useHistory();

    const handleChange = e => setForm({ ...form, [e.tarhet.id]: e.target.value});

    const handleSubmit = async e => {
        e.preventDefoult();
        const { run, nombre, correo, clave, fecha} = form;
        if (!validarRun(run)) return setMsg("RUN es incorrecto");
        if (!nombre) return setMsg("Nombre en blanco");
        if (!validarCorreo(correo)) return setMsg("Correo incorrecto");
        if (!clave) return setMsg("Clave en blanco");
        if (!esMayorEdad(fecha)) return setMsg("Debe ser mayor de 18 años");

        await addUser(form);
        setMsg("Formularío de envió correctamente");
        setTimeout(() => {
            history.push(correo === "admin@duoc.cl" ? "/perfilAdmin?nombre="+nombre : "/perfilCliente?nombre="+nombre);

        }, 1000);
    };

    return (
        <form onSubmit={handleSubmit}>
            <Input id="run" label="RUN" value={form.run} onChange ={handleChange} required />
            <Input id="nombre" label="Nombre" value={form.nombre} onChange ={handleChange} required />
            <Input id="correo" label="Correo" type="email" value={form.correo} onChange ={handleChange} required />
            <Input id="clave" label="Clave" type="password" value={form.clave} onChange ={handleChange} required />
            <Input id="fecha" label="Fecha de Nacimiento" type="date" value={form.fecha} onChange ={handleChange} required />
            <Button type="submit">Enviar</Button>
            <p style={{color: "crimson"}}>{msg}</p>
        </form>
    );
};
export default FormUsuario;   