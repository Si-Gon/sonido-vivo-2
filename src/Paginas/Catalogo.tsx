import { useState } from "react";
import CardProducto from "../Componentes/moleculas/CardProducto";
import FiltrosCatalogo from "../Componentes/organismos/FiltrosCatalogo";
import { productos } from "../datos/productos";

function Catalogo() {
    const [categoria, setCategoria] = useState("todas");
    const [busqueda, setBusqueda] = useState("");

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

    return(
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
                        <div className="col-12 col-md-6 col-lg-4" key={producto.id}>
                            <CardProducto
                            producto={producto}
                            />
                        </div>
                    ))}
                </div>
            )}
        </section>
    )
}

export default Catalogo
