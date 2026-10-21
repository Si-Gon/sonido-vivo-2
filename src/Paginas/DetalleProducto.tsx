import { useParams } from "react-router-dom";
import Boton from "../Componentes/atomos/Boton";
import { buscarProducto } from "../datos/productos";
import { formatearPrecio } from "../utilidades/formato";

function DetalleProducto() {
    const { id } = useParams();

    const producto = buscarProducto(Number(id));

    if (!producto) {
        return(
            <section className="sv-seccion">
                <h1>Producto no encontrado</h1>
                <p className="sv-pendiente">El producto solicitado no existe en el catálogo.</p>
                <div className="text-center">
                    <Boton
                    texto="Volver al catálogo"
                    to="/catalogo"
                    variante="contorno"
                    />
                </div>
            </section>
        )
    }

    return(
        <section className="sv-seccion sv-seccion-ancha">
            <div className="row g-4 align-items-center">
                <div className="col-12 col-md-5">
                    <img
                    className="sv-detalle-imagen"
                    src={`/img/productos/${producto.imagen}`}
                    alt={producto.nombre}
                    />
                </div>

                <div className="col-12 col-md-7">
                    <h1>{producto.nombre}</h1>

                    <p className="sv-card-marca">
                        {producto.marca} · {producto.modelo}
                    </p>

                    <p className="sv-detalle-precio">
                        {formatearPrecio(producto.precio)}
                    </p>

                    <p>{producto.descripcion}</p>

                    <ul className="sv-detalle-datos">
                        <li>Código: {producto.codigo}</li>
                        <li>Categoría: {producto.categoria}</li>
                        <li>Stock: {producto.stock} unidades</li>
                    </ul>

                    <Boton
                    texto="Volver al catálogo"
                    to="/catalogo"
                    variante="contorno"
                    />
                </div>
            </div>
        </section>
    )
}

export default DetalleProducto
