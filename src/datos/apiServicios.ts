// Direccion unica de los servicios: el gateway reparte /api/** al microservicio que corresponde.
// Si se quiere ir directo a un servicio sin gateway, se cambia solo aca o en el repositorio
// correspondiente (catalogo 8091, boletas 8093, despachos 8094, mensajeria 8095).
import { leerToken } from "./sesion";

export const API_GATEWAY = "http://localhost:8090";

/**
 * Igual que fetch, pero reintenta cuando el gateway responde 503 o 504.
 *
 * Pasa al arrancar: el servicio ya esta arriba pero el gateway todavia no refresco la lista de
 * instancias de Eureka, asi que no encuentra a quien derivar. Unos segundos despues si.
 */
/** Cabeceras de una petición: JSON y, si hay sesión, el token del usuario. */
export function cabecerasConToken(extras: Record<string, string> = {}): Record<string, string> {
    const token = leerToken();
    return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...extras
    };
}

export async function pedirConReintento(
    url: string,
    opciones: RequestInit = {},
    intentos = 3
): Promise<Response> {
    let ultimaSinInstancia: Response | null = null;

    // El token se inyecta acá y no en cada llamada: así también lo llevan los GET, que no pasan
    // cabeceras propias y son la mayoría de las peticiones del panel.
    const opcionesFinales: RequestInit = {
        ...opciones,
        headers: {
            ...cabecerasConToken(),
            ...((opciones.headers as Record<string, string> | undefined) ?? {})
        }
    };

    for (let intento = 1; intento <= intentos; intento++) {
        try {
            const respuesta = await fetch(url, opcionesFinales);

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
