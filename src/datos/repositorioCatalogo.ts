import { API_GATEWAY, pedirConReintento, cabecerasConToken } from "./apiServicios";

// Producto tal como lo entrega el servicio de catalogo: incluye el id de la categoria,
// que el panel necesita para editar sin adivinar por nombre.
/**
 * El gateway responde 500 o 503 cuando el servicio no está arriba: para el usuario eso no es un
 * número, es "no hay conexión".
 */
export function motivoDeEstado(estado: number): string {
    if (estado >= 500) {
        return "No se pudo conectar con el servicio de catálogo. Revisa que esté arriba.";
    }

    return `El servicio de catálogo respondió ${estado}.`;
}

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
            headers: cabecerasConToken(),
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
            headers: cabecerasConToken(),
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
            headers: cabecerasConToken(),
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
export async function descontarStockEnServicio(
    items: ItemParaDescontar[],
    referencia: string
): Promise<Resultado<number>> {
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

    // Una SALIDA por producto, con la boleta como referencia: queda en el kardex y no se repite.
    for (const [id, cantidad] of pedidoPorProducto) {
        const movimiento = await registrarMovimiento(id, "SALIDA", cantidad, "VENTA", referencia);

        if (!movimiento.ok) {
            return { ok: false, motivo: movimiento.motivo };
        }
    }

    return { ok: true, datos: pedidoPorProducto.size };
}

// ---------------------------------------------------------------- kardex

export type Movimiento = {
    id: number;
    productoId: number;
    codigo: string | null;
    producto: string | null;
    tipo: "ENTRADA" | "SALIDA";
    cantidad: number;
    motivo: string;
    referencia: string | null;
    stockResultante: number;
    creadoEn: string;
};

/**
 * Registra un movimiento de stock en el catalogo.
 *
 * La referencia es lo que hace el movimiento idempotente: dos llamadas con la misma referencia
 * y motivo no descuentan dos veces. `omitido` llega cuando se pide devolver una venta que no existe.
 */
export async function registrarMovimiento(
    productoId: number,
    tipo: "ENTRADA" | "SALIDA",
    cantidad: number,
    motivo: string,
    referencia: string
): Promise<{ ok: true; movimiento: Movimiento | null; omitido: boolean } | { ok: false; motivo: string }> {
    try {
        const respuesta = await pedirConReintento(`${API_GATEWAY}/api/productos/${productoId}/movimientos`, {
            method: "POST",
            headers: cabecerasConToken(),
            body: JSON.stringify({ tipo, cantidad, motivo, referencia })
        });

        if (respuesta.ok) {
            const cuerpo = (await respuesta.json()) as { movimiento?: Movimiento; omitido?: boolean };
            return { ok: true, movimiento: cuerpo.movimiento ?? null, omitido: cuerpo.omitido === true };
        }

        let motivoError = `El catálogo respondió ${respuesta.status}.`;

        try {
            const cuerpo = (await respuesta.json()) as { motivo?: string };
            motivoError = cuerpo.motivo ?? motivoError;
        } catch {
            /* sin cuerpo */
        }

        return { ok: false, motivo: motivoError };
    } catch {
        return { ok: false, motivo: "No se pudo conectar con el servicio de catálogo." };
    }
}

export type FiltrosMovimientos = {
    productoId?: number;
    tipo?: "ENTRADA" | "SALIDA" | "";
    motivo?: string;
    texto?: string;
};

/** Historial completo del kardex, con filtros. Sin filtros trae todos los movimientos. */
export async function historialMovimientos(filtros: FiltrosMovimientos = {}): Promise<Movimiento[]> {
    const parametros = new URLSearchParams();

    if (filtros.productoId) parametros.set("productoId", String(filtros.productoId));
    if (filtros.tipo) parametros.set("tipo", filtros.tipo);
    if (filtros.motivo) parametros.set("motivo", filtros.motivo);
    if (filtros.texto?.trim()) parametros.set("texto", filtros.texto.trim());

    const consulta = parametros.toString();
    const respuesta = await pedirConReintento(
        `${API_GATEWAY}/api/movimientos${consulta ? `?${consulta}` : ""}`
    );

    if (!respuesta.ok) {
        throw new Error(motivoDeEstado(respuesta.status));
    }

    return (await respuesta.json()) as Movimiento[];
}

/** Historial de stock de un producto, del movimiento más nuevo al más viejo. */
export async function listarMovimientos(productoId: number): Promise<Movimiento[]> {
    const respuesta = await pedirConReintento(`${API_GATEWAY}/api/productos/${productoId}/movimientos`);

    if (!respuesta.ok) {
        throw new Error(motivoDeEstado(respuesta.status));
    }

    return (await respuesta.json()) as Movimiento[];
}
