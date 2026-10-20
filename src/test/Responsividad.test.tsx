//@vitest-environment jsdom
import { expect, test } from "vitest";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Catalogo from "../Paginas/Catalogo";
import LayoutPublico from "../Componentes/organismos/LayoutPublico";

test("Prueba 4: las vistas declaran las clases responsivas de Bootstrap", () => {
    const { unmount } = render(<MemoryRouter><Catalogo /></MemoryRouter>);

    expect(document.querySelectorAll(".col-12").length).toBe(51);
    expect(document.querySelectorAll(".col-md-6").length).toBe(51);
    expect(document.querySelectorAll(".col-lg-4").length).toBe(51);

    const fila = document.querySelector(".row.g-3");
    expect(fila).not.toBeNull();
    expect(fila?.children.length).toBe(51);
    unmount();

    render(<MemoryRouter><LayoutPublico /></MemoryRouter>);

    expect(document.querySelector("main.container")).not.toBeNull();
    expect(document.querySelector(".navbar-expand-lg")).not.toBeNull();
    expect(document.querySelector(".navbar-toggler")).not.toBeNull();
});
