import { db } from '../config/firebase';
import { collection, getDocs } from 'firebase/firestore';

async function testFirebase() {
  try {
    const snap = await getDocs(collection(db, 'usuario'));
    console.log(`✅ Firestore conectado. Documentos encontrados: ${snap.size}`);
  } catch (error) {
    console.error('❌ Error conectando a Firebase:', error);
  }
}

testFirebase();
