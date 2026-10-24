import { useState } from "react";
import CampoFormulario from "../Componentes/moleculas/CampoFormulario";
import CampoSeleccion from "../Componentes/moleculas/CampoSeleccion";
import Boton from "../Componentes/atomos/Boton";
import Aviso from "../Componentes/atomos/Aviso";
import { formatearPrecio } from "../utilidades/formato";

interface Producto {
    id: number;
    nombre: string;
    categoria: string;
    precio: number;
    imagen: string;
}

const productosIniciales: Producto[] = [
    {
        id: 1,
        nombre: "Guitarra Eléctrica Fender Stratocaster",
        categoria: "Guitarras",
        precio: 750000,
        imagen: "https://via.placeholder.com/150"
    },
    {
        id: 2,
        nombre: "Batería Acústica Yamaha Stage Custom",
        categoria: "Percusión",
        precio: 1200000,
        imagen: "https://via.placeholder.com/150"
    }
];

function AdminProductos() {
    const [productos, setProductos] = useState<Producto[]>(productosIniciales);
    const [idEditando, setIdEditando] = useState<number | null>(null);
    const [nombre, setNombre] = useState("");
    const [categoria, setCategoria] = useState("");
    const [precio, setPrecio] = useState("");
    const [imagen, setImagen] = useState("");
    const [error, setError] = useState("");
    const [aviso, setAviso] = useState("");

    const limpiarFormulario = () => {
        setIdEditando(null);
        setNombre("");
        setCategoria("");
        setPrecio("");
        setImagen("");
        setError("");
    };

    const handleEditar = (prod: Producto) => {
        setIdEditando(prod.id);
        setNombre(prod.nombre);
        setCategoria(prod.categoria);
        setPrecio(prod.precio.toString());
        setImagen(prod.imagen);
    };

    const handleEliminar = (id: number) => {
        setProductos(productos.filter((p) => p.id !== id));
        setAviso("Producto eliminado correctamente.");
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!nombre.trim() || !categoria || !precio || !imagen.trim()) {
            setError("Todos los campos son obligatorios.");
            return;
        }

        const precioNum = Number(precio);
        if (isNaN(precioNum) || precioNum <= 0) {
            setError("Ingrese un precio válido mayor a 0.");
            return;
        }

        if (idEditando !== null) {
            setProductos(
                productos.map((p) =>
                    p.id === idEditando
                        ? { ...p, nombre, categoria, precio: precioNum, imagen }
                        : p
                )
            );
            setAviso("Producto actualizado con éxito.");
        } else {
            const nuevoProducto: Producto = {
                id: Date.now(),
                nombre,
                categoria,
                precio: precioNum,
                imagen
            };
            setProductos([...productos, nuevoProducto]);
            setAviso("Producto agregado con éxito.");
        }

        limpiarFormulario();
    };

    return (
        <section className="sv-seccion sv-seccion-ancha">
            <h1>Administración de Productos</h1>

            <div className="row g-4">
                <div className="col-12 col-lg-5">
                    <form className="sv-panel" onSubmit={handleSubmit}>
                        <h3>{idEditando !== null ? "Editar Producto" : "Nuevo Producto"}</h3>

                        {error && <p className="text-danger mb-3">{error}</p>}

                        <CampoFormulario
                            etiqueta="Nombre del producto"
                            tipo="text"
                            nombre="nombre"
                            valor={nombre}
                            marcador="Ej: Teclado Roland GW-8"
                            alCambiar={setNombre}
                        />

                        <CampoSeleccion
                            etiqueta="Categoría"
                            nombre="categoria"
                            valor={categoria}
                            opciones={[
                                { valor: "", etiqueta: "Seleccione una categoría" },
                                { valor: "Guitarras", etiqueta: "Guitarras" },
                                { valor: "Bajos", etiqueta: "Bajos" },
                                { valor: "Teclados", etiqueta: "Teclados" },
                                { valor: "Percusión", etiqueta: "Percusión" },
                                { valor: "Audio", etiqueta: "Audio y Amplificadores" }
                            ]}
                            alCambiar={setCategoria}
                        />

                        <CampoFormulario
                            etiqueta="Precio (CLP)"
                            tipo="number"
                            nombre="precio"
                            valor={precio}
                            marcador="Ej: 450000"
                            alCambiar={setPrecio}
                        />

                        <CampoFormulario
                            etiqueta="URL de la Imagen"
                            tipo="text"
                            nombre="imagen"
                            valor={imagen}
                            marcador="https://ejemplo.com/imagen.jpg"
                            alCambiar={setImagen}
                        />

                        <div className="d-flex gap-2 mt-4">
                            <Boton texto={idEditando !== null ? "Actualizar" : "Guardar"} tipo="submit" />
                            {idEditando !== null && (
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={limpiarFormulario}
                                >
                                    Cancelar
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                <div className="col-12 col-lg-7">
                    <div className="sv-panel">
                        <h3>Inventario Registrado</h3>
                        <div className="table-responsive mt-3">
                            <table className="table table-dark table-hover align-middle">
                                <thead>
                                    <tr>
                                        <th>Imagen</th>
                                        <th>Nombre</th>
                                        <th>Categoría</th>
                                        <th>Precio</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {productos.map((prod) => (
                                        <tr key={prod.id}>
                                            <td>
                                                <img
                                                    src={prod.imagen}
                                                    alt={prod.nombre}
                                                    style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "4px" }}
                                                />
                                            </td>
                                            <td>{prod.nombre}</td>
                                            <td>{prod.categoria}</td>
                                            <td>{formatearPrecio(prod.precio)}</td>
                                            <td>
                                                <button
                                                    className="btn btn-sm btn-outline-warning me-2"
                                                    onClick={() => handleEditar(prod)}
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => handleEliminar(prod.id)}
                                                >
                                                    Eliminar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {productos.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="text-center py-3 text-muted">
                                                No hay productos registrados.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {aviso && <Aviso mensaje={aviso} alCerrar={() => setAviso("")} />}
        </section>
    );
}

export default AdminProductos;