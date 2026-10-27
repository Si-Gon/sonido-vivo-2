import { useEffect, useState } from "react";
import Aviso from "../Componentes/atomos/Aviso";
import CardProducto from "../Componentes/moleculas/CardProducto";
import { agregarAlCarrito, mensajeDeAgregado } from "../datos/carrito";
import { listarProductos, CambiosProductos } from "../datos/repositorioProductos";

function Ofertas() {
    const [aviso, setAviso] = useState("");
    const [productos, setProductos] = useState(listarProductos());

    useEffect(() => CambiosProductos(() => setProductos(listarProductos())), []);

    const enOferta = productos.filter(
        (producto) => typeof producto.descuento === "number" && producto.descuento > 0
    );

    const agregarProducto = (id: number) => {
        setAviso(mensajeDeAgregado(agregarAlCarrito(id)));
    };

    return(
        <>
            <section className="sv-seccion sv-seccion-ancha">
                <h1>Ofertas</h1>

                <p className="sv-lead">
                    Instrumentos y accesorios con descuento vigente. El precio de oferta se aplica
                    al agregar el producto al carrito.
                </p>

                <p className="sv-contador">
                    {enOferta.length === 1
                        ? "1 producto en oferta"
                        : `${enOferta.length} productos en oferta`}
                </p>

                {enOferta.length === 0 ? (
                    <p className="sv-sin-resultados">
                        No hay ofertas disponibles en este momento.
                    </p>
                ) : (
                    <div className="row g-3">
                        {enOferta.map((producto) => (
                            <div className="col-12 col-md-6 col-lg-4 col-xl-3" key={producto.id}>
                                <CardProducto
                                producto={producto}
                                alAgregar={agregarProducto}
                                />
                            </div>
                        ))}
                    </div>
                )}
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

export default Ofertas
