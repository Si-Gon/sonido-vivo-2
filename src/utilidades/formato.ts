const formateadorPrecio = new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" });

export function formatearPrecio(valor: number) {
    return formateadorPrecio.format(valor);
}
