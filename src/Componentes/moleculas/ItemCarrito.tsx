import Boton from "../atomos/Boton";
import type { Producto } from "../../datos/productos";
import { formatearPrecio, precioVigente } from "../../utilidades/formato";

type Props = {
    producto: Producto;
    cantidad: number;
    alAgregarUna: () => void;
    alQuitarUna: () => void;
    alQuitarProducto: () => void;
};

function ItemCarrito({ producto, cantidad, alAgregarUna, alQuitarUna, alQuitarProducto }: Props) {

    const alcanzoElStock = cantidad >= producto.stock;

    return(
        <article className="sv-item-carrito">
            <img
            className="sv-item-imagen"
            src={`/img/productos/${producto.imagen}`}
            alt={producto.nombre}
            />

            <div className="sv-item-datos">
                <h2 className="sv-item-titulo">{producto.nombre}</h2>
                <p className="sv-card-marca">{producto.marca} · {producto.modelo}</p>
                <p className="sv-card-precio">{formatearPrecio(precioVigente(producto.precio, producto.descuento))}</p>
                <p className="sv-item-stock">
                    {producto.stock === 0
                        ? "Sin stock disponible"
                        : `Stock: ${producto.stock} unidades${alcanzoElStock ? " (máximo en el carrito)" : ""}`}
                </p>
            </div>

            <div className="sv-item-cantidad">
                <Boton
                texto="−"
                variante="contorno"
                etiquetaAccesible={`Quitar una unidad de ${producto.nombre}`}
                alHacerClick={alQuitarUna}
                />

                <span className="sv-cantidad" aria-label={`Cantidad: ${cantidad}`}>
                    {cantidad}
                </span>

                <Boton
                texto="+"
                variante="contorno"
                deshabilitado={alcanzoElStock}
                etiquetaAccesible={`Agregar una unidad de ${producto.nombre}`}
                alHacerClick={alAgregarUna}
                />
            </div>

            <p className="sv-item-subtotal">
                {formatearPrecio(precioVigente(producto.precio, producto.descuento) * cantidad)}
            </p>

            <Boton
            texto="Quitar"
            variante="contorno"
            etiquetaAccesible={`Quitar ${producto.nombre} del carrito`}
            alHacerClick={alQuitarProducto}
            />
        </article>
    )
}

export default ItemCarrito
