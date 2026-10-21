export type Opcion = {
    valor: string;
    etiqueta: string;
};

type Props = {
    nombre: string;
    valor: string;
    opciones: Opcion[];
    alCambiar: (valor: string) => void;
};

function Select({ nombre, valor, opciones, alCambiar }: Props) {

    return(
        <select
        className="form-select"
        id={nombre}
        name={nombre}
        value={valor}
        onChange={(evento) => alCambiar(evento.target.value)}
        >
            {opciones.map((opcion) => (
                <option key={opcion.valor} value={opcion.valor}>
                    {opcion.etiqueta}
                </option>
            ))}
        </select>
    )
}

export default Select
