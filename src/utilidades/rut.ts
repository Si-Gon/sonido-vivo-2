export function validarRut(rut: string): boolean {
    const limpio = rut.replace(/[^0-9kK]/g, "").toUpperCase();
    if (limpio.length < 8 || limpio.length > 9) return false;

    const cuerpo = limpio.slice(0, -1);
    const dvIngresado = limpio.slice(-1);

    if (!/^\d+$/.test(cuerpo)) return false;

    let suma = 0;
    let multiplicador = 2;

    for (let i = cuerpo.length - 1; i >= 0; i--) {
        suma += parseInt(cuerpo.charAt(i), 10) * multiplicador;
        multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }

    const resto = 11 - (suma % 11);
    let dvEsperado = "";

    if (resto === 11) dvEsperado = "0";
    else if (resto === 10) dvEsperado = "K";
    else dvEsperado = resto.toString();

    return dvIngresado === dvEsperado;
}

export function formatearRut(rut: string): string {
    const limpio = rut.replace(/[^0-9kK]/g, "").toUpperCase();
    if (limpio.length <= 1) return limpio;

    const cuerpo = limpio.slice(0, -1);
    const dv = limpio.slice(-1);

    const cuerpoFormateado = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return `${cuerpoFormateado}-${dv}`;
}