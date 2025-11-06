// src/services/firestoreService.js
import { db } from "../config/firebase";
import { collection, addDoc } from "firebase/firestore";

export async function addUser(user) {
  try {
    const docRef = await addDoc(collection(db, "usuario"), {
      ...user,             // user = { nombre, correo, clave, etc. }
      createdAt: new Date()
    });
    console.log("Usuario agregado con ID:", docRef.id);
    return docRef;
  } catch (error) {
    console.error("Error al guardar usuario:", error);
    throw error; // Propaga el error para que el frontend muestre mensaje
  }
}
