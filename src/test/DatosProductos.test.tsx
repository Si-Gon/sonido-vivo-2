//@vitest-environment jsdom
import { beforeEach, expect, test } from "vitest";
import {
    actualizarProducto, buscarProducto, crearProducto, eliminarProducto, listarProductos, restablecerCatalogo
} from "../datos/repositorioProductos";

beforeEach(() => {
    localStorage.clear();
    restablecerCatalogo();
});

test("Prueba 11: crear un producto lo agrega al listado y lo guarda", () => {
    const antes = listarProductos().length;

    const nuevo = crearProducto({
        codigo: "PR999",
        categoria: "Percusión",
        nombre: "Cajón Peruano",
        marca: "Sonido Vivo",
        modelo: "Cajón Pro",
        precio: 189990,
        stock: 3,
        descripcion: "Cajón de madera con cuerdas internas.",
        imagen: "pr999.jpg"
    });

    expect(nuevo.id).toBeGreaterThan(0);
    expect(listarProductos().length).toBe(antes + 1);
    expect(buscarProducto(nuevo.id)?.nombre).toBe("Cajón Peruano");
    expect(String(localStorage.getItem("productos"))).toContain("Cajón Peruano");
});

test("Prueba 12: actualizar cambia solo el dato pedido y lo deja guardado", () => {
    const original = listarProductos()[0];

    actualizarProducto(original.id, { precio: 111111 });

    const actualizado = buscarProducto(original.id);
    expect(actualizado?.precio).toBe(111111);
    expect(actualizado?.nombre).toBe(original.nombre);
    expect(actualizado?.stock).toBe(original.stock);
    expect(String(localStorage.getItem("productos"))).toContain("111111");
});

test("Prueba 13: eliminar saca el producto del listado", () => {
    const original = listarProductos()[0];
    const antes = listarProductos().length;

    eliminarProducto(original.id);

    expect(listarProductos().length).toBe(antes - 1);
    expect(buscarProducto(original.id)).toBeUndefined();
    expect(String(localStorage.getItem("productos"))).not.toContain(original.nombre);
});
