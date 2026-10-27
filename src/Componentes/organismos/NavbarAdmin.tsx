import { Link, NavLink, useNavigate } from "react-router-dom";
import { cerrarSesion, useSesion } from "../../datos/sesion";

const claseEnlace = ({ isActive }: { isActive: boolean }) => (
    isActive ? "nav-link active" : "nav-link"
);

function NavbarAdmin() {
    const sesion = useSesion();
    const navigate = useNavigate();

    const salir = () => {
        cerrarSesion();
        navigate("/login");
    };

    return(
        <nav className="navbar navbar-expand-lg navbar-dark sv-navbar-admin">
            <div className="container">

                <span className="navbar-brand sv-marca">Administración</span>

                <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#menuAdmin"
                aria-controls="menuAdmin"
                aria-expanded="false"
                aria-label="Abrir menú de administración"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="menuAdmin">
                    <ul className="navbar-nav ms-auto">

                        <li className="nav-item">
                            <Link className="nav-link" to="/">Volver al sitio</Link>
                        </li>
                        <li className="nav-item">
                            <NavLink className={claseEnlace} to="/admin/pedidos">Pedidos</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className={claseEnlace} to="/admin/productos">Productos</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className={claseEnlace} to="/admin/usuarios">Usuarios</NavLink>
                        </li>
                        {sesion && (
                            <li className="nav-item">
                                <span className="navbar-text px-lg-2">Hola, {sesion.nombre}</span>
                            </li>
                        )}
                        <li className="nav-item">
                            <button type="button" className="nav-link btn btn-link" onClick={salir}>
                                Cerrar sesión
                            </button>
                        </li>

                    </ul>
                </div>

            </div>
        </nav>
    )
}

export default NavbarAdmin
