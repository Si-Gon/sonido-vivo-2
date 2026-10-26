
import { beforeEach, describe, expect, test } from "vitest";
import {
    buscarPedidoPorId,
    crearPedido,
    guardarDatosDespacho,
    listarPedidos,
    listarPedidosPorUsuario,
    restablecerPedidosParaPruebas,
} from "../datos/repositorioPedidos";
import {
    crearProducto,
    type ProductoNuevo,
} from "../datos/repositorioProductos";
import { iniciarSesion } from "../datos/sesion";

const usuarioPrueba = {
    id: 50,
    nombre: "Cliente de prueba",
    email: "cliente@prueba.cl",
    rol: "Cliente" as const,
};

const productoPrueba: ProductoNuevo = {
    codigo: "PEDIDO001",
    categoria: "Accesorios",
    nombre: "Micrófono de prueba",
    marca: "Marca de prueba",
    modelo: "Modelo 1",
    precio: 25000,
    stock: 5,
    descripcion: "Producto utilizado en pruebas.",
    imagen: "https://example.com/microfono.jpg",
};

beforeEach(() => {
    localStorage.clear();
    restablecerPedidosParaPruebas();
});

describe("repositorioPedidos", () => {
    test("crea un pedido asociado al usuario que inició sesión", () => {
        iniciarSesion(usuarioPrueba);
        const producto = crearProducto(productoPrueba);

        const pedido = crearPedido([
            { id: producto.id, cantidad: 2 },
        ]);

        expect(pedido.usuarioId).toBe(usuarioPrueba.id);
        expect(pedido.nombreCliente).toBe(usuarioPrueba.nombre);
        expect(pedido.emailCliente).toBe(usuarioPrueba.email);
        expect(pedido.estado).toBe("Pendiente de despacho");
        expect(pedido.despacho).toBeNull();
        expect(listarPedidos()).toHaveLength(1);
    });

    test("calcula el total y conserva los datos de los productos", () => {
        iniciarSesion(usuarioPrueba);
        const producto = crearProducto(productoPrueba);

        const pedido = crearPedido([
            { id: producto.id, cantidad: 2 },
        ]);

        expect(pedido.items).toEqual([
            {
                productoId: producto.id,
                nombre: productoPrueba.nombre,
                precioUnitario: productoPrueba.precio,
                cantidad: 2,
                subtotal: 50000,
            },
        ]);
        expect(pedido.total).toBe(50000);
    });

    test("rechaza la creación si no hay una sesión iniciada", () => {
        const producto = crearProducto(productoPrueba);

        expect(() =>
            crearPedido([{ id: producto.id, cantidad: 1 }]),
        ).toThrow("Debes iniciar sesión");

        expect(listarPedidos()).toHaveLength(0);
    });

    test("rechaza un carrito vacío", () => {
        iniciarSesion(usuarioPrueba);

        expect(() => crearPedido([])).toThrow(
            "No puedes crear un pedido sin productos.",
        );
    });

    test("rechaza una cantidad superior al stock disponible", () => {
        iniciarSesion(usuarioPrueba);
        const producto = crearProducto(productoPrueba);

        expect(() =>
            crearPedido([{ id: producto.id, cantidad: 6 }]),
        ).toThrow(/Stock insuficiente/);

        expect(listarPedidos()).toHaveLength(0);
    });

    test("rechaza cantidades inválidas", () => {
        iniciarSesion(usuarioPrueba);
        const producto = crearProducto(productoPrueba);

        expect(() =>
            crearPedido([{ id: producto.id, cantidad: 0 }]),
        ).toThrow("El carrito contiene cantidades inválidas.");
    });

    test("permite buscar pedidos por ID y por usuario", () => {
        iniciarSesion(usuarioPrueba);
        const producto = crearProducto(productoPrueba);

        const pedido = crearPedido([
            { id: producto.id, cantidad: 1 },
        ]);

        expect(buscarPedidoPorId(pedido.id)).toEqual(pedido);
        expect(listarPedidosPorUsuario(usuarioPrueba.id)).toEqual([
            pedido,
        ]);
        expect(listarPedidosPorUsuario(999)).toEqual([]);
    });

    test("guarda y recupera los datos de despacho", () => {
        iniciarSesion(usuarioPrueba);
        const producto = crearProducto(productoPrueba);

        const pedido = crearPedido([
            { id: producto.id, cantidad: 1 },
        ]);

        const despacho = {
            nombre: " Cliente de prueba ",
            telefono: " 912345678 ",
            region: " Valparaíso ",
            comuna: " San Felipe ",
            direccion: " Avenida de prueba 123 ",
            referencia: " Casa azul ",
        };

        const actualizado = guardarDatosDespacho(
            pedido.id,
            despacho,
        );

        expect(actualizado.despacho).toEqual({
            nombre: "Cliente de prueba",
            telefono: "912345678",
            region: "Valparaíso",
            comuna: "San Felipe",
            direccion: "Avenida de prueba 123",
            referencia: "Casa azul",
        });

        expect(buscarPedidoPorId(pedido.id)?.despacho).toEqual(
            actualizado.despacho,
        );
    });

    test("rechaza guardar despacho para un pedido inexistente", () => {
        expect(() =>
            guardarDatosDespacho(999, {
                nombre: "Cliente",
                telefono: "912345678",
                region: "Valparaíso",
                comuna: "San Felipe",
                direccion: "Dirección de prueba",
                referencia: "",
            }),
        ).toThrow("No se encontró el pedido.");
    });

    test("notifica cuando se crea un pedido", () => {
        iniciarSesion(usuarioPrueba);
        const producto = crearProducto(productoPrueba);
        let notificaciones = 0;

        const callback = () => {
            notificaciones += 1;
        };

        window.addEventListener(
            "sonido-vivo:pedidos-actualizados",
            callback,
        );

        try {
            crearPedido([{ id: producto.id, cantidad: 1 }]);

            expect(notificaciones).toBe(1);
        } finally {
            window.removeEventListener(
                "sonido-vivo:pedidos-actualizados",
                callback,
            );
        }
    });
});
