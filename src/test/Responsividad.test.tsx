//@vitest-environment jsdom
import { expect, test } from "vitest";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Catalogo from "../Paginas/Catalogo";
import LayoutPublico from "../Componentes/organismos/LayoutPublico";

test("Prueba 4: las vistas declaran las clases responsivas de Bootstrap", () => {
    const { unmount } = render(<MemoryRouter><Catalogo /></MemoryRouter>);

    const tarjetas = Array.from(document.querySelectorAll(".sv-card"));
    expect(tarjetas.length).toBe(51);

    const columnas = tarjetas.map((tarjeta) => tarjeta.parentElement?.className ?? "");
    expect(columnas.filter((columna) => columna.includes("col-12")).length).toBe(51);
    expect(columnas.filter((columna) => columna.includes("col-md-6")).length).toBe(51);
    expect(columnas.filter((columna) => columna.includes("col-lg-4")).length).toBe(51);

    const fila = tarjetas[0].parentElement?.parentElement;
    expect(fila?.className).toContain("row");
    expect(fila?.className).toContain("g-3");
    expect(fila?.children.length).toBe(51);

    const filtroCategoria = document.querySelector(".sv-filtros [name=categoria]");
    expect(filtroCategoria?.parentElement?.parentElement?.className).toContain("col-md-5");
    unmount();

    render(<MemoryRouter><LayoutPublico /></MemoryRouter>);

    expect(document.querySelector("main.container")).not.toBeNull();
    expect(document.querySelector(".navbar-expand-lg")).not.toBeNull();
    expect(document.querySelector(".navbar-toggler")).not.toBeNull();
});
