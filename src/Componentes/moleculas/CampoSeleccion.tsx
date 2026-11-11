import Select, { type Opcion } from "../atomos/Select";

type Props = {
    etiqueta: string;
    nombre: string;
    valor: string;
    opciones: Opcion[];
    error?: string;
    deshabilitado?: boolean;
    alCambiar: (valor: string) => void;
    alPerderFoco?: () => void;
};

function CampoSeleccion({ etiqueta, nombre, valor, opciones, error, deshabilitado, alCambiar, alPerderFoco }: Props) {

    return(
        <div className="mb-3">
            <label className="form-label" htmlFor={nombre}>
                {etiqueta}
            </label>

            <Select
            nombre={nombre}
            valor={valor}
            opciones={opciones}
            error={error}
            deshabilitado={deshabilitado}
            alCambiar={alCambiar}
            alPerderFoco={alPerderFoco}
            />

            {error && (
                <div className="invalid-feedback d-block" id={`${nombre}-error`} role="alert">
                    {error}
                </div>
            )}
        </div>
    )
}

export default CampoSeleccion
