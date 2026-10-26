import { useEffect, useState } from "react";
import CampoFormulario from "../Componentes/moleculas/CampoFormulario";
import CampoSeleccion from "../Componentes/moleculas/CampoSeleccion";
import Boton from "../Componentes/atomos/Boton";
import Aviso from "../Componentes/atomos/Aviso";
import { crearProducto, eliminarProducto, listarProductos, CambiosProductos, actualizarProducto, type ProductoNuevo } from "../datos/repositorioProductos";
import type { Producto } from "../datos/productos";

type Props = {
    incrustado?: boolean;
};

function AdminProductos({ incrustado }: Props) {
    const Titulo = incrustado ? "h2" : "h1";
    const Subtitulo = incrustado ? "h3" : "h2";
    const [productos, setProductos] = useState<Producto[]>(listarProductos());
    const [nombre, setNombre] = useState("");
    const [categoria, setCategoria] = useState("Guitarras");
    const [precio, setPrecio] = useState("");
    const [stock, setStock] = useState("");
    const [imagen, setImagen] = useState("");
    const [productoEditandoId, setProductoEditandoId] = useState<number | null>(null);
    const [error, setError] = useState("");
    const [aviso, setAviso] = useState("");

    const recargarProductos = () => setProductos(listarProductos());

    useEffect(() => CambiosProductos(() => setProductos(listarProductos())), []);

    const limpiarFormulario = () => {
        setNombre("");
        setCategoria("Guitarras");
        setPrecio("");
        setStock("");
        setImagen("");
        setProductoEditandoId(null);
        setError("");
    };

    const cancelarEdicion = () => {
        limpiarFormulario();
        setAviso("Edición cancelada. No se guardaron los cambios.");
    };
    
    const iniciarEdicion = (producto: Producto) => {
        setProductoEditandoId(producto.id);
        setNombre(producto.nombre);
        setCategoria(producto.categoria);
        setPrecio(String(producto.precio));
        setStock(String(producto.stock));
        setImagen(producto.imagen);
        setError("");
        setAviso("");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    const handleCrearProducto = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setAviso("");

        if (!nombre.trim() || !categoria.trim() || !precio.trim() || !stock.trim()) {
            setError("Todos los campos marcados son obligatorios.");
            return;
        }

        const precioNum = Number(precio);
        const stockNum = Number(stock);

        if (!Number.isFinite(precioNum) || precioNum <= 0) {
            setError("El precio debe ser un número positivo.");
            return;
        }

        if (!Number.isFinite(stockNum) || stockNum < 0) {
            setError("El stock no puede ser negativo.");
            return;
        }

        const datos: Partial<ProductoNuevo> = {
            nombre: nombre.trim(),
            categoria,
            precio: precioNum,
            stock: stockNum,
            imagen: imagen.trim() || "https://via.placeholder.com/150"
        };

        try {
            if (productoEditandoId !== null) {
                const productoExiste = listarProductos().some(
                    (producto) => producto.id === productoEditandoId
                );

                if (!productoExiste) {
                    setError(
                        "El producto ya no existe en el inventario. Actualiza la lista."
                    );
                    recargarProductos();
                    limpiarFormulario();
                    return;
                }

                actualizarProducto(productoEditandoId, datos);

                setAviso("Producto actualizado correctamente.");
            } else {
                const nuevoProducto: ProductoNuevo = {
                    codigo: `AD${Date.now().toString().slice(-6)}`,
                    nombre: nombre.trim(),
                    categoria,
                    marca: "Sin marca",
                    modelo: "Sin modelo",
                    precio: precioNum,
                    stock: stockNum,
                    descripcion: "Sin descripción",
                    imagen: imagen.trim() || "https://via.placeholder.com/150"
                };
                crearProducto(nuevoProducto);
                setAviso("Producto agregado exitosamente.");
            }
            recargarProductos();
            limpiarFormulario();
        } catch {
            setError("Ocurrió un error al guardar el producto. Intenta nuevamente.");
            recargarProductos();
        }

    };

    const EliminarProducto = (id: number) => {
        eliminarProducto(id);
        recargarProductos();
        setAviso("Producto eliminado del inventario.");
    };

    return (
        <section className="sv-seccion sv-seccion-ancha">
            <Titulo>Gestión de Productos</Titulo>

            <div className="row g-4">
                <div className="col-12 col-lg-5">
                    <form className="sv-panel" onSubmit={handleCrearProducto}>
                        <Subtitulo>{productoEditandoId !== null ? "Editar Producto" : "Agregar Producto"}</Subtitulo>

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

                        <div className="mt-4 d-flex flex-wrap gap-2">
                            <Boton texto={productoEditandoId !== null ? "Guardar Cambios" : "Guardar Producto"} tipo="submit" />
                            {productoEditandoId !== null && (
                                <button type="button" className="btn btn-outline-light" onClick={cancelarEdicion}>
                                    Cancelar
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                <div className="col-12 col-lg-7">
                    <div className="sv-panel">
                        <Subtitulo>Inventario Actual</Subtitulo>
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
                                            <th>Acciones</th>
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
                                                        type="button"
                                                        className="btn btn-sm btn-outline-info"
                                                        onClick={() => iniciarEdicion(prod)}>
                                                        Editar
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() => EliminarProducto(prod.id)}
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