// src/components/pages/LoginWrapper.jsx
import { useContext, useEffect } from "react";
import { UserContext } from "../../contexts/UserContext";
import { useHistory } from "react-router-dom";

// Componente que revisa si hay usuario logueado en localStorage y actualiza el contexto
const LoginWrapper = () => {
  const { setUser } = useContext(UserContext);
  const history = useHistory();

  useEffect(() => {
    // Misma key que usa login.html y el resto del sitio
    const raw = localStorage.getItem("hh_auth");

    if (!raw) return;

    try {
      const usuario = JSON.parse(raw);
      if (!usuario) return;

      setUser(usuario); // Actualizar contexto global

      // Redirigir a la página correspondiente según el rol
      const rol = usuario.rol || "cliente";
      history.push(rol === "admin" ? "/perfilAdmin" : "/perfilCliente");
    } catch (e) {
      // Si algo viene corrupto, limpiamos sesión
      console.error("Error leyendo hh_auth:", e);
      localStorage.removeItem("hh_auth");
    }
  }, [setUser, history]);

  return null; // No renderiza nada, solo actúa en segundo plano
};

export default LoginWrapper;
