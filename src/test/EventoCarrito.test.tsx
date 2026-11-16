//@vitest-environment jsdom
import { expect, test, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CardProducto from "../Componentes/moleculas/CardProducto";
import Carrito from "../Paginas/Carrito";
import { agregarAlCarrito } from "../datos/carrito";
import { buscarProducto } from "../datos/repositorioProductos";
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
    agregarAlCarrito(7);
    agregarAlCarrito(7);

    const carrito = render(<MemoryRouter><Carrito /></MemoryRouter>);

    expect(screen.getAllByRole("article").length).toBe(1);
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

    expect(document.querySelector(".sv-cantidad")?.textContent).toBe("4");
    expect(document.querySelector('[aria-label^="Agregar una unidad"]')?.hasAttribute("disabled")).toBe(true);
    expect(screen.getByText("Total a pagar: $1.319.960").textContent).toBe("Total a pagar: $1.319.960");
    expect(screen.getByText("Stock: 4 unidades (máximo en el carrito)").textContent).toBe("Stock: 4 unidades (máximo en el carrito)");

    localStorage.setItem("sesion", JSON.stringify({
        id: 1, nombre: "Administrador", email: "admin@sonidovivo.cl", rol: "Cliente"
    }));

    mockNavigate.mockClear();

    // La compra consulta el servicio de catalogo: se simulan la lista de productos y el
    // descuento de stock para no depender de un servidor en la prueba.
    const delServicio = [{
        ...producto,
        categoriaId: 2,
        descuento: null,
        activo: true
    }];

    const fetchFalso = vi.fn(async (url: string, opciones?: { method?: string; body?: string }) => {
        const metodo = opciones?.method ?? "GET";

        if (metodo === "GET") {
            return new Response(JSON.stringify(delServicio), {
                status: 200,
                headers: { "Content-Type": "application/json" }
            });
        }

        const stockPedido = JSON.parse(opciones?.body ?? "{}").stock ?? 0;
        return new Response(JSON.stringify({ ...delServicio[0], stock: stockPedido }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    });

    vi.stubGlobal("fetch", fetchFalso);

    fireEvent.click(screen.getByText("Pagar"));

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/despacho/1"));

    expect(screen.getByText("El carrito está vacío.").textContent).toBe("El carrito está vacío.");
    expect(buscarProducto(7)?.stock).toBe(0);
    expect(localStorage.getItem("carrito")).toBeNull();

    // El descuento se envio al servicio: 4 unidades menos.
    const escritura = fetchFalso.mock.calls.find(([, opciones]) => opciones?.method === "PATCH");
    expect(escritura?.[1]?.body).toContain('"stock":0');

    vi.unstubAllGlobals();
    localStorage.clear();
});
