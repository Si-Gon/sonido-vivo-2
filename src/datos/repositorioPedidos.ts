import { actualizarProducto, descontarStock } from "./repositorioProductos";
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


function registrarPedidoConDescuento(pedido: Pedido): void {
    const claveProductos = "productos";
    const clavePedidos = "sonido-vivo:pedidos";
    const productosAnteriores = localStorage.getItem(claveProductos);
    const pedidosAnteriores = localStorage.getItem(clavePedidos);

    try {
        descontarStock(
            pedido.items.map((item) => ({
                id: item.productoId,
                cantidad: item.cantidad,
            }))
        );

        const pedidos = listarPedidos();
        guardarPedidos([...pedidos, pedido]);
    } catch (error) {
        if (productosAnteriores === null) {
            localStorage.removeItem(claveProductos);
        } else {
            localStorage.setItem(claveProductos, productosAnteriores);
        }

        if (pedidosAnteriores === null) {
            localStorage.removeItem(clavePedidos);
        } else {
            localStorage.setItem(clavePedidos, pedidosAnteriores);
        }

        throw error;
    }
}


export function crearPedido(itemsCarrito: ItemCarrito[]): Pedido {
    const sesion = leerSesion();

    if (!sesion) {
        throw new Error("Debes iniciar sesión para crear un pedido.");
    }

    if (itemsCarrito.length === 0) {
        throw new Error("No puedes crear un pedido sin productos.");
    }

    const cantidadesPorProducto = new Map<number, number>();

    for (const item of itemsCarrito) {
        if (
            !Number.isInteger(item.id) ||
            !Number.isInteger(item.cantidad) ||
            item.cantidad <= 0
        ) {
            throw new Error("El carrito contiene cantidades inválidas.");
        }

        const cantidadAcumulada =
            (cantidadesPorProducto.get(item.id) ?? 0) + item.cantidad;

        cantidadesPorProducto.set(item.id, cantidadAcumulada);
    }

    for (const [productoId, cantidadTotal] of cantidadesPorProducto) {
        const producto = buscarProducto(productoId);

        if (!producto) {
            throw new Error("Uno de los productos del carrito ya no existe.");
        }

        if (producto.stock < cantidadTotal) {
            throw new Error(`Stock insuficiente para "${producto.nombre}".`);
        }
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

    registrarPedidoConDescuento(pedido);

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

    export function actualizarEstadoPedido(
        pedidoId: number,
        estado: EstadoPedido
        ): Pedido {
        const estadosValidos: EstadoPedido[] = [
            "Pendiente de despacho",
            "En preparación",
            "Despachado",
            "Entregado",
            "Cancelado"
        ];

        if (!estadosValidos.includes(estado)) {
            throw new Error("El estado del pedido no es válido.");
        }

        const pedidos = listarPedidos();
        const indice = pedidos.findIndex((pedido) => pedido.id === pedidoId);
        
        if (indice === -1) {
            throw new Error("No se encontró el pedido.");
        }
    
        const pedidoAnterior = pedidos[indice];
    
        if (pedidoAnterior.estado === "Cancelado" && estado !== "Cancelado") {
            throw new Error("No se puede cambiar el estado de un pedido cancelado.");
        }
    
        if (pedidoAnterior.estado === estado) {
            return pedidoAnterior;
        }
    
        if (estado === "Cancelado") {
            const productosAnteriores = localStorage.getItem("productos");
            const pedidosAnteriores = localStorage.getItem("sonido-vivo:pedidos");
        
            try {
                const productosDevueltos = new Set<number>();
            
                for (const item of pedidoAnterior.items) {
                    if (productosDevueltos.has(item.productoId)) {
                        continue;
                    }
                
                    productosDevueltos.add(item.productoId);
                
                    const cantidadTotal = pedidoAnterior.items
                        .filter((otro) => otro.productoId === item.productoId)
                        .reduce((total, otro) => total + otro.cantidad, 0);
                
                    const producto = buscarProducto(item.productoId);
                
                    if (!producto) {
                        throw new Error(
                            `No se encontró el producto "${item.nombre}" para devolver el stock.`
                        );
                    }
                
                    actualizarProducto(producto.id, {
                        ...producto,
                        stock: producto.stock + cantidadTotal
                    });
                }
            
                const pedidoActualizado: Pedido = {
                    ...pedidoAnterior,
                    estado
                };
            
            pedidos[indice] = pedidoActualizado;
            guardarPedidos(pedidos);

            return pedidoActualizado;
        } catch (error) {
            if (productosAnteriores === null) {
                localStorage.removeItem("productos");
            } else {
                localStorage.setItem("productos", productosAnteriores);
            }

            if (pedidosAnteriores === null) {
                localStorage.removeItem("sonido-vivo:pedidos");
            } else {
                localStorage.setItem("sonido-vivo:pedidos", pedidosAnteriores);
            }

            throw error;
        }
    }

    const pedidoActualizado: Pedido = {
        ...pedidoAnterior,
        estado
    };
        pedidos[indice] = pedidoActualizado;
        guardarPedidos(pedidos);

        return pedidoActualizado;
    }

export function restablecerPedidosParaPruebas(): void {
    localStorage.removeItem(CLAVE);
    window.dispatchEvent(new Event(EVENTO_CAMBIO));
}
