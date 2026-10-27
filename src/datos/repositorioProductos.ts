import { productos as catalogoBase, type Producto } from "./productos";

const CLAVE = "productos";
const PRODUCTOS_ACTUALIZADOS = "sonido-vivo:productos-actualizados";

export type ProductoNuevo = Omit<Producto, "id">;

function leerGuardados(): Producto[] {
    const guardado = localStorage.getItem(CLAVE);
    if (!guardado) return [];

    try {
        const datos: unknown = JSON.parse(guardado);
        if (!Array.isArray(datos)) return [];

        // Un catálogo guardado antes de que existiera un campo no lo tiene: se completa con el
        // catálogo base para que los datos nuevos (como el descuento) lleguen a las pantallas
        // sin obligar a borrar el almacenamiento del navegador.
        const basePorId = new Map(catalogoBase.map((producto) => [producto.id, producto]));

        return (datos as Producto[]).map((producto) => {
            const base = basePorId.get(producto.id);
            return base ? { ...base, ...producto } : producto;
        });
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
    const productos = listarProductos()
    const existe = productos.some((producto) => producto.id === id);

    if (!existe) {
        throw new Error("No se encontró el producto.");
    }
    const productosActualizados = productos.map((producto) => 
        producto.id === id ? { ...producto, ...cambios } : producto
    );

    guardarProductos(productosActualizados);
    return productosActualizados;
}

export function eliminarProducto(id: number): Producto[] {
    const productos = listarProductos().filter((producto) => producto.id !== id);

    guardarProductos(productos);
    return productos;
}

export function descontarStock(items: { id: number; cantidad: number }[]): Producto[] {
    const productos = listarProductos()
    const cantidadesPorProducto = new Map<number, number>();

    for (const item of items) {
        if (
            !Number.isInteger(item.id) ||
            !Number.isInteger(item.cantidad) ||
            item.cantidad <= 0
        ) {
            throw new Error("El carrito contiene cantidades inválidas.");
        }

        cantidadesPorProducto.set(
            item.id,
            (cantidadesPorProducto.get(item.id) ?? 0) + item.cantidad
        );
    }

    for (const [id, cantidad] of cantidadesPorProducto) {
        const producto = productos.find((p) => p.id === id);

        if (!producto) {
            throw new Error("Uno de los productos del carrito ya no existe.");
        }

        if (producto.stock < cantidad) {
            throw new Error(`Stock insuficiente para "${producto.nombre}".`);
        }
    }

    const productosActualizados = productos.map((producto) => {
        const cantidad = cantidadesPorProducto.get(producto.id);

        if (cantidad === undefined) {
            return producto;
        }

        return {
            ...producto,
            stock: producto.stock - cantidad,
        };
    });

    guardarProductos(productosActualizados);
    return productosActualizados;
}

export function restablecerCatalogo(): Producto[] {
    guardarProductos(catalogoBase);
    return catalogoBase;
}
