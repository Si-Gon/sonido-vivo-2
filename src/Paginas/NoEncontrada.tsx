import { Link } from "react-router-dom";

function NoEncontrada() {

    return(
        <section className="sv-seccion">
            <h1>Página no encontrada</h1>
            <p className="sv-pendiente">La dirección solicitada no existe.</p>
            <Link className="sv-volver" to="/">Volver al inicio</Link>
        </section>
    )
}

export default NoEncontrada
