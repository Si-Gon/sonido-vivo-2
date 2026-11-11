import { API_MENSAJERIA } from "./apiMensajeria";

export type MensajeContacto = {
    nombreCompleto: string;
    correo: string;
    region: string;
    comuna: string;
    mensaje: string;
};

export type ResultadoEnvio =
    | { ok: true }
    | { ok: false; motivo: string };

export const enviarMensaje = async (datos: MensajeContacto): Promise<ResultadoEnvio> => {
    try {
        const respuesta = await fetch(`${API_MENSAJERIA}/api/contacto`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos)
        });

        if (respuesta.status === 201) {
            return { ok: true };
        }

        if (respuesta.status === 400) {
            return { ok: false, motivo: "Revisa los datos: el correo o algun campo no son validos." };
        }

        return { ok: false, motivo: `El servicio respondio con error ${respuesta.status}. Intenta mas tarde.` };
    } catch {
        return { ok: false, motivo: "No se pudo conectar con el servicio de mensajeria. Verifica que este en linea." };
    }
};
