import { useState } from "react";
import CampoFormulario from "../Componentes/moleculas/CampoFormulario";
import CampoSeleccion from "../Componentes/moleculas/CampoSeleccion";
import Boton from "../Componentes/atomos/Boton";
import Aviso from "../Componentes/atomos/Aviso";

interface Producto {
    id: number;
    nombre: string;
    categoria: string;
    precio: number;
    stock: number;
    imagen: string;
}

const productosIniciales: Producto[] = [];

function AdminProductos() {
    const [productos, setProductos] = useState<Producto[]>(productosIniciales);
    const [nombre, setNombre] = useState("");
    const [categoria, setCategoria] = useState("Guitarras");
    const [precio, setPrecio] = useState("");
    const [stock, setStock] = useState("");
    const [imagen, setImagen] = useState("");
    const [error, setError] = useState("");
    const [aviso, setAviso] = useState("");

    const handleCrearProducto = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!nombre.trim() || !categoria.trim() || !precio || !stock) {
            setError("Todos los campos marcados son obligatorios.");
            return;
        }

        const precioNum = Number(precio);
        const stockNum = Number(stock);

        if (isNaN(precioNum) || precioNum <= 0) {
            setError("El precio debe ser un número positivo.");
            return;
        }

        if (isNaN(stockNum) || stockNum < 0) {
            setError("El stock no puede ser negativo.");
            return;
        }

        const nuevoProducto: Producto = {
            id: Date.now(),
            nombre,
            categoria,
            precio: precioNum,
            stock: stockNum,
            imagen: imagen.trim() || "https://via.placeholder.com/150"
        };

        setProductos([...productos, nuevoProducto]);
        setAviso("Producto agregado exitosamente.");
        setNombre("");
        setCategoria("Guitarras");
        setPrecio("");
        setStock("");
        setImagen("");
    };

    const eliminarProducto = (id: number) => {
        setProductos(productos.filter((p) => p.id !== id));
        setAviso("Producto eliminado del inventario.");
    };

    return (
        <section className="sv-seccion sv-seccion-ancha">
            <h1>Gestión de Productos</h1>

            <div className="row g-4">
                <div className="col-12 col-lg-5">
                    <form className="sv-panel" onSubmit={handleCrearProducto}>
                        <h3>Agregar Producto</h3>

                        {error && <p className="text-danger mb-3">{error}</p>}

                        <CampoFormulario
                            etiqueta="Nombre del producto"
                            tipo="text"
                            nombre="nombre"
                            valor={nombre}
                            marcador="Ej: Guitarra Electroacústica"
                            alCambiar={setNombre}
                        />

                        <CampoSeleccion
                            etiqueta="Categoría"
                            nombre="categoria"
                            valor={categoria}
                            opciones={[
                                { valor: "Guitarras", etiqueta: "Guitarras" },
                                { valor: "Bajos", etiqueta: "Bajos" },
                                { valor: "Teclados", etiqueta: "Teclados" },
                                { valor: "Baterías", etiqueta: "Baterías" },
                                { valor: "Accesorios", etiqueta: "Accesorios" }
                            ]}
                            alCambiar={setCategoria}
                        />

                        <CampoFormulario
                            etiqueta="Precio (CLP)"
                            tipo="number"
                            nombre="precio"
                            valor={precio}
                            marcador="150000"
                            alCambiar={setPrecio}
                        />

                        <CampoFormulario
                            etiqueta="Stock disponible"
                            tipo="number"
                            nombre="stock"
                            valor={stock}
                            marcador="10"
                            alCambiar={setStock}
                        />

                        <CampoFormulario
                            etiqueta="URL de la Imagen (opcional)"
                            tipo="text"
                            nombre="imagen"
                            valor={imagen}
                            marcador="https://ejemplo.com/imagen.jpg"
                            alCambiar={setImagen}
                        />

                        <div className="mt-4">
                            <Boton texto="Guardar Producto" tipo="submit" />
                        </div>
                    </form>
                </div>

                <div className="col-12 col-lg-7">
                    <div className="sv-panel">
                        <h3>Inventario Actual</h3>
                        {productos.length === 0 ? (
                            <p className="text-muted mt-3">No hay productos registrados en el inventario.</p>
                        ) : (
                            <div className="table-responsive mt-3">
                                <table className="table table-dark table-hover align-middle">
                                    <thead>
                                        <tr>
                                            <th>Producto</th>
                                            <th>Categoría</th>
                                            <th>Precio</th>
                                            <th>Stock</th>
                                            <th>Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {productos.map((prod) => (
                                            <tr key={prod.id}>
                                                <td>{prod.nombre}</td>
                                                <td>{prod.categoria}</td>
                                                <td>${prod.precio.toLocaleString("es-CL")}</td>
                                                <td>{prod.stock}</td>
                                                <td>
                                                    <button
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() => eliminarProducto(prod.id)}
                                                    >
                                                        Eliminar
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {aviso && <Aviso mensaje={aviso} alCerrar={() => setAviso("")} />}
        </section>
    );
}

export default AdminProductos;