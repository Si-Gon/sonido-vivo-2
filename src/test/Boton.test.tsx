//@vitest-environment jsdom
import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Boton from "../Componentes/atomos/Boton";

test("Prueba 1: el boton muestra el texto recibido y respeta su destino", () => {
    const { unmount } = render(<MemoryRouter><Boton texto="Guardar" /></MemoryRouter>);
    const boton = screen.getByText("Guardar");
    expect(boton.textContent).toBe("Guardar");
    expect(boton.tagName).toBe("BUTTON");
    unmount();

    render(<MemoryRouter><Boton texto="Ver detalle" to="/producto/7" /></MemoryRouter>);
    const enlace = screen.getByText("Ver detalle");
    expect(enlace.tagName).toBe("A");
    expect(enlace.getAttribute("href")).toBe("/producto/7");
});
