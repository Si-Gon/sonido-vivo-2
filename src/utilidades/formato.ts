const formateadorPrecio = new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" });

const formateadorFecha = new Intl.DateTimeFormat("es-CL", { day: "numeric", month: "long", year: "numeric" });

export function formatearPrecio(valor: number) {
    return formateadorPrecio.format(valor);
}

export function formatearFecha(fecha: string) {
    const [anio, mes, dia] = fecha.split("-").map(Number);

    return formateadorFecha.format(new Date(anio, mes - 1, dia));
}
