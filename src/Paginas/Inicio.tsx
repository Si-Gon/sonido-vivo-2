import { useState } from "react";
import Aviso from "../Componentes/atomos/Aviso";
import Boton from "../Componentes/atomos/Boton";
import CardProducto from "../Componentes/moleculas/CardProducto";
import Carrusel from "../Componentes/organismos/Carrusel";
import { agregarAlCarrito, mensajeDeAgregado } from "../datos/carrito";
import { diapositivas } from "../datos/historia";
import { listarProductos } from "../datos/repositorioProductos";
import type { Producto } from "../datos/productos";

const CANTIDAD_DESTACADOS = 8;

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
            <section className="sv-hero">
                <img
                className="sv-hero-imagen"
                src="/img/fondos/escenario.jpg"
                alt="Dos músicos tocando guitarras acústicas sobre un escenario con poca luz"
                />

                <div className="sv-hero-contenido">
                    <p className="sv-hero-cinta">Instrumentos musicales · Viña del Mar</p>

                    <h1>Bienvenidos a Sonido Vivo</h1>

                    <p className="sv-hero-lede">
                        Equipar a un músico no es vender un instrumento: es ayudarlo a encontrar su sonido. Once años en el mostrador, con guitarras, bajos, baterías, teclados, amplificadores y accesorios, stock real en línea y despacho a todo Chile.
                    </p>

                    <div className="sv-hero-acciones">
                        <Boton
                        texto="Ver catálogo"
                        to="/catalogo"
                        tamano="normal"
                        />

                        <Boton
                        texto="Cómo llegar"
                        to="/contacto"
                        variante="contorno"
                        tamano="normal"
                        />
                    </div>

                    <dl className="sv-hero-cifras">
                        <div>
                            <dt>11 años</dt>
                            <dd>acompañando músicos</dd>
                        </div>
                        <div>
                            <dt>51</dt>
                            <dd>productos en línea</dd>
                        </div>
                        <div>
                            <dt>Todo Chile</dt>
                            <dd>despacho y retiro en tienda</dd>
                        </div>
                    </dl>
                </div>
            </section>

            <section className="sv-seccion sv-seccion-ancha sv-banda">
                <h2>Productos destacados</h2>

                <div className="row g-3">
                    {destacados.map((producto) => (
                        <div className="col-12 col-md-6 col-lg-4 col-xl-3" key={producto.id}>
                            <CardProducto
                            producto={producto}
                            alAgregar={agregarProducto}
                            />
                        </div>
                    ))}
                </div>
            </section>

            <section className="sv-seccion sv-seccion-ancha" aria-label="Nuestra historia">
                <h2>Once años de historia</h2>
                <Carrusel diapositivas={diapositivas} />
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
