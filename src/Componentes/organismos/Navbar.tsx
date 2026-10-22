import { Link, NavLink } from "react-router-dom";

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
                        <li className="nav-item">
                            <NavLink className={claseEnlace} to="/login">Iniciar sesión</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className={claseEnlace} to="/registro">Registrarse</NavLink>
                        </li>

                    </ul>
                </div>

            </div>
        </nav>
    )
}

export default Navbar
