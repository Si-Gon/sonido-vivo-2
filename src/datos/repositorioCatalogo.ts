import { API_GATEWAY } from "./apiServicios";

// Producto tal como lo entrega el servicio de catalogo: incluye el id de la categoria,
// que el panel necesita para editar sin adivinar por nombre.
export type ProductoAdmin = {
    id: number;
    codigo: string;
    categoriaId: number;
    categoria: string;
    nombre: string;
    marca: string;
    modelo: string;
    precio: number;
    descuento: number | null;
    stock: number;
    descripcion: string | null;
    imagen: string | null;
    activo: boolean;
};

export type CategoriaAdmin = {
    id: number;
    nombre: string;
    productos: number;
};

export type ProductoParaGuardar = {
    codigo: string;
    categoriaId: number;
    nombre: string;
    marca: string;
    modelo: string;
    precio: number;
    descuento: number | null;
    stock: number;
    descripcion: string;
    imagen: string;
    activo: boolean;
};

export type Resultado<T> =
    | { ok: true; datos: T }
    | { ok: false; motivo: string };

const BASE = `${API_GATEWAY}/api`;

async function leerMotivo(respuesta: Response, porDefecto: string) {
    try {
        const cuerpo = (await respuesta.json()) as { motivo?: string; message?: string };
        return cuerpo.motivo ?? cuerpo.message ?? porDefecto;
    } catch {
        return porDefecto;
    }
}

export async function listarProductosDelServicio(): Promise<Resultado<ProductoAdmin[]>> {
    try {
        const respuesta = await fetch(`${BASE}/productos`);

        if (!respuesta.ok) {
            return { ok: false, motivo: `El servicio de catalogo respondio ${respuesta.status}.` };
        }

        return { ok: true, datos: (await respuesta.json()) as ProductoAdmin[] };
    } catch {
        return { ok: false, motivo: "No se pudo conectar con el servicio de catalogo." };
    }
}

export async function listarCategoriasDelServicio(): Promise<Resultado<CategoriaAdmin[]>> {
    try {
        const respuesta = await fetch(`${BASE}/categorias`);

        if (!respuesta.ok) {
            return { ok: false, motivo: `El servicio de catalogo respondio ${respuesta.status}.` };
        }

        return { ok: true, datos: (await respuesta.json()) as CategoriaAdmin[] };
    } catch {
        return { ok: false, motivo: "No se pudo conectar con el servicio de catalogo." };
    }
}

export async function crearProductoEnServicio(datos: ProductoParaGuardar): Promise<Resultado<ProductoAdmin>> {
    try {
        const respuesta = await fetch(`${BASE}/productos`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos)
        });

        if (respuesta.status === 201) {
            return { ok: true, datos: (await respuesta.json()) as ProductoAdmin };
        }

        return { ok: false, motivo: await leerMotivo(respuesta, "No se pudo crear el producto.") };
    } catch {
        return { ok: false, motivo: "No se pudo conectar con el servicio de catalogo." };
    }
}

export async function actualizarProductoEnServicio(id: number, datos: ProductoParaGuardar): Promise<Resultado<ProductoAdmin>> {
    try {
        const respuesta = await fetch(`${BASE}/productos/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos)
        });

        if (respuesta.ok) {
            return { ok: true, datos: (await respuesta.json()) as ProductoAdmin };
        }

        if (respuesta.status === 404) {
            return { ok: false, motivo: "El producto ya no existe en el catalogo." };
        }

        return { ok: false, motivo: await leerMotivo(respuesta, "No se pudo guardar el producto.") };
    } catch {
        return { ok: false, motivo: "No se pudo conectar con el servicio de catalogo." };
    }
}

export async function desactivarProductoEnServicio(id: number): Promise<Resultado<null>> {
    try {
        const respuesta = await fetch(`${BASE}/productos/${id}`, { method: "DELETE" });

        if (respuesta.status === 204) {
            return { ok: true, datos: null };
        }

        if (respuesta.status === 404) {
            return { ok: false, motivo: "El producto ya no existe en el catalogo." };
        }

        return { ok: false, motivo: await leerMotivo(respuesta, "No se pudo quitar el producto.") };
    } catch {
        return { ok: false, motivo: "No se pudo conectar con el servicio de catalogo." };
    }
}

export async function ajustarStockEnServicio(id: number, stock: number): Promise<Resultado<ProductoAdmin>> {
    try {
        const respuesta = await fetch(`${BASE}/productos/${id}/stock`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ stock })
        });

        if (respuesta.ok) {
            return { ok: true, datos: (await respuesta.json()) as ProductoAdmin };
        }

        if (respuesta.status === 404) {
            return { ok: false, motivo: "El producto ya no existe en el catálogo." };
        }

        return { ok: false, motivo: await leerMotivo(respuesta, "No se pudo actualizar el stock.") };
    } catch {
        return { ok: false, motivo: "No se pudo conectar con el servicio de catálogo." };
    }
}

export type ItemParaDescontar = { id: number; cantidad: number };

/**
 * Descuenta del stock del servicio lo que lleva el carrito. Se lee el stock actual antes de
 * escribir, para no pisar una venta hecha desde otra pestaña, y se valida que alcance.
 */
export async function descontarStockEnServicio(items: ItemParaDescontar[]): Promise<Resultado<number>> {
    const lista = await listarProductosDelServicio();

    if (!lista.ok) {
        return { ok: false, motivo: lista.motivo };
    }

    const porId = new Map(lista.datos.map((producto) => [producto.id, producto]));
    const pedidoPorProducto = new Map<number, number>();

    for (const item of items) {
        if (!Number.isInteger(item.cantidad) || item.cantidad <= 0) {
            return { ok: false, motivo: "El carrito contiene cantidades inválidas." };
        }

        pedidoPorProducto.set(item.id, (pedidoPorProducto.get(item.id) ?? 0) + item.cantidad);
    }

    // Primero se valida todo: no se descuenta nada si algún producto no alcanza.
    for (const [id, cantidad] of pedidoPorProducto) {
        const producto = porId.get(id);

        if (!producto) {
            return { ok: false, motivo: "Uno de los productos del carrito ya no está en el catálogo." };
        }

        if (producto.stock < cantidad) {
            return {
                ok: false,
                motivo: `Stock insuficiente para "${producto.nombre}": quedan ${producto.stock} y el carrito pide ${cantidad}.`
            };
        }
    }

    for (const [id, cantidad] of pedidoPorProducto) {
        const producto = porId.get(id)!;
        const resultado = await ajustarStockEnServicio(id, producto.stock - cantidad);

        if (!resultado.ok) {
            return { ok: false, motivo: resultado.motivo };
        }
    }

    return { ok: true, datos: pedidoPorProducto.size };
}
