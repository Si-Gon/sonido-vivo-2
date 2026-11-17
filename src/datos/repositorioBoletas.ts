import { API_GATEWAY, pedirConReintento } from "./apiServicios";
import { leerSesion } from "./sesion";
import { buscarProducto } from "./repositorioProductos";
import { precioVigente } from "../utilidades/formato";

export type ItemParaBoleta = { id: number; cantidad: number };

export type ResultadoBoleta =
    | { ok: true; id: number; total: number }
    | { ok: false; motivo: string };

/**
 * Emite la boleta en el servicio de boletas. El servicio calcula subtotales y total:
 * el navegador solo manda el carrito.
 */
export async function emitirBoletaEnServicio(items: ItemParaBoleta[]): Promise<ResultadoBoleta> {
    const sesion = leerSesion();

    if (!sesion) {
        return { ok: false, motivo: "Debes iniciar sesión para comprar." };
    }

    const lineas = items
        .map((item) => {
            const producto = buscarProducto(item.id);
            if (!producto) return null;

            return {
                productoId: producto.id,
                nombreProducto: producto.nombre,
                precioUnitario: precioVigente(producto.precio, producto.descuento),
                cantidad: item.cantidad
            };
        })
        .filter((linea): linea is NonNullable<typeof linea> => linea !== null);

    if (lineas.length !== items.length) {
        return { ok: false, motivo: "Uno de los productos del carrito ya no está en el catálogo." };
    }

    try {
        const respuesta = await pedirConReintento(`${API_GATEWAY}/api/pedidos`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                usuarioId: sesion.id,
                nombreCliente: sesion.nombre,
                emailCliente: sesion.email,
                items: lineas
            })
        });

        if (respuesta.status === 201) {
            const boleta = (await respuesta.json()) as { id: number; total: number };
            return { ok: true, id: boleta.id, total: boleta.total };
        }

        let motivo = `El servicio de boletas respondió ${respuesta.status}.`;

        try {
            const cuerpo = (await respuesta.json()) as { motivo?: string; message?: string };
            motivo = cuerpo.motivo ?? cuerpo.message ?? motivo;
        } catch {
            /* sin cuerpo: se queda el mensaje por defecto */
        }

        return { ok: false, motivo };
    } catch {
        return { ok: false, motivo: "No se pudo conectar con el servicio de boletas." };
    }
}

// ---------------------------------------------------------------- panel de pedidos

export type EstadoBoleta = "PENDIENTE" | "EN_PREPARACION" | "DESPACHADO" | "ENTREGADO" | "CANCELADO";

export const ESTADOS_BOLETA: { valor: EstadoBoleta; etiqueta: string }[] = [
    { valor: "PENDIENTE", etiqueta: "Pendiente de despacho" },
    { valor: "EN_PREPARACION", etiqueta: "En preparación" },
    { valor: "DESPACHADO", etiqueta: "Despachado" },
    { valor: "ENTREGADO", etiqueta: "Entregado" },
    { valor: "CANCELADO", etiqueta: "Cancelado" }
];

export type LineaBoleta = {
    productoId: number;
    nombreProducto: string;
    precioUnitario: number;
    cantidad: number;
    subtotal: number;
};

export type Boleta = {
    id: number;
    usuarioId: number;
    nombreCliente: string;
    emailCliente: string;
    total: number;
    estado: EstadoBoleta;
    fechaCreacion: string;
    items: LineaBoleta[];
};

export type DespachoDelPedido = {
    id: number;
    pedidoId: number;
    tipoEntrega: "DOMICILIO" | "RETIRO";
    nombre: string;
    telefono: string;
    region: string | null;
    comuna: string | null;
    direccion: string | null;
    referencia: string | null;
    costoEnvio: number;
};

/** Boletas registradas en el servicio, de la más nueva a la más antigua. */
export async function listarBoletas(estado?: EstadoBoleta): Promise<Boleta[]> {
    const consulta = estado ? `?estado=${estado}` : "";
    const respuesta = await pedirConReintento(`${API_GATEWAY}/api/pedidos${consulta}`);

    if (!respuesta.ok) {
        throw new Error(`El servicio de boletas respondió ${respuesta.status}.`);
    }

    return (await respuesta.json()) as Boleta[];
}

/** Cambia el estado de la boleta en el servicio. */
export async function cambiarEstadoBoleta(id: number, estado: EstadoBoleta): Promise<Boleta> {
    const respuesta = await pedirConReintento(`${API_GATEWAY}/api/pedidos/${id}/estado`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado })
    });

    if (!respuesta.ok) {
        let motivo = `El servicio de boletas respondió ${respuesta.status}.`;

        try {
            const cuerpo = (await respuesta.json()) as { motivo?: string };
            motivo = cuerpo.motivo ?? motivo;
        } catch {
            /* sin cuerpo */
        }

        throw new Error(motivo);
    }

    return (await respuesta.json()) as Boleta;
}

/** Despachos registrados, para cruzarlos con la boleta por pedidoId. */
export async function listarDespachos(): Promise<DespachoDelPedido[]> {
    const respuesta = await pedirConReintento(`${API_GATEWAY}/api/despachos`);

    if (!respuesta.ok) {
        throw new Error(`El servicio de despachos respondió ${respuesta.status}.`);
    }

    return (await respuesta.json()) as DespachoDelPedido[];
}

/** Boletas de un usuario: lo usa el historial de compras del panel de usuarios. */
export async function listarBoletasDeUsuario(usuarioId: number): Promise<Boleta[]> {
    const respuesta = await pedirConReintento(`${API_GATEWAY}/api/pedidos?usuarioId=${usuarioId}`);

    if (!respuesta.ok) {
        throw new Error(`El servicio de boletas respondió ${respuesta.status}.`);
    }

    return (await respuesta.json()) as Boleta[];
}

/** Una boleta puntual: la usan la pantalla de despacho y el comprobante de compra. */
export async function obtenerBoleta(id: number): Promise<Boleta | undefined> {
    const respuesta = await pedirConReintento(`${API_GATEWAY}/api/pedidos/${id}`);

    if (respuesta.status === 404) return undefined;

    if (!respuesta.ok) {
        throw new Error(`El servicio de boletas respondió ${respuesta.status}.`);
    }

    return (await respuesta.json()) as Boleta;
}

/** Despacho registrado para un pedido, si ya se completó el formulario. */
export async function obtenerDespachoDePedido(pedidoId: number): Promise<DespachoDelPedido | undefined> {
    const respuesta = await pedirConReintento(`${API_GATEWAY}/api/despachos/pedido/${pedidoId}`);

    if (respuesta.status === 404) return undefined;

    if (!respuesta.ok) {
        throw new Error(`El servicio de despachos respondió ${respuesta.status}.`);
    }

    return (await respuesta.json()) as DespachoDelPedido;
}
