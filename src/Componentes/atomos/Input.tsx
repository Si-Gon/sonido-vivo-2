type Props = {
    tipo: string;
    nombre: string;
    valor: string;
    marcador?: string;
    error?: string;
    deshabilitado?: boolean;
    maxLongitud?: number;
    alCambiar: (valor: string) => void;
    alPerderFoco?: () => void;
};

function Input({ tipo, nombre, valor, marcador, error, deshabilitado = false, maxLongitud, alCambiar, alPerderFoco }: Props) {

    return (
        <input
        className={error ? "form-control is-invalid" : "form-control"}
        id={nombre}
        name={nombre}
        type={tipo}
        value={valor}
        placeholder={marcador}
        disabled={deshabilitado}
        maxLength={maxLongitud}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${nombre}-error` : undefined}
        onChange={(evento) => alCambiar(evento.target.value)}
        onBlur={alPerderFoco}
        />
    )
}

export default Input
