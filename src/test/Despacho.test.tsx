
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import Despacho from "../Paginas/Despacho";
import { regionesChile } from "../datos/regiones";
import { crearPedido, restablecerPedidosParaPruebas } from "../datos/repositorioPedidos";
import { crearProducto, type ProductoNuevo } from "../datos/repositorioProductos";
import { iniciarSesion } from "../datos/sesion";

const usuarioPrueba = {
    id: 50,
    nombre: "Cliente de prueba",
    email: "cliente@prueba.cl",
    rol: "Cliente" as const,
};

const productoPrueba: ProductoNuevo = {
    codigo: "DESPACHO001",
    categoria: "Accesorios",
    nombre: "Micrófono de prueba",
    marca: "Marca de prueba",
    modelo: "Modelo 1",
    precio: 25000,
    stock: 5,
    descripcion: "Producto utilizado en pruebas.",
    imagen: "https://example.com/microfono.jpg",
};

function prepararPedido() {
    iniciarSesion(usuarioPrueba);

    const producto = crearProducto(productoPrueba);
    const pedido = crearPedido([{ id: producto.id, cantidad: 1 }]);

    return pedido;
}

function renderizarDespacho(pedidoId: number) {
    return render(
        <MemoryRouter initialEntries={[`/despacho/${pedidoId}`]}>
            <Routes>
                <Route path="/despacho/:id" element={<Despacho />} />
                <Route path="/login" element={<p>Pantalla de inicio de sesión</p>} />
                <Route path="/catalogo" element={<p>Catálogo</p>} />
                <Route path="/" element={<p>Inicio</p>} />
            </Routes>
        </MemoryRouter>
    );
}

function completarFormulario() {
    const regionValida = regionesChile.find(
        (region) => region.comunas.length > 0
    );

    if (!regionValida) {
        throw new Error("No hay regiones con comunas disponibles para la prueba.");
    }

    fireEvent.change(screen.getByLabelText("Nombre del destinatario *"), {
        target: { value: "Cliente de prueba" },
    });

    fireEvent.change(screen.getByLabelText("Teléfono *"), {
        target: { value: "912345678" },
    });

    fireEvent.change(screen.getByLabelText("Región *"), {
        target: { value: regionValida.id },
    });

    fireEvent.change(screen.getByLabelText("Comuna *"), {
        target: { value: regionValida.comunas[0] },
    });

    fireEvent.change(screen.getByLabelText("Dirección *"), {
        target: { value: "Avenida de prueba 123" },
    });

    return regionValida;
}

beforeEach(() => {
    localStorage.clear();
    restablecerPedidosParaPruebas();
});

afterEach(() => {
    cleanup();
});

describe("Despacho", () => {
    it("muestra el pedido y el formulario de despacho", () => {
        const pedido = prepararPedido();

        renderizarDespacho(pedido.id);

        expect(screen.getByRole("heading", { name: "Datos de despacho" })).toBeTruthy();
        expect(screen.getByText(`Pedido #${pedido.id} · Total: $25.000`)).toBeTruthy();
        expect(screen.getByLabelText("Nombre del destinatario *")).toBeTruthy();
        expect(screen.getByRole("button", { name: "Guardar datos de despacho" })).toBeTruthy();
    });

    it("rechaza los campos obligatorios vacíos", () => {
        const pedido = prepararPedido();

        renderizarDespacho(pedido.id);

        fireEvent.submit(screen.getByRole("button", {
            name: "Guardar datos de despacho",
        }).closest("form")!);

        expect(screen.getByText("Completa todos los campos obligatorios.")).toBeTruthy();
    });

    it("rechaza un teléfono inválido", () => {
        const pedido = prepararPedido();

        renderizarDespacho(pedido.id);
        completarFormulario();

        fireEvent.change(screen.getByLabelText("Teléfono *"), {
            target: { value: "teléfono incorrecto" },
        });

        fireEvent.click(screen.getByRole("button", {
            name: "Guardar datos de despacho",
        }));

        expect(screen.getByText("Ingresa un teléfono válido.")).toBeTruthy();
    });

    
    it("guarda los datos de despacho válidos", () => {
        const pedido = prepararPedido();
    
        renderizarDespacho(pedido.id);
        completarFormulario();
    
        fireEvent.click(screen.getByRole("button", {
            name: "Guardar datos de despacho",
        }));
    
        expect(screen.getByRole("status").textContent).toContain(
            "Los datos de despacho se guardaron correctamente."
        );
    });


    it("impide acceder al pedido de otro usuario", () => {
        const pedido = prepararPedido();

        iniciarSesion({
            id: 99,
            nombre: "Otro cliente",
            email: "otro@prueba.cl",
            rol: "Cliente",
        });

        renderizarDespacho(pedido.id);

        expect(
            screen.getByText("No tienes permiso para acceder a este pedido.")
        ).toBeTruthy();
    });

    it("muestra un error si el pedido no existe", () => {
        iniciarSesion(usuarioPrueba);

        renderizarDespacho(999);

        expect(screen.getByText("No se encontró el pedido.")).toBeTruthy();
    });
});
