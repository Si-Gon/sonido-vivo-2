//@vitest-environment jsdom
import { beforeEach, expect, test } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Carrito from "../Paginas/Carrito";
import Login from "../Paginas/Login";

beforeEach(() => {
    localStorage.clear();
    localStorage.setItem("carrito", JSON.stringify([{ id: 1, cantidad: 2 }]));
});

test("Prueba 16: sin sesion el carrito no cobra, manda al login y deja las unidades", () => {
    render(
        <MemoryRouter initialEntries={["/carrito"]}>
            <Routes>
                <Route path="/carrito" element={<Carrito />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </MemoryRouter>
    );

    expect(screen.getByRole("button", { name: /pagar/i })).toBeTruthy();
    expect(localStorage.getItem("sesion")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: /pagar/i }));

    // Llega al login con el aviso, y el carrito sigue con sus dos unidades.
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Iniciar Sesión");
    expect(screen.getByText("Para comprar tienes que iniciar sesión.")).toBeTruthy();

    const guardado = JSON.parse(localStorage.getItem("carrito") || "[]");
    expect(guardado).toHaveLength(1);
    expect(guardado[0].cantidad).toBe(2);
    expect(localStorage.getItem("sesion")).toBeNull();
});
