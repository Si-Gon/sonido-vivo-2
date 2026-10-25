import { Link, NavLink, useNavigate } from "react-router-dom";
import { cerrarSesion, useSesion } from "../../datos/sesion";

const sesion = useSesion();
const navigate = useNavigate();
const salir = () => {
    cerrarSesion();
    navigate("/");
};
const claseEnlace = ({ isActive }: { isActive: boolean }) => (
    isActive ? "nav-link active" : "nav-link"
);

function Navbar() {

    return(
        <nav className="navbar navbar-expand-lg navbar-dark sv-navbar">
            <div className="container">

                <Link className="navbar-brand sv-marca" to="/">
                    <img src="/img/logo-claro.png" alt="" className="sv-logo" />
                    Sonido Vivo
                </Link>

                <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#menuPrincipal"
                aria-controls="menuPrincipal"
                aria-expanded="false"
                aria-label="Abrir menú de navegación"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="menuPrincipal">
                    <ul className="navbar-nav ms-auto">

                        <li className="nav-item">
                            <NavLink className={claseEnlace} to="/" end>Inicio</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className={claseEnlace} to="/nosotros">Nosotros</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className={claseEnlace} to="/catalogo">Catálogo</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className={claseEnlace} to="/carrito">Carrito</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className={claseEnlace} to="/novedades">Novedades</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className={claseEnlace} to="/contacto">Contacto</NavLink>
                        </li>
                        {sesion ? (
                            <>
                                {sesion.rol === "Administrador" && (
                                    <li className="nav-item">
                                        <NavLink className={claseEnlace} to="/admin">Panel</NavLink>
                                    </li>
                                )}
                                <li className="nav-item">
                                    <span className="navbar-text px-lg-2">Hola, {sesion.nombre}</span>
                                </li>
                                <li className="nav-item">
                                    <button type="button" className="nav-link btn btn-link" onClick={salir}>
                                    Cerrar sesión
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <NavLink className={claseEnlace} to="/login">Iniciar sesión</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className={claseEnlace} to="/registro">Registrarse</NavLink>
                                </li>
                            </>
                        )}

                    </ul>
                </div>

            </div>
        </nav>
    )
}

export default Navbar
