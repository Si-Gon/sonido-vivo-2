import { listarProductosDelServicio, type ProductoAdmin } from "./repositorioCatalogo";
import type { Producto } from "./productos";

/**
 * Catalogo del sitio publico.
 *
 * No hay copia en el navegador: cada pantalla pide el catalogo al servicio. Antes se guardaba en
 * localStorage y el sitio seguia mostrando datos viejos cuando la base cambiaba o el servicio se
 * caia.
 */
export function aProducto(admin: ProductoAdmin): Producto {
    return {
        id: admin.id,
        codigo: admin.codigo,
        categoria: admin.categoria,
        nombre: admin.nombre,
        marca: admin.marca,
        modelo: admin.modelo,
        precio: Number(admin.precio),
        descuento: admin.descuento ?? undefined,
        stock: admin.stock,
        descripcion: admin.descripcion ?? "",
        imagen: admin.imagen ?? ""
    };
}

// Copia en memoria de la visita actual: la usan el carrito y los componentes que necesitan
// saber stock o precio sin volver a pedirlo. No se guarda en el navegador.
let enMemoria: Producto[] = [];

export function productoEnMemoria(id: number): Producto | undefined {
    return enMemoria.find((producto) => producto.id === id);
}

export async function listarProductos(): Promise<Producto[]> {
    const resultado = await listarProductosDelServicio();

    if (!resultado.ok) {
        throw new Error(resultado.motivo);
    }

    enMemoria = resultado.datos.map(aProducto);
    return enMemoria;
}

export async function buscarProducto(id: number): Promise<Producto | undefined> {
    const productos = await listarProductos();
    return productos.find((producto) => producto.id === id);
}
