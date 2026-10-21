import { useState } from "react";
import Aviso from "../Componentes/atomos/Aviso";
import CardProducto from "../Componentes/moleculas/CardProducto";
import Carrusel from "../Componentes/organismos/Carrusel";
import { agregarAlCarrito, mensajeDeAgregado } from "../datos/carrito";
import { diapositivas } from "../datos/historia";
import { listarProductos } from "../datos/repositorioProductos";
import type { Producto } from "../datos/productos";

const CANTIDAD_DESTACADOS = 7;

function elegirDestacados(): Producto[] {
    const conStock = listarProductos().filter((producto) => producto.stock > 0);

    const mezclados = conStock
        .map((producto) => ({ producto, azar: Math.random() }))
        .sort((primero, segundo) => primero.azar - segundo.azar)
        .map((entrada) => entrada.producto);

    return mezclados.slice(0, CANTIDAD_DESTACADOS);
}

function Inicio() {
    const [aviso, setAviso] = useState("");
    const [destacados] = useState(() => elegirDestacados());

    const agregarProducto = (id: number) => {
        setAviso(mensajeDeAgregado(agregarAlCarrito(id)));
    };

    return(
        <>
            <section className="sv-seccion sv-seccion-ancha">
                <h1>Bienvenidos a Sonido Vivo</h1>
                <p className="sv-lead">
                    Somos una tienda de instrumentos musicales con 11 años equipando a músicos de todo Chile. Guitarras, bajos, baterías, teclados, amplificadores, micrófonos, pedales de efectos y accesorios: todo lo que necesitas para crear tu música.
                </p>
            </section>

            <section className="sv-seccion sv-seccion-ancha" aria-label="Nuestra historia">
                <Carrusel diapositivas={diapositivas} />
            </section>

            <section className="sv-seccion sv-seccion-ancha">
                <h2>Productos destacados</h2>

                <div className="row g-3">
                    {destacados.map((producto) => (
                        <div className="col-12 col-md-6 col-lg-4" key={producto.id}>
                            <CardProducto
                            producto={producto}
                            alAgregar={agregarProducto}
                            />
                        </div>
                    ))}
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

export default Inicio
