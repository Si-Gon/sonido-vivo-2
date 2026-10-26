import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import AdminUsuarios from "../Paginas/AdminUsuarios";
import * as repositorio from "../datos/repositorioUsuarios";

vi.mock("../Componentes/moleculas/CampoFormulario", () => ({
    default: (props: any) => (
        <label>
            {props.etiqueta}
            <input
                aria-label={props.etiqueta}
                name={props.nombre}
                type={props.tipo}
                value={props.valor}
                placeholder={props.marcador}
                onChange={(e) => props.alCambiar(e.target.value)}
            />
        </label>
    ),
}));

vi.mock("../Componentes/moleculas/CampoSeleccion", () => ({
    default: (props: any) => (
        <label>
            {props.etiqueta}
            <select
                aria-label={props.etiqueta}
                name={props.nombre}
                value={props.valor}
                onChange={(e) => props.alCambiar(e.target.value)}
            >
                {props.opciones.map((opcion: any) => (
                    <option key={opcion.valor} value={opcion.valor}>
                        {opcion.etiqueta}
                    </option>
                ))}
            </select>
        </label>
    ),
}));

vi.mock("../Componentes/atomos/Boton", () => ({
    default: (props: any) => (
        <button type={props.tipo ?? "button"}>{props.texto}</button>
    ),
}));

vi.mock("../Componentes/atomos/Aviso", () => ({
    default: (props: any) => (
        <div role="status">
            {props.mensaje}
            <button type="button" onClick={props.alCerrar}>
                Cerrar aviso
            </button>
        </div>
    ),
}));

describe("AdminUsuarios", () => {
    beforeEach(() => {
        vi.spyOn(repositorio, "listarUsuarios").mockReturnValue([
            {
                id: 1,
                nombre: "Administrador",
                rut: "11.111.111-1",
                email: "admin@sonidovivo.cl",
                region: "Región Metropolitana",
                comuna: "Santiago",
                password: "admin123",
                rol: "Administrador",
                activo: true,
            },
        ]);
    });

    afterEach(() => {
        cleanup();
        vi.restoreAllMocks();
    });

    it("muestra la pantalla y los usuarios registrados", () => {
        render(<AdminUsuarios />);

        expect(screen.getByText("Gestión de Usuarios")).toBeTruthy();
        expect(screen.getByText("admin@sonidovivo.cl")).toBeTruthy();
        expect(screen.getByText("Activo")).toBeTruthy();
    });

    it("rechaza un RUT inválido", () => {
        render(<AdminUsuarios />);

        fireEvent.change(screen.getByLabelText("Nombre completo"), {
            target: { value: "Carlos Tapia" },
        });
        fireEvent.change(screen.getByLabelText("RUT / RUN"), {
            target: { value: "123" },
        });
        fireEvent.change(screen.getByLabelText("Correo electrónico"), {
            target: { value: "carlos@ejemplo.cl" },
        });
        fireEvent.change(screen.getByLabelText("Región"), {
            target: { value: "Región Metropolitana" },
        });
        fireEvent.change(screen.getByLabelText("Comuna"), {
            target: { value: "Santiago" },
        });
        fireEvent.change(screen.getByLabelText("Contraseña"), {
            target: { value: "Clave123" },
        });

        fireEvent.click(screen.getByRole("button", { name: "Registrar Usuario" }));

        expect(screen.getByText("El RUT ingresado no es válido.")).toBeTruthy();
    });

    it("valida que la contraseña tenga al menos ocho caracteres", () => {
        render(<AdminUsuarios />);

        fireEvent.change(screen.getByLabelText("Nombre completo"), {
            target: { value: "Carlos Tapia" },
        });
        fireEvent.change(screen.getByLabelText("RUT / RUN"), {
            target: { value: "11.111.111-1" },
        });
        fireEvent.change(screen.getByLabelText("Correo electrónico"), {
            target: { value: "carlos@ejemplo.cl" },
        });
        fireEvent.change(screen.getByLabelText("Región"), {
            target: { value: "Región Metropolitana" },
        });
        fireEvent.change(screen.getByLabelText("Comuna"), {
            target: { value: "Santiago" },
        });
        fireEvent.change(screen.getByLabelText("Contraseña"), {
            target: { value: "abc" },
        });

        fireEvent.click(screen.getByRole("button", { name: "Registrar Usuario" }));

        expect(
            screen.getByText("La contraseña debe tener al menos 8 caracteres.")
        ).toBeTruthy();
    });
    it("permite desactivar un usuario cuando el repositorio lo acepta", () => {
    vi.spyOn(repositorio, "cambiarEstadoUsuario").mockReturnValue({
        ok: true,
        usuario: {
            id: 1,
            nombre: "Administrador",
            rut: "11.111.111-1",
            email: "admin@sonidovivo.cl",
            region: "Región Metropolitana",
            comuna: "Santiago",
            password: "admin123",
            rol: "Administrador",
            activo: false,
        },
    });

    render(<AdminUsuarios />);

    fireEvent.click(screen.getByRole("button", { name: "Desactivar" }));

    expect(
        screen.getByText("Estado de usuario actualizado.")
    ).toBeTruthy();
    });
    
});
