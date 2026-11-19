import { cabecerasConToken } from "./apiServicios";
import { API_MENSAJERIA } from "./apiMensajeria";

export type EstadoMensaje = "PENDIENTE" | "RESPONDIDO";

export type Mensaje = {
    id: number;
    nombreCompleto: string;
    correo: string;
    region: string | null;
    comuna: string | null;
    mensaje: string;
    estado: EstadoMensaje;
    fechaCreacion: string;
};

export type ResultadoLista =
    | { ok: true; mensajes: Mensaje[] }
    | { ok: false; motivo: string };

export type ResultadoAccion =
    | { ok: true }
    | { ok: false; motivo: string };

export type ResultadoMensaje =
    | { ok: true; mensaje: Mensaje }
    | { ok: false; motivo: string };

const mensajeDeError = (estado: number) =>
    `El servicio de mensajeria respondio con error ${estado}.`;

export const listarMensajes = async (estado?: EstadoMensaje): Promise<ResultadoLista> => {
    const consulta = estado ? `?estado=${estado}` : "";

    try {
        const respuesta = await fetch(`${API_MENSAJERIA}/api/contacto${consulta}`);

        if (!respuesta.ok) {
            return { ok: false, motivo: mensajeDeError(respuesta.status) };
        }

        return { ok: true, mensajes: (await respuesta.json()) as Mensaje[] };
    } catch {
        return { ok: false, motivo: "No se pudo conectar con el servicio de mensajeria." };
    }
};

export const obtenerMensaje = async (id: number): Promise<ResultadoMensaje> => {
    try {
        const respuesta = await fetch(`${API_MENSAJERIA}/api/contacto/${id}`);

        if (respuesta.status === 404) {
            return { ok: false, motivo: "El mensaje no existe o ya fue eliminado." };
        }

        if (!respuesta.ok) {
            return { ok: false, motivo: mensajeDeError(respuesta.status) };
        }

        return { ok: true, mensaje: (await respuesta.json()) as Mensaje };
    } catch {
        return { ok: false, motivo: "No se pudo conectar con el servicio de mensajeria." };
    }
};

export const cambiarEstadoMensaje = async (id: number, estado: EstadoMensaje): Promise<ResultadoAccion> => {
    try {
        const respuesta = await fetch(`${API_MENSAJERIA}/api/contacto/${id}/estado`, {
            method: "PATCH",
            headers: cabecerasConToken(),
            body: JSON.stringify({ estado })
        });

        if (!respuesta.ok) {
            return { ok: false, motivo: mensajeDeError(respuesta.status) };
        }

        return { ok: true };
    } catch {
        return { ok: false, motivo: "No se pudo conectar con el servicio de mensajeria." };
    }
};

export const eliminarMensaje = async (id: number): Promise<ResultadoAccion> => {
    try {
        const respuesta = await fetch(`${API_MENSAJERIA}/api/contacto/${id}`, { method: "DELETE" });

        if (!respuesta.ok) {
            return { ok: false, motivo: mensajeDeError(respuesta.status) };
        }

        return { ok: true };
    } catch {
        return { ok: false, motivo: "No se pudo conectar con el servicio de mensajeria." };
    }
};
