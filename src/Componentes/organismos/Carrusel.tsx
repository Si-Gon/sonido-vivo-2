import { useEffect, useState } from "react";
import type { Diapositiva } from "../../datos/historia";

type Props = {
    diapositivas: Diapositiva[];
};

const INTERVALO = 5000;

function Carrusel({ diapositivas }: Props) {
    const [activa, setActiva] = useState(0);

    useEffect(() => {
        const total = diapositivas.length;

        const temporizador = setInterval(() => {
            setActiva((actual) => (actual + 1) % total);
        }, INTERVALO);

        return () => clearInterval(temporizador);
    }, [diapositivas.length]);

    const mover = (direccion: number) => {
        setActiva((actual) => (actual + direccion + diapositivas.length) % diapositivas.length);
    };

    return(
        <div className="sv-carrusel">
            {diapositivas.map((diapositiva, indice) => (
                <div
                className={indice === activa ? "sv-carrusel-slide sv-carrusel-activa" : "sv-carrusel-slide"}
                key={diapositiva.titulo}
                >
                    <img
                    className="sv-carrusel-imagen"
                    src={diapositiva.imagen}
                    alt={diapositiva.titulo}
                    />

                    <div className="sv-carrusel-contenido">
                        <h2>{diapositiva.titulo}</h2>
                        <p>{diapositiva.texto}</p>
                    </div>
                </div>
            ))}

            <button
            className="sv-carrusel-btn sv-carrusel-izq"
            type="button"
            aria-label="Diapositiva anterior"
            onClick={() => mover(-1)}
            >
                ❮
            </button>

            <button
            className="sv-carrusel-btn sv-carrusel-der"
            type="button"
            aria-label="Diapositiva siguiente"
            onClick={() => mover(1)}
            >
                ❯
            </button>
        </div>
    )
}

export default Carrusel
