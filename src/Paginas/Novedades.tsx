import Boton from "../Componentes/atomos/Boton";
import CardNovedad from "../Componentes/moleculas/CardNovedad";
import { novedadesPorFecha } from "../datos/novedades";
import { formatearFecha } from "../utilidades/formato";

function Novedades() {
    const ordenadas = novedadesPorFecha();
    const [destacada, ...anteriores] = ordenadas;

    if (!destacada) {
        return(
            <section className="sv-seccion sv-seccion-ancha">
                <h1>Novedades</h1>
                <p className="sv-sin-resultados">Todavía no hay novedades publicadas.</p>
            </section>
        )
    }

    return(
        <section className="sv-seccion sv-seccion-ancha">
            <h1>Novedades</h1>

            <article className="sv-novedad-destacada">
                <div className="row g-4 align-items-center">
                    <div className="col-12 col-lg-5">
                        <img
                        className="sv-novedad-imagen"
                        src={destacada.imagen}
                        alt={destacada.titulo}
                        />
                    </div>

                    <div className="col-12 col-lg-7">
                        <p className="sv-novedad-meta">
                            <span className="sv-etiqueta">{destacada.categoria}</span>
                            <span className="sv-novedad-fecha">· {formatearFecha(destacada.fecha)}</span>
                        </p>

                        <h2>{destacada.titulo}</h2>
                        <p>{destacada.resumen}</p>

                        <Boton
                        texto="Leer la novedad"
                        to={`/novedad/${destacada.id}`}
                        />
                    </div>
                </div>
            </article>

            <h2 className="sv-novedad-subtitulo">Novedades anteriores</h2>

            <div className="row g-3">
                {anteriores.map((novedad) => (
                    <div className="col-12 col-md-6 col-lg-4 col-xl-3" key={novedad.id}>
                        <CardNovedad
                        novedad={novedad}
                        />
                    </div>
                ))}
            </div>
        </section>
    )
}

export default Novedades
