import Select, { type Opcion } from "../atomos/Select";

type Props = {
    etiqueta: string;
    nombre: string;
    valor: string;
    opciones: Opcion[];
    alCambiar: (valor: string) => void;
};

function CampoSeleccion({ etiqueta, nombre, valor, opciones, alCambiar }: Props) {

    return(
        <div className="mb-3">
            <label className="form-label" htmlFor={nombre}>
                {etiqueta}
            </label>

            <Select
            nombre={nombre}
            valor={valor}
            opciones={opciones}
            alCambiar={alCambiar}
            />
        </div>
    )
}

export default CampoSeleccion
