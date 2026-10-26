
import { leerSesion } from "./sesion";
import { buscarProducto } from "./repositorioProductos";
import type { ItemCarrito } from "./carrito";

const CLAVE = "sonido-vivo:pedidos";
const EVENTO_CAMBIO = "sonido-vivo:pedidos-actualizados";

export type EstadoPedido = "Pendiente de despacho" | "En preparación" | "Despachado" | "Entregado" | "Cancelado";

export type ItemPedido = {
    productoId: number;
    nombre: string;
    precioUnitario: number;
    cantidad: number;
    subtotal: number;
};

export type DatosDespacho = {
    nombre: string;
    telefono: string;
    region: string;
    comuna: string;
    direccion: string;
    referencia: string;
};

export type Pedido = {
    id: number;
    usuarioId: number;
    nombreCliente: string;
    emailCliente: string;
    items: ItemPedido[];
    total: number;
    estado: EstadoPedido;
    despacho: DatosDespacho | null;
    fechaCreacion: string;
};

function leerGuardados(): Pedido[] {
    const guardado = localStorage.getItem(CLAVE);

    if (!guardado) return [];

    try {
        const datos: unknown = JSON.parse(guardado);
        return Array.isArray(datos) ? datos as Pedido[] : [];
    } catch {
        return [];
    }
}

function guardarPedidos(pedidos: Pedido[]) {
    localStorage.setItem(CLAVE, JSON.stringify(pedidos));
    window.dispatchEvent(new Event(EVENTO_CAMBIO));
}

export function listarPedidos(): Pedido[] {
    return leerGuardados();
}

export function buscarPedidoPorId(id: number): Pedido | undefined {
    return listarPedidos().find((pedido) => pedido.id === id);
}

export function listarPedidosPorUsuario(usuarioId: number): Pedido[] {
    return listarPedidos().filter((pedido) => pedido.usuarioId === usuarioId);
}

export function suscribirCambiosPedidos(callback: () => void): () => void {
    window.addEventListener(EVENTO_CAMBIO, callback);
    window.addEventListener("storage", callback);

    return () => {
        window.removeEventListener(EVENTO_CAMBIO, callback);
        window.removeEventListener("storage", callback);
    };
}

export function crearPedido(itemsCarrito: ItemCarrito[]): Pedido {
    const sesion = leerSesion();

    if (!sesion) {
        throw new Error("Debes iniciar sesión para crear un pedido.");
    }

    if (itemsCarrito.length === 0) {
        throw new Error("No puedes crear un pedido sin productos.");
    }

    const itemsPedido: ItemPedido[] = itemsCarrito.map((item) => {
        if (!Number.isInteger(item.id) || !Number.isInteger(item.cantidad) || item.cantidad <= 0) {
            throw new Error("El carrito contiene cantidades inválidas.");
        }

        const producto = buscarProducto(item.id);

        if (!producto) {
            throw new Error("Uno de los productos del carrito ya no existe.");
        }

        if (producto.stock < item.cantidad) {
            throw new Error(`Stock insuficiente para "${producto.nombre}".`);
        }

        return {
            productoId: producto.id,
            nombre: producto.nombre,
            precioUnitario: producto.precio,
            cantidad: item.cantidad,
            subtotal: producto.precio * item.cantidad
        };
    });

    const pedidos = listarPedidos();
    const siguienteId = pedidos.reduce(
        (mayor, pedido) => Math.max(mayor, pedido.id),
        0
    ) + 1;

    const pedido: Pedido = {
        id: siguienteId,
        usuarioId: sesion.id,
        nombreCliente: sesion.nombre,
        emailCliente: sesion.email,
        items: itemsPedido,
        total: itemsPedido.reduce((total, item) => total + item.subtotal, 0),
        estado: "Pendiente de despacho",
        despacho: null,
        fechaCreacion: new Date().toISOString()
    };

    guardarPedidos([...pedidos, pedido]);

    return pedido;
}

export function guardarDatosDespacho(
    pedidoId: number,
    despacho: DatosDespacho
): Pedido {
    const pedidos = listarPedidos();
    const indice = pedidos.findIndex((pedido) => pedido.id === pedidoId);

    if (indice === -1) {
        throw new Error("No se encontró el pedido.");
    }

    const pedidoActualizado: Pedido = {
        ...pedidos[indice],
        despacho: {
            nombre: despacho.nombre.trim(),
            telefono: despacho.telefono.trim(),
            region: despacho.region.trim(),
            comuna: despacho.comuna.trim(),
            direccion: despacho.direccion.trim(),
            referencia: despacho.referencia.trim()
        }
    };

    pedidos[indice] = pedidoActualizado;
    guardarPedidos(pedidos);

    return pedidoActualizado;
}

export function restablecerPedidosParaPruebas(): void {
    localStorage.removeItem(CLAVE);
    window.dispatchEvent(new Event(EVENTO_CAMBIO));
}
