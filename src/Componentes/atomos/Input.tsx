type Props = {
    tipo: string;
    nombre: string;
    valor: string;
    marcador?: string;
    alCambiar: (valor: string) => void;
};

function Input({ tipo, nombre, valor, marcador, alCambiar }: Props) {

    return(
        <input
        className="form-control"
        id={nombre}
        name={nombre}
        type={tipo}
        value={valor}
        placeholder={marcador}
        onChange={(evento) => alCambiar(evento.target.value)}
        />
    )
}

export default Input
