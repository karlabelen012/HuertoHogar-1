// =======================================================
// Huerto Hogar - Ajustes visuales de páginas informativas
// =======================================================

// helper rápido
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

// 1️⃣ Ajustar secciones de "Nosotros"
export function initNosotros() {
  const cards = $$(".mision-card, .vision-card, .proposito-card");
  cards.forEach(c => {
    c.style.background = "#fff";
    c.style.borderRadius = "12px";
    c.style.boxShadow = "0 2px 6px rgba(0,0,0,0.08)";
    c.style.padding = "20px";
  });

  // imagen de equipo centrada
  const equipoImg = $("#imgEquipo");
  if (equipoImg) {
    equipoImg.style.maxWidth = "280px";
    equipoImg.style.display = "block";
    equipoImg.style.margin = "20px auto";
    equipoImg.style.borderRadius = "10px";
  }
}

// 2️⃣ Ajustar estructura de Blogs (listado)
export function initBlogs() {
  const cards = $$(".blog-card");
  cards.forEach(c => {
    c.style.background = "#fff";
    c.style.borderRadius = "12px";
    c.style.boxShadow = "0 2px 6px rgba(0,0,0,0.08)";
    c.style.overflow = "hidden";
    c.style.marginBottom = "25px";
  });

  // imágenes de los blogs
  $$(".blog-card img").forEach(img => {
    img.style.width = "100%";
    img.style.height = "220px";
    img.style.objectFit = "cover";
  });
}

// 3️⃣ Ajustar detalle de Blog
export function initBlogDetalle() {
  const cont = $("#blogCuerpo");
  if (cont) {
    cont.style.background = "#fff";
    cont.style.borderRadius = "12px";
    cont.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
    cont.style.padding = "25px";
    cont.style.marginTop = "20px";
  }

  const img = $("#blogImg");
  if (img) {
    img.style.display = "block";
    img.style.margin = "0 auto 20px";
    img.style.maxWidth = "600px";
    img.style.borderRadius = "8px";
  }
}

// 4️⃣ Ajustar Detalle Producto
export function initDetalleProducto() {
  const main = $(".producto-detalle");
  if (main) {
    main.style.display = "flex";
    main.style.flexWrap = "wrap";
    main.style.gap = "40px";
    main.style.alignItems = "flex-start";
  }

  const img = $("#imgPrincipal");
  if (img) {
    img.style.maxWidth = "350px";
    img.style.borderRadius = "8px";
    img.style.boxShadow = "0 2px 6px rgba(0,0,0,0.1)";
  }

  const desc = $("#descripcionProducto");
  if (desc) {
    desc.style.fontSize = "1rem";
    desc.style.lineHeight = "1.6";
    desc.style.marginTop = "10px";
  }
}

// 5️⃣ Ajustar Categorías y Productos
export function initCatalogo() {
  const grid = $$(".card, .producto-card");
  grid.forEach(card => {
    card.style.transition = "all 0.3s ease";
    card.addEventListener("mouseenter", () => {
      card.style.transform = "translateY(-5px)";
      card.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "none";
      card.style.boxShadow = "0 2px 6px rgba(0,0,0,0.08)";
    });
  });
}

// Inicializador automático según página
document.addEventListener("DOMContentLoaded", () => {
  const path = location.pathname;
  if (path.includes("nosotros")) initNosotros();
  if (path.includes("blogs")) initBlogs();
  if (path.includes("blog_")) initBlogDetalle();
  if (path.includes("detalleProducto")) initDetalleProducto();
  if (path.includes("productos") || path.includes("categorias"))
    initCatalogo();
});
