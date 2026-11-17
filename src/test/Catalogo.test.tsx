//@vitest-environment jsdom
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Catalogo from "../Paginas/Catalogo";

// Catálogo que devolvería el servicio: 51 productos, dos con nombre conocido para las aserciones.
const nombres = ["Guitarra Acústica Folk", "Pop Filter para Micrófono"];
const catalogo = Array.from({ length: 51 }, (_, indice) => ({
    id: indice + 1,
    codigo: `P${String(indice + 1).padStart(3, "0")}`,
    categoriaId: 1,
    categoria: "Accesorios",
    nombre: nombres[indice] ?? `Producto ${indice + 1}`,
    marca: "Sonido Vivo",
    modelo: `M${indice + 1}`,
    precio: 10000 + indice,
    descuento: null,
    stock: 5,
    descripcion: null,
    imagen: null,
    activo: true
}));

let fetchFalso: ReturnType<typeof vi.fn>;

beforeEach(() => {
    fetchFalso = vi.fn(async () =>
        new Response(JSON.stringify(catalogo), { status: 200, headers: { "Content-Type": "application/json" } })
    );

    vi.stubGlobal("fetch", fetchFalso);
});

afterEach(() => {
    vi.unstubAllGlobals();
});

test("Prueba 3: el catalogo muestra la lista completa de productos", async () => {
    render(<MemoryRouter><Catalogo /></MemoryRouter>);

    // Primero avisa que está cargando; los productos llegan desde el servicio.
    await waitFor(() => expect(screen.getAllByRole("article").length).toBe(51));

    expect(screen.getByText("Guitarra Acústica Folk").textContent).toBe("Guitarra Acústica Folk");
    expect(screen.getByText("Pop Filter para Micrófono").textContent).toBe("Pop Filter para Micrófono");
    expect(screen.getAllByText("Ver detalle").length).toBe(51);
    expect(String(fetchFalso.mock.calls[0][0])).toContain("/api/productos");
});
