import { beforeEach, describe, expect, test } from "vitest";
import {
    actualizarProducto,
    buscarProducto,
    crearProducto,
    eliminarProducto,
    listarProductos,
    restablecerCatalogo,
    type ProductoNuevo,
} from "../datos/repositorioProductos";

const productoPrueba: ProductoNuevo = {
    codigo: "TEST001",
    categoria: "Accesorios",
    nombre: "Producto de prueba",
    marca: "Marca de prueba",
    modelo: "Modelo de prueba",
    precio: 12345,
    stock: 3,
    descripcion: "Producto utilizado en pruebas automatizadas.",
    imagen: "https://example.com/producto.jpg",
};

beforeEach(() => {
    localStorage.clear();
});

describe("repositorioProductos", () => {
    test("crearProducto guarda el producto y listarProductos lo devuelve", () => {
        const creado = crearProducto(productoPrueba);
        const productos = listarProductos();

        expect(productos.some((producto) => producto.id === creado.id)).toBe(true);
        expect(productos.find((producto) => producto.id === creado.id)).toMatchObject(productoPrueba);
    });

    test("eliminarProducto elimina realmente el producto del repositorio", () => {
        const creado = crearProducto(productoPrueba);
        eliminarProducto(creado.id);

        expect(listarProductos().some((producto) => producto.id === creado.id)).toBe(false);
    });

    test("listarProductos inicializa el catálogo base cuando no hay datos guardados", () => {
        const productos = listarProductos();

        expect(productos.length).toBeGreaterThan(0);
        expect(productos.some((producto) => producto.nombre === "Guitarra Acústica Folk")).toBe(true);
    });

    test("el repositorio notifica a las vistas cuando cambian los productos", () => {
        let notificaciones = 0;
        const callback = () => { notificaciones += 1; };
        
        const evento = "sonido-vivo:productos-actualizados";
        window.addEventListener(evento, callback);

        try {
            const creado = crearProducto(productoPrueba);
            eliminarProducto(creado.id);
            expect(notificaciones).toBe(2);
        } finally {
            window.removeEventListener("sonido-vivo:productos-actualizados", callback);
        }
    });

    test("restablecerCatalogo conserva el catálogo base disponible", () => {
        crearProducto(productoPrueba);
        const restablecidos = restablecerCatalogo();

        expect(listarProductos()).toEqual(restablecidos);
        expect(listarProductos().some((producto) => producto.nombre === productoPrueba.nombre)).toBe(false);
    });

    test("actualizarProducto guarda los cambios del producto", () => {
    const creado = crearProducto(productoPrueba);

    actualizarProducto(creado.id, {
        nombre: "Producto editado",
        precio: 20000,
        stock: 8,
    });

    const actualizado = listarProductos().find(
        (producto) => producto.id === creado.id
    );

    expect(actualizado).toMatchObject({
        nombre: "Producto editado",
        precio: 20000,
        stock: 8,
    });
    });
    
    test("buscarProducto devuelve el producto correcto o undefined", () => {
        const creado = crearProducto(productoPrueba);
    
        expect(buscarProducto(creado.id)).toMatchObject(productoPrueba);
        expect(buscarProducto(999999)).toBeUndefined();
    });
    
    test("actualizarProducto rechaza un ID inexistente", () => {
        expect(() =>
            actualizarProducto(999999, { nombre: "Producto editado" })
        ).toThrow("No se encontró el producto.");
    });
    
    test("eliminarProducto no elimina otros productos", () => {
        const primero = crearProducto(productoPrueba);
        const segundo = crearProducto({
            ...productoPrueba,
            codigo: "TEST002",
            nombre: "Segundo producto",
        });
    
        eliminarProducto(primero.id);
    
        expect(buscarProducto(primero.id)).toBeUndefined();
        expect(buscarProducto(segundo.id)?.nombre).toBe("Segundo producto");
    });
});