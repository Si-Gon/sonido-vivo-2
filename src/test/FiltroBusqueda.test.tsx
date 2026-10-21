//@vitest-environment jsdom
import { expect, test } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Catalogo from "../Paginas/Catalogo";

test("Prueba 6: el catalogo busca por nombre y avisa cuando no hay coincidencias", () => {
    render(<MemoryRouter><Catalogo /></MemoryRouter>);

    fireEvent.change(screen.getByLabelText("Buscar por nombre"), { target: { value: "guitarra" } });

    expect(screen.getAllByRole("article").length).toBe(18);

    fireEvent.change(screen.getByLabelText("Buscar por nombre"), { target: { value: "zzt" } });

    expect(screen.queryAllByRole("article").length).toBe(0);
    expect(screen.getByText("No se encontraron productos para los filtros seleccionados.").textContent).toBe("No se encontraron productos para los filtros seleccionados.");

    fireEvent.click(screen.getByText("Limpiar"));

    expect(screen.getAllByRole("article").length).toBe(51);
    expect(screen.queryByText("No se encontraron productos para los filtros seleccionados.")).toBeNull();
});
