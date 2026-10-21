import { useParams } from "react-router-dom";
import Boton from "../Componentes/atomos/Boton";
import { buscarNovedad } from "../datos/novedades";
import { formatearFecha } from "../utilidades/formato";

function NovedadDetalle() {
    const { id } = useParams();

    const novedad = buscarNovedad(Number(id));

    if (!novedad) {
        return(
            <section className="sv-seccion">
                <h1>Novedad no encontrada</h1>
                <p className="sv-pendiente">La novedad solicitada no existe.</p>
                <div className="text-center">
                    <Boton
                    texto="Volver a novedades"
                    to="/novedades"
                    variante="contorno"
                    />
                </div>
            </section>
        )
    }

    return(
        <section className="sv-seccion sv-seccion-ancha">
            <div className="row g-4">
                <div className="col-12 col-lg-5">
                    <img
                    className="sv-novedad-imagen"
                    src={novedad.imagen}
                    alt={novedad.titulo}
                    />
                </div>

                <div className="col-12 col-lg-7">
                    <p className="sv-novedad-meta">
                        <span className="sv-etiqueta">{novedad.categoria}</span>
                        <span className="sv-novedad-fecha">· {formatearFecha(novedad.fecha)}</span>
                    </p>

                    <h1>{novedad.titulo}</h1>

                    {novedad.parrafos.map((parrafo, indice) => (
                        <p key={indice}>{parrafo}</p>
                    ))}

                    <Boton
                    texto="Volver a novedades"
                    to="/novedades"
                    variante="contorno"
                    />
                </div>
            </div>
        </section>
    )
}

export default NovedadDetalle
