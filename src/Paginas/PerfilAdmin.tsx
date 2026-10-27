import { useNavigate } from "react-router-dom";
import Boton from "../Componentes/atomos/Boton";
import { cerrarSesion, useSesion } from "../datos/sesion";
import { listarUsuarios } from "../datos/repositorioUsuarios";

function PerfilAdmin() {
    const sesion = useSesion();
    const navigate = useNavigate();

    const usuario = sesion
        ? listarUsuarios().find((item) => item.id === sesion.id)
        : undefined;

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
                    {usuario && <li>RUT: {usuario.rut}</li>}
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
