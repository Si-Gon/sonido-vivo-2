import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(() => {
    cleanup();
});

// --- Servicios simulados para las pruebas que no declaran su propio fetch -------------------
// Antes las pantallas leían un catálogo escrito en el código; ahora lo piden al servicio, así que
// acá se responde con el catálogo real congelado y con listas vacías para el resto de endpoints.
import { beforeEach as antesDeCada, vi as viSetup } from "vitest";
import { catalogoDePrueba } from "./catalogoDePrueba";

antesDeCada(() => {
    const responder = (datos: unknown, estado = 200) =>
        new Response(JSON.stringify(datos), {
            status: estado,
            headers: { "Content-Type": "application/json" }
        });

    viSetup.stubGlobal("fetch", viSetup.fn(async (url: string | URL) => {
        const ruta = String(url);

        if (ruta.includes("/api/productos")) return responder(catalogoDePrueba);
        if (ruta.includes("/api/categorias")) return responder([]);
        if (ruta.includes("/api/usuarios")) return responder([]);
        if (ruta.includes("/api/pedidos")) return responder([]);
        if (ruta.includes("/api/despachos")) return responder([]);
        if (ruta.includes("/api/contacto")) return responder([]);
        if (ruta.includes("/api/movimientos")) return responder([]);

        return responder({ motivo: "ruta no simulada" }, 404);
    }));
});
