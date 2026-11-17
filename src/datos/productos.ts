export type Producto = {
    id: number;
    codigo: string;
    categoria: string;
    nombre: string;
    marca: string;
    modelo: string;
    precio: number;
    descuento?: number;
    stock: number;
    descripcion: string;
    imagen: string;
};

// El catálogo ya no se escribe en el código: lo entrega el servicio de catálogo.

// Categorías del filtro del catálogo: coinciden con las de la migración V3 del servicio.
export const categorias: string[] = [
    "Guitarras Acústicas",
    "Guitarras Eléctricas",
    "Bajos Eléctricos",
    "Baterías",
    "Teclados y Pianos",
    "Amplificadores",
    "Pedales de Efectos",
    "Micrófonos",
    "Estudio y Grabación",
    "Accesorios"
];
