const formateadorPrecio = new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" });

const formateadorFecha = new Intl.DateTimeFormat("es-CL", { day: "numeric", month: "long", year: "numeric" });

export function formatearPrecio(valor: number) {
    return formateadorPrecio.format(valor);
}

export function precioVigente(precio: number, descuento?: number) {
    if (!descuento || descuento <= 0 || descuento >= 100) return precio;
    return Math.round((precio * (1 - descuento / 100)) / 10) * 10;
}

export function formatearFecha(fecha: string) {
    // Acepta tanto 'AAAA-MM-DD' como el ISO completo que guarda el repositorio de pedidos.
    if (fecha.includes("T")) {
        const instante = new Date(fecha);
        return Number.isNaN(instante.getTime()) ? fecha : formateadorFecha.format(instante);
    }

    const [anio, mes, dia] = fecha.split("-").map(Number);

    if (!Number.isInteger(anio) || !Number.isInteger(mes) || !Number.isInteger(dia)) {
        return fecha;
    }

    return formateadorFecha.format(new Date(anio, mes - 1, dia));
}
