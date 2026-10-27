import { useState } from "react";
import { useParams } from "react-router-dom";
import Aviso from "../Componentes/atomos/Aviso";
import Boton from "../Componentes/atomos/Boton";
import { agregarAlCarrito, mensajeDeAgregado } from "../datos/carrito";
import { buscarProducto } from "../datos/repositorioProductos";
import { formatearPrecio, precioVigente } from "../utilidades/formato";

function DetalleProducto() {
    const { id } = useParams();
    const [aviso, setAviso] = useState("");

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

    const agregarProducto = () => {
        setAviso(mensajeDeAgregado(agregarAlCarrito(producto.id)));
    };

    return(
        <>
        <section className="sv-seccion sv-seccion-ancha">
            <div className="row g-4 align-items-center">
                <div className="col-12 col-md-5">
                    <figure className="sv-placa-foto">
                        <img
                        className="sv-detalle-imagen"
                        src={`/img/productos/${producto.imagen}`}
                        alt={producto.nombre}
                        />
                        <figcaption>Imagen referencial del producto</figcaption>
                    </figure>
                </div>

                <div className="col-12 col-md-7">
                    <h1>{producto.nombre}</h1>

                    <p className="sv-card-marca">
                        {producto.marca} · {producto.modelo}
                    </p>

                    <p className="sv-detalle-precio">
                        { producto.descuento ? (
                            <>
                                {formatearPrecio(precioVigente(producto.precio, producto.descuento))}
                                <span className="sv-precio-antes">{formatearPrecio(producto.precio)}</span>
                                <span className="sv-etiqueta-oferta">-{producto.descuento}%</span>
                            </>
                        ) : (
                            formatearPrecio(producto.precio)
                        )}
                    </p>

                    <p>{producto.descripcion}</p>

                    <ul className="sv-detalle-datos">
                        <li>Código: {producto.codigo}</li>
                        <li>Categoría: {producto.categoria}</li>
                        <li>Stock: {producto.stock} unidades</li>
                    </ul>

                    <div className="d-flex flex-wrap gap-2">
                        <Boton
                        texto="Agregar al carrito"
                        alHacerClick={agregarProducto}
                        />

                        <Boton
                        texto="Volver al catálogo"
                        to="/catalogo"
                        variante="contorno"
                        />
                    </div>
                </div>
            </div>
        </section>

            {aviso !== "" && (
                <Aviso
                mensaje={aviso}
                alCerrar={() => setAviso("")}
                />
            )}
        </>
    )
}

export default DetalleProducto
