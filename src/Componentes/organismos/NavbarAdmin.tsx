import { Link, NavLink } from "react-router-dom";

const claseEnlace = ({ isActive }: { isActive: boolean }) => (
    isActive ? "nav-link active" : "nav-link"
);

function NavbarAdmin() {

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
                            <NavLink className={claseEnlace} to="/admin" end>Panel</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className={claseEnlace} to="/admin/productos">Productos</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className={claseEnlace} to="/admin/usuarios">Usuarios</NavLink>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/login">Cerrar sesión</Link>
                        </li>

                    </ul>
                </div>

            </div>
        </nav>
    )
}

export default NavbarAdmin
