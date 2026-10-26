import { useEffect, useState } from "react";
import Aviso from "../Componentes/atomos/Aviso";
import CardProducto from "../Componentes/moleculas/CardProducto";
import FiltrosCatalogo from "../Componentes/organismos/FiltrosCatalogo";
import { agregarAlCarrito, mensajeDeAgregado } from "../datos/carrito";
import { listarProductos, CambiosProductos } from "../datos/repositorioProductos";

function Catalogo() {
    const [categoria, setCategoria] = useState("todas");
    const [busqueda, setBusqueda] = useState("");
    const [aviso, setAviso] = useState("");
    const [productos, setProductos] = useState(listarProductos());

    useEffect(() => CambiosProductos(() => setProductos(listarProductos())), []);
    const textoBuscado = busqueda.trim().toLowerCase();
    
    const productosFiltrados = productos.filter((producto) => {
        const coincideCategoria = categoria === "todas" || producto.categoria === categoria;
        const coincideNombre = textoBuscado === "" || producto.nombre.toLowerCase().includes(textoBuscado);
        return coincideCategoria && coincideNombre;
    });

    const limpiarFiltros = () => {
        setCategoria("todas");
        setBusqueda("");
    };

    const agregarProducto = (id: number) => {
        setAviso(mensajeDeAgregado(agregarAlCarrito(id)));
    };

    return(
        <>
            <section className="sv-seccion sv-seccion-ancha">
                <h1>Catálogo de productos</h1>

                <FiltrosCatalogo
                categoria={categoria}
                busqueda={busqueda}
                alCambiarCategoria={setCategoria}
                alCambiarBusqueda={setBusqueda}
                alLimpiar={limpiarFiltros}
                />

                <p className="sv-contador">
                    Mostrando {productosFiltrados.length} de {productos.length} productos
                </p>

                {productosFiltrados.length === 0 ? (
                    <p className="sv-sin-resultados">
                        No se encontraron productos para los filtros seleccionados.
                    </p>
                ) : (
                    <div className="row g-3">
                        {productosFiltrados.map((producto) => (
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

export default Catalogo
