import { useNavigate } from "react-router-dom";
import Boton from "../Componentes/atomos/Boton";
import { cerrarSesion, useSesion } from "../datos/sesion";
import { formatearRut } from "../utilidades/rut";
import { useEffect, useState } from "react";
import { obtenerUsuario, type Usuario } from "../datos/repositorioUsuarios";

function PerfilAdmin() {
    const sesion = useSesion();
    const navigate = useNavigate();

    const [usuario, setUsuario] = useState<Usuario | undefined>(undefined);

    useEffect(() => {
        if (!sesion) return;

        let vigente = true;

        void obtenerUsuario(sesion.id).then((datos) => {
            if (vigente) setUsuario(datos);
        });

        return () => {
            vigente = false;
        };
    }, [sesion]);

    const salir = () => {
        cerrarSesion();
        navigate("/login");
    };

    if (!sesion) {
        return(
            <section className="sv-seccion">
                <h1>Mi perfil</h1>
                <p className="sv-pendiente">No hay una sesión activa.</p>
            </section>
        )
    }

    return(
        <section className="sv-seccion">
            <h1>Mi perfil</h1>

            <p className="sv-lead">
                Datos de la cuenta con la que estás administrando la tienda. El nombre y el correo
                son los que quedan asociados a los pedidos que registres.
            </p>

            <div className="sv-panel">
                <h2>Datos de la cuenta</h2>
                <ul className="sv-detalle-datos">
                    <li>Nombre: {sesion.nombre}</li>
                    <li>Correo: {sesion.email}</li>
                    <li>Rol: {sesion.rol}</li>
                    {usuario && <li>RUT: {formatearRut(usuario.rut)}</li>}
                    {usuario && usuario.region !== "" && (
                        <li>Ubicación: {usuario.comuna}, {usuario.region}</li>
                    )}
                    <li>Estado de la cuenta: {usuario ? (usuario.activo ? "Activa" : "Inactiva") : "—"}</li>
                </ul>
            </div>

            <div className="d-flex flex-wrap gap-2 mt-4">
                <Boton texto="Ir al panel" to="/admin" variante="contorno" />
                <button type="button" className="btn btn-warning" onClick={salir}>
                    Cerrar sesión
                </button>
            </div>
        </section>
    )
}

export default PerfilAdmin
