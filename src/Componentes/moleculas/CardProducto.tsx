import Boton from "../atomos/Boton";
import { formatearPrecio } from "../../utilidades/formato";
import type { Producto } from "../../datos/productos";

type Props = {
    producto: Producto;
};

function CardProducto({ producto }: Props) {

    return(
        <article className="card sv-card h-100">
            <img
            className="card-img-top sv-card-imagen"
            src={`/img/productos/${producto.imagen}`}
            alt={producto.nombre}
            />

            <div className="card-body sv-card-cuerpo">
                <h2 className="card-title sv-card-titulo">
                    {producto.nombre}
                </h2>

                <p className="card-text sv-card-marca">
                    {producto.marca} · {producto.modelo}
                </p>

                <p className="card-text sv-card-precio">
                    {formatearPrecio(producto.precio)}
                </p>

                <div className="d-grid mt-auto">
                    <Boton
                    texto="Ver detalle"
                    to={`/producto/${producto.id}`}
                    variante="contorno"
                    />
                </div>
            </div>
        </article>
    )
}

export default CardProducto
