import { useParams } from "react-router-dom";

function DetalleProducto() {

    const { id } = useParams()

    return(
        <section className="sv-seccion">
            <h1>Detalle del producto</h1>
            <p className="sv-pendiente">Producto: {id}</p>
        </section>
    )
}

export default DetalleProducto
