type Nombre = "ubicacion" | "experiencia" | "catalogo";

type Props = {
    nombre: Nombre;
};

function Icono({ nombre }: Props) {

    return(
        <svg
        className="sv-icono"
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
        >
            {nombre === "ubicacion" && (
                <>
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                </>
            )}

            {nombre === "experiencia" && (
                <>
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l4 2" />
                </>
            )}

            {nombre === "catalogo" && (
                <>
                    <path d="M9 18V6l10-2v12" />
                    <circle cx="6" cy="18" r="3" />
                    <circle cx="17" cy="16" r="3" />
                </>
            )}
        </svg>
    )
}

export default Icono
