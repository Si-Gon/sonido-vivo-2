//@vitest-environment jsdom
import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../App";

const rutas: [string, string][] = [
    ["/", "Inicio"],
    ["/nosotros", "Nosotros"],
    ["/catalogo", "Catálogo de productos"],
    ["/producto/7", "Guitarra Eléctrica Les Paul"],
    ["/carrito", "Carrito de compras"],
    ["/novedades", "Novedades"],
    ["/novedad/3", "Detalle de la novedad"],
    ["/contacto", "Contacto"],
    ["/login", "Iniciar sesión"],
    ["/registro", "Registro de usuario"],
    ["/admin", "Panel de administración"],
    ["/admin/productos", "Administración de productos"],
    ["/admin/usuarios", "Administración de usuarios"],
    ["/ruta-inexistente", "Página no encontrada"]
];

test("Prueba 15: cada ruta muestra su pagina y el detalle lee el parametro de la URL", () => {
    rutas.forEach(([ruta, titulo]) => {
        const { unmount } = render(
            <MemoryRouter initialEntries={[ruta]}>
                <App />
            </MemoryRouter>
        );
        expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(titulo);
        unmount();
    });

    const { unmount } = render(
        <MemoryRouter initialEntries={["/producto/7"]}>
            <App />
        </MemoryRouter>
    );
    expect(screen.getByText("Epiphone · Les Paul Std").textContent).toBe("Epiphone · Les Paul Std");
    expect(screen.getByText("$329.990").textContent).toBe("$329.990");
    expect(screen.getByText("Código: GE002").textContent).toBe("Código: GE002");
    unmount();

    render(
        <MemoryRouter initialEntries={["/producto/999"]}>
            <App />
        </MemoryRouter>
    );
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Producto no encontrado");
});
