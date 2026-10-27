//@vitest-environment jsdom
import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../App";

test("Prueba 10: el panel pide sesion, y ademas rol de administrador", () => {
    localStorage.clear();

    // Sin sesión: al login.
    const sinSesion = render(<MemoryRouter initialEntries={["/admin"]}><App /></MemoryRouter>);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Iniciar Sesión");
    sinSesion.unmount();

    // Con sesión de cliente: no entra al panel, lo manda al catálogo.
    localStorage.setItem("sesion", JSON.stringify({
        id: 2, nombre: "Cliente", email: "cliente@correo.cl", rol: "Cliente"
    }));
    const cliente = render(<MemoryRouter initialEntries={["/admin"]}><App /></MemoryRouter>);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Catálogo de productos");
    cliente.unmount();

    // Con sesión de administrador: entra.
    localStorage.setItem("sesion", JSON.stringify({
        id: 1, nombre: "Administrador", email: "admin@sonidovivo.cl", rol: "Administrador"
    }));
    render(<MemoryRouter initialEntries={["/admin"]}><App /></MemoryRouter>);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Panel de administración");

    localStorage.clear();
});
