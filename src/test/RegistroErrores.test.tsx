//@vitest-environment jsdom
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Registro from "../Paginas/Registro";

const completar = (rut: string, email: string) => {
    fireEvent.change(screen.getByLabelText("Nombre completo"), { target: { value: "Prueba de Formulario" } });
    fireEvent.change(screen.getByLabelText("RUT / RUN"), { target: { value: rut } });
    fireEvent.change(screen.getByLabelText("Correo electrónico"), { target: { value: email } });
    fireEvent.change(screen.getByLabelText("Región"), { target: { value: "valparaiso" } });
    fireEvent.change(screen.getByLabelText("Comuna"), { target: { value: "Viña del Mar" } });
    fireEvent.change(screen.getByLabelText("Contraseña"), { target: { value: "claveSegura123" } });
    fireEvent.change(screen.getByLabelText("Confirmar contraseña"), { target: { value: "claveSegura123" } });
};

let fetchFalso: ReturnType<typeof vi.fn>;

beforeEach(() => {
    localStorage.clear();

    // El correo admin@sonidovivo.cl ya existe en el servicio: el registro debe avisar.
    fetchFalso = vi.fn(async (_url: string, opciones?: { body?: string }) => {
        const cuerpo = JSON.parse(opciones?.body ?? "{}");

        if (String(cuerpo.email).toLowerCase() === "admin@sonidovivo.cl") {
            return new Response(JSON.stringify({ motivo: "Ya existe una cuenta con ese correo." }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        return new Response(JSON.stringify({
            id: 9, nombre: cuerpo.nombre, rut: cuerpo.rut, email: cuerpo.email,
            region: cuerpo.region, comuna: cuerpo.comuna, rol: "Cliente", activo: true
        }), { status: 201, headers: { "Content-Type": "application/json" } });
    });

    vi.stubGlobal("fetch", fetchFalso);
});

afterEach(() => {
    vi.unstubAllGlobals();
});

test("Prueba 14: el registro rechaza un RUT invalido y un correo ya en uso", async () => {
    // RUT con dígito verificador inválido: lo corta el formulario y no llega al servicio.
    const primera = render(<MemoryRouter><Registro /></MemoryRouter>);

    completar("11.111.111-2", "nueva.persona@correo.cl");
    fireEvent.click(screen.getByRole("button", { name: /registrarse/i }));

    expect(screen.getByText("El RUT ingresado no es válido.")).toBeTruthy();
    expect(fetchFalso).not.toHaveBeenCalled();
    primera.unmount();

    // Correo que el servicio ya tiene: muestra el motivo que devuelve la API.
    render(<MemoryRouter><Registro /></MemoryRouter>);

    completar("12.345.678-5", "admin@sonidovivo.cl");
    fireEvent.click(screen.getByRole("button", { name: /registrarse/i }));

    await waitFor(() =>
        expect(screen.getByText("Ya existe una cuenta con ese correo.")).toBeTruthy()
    );

    const envio = fetchFalso.mock.calls.find(([, opciones]) => opciones?.body?.includes("admin@sonidovivo.cl"));
    expect(envio).toBeTruthy();
});
