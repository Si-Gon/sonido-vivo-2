import { useSyncExternalStore } from "react";
import type { Rol } from "./repositorioUsuarios";

const CLAVE = "sesion";

export type Sesion = {
    id: number;
    nombre: string;
    email: string;
    rol: Rol;
};

const oyentes = new Set<() => void>();
let textoCache: string | null = null;
let sesionCache: Sesion | null = null;

export function leerSesion(): Sesion | null {
    const texto = localStorage.getItem(CLAVE);

    if (texto !== textoCache) {
        textoCache = texto;
        try {
            sesionCache = texto ? (JSON.parse(texto) as Sesion) : null;
        } catch {
            sesionCache = null;
        }
    }
    return sesionCache;
}

function avisar() {
    oyentes.forEach((oyente) => oyente());
}

export function iniciarSesion(sesion: Sesion) {
    localStorage.setItem(CLAVE, JSON.stringify(sesion));
    avisar();
}

export function cerrarSesion() {
    localStorage.removeItem(CLAVE);
    avisar();
}

function suscribir(oyente: () => void) {
    oyentes.add(oyente);
    window.addEventListener("storage", oyente);
    return () => {
        oyentes.delete(oyente);
        window.removeEventListener("storage", oyente);
    };
}

export function useSesion(): Sesion | null {
    return useSyncExternalStore(suscribir, leerSesion, () => null);
}