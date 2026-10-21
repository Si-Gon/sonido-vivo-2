//@vitest-environment jsdom
import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CardProducto from "../Componentes/moleculas/CardProducto";
import type { Producto } from "../datos/productos";

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

test("Prueba 2: la tarjeta muestra los datos del producto recibido por propiedad", () => {
    render(<MemoryRouter><CardProducto producto={producto} alAgregar={() => {}} /></MemoryRouter>);

    expect(screen.getByText("Guitarra Eléctrica Les Paul").textContent).toBe("Guitarra Eléctrica Les Paul");
    expect(screen.getByText("Epiphone · Les Paul Std").textContent).toBe("Epiphone · Les Paul Std");
    expect(screen.getByText("$329.990").textContent).toBe("$329.990");
    expect(screen.getByRole("img").getAttribute("alt")).toBe("Guitarra Eléctrica Les Paul");
    expect(screen.getByText("Ver detalle").getAttribute("href")).toBe("/producto/7");
});
