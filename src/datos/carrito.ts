import { buscarProducto } from "./repositorioProductos";

const CLAVE = "carrito";

export type ItemCarrito = {
    id: number;
    cantidad: number;
};

export type ResultadoCarrito = {
    items: ItemCarrito[];
    agregado: boolean;
    limite: number;
};

function normalizar(datos: unknown): ItemCarrito[] {
    if (!Array.isArray(datos)) return [];

    const items: ItemCarrito[] = [];

    datos.forEach((entrada) => {
        const esNumero = typeof entrada === "number";
        const id = esNumero ? entrada : Number((entrada as { id?: unknown }).id);
        const cantidadGuardada = esNumero ? 1 : Number((entrada as { cantidad?: unknown }).cantidad);

        if (!Number.isFinite(id)) return;

        const cantidad = Number.isFinite(cantidadGuardada) && cantidadGuardada > 0 ? cantidadGuardada : 1;
        const existente = items.find((item) => item.id === id);

        if (existente) {
            existente.cantidad += cantidad;
        } else {
            items.push({ id, cantidad });
        }
    });

    return items;
}

export function leerCarrito(): ItemCarrito[] {
    const guardado = localStorage.getItem(CLAVE);
    if (!guardado) return [];

    try {
        return normalizar(JSON.parse(guardado));
    } catch {
        return [];
    }
}

function guardarCarrito(items: ItemCarrito[]) {
    localStorage.setItem(CLAVE, JSON.stringify(items));
}

export function mensajeDeAgregado(resultado: ResultadoCarrito): string {
    if (resultado.agregado) return "Producto agregado al carrito";

    return resultado.limite > 0
        ? `Solo hay ${resultado.limite} unidades disponibles`
        : "No hay unidades disponibles de este producto";
}

export function cantidadEnCarrito(id: number, items: ItemCarrito[] = leerCarrito()): number {
    return items.find((item) => item.id === id)?.cantidad ?? 0;
}

export function stockDisponible(id: number, items: ItemCarrito[] = leerCarrito()): number {
    const producto = buscarProducto(id);
    if (!producto) return 0;

    return Math.max(producto.stock - cantidadEnCarrito(id, items), 0);
}

export function agregarAlCarrito(id: number): ResultadoCarrito {
    const items = leerCarrito();
    const producto = buscarProducto(id);
    const limite = producto ? producto.stock : 0;

    if (!producto || cantidadEnCarrito(id, items) >= producto.stock) {
        return { items, agregado: false, limite };
    }

    const existente = items.find((item) => item.id === id);

    if (existente) {
        existente.cantidad += 1;
    } else {
        items.push({ id, cantidad: 1 });
    }

    guardarCarrito(items);
    return { items, agregado: true, limite };
}

export function quitarUnaUnidad(id: number): ItemCarrito[] {
    const items = leerCarrito();
    const existente = items.find((item) => item.id === id);

    if (!existente) return items;

    existente.cantidad -= 1;

    if (existente.cantidad <= 0) {
        return quitarDelCarrito(id);
    }

    guardarCarrito(items);
    return items;
}

export function quitarDelCarrito(id: number): ItemCarrito[] {
    const items = leerCarrito().filter((item) => item.id !== id);
    guardarCarrito(items);
    return items;
}

export function vaciarCarrito() {
    localStorage.removeItem(CLAVE);
}

export function calcularTotal(items: ItemCarrito[]): number {
    return items.reduce((total, item) => {
        const producto = buscarProducto(item.id);
        return total + (producto ? producto.precio * item.cantidad : 0);
    }, 0);
}

export function contarUnidades(items: ItemCarrito[]): number {
    return items.reduce((unidades, item) => unidades + item.cantidad, 0);
}
