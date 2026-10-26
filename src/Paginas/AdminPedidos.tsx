
import { useEffect, useState } from "react";
import {
    actualizarEstadoPedido,
    listarPedidos,
    suscribirCambiosPedidos,
    type EstadoPedido,
    type Pedido
} from "../datos/repositorioPedidos";
import { formatearPrecio } from "../utilidades/formato";

const estados: EstadoPedido[] = [
    "Pendiente de despacho",
    "En preparación",
    "Despachado",
    "Entregado",
    "Cancelado"
];

type AdminPedidosProps = {
    incrustado?: boolean;
};

function AdminPedidos({ incrustado = false }: AdminPedidosProps) {
    const [pedidos, setPedidos] = useState<Pedido[]>(() => listarPedidos());
    const [error, setError] = useState("");

    useEffect(() => {
        const actualizar = () => setPedidos(listarPedidos());
        const cancelarSuscripcion = suscribirCambiosPedidos(actualizar);

        actualizar();

        return cancelarSuscripcion;
    }, []);

    const cambiarEstado = (id: number, estado: EstadoPedido) => {
        try {
            actualizarEstadoPedido(id, estado);
            setPedidos(listarPedidos());
            setError("");
        } catch (err) {
            setError(err instanceof Error ? err.message : "No se pudo actualizar el pedido.");
        }
    };

    if (pedidos.length === 0) {
        return (
            <section className={incrustado ? "" : "sv-seccion sv-seccion-ancha"}>
                <h2>Gestión de pedidos</h2>
                <p className="sv-sin-resultados">Todavía no hay pedidos registrados.</p>
            </section>
        );
    }

    return (
        <section className={incrustado ? "" : "sv-seccion sv-seccion-ancha"}>
            <h2>Gestión de pedidos</h2>

            {error && <p className="text-danger" role="alert">{error}</p>}

            <div className="table-responsive">
                <table className="table table-striped align-middle">
                    <thead>
                        <tr>
                            <th>Pedido</th>
                            <th>Cliente</th>
                            <th>Fecha</th>
                            <th>Total</th>
                            <th>Despacho</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pedidos
                            .slice()
                            .sort((a, b) => b.id - a.id)
                            .map((pedido) => (
                                <tr key={pedido.id}>
                                    <td>#{pedido.id}</td>
                                    <td>
                                        {pedido.nombreCliente}
                                        <br />
                                        <small>{pedido.emailCliente}</small>
                                    </td>
                                    <td>{new Date(pedido.fechaCreacion).toLocaleDateString("es-CL")}</td>
                                    <td>{formatearPrecio(pedido.total)}</td>
                                    <td>
                                        {pedido.despacho ? (
                                            <>
                                                <strong>{pedido.despacho.nombre}</strong>
                                                <br />
                                                {pedido.despacho.telefono}
                                                <br />
                                                {pedido.despacho.direccion}, {pedido.despacho.comuna}
                                                <br />
                                                {pedido.despacho.region}
                                            </>
                                        ) : (
                                            <span className="text-warning">Faltan datos</span>
                                        )}
                                    </td>
                                    <td>
                                        <select
                                            className="form-select"
                                            value={pedido.estado}
                                            aria-label={`Estado del pedido ${pedido.id}`}
                                            onChange={(e) =>
                                                cambiarEstado(pedido.id, e.target.value as EstadoPedido)
                                            }
                                        >
                                            {estados.map((estado) => (
                                                <option key={estado} value={estado}>
                                                    {estado}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}

export default AdminPedidos;
