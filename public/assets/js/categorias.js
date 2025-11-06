// ==========================================================
// 🍋 HUERTO HOGAR - CATEGORIAS.JS (sin data.js)
// ==========================================================
const CATEGORIAS = [
  {
    id: "frutas",
    nombre: "Frutas frescas",
    img: "../assets/img/cat-frutas.jpg",
  },
  {
    id: "verduras",
    nombre: "Verduras orgánicas",
    img: "../assets/img/cat-verduras.jpg",
  },
  {
    id: "lacteos",
    nombre: "Lácteos",
    img: "../assets/img/cat-lacteos.jpg",
  },
  {
    id: "organicos",
    nombre: "Productos orgánicos",
    img: "../assets/img/cat-organicos.jpg",
  },
];

const gridCat = document.getElementById("gridCategorias");

if (gridCat) {
  gridCat.innerHTML = CATEGORIAS.map(
    (c) => `
    <div class="col-6 col-md-3 mb-3">
      <a href="./productos.html?cat=${encodeURIComponent(c.id)}" class="text-decoration-none text-dark">
        <div class="card h-100 shadow-sm">
          <img src="${c.img}" class="card-img-top" alt="${c.nombre}" style="height:150px;object-fit:cover;">
          <div class="card-body text-center">
            <h6 class="card-title mb-0">${c.nombre}</h6>
          </div>
        </div>
      </a>
    </div>`
  ).join("");
}
