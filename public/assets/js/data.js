// public/assets/js/data.js
export const PRODUCTOS = [
  {
    id: 'p1',
    activo: true,
    categoria: 'Verduras Orgánicas',
    nombre: 'Zanahorias Orgánicas',
    descripcion: 'Zanahorias frescas sin pesticidas, listas para ensaladas.',
    imagen: '../assets/image/zanahoria.png',
    origen: 'Región del Ñuble',
    oferta: false,
    precio: 900,
    stock: 40
  },
  {
    id: 'p2',
    activo: true,
    categoria: 'Frutas Frescas',
    nombre: 'Manzanas Rojas',
    descripcion: 'Manzanas dulces de huertos locales.',
    imagen: '../assets/image/manzanas.png',
    origen: 'Región del Maule',
    oferta: true,
    precio: 1200,
    precioAnterior: 1500,
    stock: 30
  },
  {
    id: 'p3',
    activo: true,
    categoria: 'Lácteos',
    nombre: 'Yogurt Artesanal',
    descripcion: 'Yogurt natural sin azúcar.',
    imagen: '../assets/image/yogurt.png',
    origen: 'Región de Los Lagos',
    oferta: false,
    precio: 1800,
    stock: 25
  },
  {
    id: 'p4',
    activo: true,
    categoria: 'Productos Orgánicos',
    nombre: 'Miel Orgánica',
    descripcion: 'Miel pura 100% natural, cosechada en bosques nativos.',
    imagen: '../assets/image/miel.png',
    origen: 'Región del Biobío',
    oferta: true,
    precio: 3500,
    precioAnterior: 4200,
    stock: 20
  }
];
