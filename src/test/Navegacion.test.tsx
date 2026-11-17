//@vitest-environment jsdom
import { expect, test } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../App";

const publicas: [string, string][] = [
    ["/", "Bienvenidos a Sonido Vivo"],
    ["/nosotros", "Nosotros"],
    ["/catalogo", "Catálogo de productos"],
    ["/producto/7", "Guitarra Eléctrica Les Paul"],
    ["/carrito", "Carrito de compras"],
    ["/novedades", "Novedades"],
    ["/novedad/3", "Taller de luthería: mantenimiento de instrumentos de cuerda"],
    ["/contacto", "Contacto"],
    ["/login", "Iniciar Sesión"],
    ["/registro", "Crear cuenta"],
    ["/ruta-inexistente", "Página no encontrada"]
];

// El panel pide sesión de administrador: se siembra para poder mirar sus tres pantallas.
const panel: [string, string][] = [
    ["/admin", "Panel de administración"],
    ["/admin/pedidos", "Gestión de pedidos"],
    ["/admin/productos", "Gestión de Productos"],
    ["/admin/usuarios", "Gestión de Usuarios"]
];

test("Prueba 8: cada ruta muestra su pagina y el detalle lee el parametro de la URL", async () => {
    localStorage.clear();

    for (const [ruta, titulo] of publicas) {
        const { unmount } = render(
            <MemoryRouter initialEntries={[ruta]}>
                <App />
            </MemoryRouter>
        );

        // El producto del detalle y el listado llegan del servicio: se espera al título.
        await waitFor(() => expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(titulo));
        unmount();
    }

    localStorage.setItem("sesion", JSON.stringify({
        id: 1, nombre: "Administrador", email: "admin@sonidovivo.cl", rol: "Administrador"
    }));

    for (const [ruta, titulo] of panel) {
        const { unmount } = render(
            <MemoryRouter initialEntries={[ruta]}>
                <App />
            </MemoryRouter>
        );

        await waitFor(() => expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(titulo));
        unmount();
    }

    localStorage.clear();

    const { unmount } = render(
        <MemoryRouter initialEntries={["/producto/7"]}>
            <App />
        </MemoryRouter>
    );
    await waitFor(() => expect(screen.getByText("Epiphone · Les Paul Std").textContent).toBe("Epiphone · Les Paul Std"));
    expect(screen.getByText("$329.990").textContent).toBe("$329.990");
    expect(screen.getByText("Código: GE002").textContent).toBe("Código: GE002");
    unmount();

    render(
        <MemoryRouter initialEntries={["/producto/999"]}>
            <App />
        </MemoryRouter>
    );
    await waitFor(() => expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Producto no encontrado"));
});
