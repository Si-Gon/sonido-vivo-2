//@vitest-environment jsdom
import { expect, test } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Catalogo from "../Paginas/Catalogo";

test("Prueba 5: el catalogo filtra los productos por categoria", () => {
    render(<MemoryRouter><Catalogo /></MemoryRouter>);

    expect(screen.getAllByRole("article").length).toBe(51);

    fireEvent.change(screen.getByLabelText("Categoría"), { target: { value: "Guitarras Acústicas" } });

    expect(screen.getAllByRole("article").length).toBe(5);
    expect(screen.getByText("Guitarra Acústica Folk").textContent).toBe("Guitarra Acústica Folk");
    expect(screen.queryByText("Micrófono Dinámico Cardioide")).toBeNull();

    fireEvent.change(screen.getByLabelText("Categoría"), { target: { value: "todas" } });

    expect(screen.getAllByRole("article").length).toBe(51);
});
