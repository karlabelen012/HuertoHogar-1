// ==========================================================
// 🎟️ HUERTO HOGAR - OFERTA.JS
// ==========================================================
import { db } from "./firebase.js";

import {
  getDocs,
  collection
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

// Retorna el porcentaje de descuento (0.1 = 10%) si el código es válido
export async function validarCodigo(codigo) {
  try {
    const snap = await getDocs(collection(db, "ofertas"));
    for (const docu of snap.docs) {
      const data = docu.data();
      const code = (data.codigo || "").toLowerCase();
      if (code === codigo.toLowerCase() && data.activo) {
        return Number(data.descuento || 0); // ej: 0.1 = 10%
      }
    }
    return null;
  } catch (err) {
    console.error("Error validando código:", err);
    return null;
  }
}
