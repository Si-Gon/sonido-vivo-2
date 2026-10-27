import Boton from "../atomos/Boton";
import { formatearPrecio, precioVigente } from "../../utilidades/formato";
import type { Producto } from "../../datos/productos";

type Props = {
    producto: Producto;
    alAgregar: (id: number) => void;
};

function CardProducto({ producto, alAgregar }: Props) {

    const sinStock = producto.stock === 0;

    return(
        <article className="card sv-card h-100">
            <img
            className="card-img-top sv-card-imagen"
            src={producto.imagen.startsWith("http") ? producto.imagen : `/img/productos/${producto.imagen}`}
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
                    {producto.descuento ? (
                        <>
                            <span className="sv-precio-oferta">
                                {formatearPrecio(precioVigente(producto.precio, producto.descuento))}
                            </span>
                            <span className="sv-precio-antes">{formatearPrecio(producto.precio)}</span>
                            <span className="sv-etiqueta-oferta">-{producto.descuento}%</span>
                        </>
                    ) : (
                        formatearPrecio(producto.precio)
                    )}
                </p>

                {sinStock && (
                    <p className="sv-card-stock">Sin stock</p>
                )}

                <div className="d-grid gap-1 mt-auto">
                    <Boton
                    texto="Ver detalle"
                    to={`/producto/${producto.id}`}
                    variante="contorno"
                    />

                    <Boton
                    texto="Agregar"
                    deshabilitado={sinStock}
                    alHacerClick={() => alAgregar(producto.id)}
                    />
                </div>
            </div>
        </article>
    )
}

export default CardProducto
