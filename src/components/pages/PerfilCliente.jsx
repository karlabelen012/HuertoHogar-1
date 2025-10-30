import React from "react";
import { useLocation } from "react-router-dom";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const PerfilCliente = () => {
  const query = useQuery();
  const nombre = query.get("nombre") || "Cliente Huerto Hogar";
  const tab = query.get("tab") || "perfil";

  return (
    <div className="container py-4">
      <h1>Perfil del Cliente</h1>
      <p>Hola, {nombre}</p>
      <p>Pestaña: {tab}</p>
    </div>
  );
};

export default PerfilCliente;
