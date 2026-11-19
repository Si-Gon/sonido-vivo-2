import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { pedirConReintento } from "../datos/apiServicios";
import { iniciarSesion, leerSesion, cerrarSesion } from "../datos/sesion";

// El gateway responde 401 cuando el token venció o no es válido, y 403 cuando el rol no alcanza.
// El primero tiene que cerrar la sesión; el segundo, no: el usuario sigue siendo quien dice ser.
describe("Sesión rechazada por el gateway", () => {
    const sesion = {
        id: 1,
        nombre: "Administrador",
        email: "admin@sonidovivo.cl",
        rol: "Administrador" as const,
        token: "token-de-prueba"
    };

    beforeEach(() => {
        localStorage.clear();
        iniciarSesion(sesion);
    });

    afterEach(() => {
        cerrarSesion();
        vi.restoreAllMocks();
    });

    it("cierra la sesión cuando el servicio responde 401", async () => {
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("{}", { status: 401 })));

        const respuesta = await pedirConReintento("http://localhost:8090/api/usuarios", {}, 1);

        expect(respuesta.status).toBe(401);
        expect(leerSesion()).toBeNull();
    });

    it("mantiene la sesión cuando responde 403, porque es un problema de permisos", async () => {
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("{}", { status: 403 })));

        await pedirConReintento("http://localhost:8090/api/usuarios", {}, 1);

        expect(leerSesion()?.email).toBe("admin@sonidovivo.cl");
    });
});
