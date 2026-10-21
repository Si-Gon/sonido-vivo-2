import { useEffect, useRef } from "react";

type Props = {
    mensaje: string;
    alCerrar: () => void;
};

const DURACION = 3600;

function Aviso({ mensaje, alCerrar }: Props) {
    const cerrar = useRef(alCerrar);

    useEffect(() => {
        cerrar.current = alCerrar;
    });

    useEffect(() => {
        const temporizador = setTimeout(() => cerrar.current(), DURACION);
        return () => clearTimeout(temporizador);
    }, [mensaje]);

    return(
        <div className="sv-aviso" role="status" aria-live="polite">
            <span className="sv-aviso-texto">{mensaje}</span>

            <button
            className="sv-aviso-cerrar"
            type="button"
            aria-label="Cerrar aviso"
            onClick={() => cerrar.current()}
            >
                ×
            </button>
        </div>
    )
}

export default Aviso
