import { useParams } from "react-router-dom";

function NovedadDetalle() {

    const { id } = useParams()

    return(
        <section className="sv-seccion">
            <h1>Detalle de la novedad</h1>
            <p className="sv-pendiente">Novedad: {id}</p>
        </section>
    )
}

export default NovedadDetalle
