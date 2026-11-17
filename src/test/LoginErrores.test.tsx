//@vitest-environment jsdom
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "../Paginas/Login";

let fetchFalso: ReturnType<typeof vi.fn>;

beforeEach(() => {
    localStorage.clear();

    // El servicio responde 401 cuando el correo o la clave no corresponden.
    fetchFalso = vi.fn(async () =>
        new Response(JSON.stringify({ motivo: "Correo o contraseña incorrectos." }), {
            status: 401,
            headers: { "Content-Type": "application/json" }
        })
    );

    vi.stubGlobal("fetch", fetchFalso);
});

afterEach(() => {
    vi.unstubAllGlobals();
});

test("Prueba 15: el login pide los datos antes de consultar y avisa credenciales incorrectas", async () => {
    // Sin correo ni clave: ni siquiera consulta al servicio.
    const vacio = render(<MemoryRouter><Login /></MemoryRouter>);

    fireEvent.click(screen.getByRole("button", { name: /ingresar/i }));

    expect(screen.getByText("Por favor ingrese correo y contraseña.")).toBeTruthy();
    expect(fetchFalso).not.toHaveBeenCalled();
    expect(localStorage.getItem("sesion")).toBeNull();
    vacio.unmount();

    // Con datos que no corresponden: un solo mensaje, sin decir cuál de los dos falló.
    render(<MemoryRouter><Login /></MemoryRouter>);

    fireEvent.change(screen.getByLabelText("Correo electrónico"), { target: { value: "nadie@correo.cl" } });
    fireEvent.change(screen.getByLabelText("Contraseña"), { target: { value: "clave-equivocada" } });
    fireEvent.click(screen.getByRole("button", { name: /ingresar/i }));

    await waitFor(() =>
        expect(screen.getByText("Correo o contraseña incorrectos.")).toBeTruthy()
    );

    expect(fetchFalso).toHaveBeenCalledTimes(1);
    expect(String(fetchFalso.mock.calls[0][0])).toContain("/api/usuarios/login");
    expect(localStorage.getItem("sesion")).toBeNull();
});
