export const CATEGORIAS = [
  { id: 'Frutas Frescas', img: '../assets/image/categoriafruta.png' },
  { id: 'Verduras Orgánicas', img: '../assets/image/categoriaverduras.png' },
  { id: 'Productos Orgánicos', img: '../assets/image/categoriaOrganicos.png' },
  { id: 'Lácteos', img: '../assets/image/categorialacteos.png' }
];


export const PRODUCTOS = [
  // Frutas
  { id:'FR001', nombre:'Manzanas Fuji',      precio:1200, categoria:'Frutas Frescas',      img:'../assets/image/manzanafuji.png' },
  { id:'FR002', nombre:'Naranjas Valencia',  precio:1000, categoria:'Frutas Frescas',      img:'../assets/image/naranja.png' },
  { id:'FR003', nombre:'Plátanos Cavendish', precio:800,  categoria:'Frutas Frescas',      img:'../assets/image/platano.png' },
  { id:'FR004', nombre:'Uvas Verdes',        precio:1300, categoria:'Frutas Frescas',      img:'../assets/image/uvasverdes.png' },

  // Verduras
  { id:'VR001', nombre:'Zanahorias Orgánicas', precio:900,  categoria:'Verduras Orgánicas',  img:'../assets/image/zanahoria.png' },
  { id:'VR002', nombre:'Espinacas Frescas',    precio:700,  categoria:'Verduras Orgánicas',  img:'../assets/image/espinaca.png' },
  { id:'VR003', nombre:'Pimientos Tricolores', precio:1500, categoria:'Verduras Orgánicas',  img:'../assets/image/pimientos.png' },

  // Orgánicos
  { id:'PO001', nombre:'Miel Orgánica 500g',  precio:5000, categoria:'Productos Orgánicos', img:'../assets/image/miel.png' },
  { id:'PO003', nombre:'Quinua Orgánica',     precio:4200, categoria:'Productos Orgánicos', img:'../assets/image/quinoa.png' },

  // Lácteos
  { id:'PL001', nombre:'Leche Entera 1L',     precio:1100, categoria:'Lácteos',             img:'../assets/image/leche.png' },
];
