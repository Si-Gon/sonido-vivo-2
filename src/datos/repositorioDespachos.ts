import { API_GATEWAY, pedirConReintento, cabecerasConToken } from "./apiServicios";

export type DatosDespachoParaServicio = {
    pedidoId: number;
    tipoEntrega: "DOMICILIO" | "RETIRO";
    nombre: string;
    telefono: string;
    region: string;
    comuna: string;
    direccion: string;
    referencia: string;
    costoEnvio: number;
};

export type ResultadoDespacho =
    | { ok: true; id: number }
    | { ok: false; motivo: string };

/** Registra la entrega del pedido en el servicio de despachos. */
export async function registrarDespachoEnServicio(datos: DatosDespachoParaServicio): Promise<ResultadoDespacho> {
    try {
        const respuesta = await pedirConReintento(`${API_GATEWAY}/api/despachos`, {
            method: "POST",
            headers: cabecerasConToken(),
            body: JSON.stringify(datos)
        });

        if (respuesta.status === 201) {
            const despacho = (await respuesta.json()) as { id: number };
            return { ok: true, id: despacho.id };
        }

        let motivo = `El servicio de despachos respondió ${respuesta.status}.`;

        try {
            const cuerpo = (await respuesta.json()) as { motivo?: string; message?: string };
            motivo = cuerpo.motivo ?? cuerpo.message ?? motivo;
        } catch {
            /* sin cuerpo */
        }

        return { ok: false, motivo };
    } catch {
        return { ok: false, motivo: "No se pudo conectar con el servicio de despachos." };
    }
}
