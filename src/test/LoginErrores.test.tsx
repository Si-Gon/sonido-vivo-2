//@vitest-environment jsdom
import { beforeEach, expect, test } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "../Paginas/Login";

beforeEach(() => {
    localStorage.clear();
});

test("Prueba 15: el login pide los datos antes de consultar y avisa credenciales incorrectas", () => {
    // Sin correo ni clave: ni siquiera consulta.
    const vacio = render(<MemoryRouter><Login /></MemoryRouter>);

    fireEvent.click(screen.getByRole("button", { name: /ingresar/i }));

    expect(screen.getByText("Por favor ingrese correo y contraseña.")).toBeTruthy();
    expect(localStorage.getItem("sesion")).toBeNull();
    vacio.unmount();

    // Con datos que no corresponden: un solo mensaje, sin decir cuál de los dos falló.
    render(<MemoryRouter><Login /></MemoryRouter>);

    fireEvent.change(screen.getByLabelText("Correo electrónico"), { target: { value: "nadie@correo.cl" } });
    fireEvent.change(screen.getByLabelText("Contraseña"), { target: { value: "clave-equivocada" } });
    fireEvent.click(screen.getByRole("button", { name: /ingresar/i }));

    expect(screen.getByText("Correo o contraseña incorrectos.")).toBeTruthy();
    expect(localStorage.getItem("sesion")).toBeNull();
});
