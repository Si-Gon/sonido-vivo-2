import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
    historialMovimientos,
    listarProductosDelServicio,
    type Movimiento,
    type ProductoAdmin
} from "../datos/repositorioCatalogo";

const MOTIVOS = [
    { valor: "VENTA", etiqueta: "Venta" },
    { valor: "CANCELACION", etiqueta: "Cancelación" },
    { valor: "AJUSTE", etiqueta: "Ajuste manual" },
    { valor: "INICIAL", etiqueta: "Stock inicial" }
];

// Lo que muestra la columna de saldo: el stock que quedó después de ese movimiento.
function fechaCorta(iso: string) {
    const fecha = new Date(iso);
    return `${fecha.toLocaleDateString("es-CL")} ${fecha.toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" })}`;
}

function AdminMovimientos() {
    const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
    const [productos, setProductos] = useState<ProductoAdmin[]>([]);
    const [productoId, setProductoId] = useState("");
    const [tipo, setTipo] = useState("");
    const [motivo, setMotivo] = useState("");
    const [texto, setTexto] = useState("");
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    // Catálogo para el selector de producto.
    useEffect(() => {
        void listarProductosDelServicio().then((lista) => {
            if (lista.ok) setProductos(lista.datos);
        });
    }, []);

    const cargar = useCallback(async () => {
        setCargando(true);

        try {
            const datos = await historialMovimientos({
                productoId: productoId === "" ? undefined : Number(productoId),
                tipo: tipo === "" ? undefined : (tipo as "ENTRADA" | "SALIDA"),
                motivo,
                texto
            });

            setMovimientos(datos);
            setError("");
        } catch (err) {
            setError(err instanceof Error ? err.message : "No se pudo cargar el historial.");
        } finally {
            setCargando(false);
        }
    }, [productoId, tipo, motivo, texto]);

    useEffect(() => {
        void cargar();
    }, [cargar]);

    const resumen = useMemo(() => {
        const entradas = movimientos.filter((m) => m.tipo === "ENTRADA").reduce((s, m) => s + m.cantidad, 0);
        const salidas = movimientos.filter((m) => m.tipo === "SALIDA").reduce((s, m) => s + m.cantidad, 0);

        return { entradas, salidas };
    }, [movimientos]);

    const limpiarFiltros = () => {
        setProductoId("");
        setTipo("");
        setMotivo("");
        setTexto("");
    };

    return (
        <section className="sv-seccion sv-seccion-ancha">
            <h1>Movimientos de stock</h1>
            <p>
                Cada cambio de inventario queda registrado: las ventas descuentan, las cancelaciones
                devuelven y los ajustes manuales del panel también aparecen acá.
            </p>

            <div className="row g-3 align-items-end mb-3">
                <div className="col-12 col-md-4">
                    <label className="form-label" htmlFor="filtro-producto">Producto</label>
                    <select
                        id="filtro-producto"
                        className="form-select"
                        value={productoId}
                        onChange={(e) => setProductoId(e.target.value)}
                    >
                        <option value="">Todos los productos</option>
                        {productos.map((producto) => (
                            <option key={producto.id} value={producto.id}>
                                {producto.codigo} · {producto.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="col-6 col-md-2">
                    <label className="form-label" htmlFor="filtro-tipo">Tipo</label>
                    <select
                        id="filtro-tipo"
                        className="form-select"
                        value={tipo}
                        onChange={(e) => setTipo(e.target.value)}
                    >
                        <option value="">Todos</option>
                        <option value="ENTRADA">Entrada</option>
                        <option value="SALIDA">Salida</option>
                    </select>
                </div>

                <div className="col-6 col-md-2">
                    <label className="form-label" htmlFor="filtro-motivo">Motivo</label>
                    <select
                        id="filtro-motivo"
                        className="form-select"
                        value={motivo}
                        onChange={(e) => setMotivo(e.target.value)}
                    >
                        <option value="">Todos</option>
                        {MOTIVOS.map((opcion) => (
                            <option key={opcion.valor} value={opcion.valor}>{opcion.etiqueta}</option>
                        ))}
                    </select>
                </div>

                <div className="col-12 col-md-4">
                    <label className="form-label" htmlFor="filtro-texto">Referencia o producto</label>
                    <input
                        id="filtro-texto"
                        className="form-control"
                        placeholder="PEDIDO-5, AC006, afinador…"
                        value={texto}
                        onChange={(e) => setTexto(e.target.value)}
                    />
                </div>
            </div>

            <div className="d-flex flex-wrap gap-3 align-items-center mb-3">
                <p className="mb-0">
                    {movimientos.length} movimiento(s) · {resumen.entradas} unidad(es) de entrada ·{" "}
                    {resumen.salidas} de salida
                </p>
                <button type="button" className="btn btn-sm btn-outline-dark" onClick={limpiarFiltros}>
                    Limpiar filtros
                </button>
            </div>

            {error && <p className="text-danger" role="alert">{error}</p>}

            {cargando ? (
                <p>Cargando movimientos…</p>
            ) : movimientos.length === 0 ? (
                <p className="sv-sin-resultados">No hay movimientos con esos filtros.</p>
            ) : (
                <div className="table-responsive">
                    <table className="table table-striped align-middle">
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Producto</th>
                                <th>Tipo</th>
                                <th className="text-end">Cantidad</th>
                                <th>Motivo</th>
                                <th>Referencia</th>
                                <th className="text-end">Saldo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {movimientos.map((movimiento) => {
                                const esPedido = movimiento.referencia?.startsWith("PEDIDO-") ?? false;
                                const numeroPedido = esPedido ? movimiento.referencia!.replace("PEDIDO-", "") : "";

                                return (
                                    <tr key={movimiento.id}>
                                        <td>{fechaCorta(movimiento.creadoEn)}</td>
                                        <td>
                                            <strong>{movimiento.codigo}</strong>
                                            <br />
                                            <small>{movimiento.producto}</small>
                                        </td>
                                        <td>
                                            <span className={movimiento.tipo === "ENTRADA" ? "badge text-bg-success" : "badge text-bg-secondary"}>
                                                {movimiento.tipo === "ENTRADA" ? "Entrada" : "Salida"}
                                            </span>
                                        </td>
                                        <td className="text-end">
                                            {movimiento.tipo === "ENTRADA" ? "+" : "−"}{movimiento.cantidad}
                                        </td>
                                        <td>{MOTIVOS.find((m) => m.valor === movimiento.motivo)?.etiqueta ?? movimiento.motivo}</td>
                                        <td>
                                            {esPedido ? (
                                                <Link to={`/admin/pedidos?pedido=${numeroPedido}`}>
                                                    {movimiento.referencia}
                                                </Link>
                                            ) : (
                                                <span className="text-muted">—</span>
                                            )}
                                        </td>
                                        <td className="text-end">{movimiento.stockResultante}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}

export default AdminMovimientos;
