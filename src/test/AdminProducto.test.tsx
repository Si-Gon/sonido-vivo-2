import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import AdminProductos from "../Paginas/AdminProductos";

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
        <button
            type={props.tipo ?? "button"}
            onClick={props.alHacerClick}
        >
            {props.texto}
        </button>
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

beforeEach(() => {
    localStorage.clear();

    Object.defineProperty(window, "scrollTo", {
        configurable: true,
        value: vi.fn(),
    });
});

afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
});

describe("AdminProductos", () => {
    it("muestra el panel y el inventario actual", () => {
        render(<AdminProductos />);

        expect(screen.getByText("Gestión de Productos")).toBeTruthy();
        expect(screen.getByText("Inventario Actual")).toBeTruthy();
        expect(screen.getByRole("button", { name: "Guardar Producto" })).toBeTruthy();
    });

    it("crea un producto nuevo", () => {
        render(<AdminProductos />);

        fireEvent.change(screen.getByLabelText("Nombre del producto"), {
            target: { value: "Producto nuevo de prueba" },
        });
        fireEvent.change(screen.getByLabelText("Precio (CLP)"), {
            target: { value: "15000" },
        });
        fireEvent.change(screen.getByLabelText("Stock disponible"), {
            target: { value: "4" },
        });

        fireEvent.click(screen.getByRole("button", { name: "Guardar Producto" }));

        expect(screen.getByText("Producto nuevo de prueba")).toBeTruthy();
        expect(screen.getByRole("status").textContent).toContain(
            "Producto agregado exitosamente."
        );
    });

    it("permite editar un producto existente", () => {
        render(<AdminProductos />);

        fireEvent.click(screen.getAllByRole("button", { name: "Editar" })[0]);

        fireEvent.change(screen.getByLabelText("Nombre del producto"), {
            target: { value: "Producto editado de prueba" },
        });
        fireEvent.change(screen.getByLabelText("Precio (CLP)"), {
            target: { value: "22000" },
        });
        fireEvent.change(screen.getByLabelText("Stock disponible"), {
            target: { value: "8" },
        });

        fireEvent.click(screen.getByRole("button", { name: "Guardar Cambios" }));

        expect(screen.getByText("Producto editado de prueba")).toBeTruthy();
        expect(screen.getByRole("status").textContent).toContain(
            "Producto actualizado correctamente."
        );
    });

    it("elimina un producto del inventario", () => {
        render(<AdminProductos />);

        fireEvent.change(screen.getByLabelText("Nombre del producto"), {
            target: { value: "Producto para eliminar" },
        });
        fireEvent.change(screen.getByLabelText("Precio (CLP)"), {
            target: { value: "10000" },
        });
        fireEvent.change(screen.getByLabelText("Stock disponible"), {
            target: { value: "2" },
        });

        fireEvent.click(screen.getByRole("button", { name: "Guardar Producto" }));

        const fila = screen.getByText("Producto para eliminar").closest("tr");
        expect(fila).toBeTruthy();

        fireEvent.click(
            within(fila!).getByRole("button", { name: "Eliminar" })
        );

        expect(screen.queryByText("Producto para eliminar")).toBeNull();
        expect(screen.getByRole("status").textContent).toContain(
            "Producto eliminado del inventario."
        );
    });

    it("rechaza un precio negativo", () => {
        render(<AdminProductos />);

        fireEvent.change(screen.getByLabelText("Nombre del producto"), {
            target: { value: "Producto inválido" },
        });
        fireEvent.change(screen.getByLabelText("Precio (CLP)"), {
            target: { value: "-100" },
        });
        fireEvent.change(screen.getByLabelText("Stock disponible"), {
            target: { value: "2" },
        });

        fireEvent.click(screen.getByRole("button", { name: "Guardar Producto" }));

        expect(screen.getByText("El precio debe ser un número positivo.")).toBeTruthy();
        expect(screen.queryByText("Producto inválido")).toBeNull();
    });

    it("rechaza un stock negativo", () => {
        render(<AdminProductos />);

        fireEvent.change(screen.getByLabelText("Nombre del producto"), {
            target: { value: "Producto con stock inválido" },
        });
        fireEvent.change(screen.getByLabelText("Precio (CLP)"), {
            target: { value: "10000" },
        });
        fireEvent.change(screen.getByLabelText("Stock disponible"), {
            target: { value: "-1" },
        });

        fireEvent.click(screen.getByRole("button", { name: "Guardar Producto" }));

        expect(screen.getByText("El stock no puede ser negativo.")).toBeTruthy();
        expect(screen.queryByText("Producto con stock inválido")).toBeNull();
    });

    it("permite cancelar una edición sin guardar los cambios", () => {
        render(<AdminProductos />);

        const nombreOriginal = screen.getAllByRole("row")[1].querySelector("td")?.textContent;

        fireEvent.click(screen.getAllByRole("button", { name: "Editar" })[0]);

        fireEvent.change(screen.getByLabelText("Nombre del producto"), {
            target: { value: "Cambio que se cancelará" },
        });

        fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));

        expect(screen.queryByText("Cambio que se cancelará")).toBeNull();
        expect(screen.getByRole("button", { name: "Guardar Producto" })).toBeTruthy();

        if (nombreOriginal) {
            expect(screen.getByText(nombreOriginal)).toBeTruthy();
        }
    });
});
