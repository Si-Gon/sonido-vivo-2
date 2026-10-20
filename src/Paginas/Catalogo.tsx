import CardProducto from "../Componentes/moleculas/CardProducto";
import { productos } from "../datos/productos";

function Catalogo() {

    return(
        <section className="sv-seccion sv-seccion-ancha">
            <h1>Catálogo de productos</h1>

            <div className="row g-3">
                {productos.map((producto) => (
                    <div className="col-12 col-md-6 col-lg-4" key={producto.id}>
                        <CardProducto
                        producto={producto}
                        />
                    </div>
                ))}
            </div>
        </section>
    )
}

export default Catalogo
