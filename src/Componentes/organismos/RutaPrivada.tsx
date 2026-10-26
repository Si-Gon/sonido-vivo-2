import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSesion } from "../../datos/sesion";

type Props = {
    children: ReactNode;
    /** Rol que puede entrar. Sin rol alcanza con tener sesión. */
    rol?: "Administrador" | "Cliente";
    /** A dónde va quien tiene sesión pero no el rol pedido. */
    destinoSinRol?: string;
};

/**
 * Deja pasar solo con sesión abierta, y opcionalmente con un rol.
 *
 * Sin sesión manda al login y le dice de qué pantalla viene, para que al entrar vuelva ahí; con
 * sesión pero sin el rol, lo manda a la tienda. El aviso del login lo muestra el propio login.
 */
function RutaPrivada({ children, rol, destinoSinRol = "/catalogo" }: Props) {
    const sesion = useSesion();
    const location = useLocation();

    if (!sesion) {
        return (
            <Navigate
            to="/login"
            replace
            state={{ desde: location.pathname, mensaje: "Para entrar aquí tienes que iniciar sesión." }}
            />
        );
    }

    if (rol && sesion.rol !== rol) {
        return <Navigate to={destinoSinRol} replace />;
    }

    return <>{children}</>;
}

export default RutaPrivada;
