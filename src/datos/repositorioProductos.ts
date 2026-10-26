import { productos as catalogoBase, type Producto } from "./productos";

const CLAVE = "productos";
const PRODUCTOS_ACTUALIZADOS = "sonido-vivo:productos-actualizados";

export type ProductoNuevo = Omit<Producto, "id">;

function leerGuardados(): Producto[] {
    const guardado = localStorage.getItem(CLAVE);
    if (!guardado) return [];

    try {
        const datos: unknown = JSON.parse(guardado);
        return Array.isArray(datos) ? (datos as Producto[]) : [];
    } catch {
        return [];
    }
}

function guardarProductos(productos: Producto[]) {
    localStorage.setItem(CLAVE, JSON.stringify(productos));
    window.dispatchEvent(new CustomEvent(PRODUCTOS_ACTUALIZADOS));
}

export function CambiosProductos(callback: () => void): () => void {
    const alCambiar = () => callback();
    window.addEventListener(PRODUCTOS_ACTUALIZADOS, alCambiar);
    window.addEventListener("storage", (alCambiar));
    
    return () => {
        window.removeEventListener(PRODUCTOS_ACTUALIZADOS, alCambiar);
        window.removeEventListener("storage", alCambiar);
    }
}

function iniciarCatalogo() {
    if (localStorage.getItem(CLAVE) === null) {
        localStorage.setItem(CLAVE, JSON.stringify(catalogoBase));
    }
}

export function listarProductos(): Producto[] {
    iniciarCatalogo();
    return leerGuardados();
}

export function buscarProducto(id: number): Producto | undefined {
    return listarProductos().find((producto) => producto.id === id);
}

export function crearProducto(datos: ProductoNuevo): Producto {
    const productos = listarProductos();
    const siguienteId = productos.reduce((mayor, producto) => Math.max(mayor, producto.id), 0) + 1;
    const producto: Producto = { ...datos, id: siguienteId };

    guardarProductos([...productos, producto]);
    return producto;
}

export function actualizarProducto(id: number, cambios: Partial<ProductoNuevo>): Producto[] {
    const productos = listarProductos().map((producto) => (
        producto.id === id ? { ...producto, ...cambios } : producto
    ));

    guardarProductos(productos);
    return productos;
}

export function eliminarProducto(id: number): Producto[] {
    const productos = listarProductos().filter((producto) => producto.id !== id);

    guardarProductos(productos);
    return productos;
}

export function descontarStock(items: { id: number; cantidad: number }[]): Producto[] {
    const productos = listarProductos().map((producto) => {
        const item = items.find((entrada) => entrada.id === producto.id);
        if (!item) return producto;

        return { ...producto, stock: Math.max(producto.stock - item.cantidad, 0) };
    });

    guardarProductos(productos);
    return productos;
}

export function restablecerCatalogo(): Producto[] {
    guardarProductos(catalogoBase);
    return catalogoBase;
}
