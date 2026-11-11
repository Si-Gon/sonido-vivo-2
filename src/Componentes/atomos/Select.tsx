export type Opcion = {
    valor: string;
    etiqueta: string;
};

type Props = {
    nombre: string;
    valor: string;
    opciones: Opcion[];
    error?: string;
    deshabilitado?: boolean;
    alCambiar: (valor: string) => void;
    alPerderFoco?: () => void;
};

function Select({ nombre, valor, opciones, error, deshabilitado = false, alCambiar, alPerderFoco }: Props) {

    return (
        <select
        className={error ? "form-select is-invalid" : "form-select"}
        id={nombre}
        name={nombre}
        value={valor}
        disabled={deshabilitado}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${nombre}-error` : undefined}
        onChange={(evento) => alCambiar(evento.target.value)}
        onBlur={alPerderFoco}
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
