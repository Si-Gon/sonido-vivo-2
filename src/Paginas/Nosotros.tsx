import Icono from "../Componentes/atomos/Icono";

const esencia = [
    { icono: "ubicacion" as const, etiqueta: "Ubicación", valor: "Viña del Mar, Región de Valparaíso" },
    { icono: "experiencia" as const, etiqueta: "Experiencia", valor: "11 años al servicio de la música" },
    { icono: "catalogo" as const, etiqueta: "Catálogo", valor: "Más de 340 referencias activas" }
];

const equipo = ["Silvio Gonzalves", "Maximiliano Quezada", "Oscar Garrido"];

function Nosotros() {

    return(
        <>
            <section className="sv-seccion sv-seccion-ancha">
                <h1>Nosotros</h1>
                <p className="sv-lead">Especialistas en instrumentos y equipos musicales</p>
            </section>

            <section className="sv-seccion sv-seccion-ancha">
                <div className="row g-4 align-items-center">
                    <div className="col-12 col-lg-7">
                        <h2>Quiénes somos</h2>
                        <p className="sv-lead">
                            Somos una tienda especializada en instrumentos musicales, equipos de sonido y accesorios, ubicados en la ciudad de Viña del Mar, Región de Valparaíso.
                        </p>
                        <p>
                            Con 11 años de trayectoria en el mercado, Sonido Vivo nació como una tienda familiar dedicada a atender y asesorar a músicos de todos los niveles, desde principiantes entusiastas hasta profesionales en gira. Nuestro equipo es liderado por su dueño junto a vendedores apasionados por la música que brindan una atención cercana, técnica y personalizada.
                        </p>
                    </div>

                    <div className="col-12 col-lg-5">
                        <div className="sv-panel">
                            <h3>Nuestra Esencia</h3>

                            <ul className="sv-esencia">
                                {esencia.map((dato) => (
                                    <li key={dato.etiqueta}>
                                        <Icono nombre={dato.icono} />
                                        <span>
                                            <strong>{dato.etiqueta}:</strong> {dato.valor}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <section className="sv-seccion sv-seccion-ancha">
                <div className="row g-3">
                    <div className="col-12 col-md-6">
                        <div className="sv-panel h-100">
                            <h2>Nuestra Misión</h2>
                            <p>
                                Facilitar el acceso a instrumentos y equipos de audio de alta calidad, brindando una asesoría técnica honesta y personalizada para que cada músico encuentre el sonido que busca.
                            </p>
                        </div>
                    </div>

                    <div className="col-12 col-md-6">
                        <div className="sv-panel h-100">
                            <h2>Nuestra Visión</h2>
                            <p>
                                Ser la tienda de música de referencia en la Región de Valparaíso y en el entorno digital, reconocida por el respaldo técnico, la variedad de catálogo y la cercanía con la comunidad musical.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="sv-seccion sv-seccion-ancha">
                <h2>Equipo de Desarrollo</h2>

                <div className="row g-3">
                    {equipo.map((integrante) => (
                        <div className="col-12 col-md-6 col-lg-4" key={integrante}>
                            <div className="sv-panel h-100">
                                <h3 className="sv-integrante">{integrante}</h3>
                                <p className="sv-rol">Desarrollo Web (React + Vite + TS)</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </>
    )
}

export default Nosotros
