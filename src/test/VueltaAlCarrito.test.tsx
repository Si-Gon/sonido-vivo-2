//@vitest-environment jsdom
import { expect, test } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Carrito from "../Paginas/Carrito";
import Login from "../Paginas/Login";

test("Prueba 18: despues de entrar vuelve al carrito y avisa por que se pidio la sesion", () => {
    localStorage.clear();
    localStorage.setItem("carrito", JSON.stringify([{ id: 1, cantidad: 1 }]));

    render(
        <MemoryRouter
        initialEntries={[{
            pathname: "/login",
            state: { desde: "/carrito", mensaje: "Para comprar tienes que iniciar sesión." }
        }]}
        >
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/carrito" element={<Carrito />} />
            </Routes>
        </MemoryRouter>
    );

    expect(screen.getByText("Para comprar tienes que iniciar sesión.")).toBeTruthy();

    fireEvent.change(screen.getByLabelText("Correo electrónico"), { target: { value: "admin@sonidovivo.cl" } });
    fireEvent.change(screen.getByLabelText("Contraseña"), { target: { value: "admin123" } });
    fireEvent.click(screen.getByRole("button", { name: /ingresar/i }));

    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Carrito de compras");
    expect(String(localStorage.getItem("sesion"))).toContain("admin@sonidovivo.cl");
});
