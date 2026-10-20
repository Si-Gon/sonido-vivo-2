//@vitest-environment jsdom
import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Catalogo from "../Paginas/Catalogo";
import { productos } from "../datos/productos";

test("Prueba 3: el catalogo muestra la lista completa de productos", () => {
    render(<MemoryRouter><Catalogo /></MemoryRouter>);

    expect(screen.getAllByRole("article").length).toBe(51);
    expect(screen.getAllByRole("article").length).toBe(productos.length);
    expect(screen.getByText("Guitarra Acústica Folk").textContent).toBe("Guitarra Acústica Folk");
    expect(screen.getByText("Pop Filter para Micrófono").textContent).toBe("Pop Filter para Micrófono");
    expect(screen.getAllByText("Ver detalle").length).toBe(51);
});
