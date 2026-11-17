import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Aviso from "../Componentes/atomos/Aviso";
import Boton from "../Componentes/atomos/Boton";
import { agregarAlCarrito, mensajeDeAgregado } from "../datos/carrito";
import { buscarProducto } from "../datos/repositorioProductos";
import type { Producto } from "../datos/productos";
import { formatearPrecio, precioVigente } from "../utilidades/formato";

function DetalleProducto() {
    const { id } = useParams();
    const [aviso, setAviso] = useState("");
    const [producto, setProducto] = useState<Producto | undefined>(undefined);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    // El detalle se pide al servicio de catálogo.
    useEffect(() => {
        let vigente = true;

        void buscarProducto(Number(id))
            .then((encontrado) => {
                if (vigente) setProducto(encontrado);
            })
            .catch((err) => {
                if (vigente) setError(err instanceof Error ? err.message : "No se pudo cargar el producto.");
            })
            .finally(() => {
                if (vigente) setCargando(false);
            });

        return () => {
            vigente = false;
        };
    }, [id]);

    if (cargando) {
        return (
            <section className="sv-seccion">
                <h1>Producto</h1>
                <p>Cargando el producto…</p>
            </section>
        );
    }

    if (error) {
        return (
            <section className="sv-seccion">
                <h1>Producto no disponible</h1>
                <p className="text-danger" role="alert">{error}</p>
                <div className="text-center">
                    <Boton texto="Volver al catálogo" to="/catalogo" variante="contorno" />
                </div>
            </section>
        );
    }

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
