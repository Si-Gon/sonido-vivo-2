//@vitest-environment jsdom
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { buscarProducto, listarProductos, productoEnMemoria } from "../datos/repositorioProductos";

const delServicio = [
    {
        id: 42, codigo: "AC006", categoriaId: 10, categoria: "Accesorios",
        nombre: "Afinador de Clip", marca: "Korg", modelo: "AW-2", precio: "8990.00",
        descuento: 10, stock: 20, descripcion: null, imagen: "ac006.jpg", activo: true
    },
    {
        id: 24, codigo: "AM002", categoriaId: 6, categoria: "Amplificadores",
        nombre: "Amplificador Guitarra 40W", marca: "Fender", modelo: "Champion 40",
        precio: "299990.00", descuento: null, stock: 3, descripcion: "Valvular híbrido.",
        imagen: "am002.jpg", activo: true
    }
];

let fetchFalso: ReturnType<typeof vi.fn>;

beforeEach(() => {
    fetchFalso = vi.fn(async () =>
        new Response(JSON.stringify(delServicio), { status: 200, headers: { "Content-Type": "application/json" } })
    );

    vi.stubGlobal("fetch", fetchFalso);
});

afterEach(() => {
    vi.unstubAllGlobals();
});

test("Prueba 11: el catálogo se pide al servicio y se convierte al modelo del sitio", async () => {
    const productos = await listarProductos();

    expect(productos.length).toBe(2);
    expect(fetchFalso.mock.calls[0][0]).toContain("/api/productos");

    const afinador = productos[0];
    expect(afinador.nombre).toBe("Afinador de Clip");
    expect(afinador.categoria).toBe("Accesorios");
    expect(afinador.precio).toBe(8990);          // el servicio manda decimal como texto
    expect(afinador.descuento).toBe(10);
    expect(afinador.descripcion).toBe("");       // null del servicio queda como texto vacío
});

test("Prueba 12: buscar por id encuentra el producto y no deja copia en el navegador", async () => {
    const encontrado = await buscarProducto(24);

    expect(encontrado?.nombre).toBe("Amplificador Guitarra 40W");
    expect(productoEnMemoria(24)?.stock).toBe(3);
    expect(await buscarProducto(9999)).toBeUndefined();

    // Lo único que se guarda es la copia en memoria de la visita.
    expect(localStorage.getItem("productos")).toBeNull();
});

test("Prueba 13: si el servicio responde con error, el catálogo falla en vez de mostrar datos viejos", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("", { status: 500 })));

    await expect(listarProductos()).rejects.toThrow("500");
});
