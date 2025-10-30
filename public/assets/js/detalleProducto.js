import { PRODUCTOS } from './data.js';
import { Cart } from './cart.js';

const qs = new URLSearchParams(location.search);
const id = qs.get('id');
const p = PRODUCTOS.find(x => x.id === id);
if(!p) { /* podrías redirigir a productos */ }

const $img  = document.getElementById('imgPrincipal');
const $mini = document.getElementById('mini1');
const $nom  = document.getElementById('nombreProducto');
const $pre  = document.getElementById('precioProducto');
const $desc = document.getElementById('descripcionProducto');
const $cant = document.getElementById('cantidad');
const $rel  = document.getElementById('relacionados');

const clp = n => n.toLocaleString('es-CL',{style:'currency',currency:'CLP',maximumFractionDigits:0});

// Render principal
$img.src = p.img; $mini.src = p.img;
$nom.textContent = p.nombre;
$pre.textContent = clp(p.precio);
$desc.textContent = `Delicioso(a) ${p.nombre} de nuestra tienda HuertoHogar.`;

// Relacionados (misma categoría, diferente id)
const rel = PRODUCTOS.filter(x => x.categoria===p.categoria && x.id!==p.id).slice(0,1)[0];
if(rel){
  $rel.innerHTML = `
    <a href="./detalleProducto.html?id=${rel.id}" class="text-decoration-none text-dark">
      <div class="card">
        <img src="${rel.img}" class="card-img-top" alt="${rel.nombre}" style="height:180px;object-fit:contain;">
        <div class="card-body text-center">
          <h6 class="card-title">${rel.nombre}</h6>
          <p class="text-success fw-semibold">${clp(rel.precio)}</p>
        </div>
      </div>
    </a>`;
}

// Añadir al carrito
document.getElementById('btnAgregar').addEventListener('click', ()=>{
  const qty = Math.max(1, parseInt($cant.value)||1);
  Cart.add(p, qty);
  alert(`✅ ${p.nombre} (${qty}) añadido al carrito.`);
});
