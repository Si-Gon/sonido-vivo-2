import { Link } from "react-router-dom";

type Props = {
    texto: string;
    to?: string;
    tipo?: "button" | "submit";
    variante?: "oscuro" | "contorno";
    tamano?: "pequeno" | "normal";
    ancho?: boolean;
    deshabilitado?: boolean;
    etiquetaAccesible?: string;
    alHacerClick?: () => void;
};

function Boton({ texto, to, tipo = "button", variante = "oscuro", tamano = "pequeno", ancho = false, deshabilitado = false, etiquetaAccesible, alHacerClick }: Props) {

    const clases = [
        "btn",
        variante === "oscuro" ? "btn-dark" : "btn-outline-dark",
        tamano === "pequeno" ? "btn-sm" : "",
        ancho ? "w-100" : ""
    ].filter(Boolean).join(" ");

    if (to) {
        return(
            <Link className={clases} to={to} aria-label={etiquetaAccesible}>
                {texto}
            </Link>
        )
    }

    return(
        <button className={clases} type={tipo} disabled={deshabilitado} aria-label={etiquetaAccesible} onClick={alHacerClick}>
            {texto}
        </button>
    )
}

export default Boton
