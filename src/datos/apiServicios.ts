// Direccion unica de los servicios: el gateway reparte /api/** al microservicio que corresponde.
// Si se quiere ir directo a un servicio sin gateway, se cambia solo aca o en el repositorio
// correspondiente (catalogo 8091, boletas 8093, despachos 8094, mensajeria 8095).
export const API_GATEWAY = "http://localhost:8090";

/**
 * Igual que fetch, pero reintenta cuando el gateway responde 503 o 504.
 *
 * Pasa al arrancar: el servicio ya esta arriba pero el gateway todavia no refresco la lista de
 * instancias de Eureka, asi que no encuentra a quien derivar. Unos segundos despues si.
 */
export async function pedirConReintento(
    url: string,
    opciones: RequestInit = {},
    intentos = 3
): Promise<Response> {
    let ultimaSinInstancia: Response | null = null;

    for (let intento = 1; intento <= intentos; intento++) {
        try {
            const respuesta = await fetch(url, opciones);

            if (respuesta.status !== 503 && respuesta.status !== 504) {
                return respuesta;
            }

            ultimaSinInstancia = respuesta;
        } catch (error) {
            if (intento === intentos) throw error;
        }

        await new Promise((esperar) => setTimeout(esperar, 700 * intento));
    }

    return ultimaSinInstancia as Response;
}
