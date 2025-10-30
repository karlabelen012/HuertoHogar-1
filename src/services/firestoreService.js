// src/services/firestoreService.js
import { db } from "../config/firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";

// guardar usuario (tu video)
export async function addUser(user) {
  const docRef = await addDoc(collection(db, "usuario"), {
    ...user,
    createdAt: serverTimestamp(),
  });
  console.log("Usuario registrado con ID: ", docRef.id);
  return docRef;
}

// obtener productos (con filtro opcional)
export async function getProductos(categoria = null) {
  const colRef = collection(db, "productos");

  let snap;
  if (categoria) {
    const q = query(colRef, where("categoria", "==", categoria));
    snap = await getDocs(q);
  } else {
    snap = await getDocs(colRef);
  }

  const productos = [];
  snap.forEach((d) => productos.push({ id: d.id, ...d.data() }));
  return productos;
}

// guardar orden (checkout)
export async function addOrden(orden) {
  const docRef = await addDoc(collection(db, "ordenes"), {
    ...orden,
    createdAt: serverTimestamp(),
  });
  console.log("Orden registrada con ID: ", docRef.id);
  return docRef;
}
