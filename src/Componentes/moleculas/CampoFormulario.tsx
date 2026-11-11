import Input from "../atomos/Input";

type Props = {
    etiqueta: string;
    tipo: string;
    nombre: string;
    valor: string;
    marcador?: string;
    error?: string;
    ayuda?: string;
    deshabilitado?: boolean;
    maxLongitud?: number;
    alCambiar: (valor: string) => void;
    alPerderFoco?: () => void;
};

function CampoFormulario({
    etiqueta, tipo, nombre, valor, marcador, error, ayuda, deshabilitado, maxLongitud, alCambiar, alPerderFoco
}: Props) {

    const ayudaVisible = ayuda && !error;

    return(
        <div className="mb-3">
            <label className="form-label" htmlFor={nombre}>
                {etiqueta}
            </label>

            <Input
            tipo={tipo}
            nombre={nombre}
            valor={valor}
            marcador={marcador}
            error={error}
            deshabilitado={deshabilitado}
            maxLongitud={maxLongitud}
            alCambiar={alCambiar}
            alPerderFoco={alPerderFoco}
            />

            {error && (
                <div className="invalid-feedback d-block" id={`${nombre}-error`} role="alert">
                    {error}
                </div>
            )}

            {ayudaVisible && (
                <div className="form-text" id={`${nombre}-error`}>
                    {ayuda}
                </div>
            )}
        </div>
    )
}

export default CampoFormulario
