import Boton from "../atomos/Boton";
import type { Novedad } from "../../datos/novedades";
import { formatearFecha } from "../../utilidades/formato";

type Props = {
    novedad: Novedad;
};

function CardNovedad({ novedad }: Props) {

    return(
        <article className="sv-novedad h-100">
            <img
            className="sv-novedad-miniatura"
            src={novedad.imagen}
            alt={novedad.titulo}
            />

            <div className="sv-novedad-cuerpo">
                <p className="sv-novedad-meta">
                    <span className="sv-etiqueta">{novedad.categoria}</span>
                    <span className="sv-novedad-fecha">· {formatearFecha(novedad.fecha)}</span>
                </p>

                <h3 className="sv-novedad-titulo">{novedad.titulo}</h3>
                <p className="sv-novedad-resumen">{novedad.resumen}</p>

                <div className="mt-auto">
                    <Boton
                    texto="Leer la novedad"
                    to={`/novedad/${novedad.id}`}
                    variante="contorno"
                    />
                </div>
            </div>
        </article>
    )
}

export default CardNovedad
