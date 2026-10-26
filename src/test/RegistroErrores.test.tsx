//@vitest-environment jsdom
import { beforeEach, expect, test } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Registro from "../Paginas/Registro";
import { listarUsuarios } from "../datos/repositorioUsuarios";

const completar = (rut: string, email: string) => {
    fireEvent.change(screen.getByLabelText("Nombre completo"), { target: { value: "Prueba de Formulario" } });
    fireEvent.change(screen.getByLabelText("RUT / RUN"), { target: { value: rut } });
    fireEvent.change(screen.getByLabelText("Correo electrónico"), { target: { value: email } });
    fireEvent.change(screen.getByLabelText("Región"), { target: { value: "valparaiso" } });
    fireEvent.change(screen.getByLabelText("Comuna"), { target: { value: "Viña del Mar" } });
    fireEvent.change(screen.getByLabelText("Contraseña"), { target: { value: "claveSegura123" } });
    fireEvent.change(screen.getByLabelText("Confirmar contraseña"), { target: { value: "claveSegura123" } });
};

beforeEach(() => {
    localStorage.clear();
});

test("Prueba 14: el registro rechaza un RUT invalido y un correo ya en uso", () => {
    // RUT con dígito verificador inválido: avisa y no crea la cuenta.
    const primera = render(<MemoryRouter><Registro /></MemoryRouter>);
    const usuariosAntes = listarUsuarios().length;

    completar("11.111.111-2", "nueva.persona@correo.cl");
    fireEvent.click(screen.getByRole("button", { name: /registrarse/i }));

    expect(screen.getByText("El RUT ingresado no es válido.")).toBeTruthy();
    expect(listarUsuarios().length).toBe(usuariosAntes);
    primera.unmount();

    // Correo que ya existe: avisa y tampoco crea la cuenta.
    render(<MemoryRouter><Registro /></MemoryRouter>);

    completar("12.345.678-5", "admin@sonidovivo.cl");
    fireEvent.click(screen.getByRole("button", { name: /registrarse/i }));

    expect(screen.getByText("Ya existe una cuenta con ese correo.")).toBeTruthy();
    expect(listarUsuarios().length).toBe(usuariosAntes);
});
