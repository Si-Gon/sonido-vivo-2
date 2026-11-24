//@vitest-environment jsdom
import { expect, test, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CardProducto from "../Componentes/moleculas/CardProducto";
import Carrito from "../Paginas/Carrito";
import { listarProductos } from "../datos/repositorioProductos";
import { agregarAlCarrito } from "../datos/carrito";
import type { Producto } from "../datos/productos";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async (importOriginal) => {
    const actual = await importOriginal<typeof import("react-router-dom")>();

    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

const producto: Producto = {
    id: 7,
    codigo: "GE002",
    categoria: "Guitarras Eléctricas",
    nombre: "Guitarra Eléctrica Les Paul",
    marca: "Epiphone",
    modelo: "Les Paul Std",
    precio: 329990,
    stock: 4,
    descripcion: "Cuerpo caoba, tapa arce, pastillas humbucker.",
    imagen: "ge002.jpg"
};

test("Prueba 7: agregar al carrito avisa al padre, agrupa el repetido y no supera el stock", async () => {
    const alAgregar = vi.fn();
    const tarjeta = render(<MemoryRouter><CardProducto producto={producto} alAgregar={alAgregar} /></MemoryRouter>);

    expect(alAgregar).not.toHaveBeenCalled();

    fireEvent.click(screen.getByText("Agregar"));

    expect(alAgregar).toHaveBeenCalledTimes(1);
    expect(alAgregar).toHaveBeenCalledWith(7);
    tarjeta.unmount();

    localStorage.clear();

    // El catálogo vive en el servicio: se simulan la lista, la boleta y el movimiento de stock,
    // y se carga una vez para que el carrito conozca stock y precio.
    const delServicio = [{ ...producto, categoriaId: 2, descuento: null, activo: true }];

    const fetchFalso = vi.fn(async (url: string, opciones?: { method?: string; body?: string }) => {
        const metodo = opciones?.method ?? "GET";

        if (String(url).includes("/api/pedidos")) {
            const cuerpo = JSON.parse(opciones?.body ?? "{}");
            const total = cuerpo.items.reduce(
                (suma: number, linea: { precioUnitario: number; cantidad: number }) =>
                    suma + linea.precioUnitario * linea.cantidad, 0);

            return new Response(JSON.stringify({ id: 1, total }), {
                status: 201,
                headers: { "Content-Type": "application/json" }
            });
        }

        if (metodo === "GET") {
            return new Response(JSON.stringify(delServicio), {
                status: 200,
                headers: { "Content-Type": "application/json" }
            });
        }

        return new Response(JSON.stringify({ motivo: "No hay nada más que pedir en esta prueba." }), {
            status: 404,
            headers: { "Content-Type": "application/json" }
        });
    });

    vi.stubGlobal("fetch", fetchFalso);
    await listarProductos();

    agregarAlCarrito(7);
    agregarAlCarrito(7);

    const carrito = render(<MemoryRouter><Carrito /></MemoryRouter>);

    await waitFor(() => expect(screen.getAllByRole("article").length).toBe(1));
    expect(document.querySelector(".sv-cantidad")?.textContent).toBe("2");
    expect(document.querySelector('[aria-label^="Agregar una unidad"]')?.hasAttribute("disabled")).toBe(false);
    expect(screen.getByText("Total a pagar: $659.980").textContent).toBe("Total a pagar: $659.980");
    carrito.unmount();

    const tercera = agregarAlCarrito(7);
    const cuarta = agregarAlCarrito(7);
    const quinta = agregarAlCarrito(7);

    expect(tercera.agregado).toBe(true);
    expect(cuarta.agregado).toBe(true);
    expect(quinta.agregado).toBe(false);
    expect(quinta.limite).toBe(4);
    expect(quinta.items[0].cantidad).toBe(4);

    render(<MemoryRouter><Carrito /></MemoryRouter>);

    await waitFor(() => expect(document.querySelector(".sv-cantidad")?.textContent).toBe("4"));
    expect(document.querySelector('[aria-label^="Agregar una unidad"]')?.hasAttribute("disabled")).toBe(true);
    expect(screen.getByText("Total a pagar: $1.319.960").textContent).toBe("Total a pagar: $1.319.960");
    expect(screen.getByText("Stock: 4 unidades (máximo en el carrito)").textContent).toBe("Stock: 4 unidades (máximo en el carrito)");

    localStorage.setItem("sesion", JSON.stringify({
        id: 1, nombre: "Administrador", email: "admin@sonidovivo.cl", rol: "Cliente"
    }));

    mockNavigate.mockClear();

    fireEvent.click(screen.getByText("Pagar"));

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/despacho/1"));

    expect(screen.getByText("El carrito está vacío.").textContent).toBe("El carrito está vacío.");
    expect(localStorage.getItem("carrito")).toBeNull();

    // El navegador solo emite la boleta: el descuento de stock lo hace el servicio de boletas,
    // dentro de la misma operación, para que no dependa de lo que haga la pantalla.
    const boleta = fetchFalso.mock.calls.find(([url, opciones]) =>
        String(url).includes("/api/pedidos") && opciones?.method === "POST");

    // El carrito llegó al máximo del stock: 4 unidades.
    expect(boleta?.[1]?.body).toContain('"cantidad":4');
    expect(boleta?.[1]?.body).toContain('"productoId":7');

    const movimientos = fetchFalso.mock.calls.filter(([url]) => String(url).includes("/movimientos"));
    expect(movimientos).toHaveLength(0);

    vi.unstubAllGlobals();
    localStorage.clear();
});
