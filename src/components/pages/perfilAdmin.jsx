import React from "react";
import { useLocation } from "react-router-dom";

// helper chiquitito
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const PerfilAdmin = () => {
  const query = useQuery();
  const nombre = query.get("nombre") || "Administrador";
  const tab = query.get("tab") || "dashboard";

  return (
    <div className="container py-4">
      <h1>Perfil Administrador</h1>
      <p>Hola, {nombre}</p>
      <p>Sección activa: {tab}</p>
    </div>
  );
};

export default PerfilAdmin;
