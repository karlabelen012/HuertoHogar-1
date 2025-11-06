import React, { useState, useEffect } from 'react';
import { db } from '../../services/firebase';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './Checkout.css';

const Checkout = () => {
  const [carrito, setCarrito] = useState([]);
  const [form, setForm] = useState({ nombre: '', correo: '', direccion: '' });
  const [procesando, setProcesando] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('hh_cart') || '[]');
    setCarrito(cart);
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.id]: e.target.value });

  const validar = () => {
    if (form.nombre.length < 3) return alert('Nombre muy corto');
    if (!form.correo.includes('@')) return alert('Correo inválido');
    if (!form.direccion) return alert('Ingresa una dirección');
    return true;
  };

  const generarOrden = async () => {
    if (!validar()) return;
    setProcesando(true);
    const total = carrito.reduce((a, b) => a + b.precio * b.cantidad, 0);
    const compra = {
      fecha: new Date(),
      cliente: form,
      productos: carrito,
      total,
      estado: 'pendiente',
    };
    try {
      const docRef = await addDoc(collection(db, 'compras'), compra);
      await updateDoc(doc(db, 'compras', docRef.id), { numeroOrden: docRef.id });
      localStorage.removeItem('hh_cart');
      navigate('/pago-correcto');
    } catch (e) {
      console.error(e);
      navigate('/pago-error');
    } finally {
      setProcesando(false);
    }
  };

  return (
    <main className="checkout">
      <h1>Checkout</h1>
      <div>
        {carrito.map((p, i) => (
          <p key={i}>{p.nombre} x{p.cantidad} = ${p.precio * p.cantidad}</p>
        ))}
      </div>
      <input id="nombre" placeholder="Nombre" onChange={handleChange} />
      <input id="correo" placeholder="Correo" onChange={handleChange} />
      <input id="direccion" placeholder="Dirección" onChange={handleChange} />
      <button onClick={generarOrden} disabled={procesando}>
        {procesando ? 'Procesando...' : 'Pagar ahora'}
      </button>
    </main>
  );
};

export default Checkout;
