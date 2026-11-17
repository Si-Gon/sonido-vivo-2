import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
    ESTADOS_BOLETA,
    cambiarEstadoBoleta,
    listarBoletas,
    listarDespachos,
    type Boleta,
    type DespachoDelPedido,
    type EstadoBoleta
} from "../datos/repositorioBoletas";
import { formatearPrecio } from "../utilidades/formato";

function AdminPedidos() {
    const [parametros] = useSearchParams();
    const [boletas, setBoletas] = useState<Boleta[]>([]);
    const [despachos, setDespachos] = useState<DespachoDelPedido[]>([]);
    const [filtro, setFiltro] = useState<EstadoBoleta | "">("");
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");
    const [detalle, setDetalle] = useState<number | null>(null);

    const cargar = useCallback(async (estado: EstadoBoleta | "") => {
        setCargando(true);

        try {
            const [listaBoletas, listaDespachos] = await Promise.all([
                listarBoletas(estado === "" ? undefined : estado),
                listarDespachos()
            ]);

            setBoletas(listaBoletas);
            setDespachos(listaDespachos);
            setError("");
        } catch (err) {
            setError(err instanceof Error ? err.message : "No se pudieron cargar los pedidos.");
        } finally {
            setCargando(false);
        }
    }, []);

    useEffect(() => {
        void cargar(filtro);
    }, [cargar, filtro]);

    // Un despacho por pedido, para no recorrer la lista en cada fila.
    const despachoPorPedido = useMemo(() => {
        const mapa = new Map<number, DespachoDelPedido>();
        despachos.forEach((despacho) => mapa.set(despacho.pedidoId, despacho));
        return mapa;
    }, [despachos]);

    const cambiarEstado = async (id: number, estado: EstadoBoleta) => {
        try {
            await cambiarEstadoBoleta(id, estado);
            await cargar(filtro);
        } catch (err) {
            setError(err instanceof Error ? err.message : "No se pudo actualizar el pedido.");
        }
    };

    // Si se llega desde el historial de stock, se muestra solo ese pedido.
    const pedidoBuscado = parametros.get("pedido");
    const visibles = pedidoBuscado
        ? boletas.filter((boleta) => String(boleta.id) === pedidoBuscado)
        : boletas;

    return (
        <section className="sv-seccion sv-seccion-ancha">
            <h1>Gestión de pedidos</h1>
            <p>Los pedidos se leen del servicio de boletas; el despacho, del servicio de despachos.</p>

            <div className="d-flex flex-wrap gap-3 align-items-end mb-3">
                <div>
                    <label className="form-label" htmlFor="filtro-estado">Estado</label>
                    <select
                        id="filtro-estado"
                        className="form-select"
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value as EstadoBoleta | "")}
                    >
                        <option value="">Todos</option>
                        {ESTADOS_BOLETA.map((estado) => (
                            <option key={estado.valor} value={estado.valor}>{estado.etiqueta}</option>
                        ))}
                    </select>
                </div>

                <p className="mb-2">
                    {visibles.length} pedido(s) · {formatearPrecio(visibles.reduce((suma, b) => suma + Number(b.total), 0))} en total
                </p>
            </div>

            {error && <p className="text-danger" role="alert">{error}</p>}

            {cargando ? (
                <p>Cargando pedidos…</p>
            ) : visibles.length === 0 ? (
                <p className="sv-sin-resultados">
                    {pedidoBuscado
                        ? `No se encontró el pedido #${pedidoBuscado}.`
                        : filtro === "" ? "Todavía no hay pedidos registrados." : "No hay pedidos con ese estado."}
                </p>
            ) : (
                <div className="table-responsive">
                    <table className="table table-striped align-middle">
                        <thead>
                            <tr>
                                <th>Pedido</th>
                                <th>Cliente</th>
                                <th>Fecha</th>
                                <th>Total</th>
                                <th>Entrega</th>
                                <th>Estado</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {visibles.map((boleta) => {
                                const despacho = despachoPorPedido.get(boleta.id);
                                const abierto = detalle === boleta.id;

                                return (
                                    <Fragment key={boleta.id}>
                                        <tr>
                                            <td>#{boleta.id}</td>
                                            <td>
                                                {boleta.nombreCliente}
                                                <br />
                                                <small>{boleta.emailCliente}</small>
                                            </td>
                                            <td>{new Date(boleta.fechaCreacion).toLocaleDateString("es-CL")}</td>
                                            <td>{formatearPrecio(Number(boleta.total))}</td>
                                            <td>
                                                {despacho ? (
                                                    <>
                                                        <strong>{despacho.tipoEntrega === "RETIRO" ? "Retiro en tienda" : "Domicilio"}</strong>
                                                        <br />
                                                        {despacho.tipoEntrega === "RETIRO" ? (
                                                            <small>{despacho.nombre} · {despacho.telefono}</small>
                                                        ) : (
                                                            <small>
                                                                {despacho.direccion}, {despacho.comuna}
                                                                <br />
                                                                {despacho.region} · {despacho.telefono}
                                                            </small>
                                                        )}
                                                        <br />
                                                        <small>Envío: {Number(despacho.costoEnvio) === 0 ? "sin costo" : formatearPrecio(Number(despacho.costoEnvio))}</small>
                                                    </>
                                                ) : (
                                                    <span className="text-warning">Sin datos de entrega</span>
                                                )}
                                            </td>
                                            <td>
                                                <select
                                                    className="form-select"
                                                    value={boleta.estado}
                                                    aria-label={`Estado del pedido ${boleta.id}`}
                                                    onChange={(e) => void cambiarEstado(boleta.id, e.target.value as EstadoBoleta)}
                                                >
                                                    {ESTADOS_BOLETA.map((estado) => (
                                                        <option key={estado.valor} value={estado.valor}>{estado.etiqueta}</option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td>
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-dark"
                                                    onClick={() => setDetalle(abierto ? null : boleta.id)}
                                                >
                                                    {abierto ? "Ocultar" : "Ver detalle"}
                                                </button>
                                            </td>
                                        </tr>

                                        {abierto && (
                                            <tr>
                                                <td colSpan={7}>
                                                    <table className="table table-sm mb-0">
                                                        <thead>
                                                            <tr>
                                                                <th>Producto</th>
                                                                <th>Cantidad</th>
                                                                <th>Precio</th>
                                                                <th>Subtotal</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {boleta.items.map((linea) => (
                                                                <tr key={linea.productoId}>
                                                                    <td>{linea.nombreProducto}</td>
                                                                    <td>{linea.cantidad}</td>
                                                                    <td>{formatearPrecio(Number(linea.precioUnitario))}</td>
                                                                    <td>{formatearPrecio(Number(linea.subtotal))}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                        )}
                                    </Fragment>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}

export default AdminPedidos;
