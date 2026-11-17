import { useEffect, useState } from "react";
import CampoFormulario from "../Componentes/moleculas/CampoFormulario";
import CampoSeleccion from "../Componentes/moleculas/CampoSeleccion";
import Boton from "../Componentes/atomos/Boton";
import Aviso from "../Componentes/atomos/Aviso";
import {
    actualizarProductoEnServicio,
    crearProductoEnServicio,
    desactivarProductoEnServicio,
    listarCategoriasDelServicio,
    listarProductosDelServicio,
    type CategoriaAdmin,
    type ProductoAdmin,
    type ProductoParaGuardar
} from "../datos/repositorioCatalogo";

type Formulario = {
    codigo: string;
    nombre: string;
    marca: string;
    modelo: string;
    categoriaId: string;
    precio: string;
    descuento: string;
    stock: string;
    descripcion: string;
    imagen: string;
};

const FORMULARIO_VACIO: Formulario = {
    codigo: "",
    nombre: "",
    marca: "",
    modelo: "",
    categoriaId: "",
    precio: "",
    descuento: "",
    stock: "",
    descripcion: "",
    imagen: ""
};

function AdminProductos() {
    const [productos, setProductos] = useState<ProductoAdmin[]>([]);
    const [categorias, setCategorias] = useState<CategoriaAdmin[]>([]);
    const [formulario, setFormulario] = useState<Formulario>(FORMULARIO_VACIO);
    const [editandoId, setEditandoId] = useState<number | null>(null);
    const [cargando, setCargando] = useState(true);
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState("");
    const [aviso, setAviso] = useState("");

    const campo = (nombre: keyof Formulario) => (valor: string) =>
        setFormulario((actual) => ({ ...actual, [nombre]: valor }));

    const cargar = async () => {
        setCargando(true);
        const [listaProductos, listaCategorias] = await Promise.all([
            listarProductosDelServicio(),
            listarCategoriasDelServicio()
        ]);
        setCargando(false);

        if (!listaProductos.ok) {
            setError(listaProductos.motivo);
            return;
        }

        if (!listaCategorias.ok) {
            setError(listaCategorias.motivo);
            return;
        }

        setError("");
        setProductos(listaProductos.datos);
        setCategorias(listaCategorias.datos);

        // La categoria inicial es la primera que exista en la base.
        setFormulario((actual) =>
            actual.categoriaId === "" && listaCategorias.datos.length > 0
                ? { ...actual, categoriaId: String(listaCategorias.datos[0].id) }
                : actual
        );
    };

    useEffect(() => {
        cargar();
    }, []);

    const limpiarFormulario = () => {
        setFormulario({ ...FORMULARIO_VACIO, categoriaId: categorias[0] ? String(categorias[0].id) : "" });
        setEditandoId(null);
        setError("");
    };

    const iniciarEdicion = (producto: ProductoAdmin) => {
        setEditandoId(producto.id);
        setFormulario({
            codigo: producto.codigo,
            nombre: producto.nombre,
            marca: producto.marca,
            modelo: producto.modelo,
            categoriaId: String(producto.categoriaId),
            precio: String(producto.precio),
            descuento: producto.descuento === null ? "" : String(producto.descuento),
            stock: String(producto.stock),
            descripcion: producto.descripcion ?? "",
            imagen: producto.imagen ?? ""
        });
        setError("");
        setAviso("");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const cancelarEdicion = () => {
        limpiarFormulario();
        setAviso("Edición cancelada. No se guardaron los cambios.");
    };

    const handleGuardar = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setAviso("");

        if (!formulario.codigo.trim() || !formulario.nombre.trim() || !formulario.marca.trim()
            || !formulario.modelo.trim() || !formulario.categoriaId || !formulario.precio.trim()
            || !formulario.stock.trim()) {
            setError("Código, nombre, marca, modelo, categoría, precio y stock son obligatorios.");
            return;
        }

        const precio = Number(formulario.precio);
        const stock = Number(formulario.stock);
        const descuento = formulario.descuento.trim() === "" ? null : Number(formulario.descuento);

        if (!Number.isFinite(precio) || precio < 0) {
            setError("El precio debe ser un número mayor o igual a cero.");
            return;
        }

        if (!Number.isInteger(stock) || stock < 0) {
            setError("El stock debe ser un número entero mayor o igual a cero.");
            return;
        }

        if (descuento !== null && (!Number.isInteger(descuento) || descuento < 0 || descuento > 100)) {
            setError("El descuento debe estar entre 0 y 100 por ciento.");
            return;
        }

        const datos: ProductoParaGuardar = {
            codigo: formulario.codigo.trim().toUpperCase(),
            categoriaId: Number(formulario.categoriaId),
            nombre: formulario.nombre.trim(),
            marca: formulario.marca.trim(),
            modelo: formulario.modelo.trim(),
            precio,
            descuento,
            stock,
            descripcion: formulario.descripcion.trim(),
            imagen: formulario.imagen.trim(),
            activo: true
        };

        setGuardando(true);
        const resultado = editandoId === null
            ? await crearProductoEnServicio(datos)
            : await actualizarProductoEnServicio(editandoId, datos);
        setGuardando(false);

        if (!resultado.ok) {
            setError(resultado.motivo);
            return;
        }

        setAviso(editandoId === null ? "Producto agregado al catálogo." : "Producto actualizado.");
        limpiarFormulario();
        await cargar();
    };

    const quitarProducto = async (producto: ProductoAdmin) => {
        if (!window.confirm(`Quitar "${producto.nombre}" del catálogo?`)) {
            return;
        }

        setError("");
        const resultado = await desactivarProductoEnServicio(producto.id);

        if (!resultado.ok) {
            setError(resultado.motivo);
            return;
        }

        setAviso(`"${producto.nombre}" quedó fuera del catálogo.`);
        await cargar();
    };

    return (
        <section className="sv-seccion sv-seccion-ancha">
            <h1>Gestión de Productos</h1>

            <div className="row g-4">
                <div className="col-12 col-lg-5">
                    <form className="sv-panel" onSubmit={handleGuardar}>
                        <h2>{editandoId !== null ? "Editar Producto" : "Agregar Producto"}</h2>

                        {error && <p className="text-danger mb-3" role="alert">{error}</p>}

                        <CampoFormulario
                            etiqueta="Código"
                            tipo="text"
                            nombre="codigo"
                            valor={formulario.codigo}
                            marcador="Ej: GE006"
                            maxLongitud={20}
                            alCambiar={campo("codigo")}
                        />

                        <CampoFormulario
                            etiqueta="Nombre del producto"
                            tipo="text"
                            nombre="nombre"
                            valor={formulario.nombre}
                            marcador="Ej: Guitarra Electroacústica"
                            maxLongitud={150}
                            alCambiar={campo("nombre")}
                        />

                        <CampoFormulario
                            etiqueta="Marca"
                            tipo="text"
                            nombre="marca"
                            valor={formulario.marca}
                            marcador="Ej: Yamaha"
                            maxLongitud={60}
                            alCambiar={campo("marca")}
                        />

                        <CampoFormulario
                            etiqueta="Modelo"
                            tipo="text"
                            nombre="modelo"
                            valor={formulario.modelo}
                            marcador="Ej: F310"
                            maxLongitud={60}
                            alCambiar={campo("modelo")}
                        />

                        <CampoSeleccion
                            etiqueta="Categoría"
                            nombre="categoriaId"
                            valor={formulario.categoriaId}
                            opciones={categorias.length === 0
                                ? [{ valor: "", etiqueta: "Sin categorías en el servicio" }]
                                : categorias.map((categoria) => ({ valor: String(categoria.id), etiqueta: categoria.nombre }))}
                            alCambiar={campo("categoriaId")}
                        />

                        <CampoFormulario
                            etiqueta="Precio (CLP)"
                            tipo="number"
                            nombre="precio"
                            valor={formulario.precio}
                            marcador="150000"
                            alCambiar={campo("precio")}
                        />

                        <CampoFormulario
                            etiqueta="Descuento en oferta (%) — vacío si no tiene"
                            tipo="number"
                            nombre="descuento"
                            valor={formulario.descuento}
                            marcador="0"
                            alCambiar={campo("descuento")}
                        />

                        <CampoFormulario
                            etiqueta="Stock disponible"
                            tipo="number"
                            nombre="stock"
                            valor={formulario.stock}
                            marcador="10"
                            alCambiar={campo("stock")}
                        />

                        <div className="mb-3">
                            <label className="form-label" htmlFor="descripcion">Descripción</label>
                            <textarea
                                className="form-control"
                                id="descripcion"
                                name="descripcion"
                                rows={3}
                                value={formulario.descripcion}
                                onChange={(evento) => campo("descripcion")(evento.target.value)}
                                maxLength={500}
                                placeholder="Materiales, medidas, detalles del instrumento..."
                            />
                            <div className="form-text">{formulario.descripcion.trim().length} de 500 caracteres</div>
                        </div>

                        <CampoFormulario
                            etiqueta="Imagen (nombre del archivo o URL)"
                            tipo="text"
                            nombre="imagen"
                            valor={formulario.imagen}
                            marcador="Ej: ge006.jpg"
                            maxLongitud={160}
                            alCambiar={campo("imagen")}
                        />

                        <div className="mt-4 d-flex flex-wrap gap-2">
                            <Boton
                                texto={guardando ? "Guardando..." : (editandoId !== null ? "Guardar Cambios" : "Guardar Producto")}
                                tipo="submit"
                                deshabilitado={guardando}
                            />
                            {editandoId !== null && (
                                <button type="button" className="btn btn-outline-light" onClick={cancelarEdicion}>
                                    Cancelar
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                <div className="col-12 col-lg-7">
                    <div className="sv-panel">
                        <h2>Inventario Actual</h2>
                        <p className="text-muted">
                            {cargando ? "Cargando del servicio..." : `${productos.length} productos publicados en el catálogo.`}
                        </p>

                        {productos.length > 0 && (
                            <div className="table-responsive mt-3">
                                <table className="table table-dark table-hover align-middle">
                                    <thead>
                                        <tr>
                                            <th>Código</th>
                                            <th>Producto</th>
                                            <th>Categoría</th>
                                            <th>Precio</th>
                                            <th>Oferta</th>
                                            <th>Stock</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {productos.map((prod) => (
                                            <tr key={prod.id}>
                                                <td>{prod.codigo}</td>
                                                <td>
                                                    {prod.nombre}
                                                    <div className="text-muted small">{prod.marca} · {prod.modelo}</div>
                                                </td>
                                                <td>{prod.categoria}</td>
                                                <td>${prod.precio.toLocaleString("es-CL")}</td>
                                                <td>
                                                    {prod.descuento && prod.descuento > 0
                                                        ? <span className="sv-etiqueta-oferta">-{prod.descuento}%</span>
                                                        : "—"}
                                                </td>
                                                <td>{prod.stock}</td>
                                                <td>
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-info me-2"
                                                        onClick={() => iniciarEdicion(prod)}>
                                                        Editar
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() => quitarProducto(prod)}>
                                                        Quitar
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
