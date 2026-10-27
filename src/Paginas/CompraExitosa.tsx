import { useParams } from "react-router-dom";
import Boton from "../Componentes/atomos/Boton";
import { buscarPedidoPorId } from "../datos/repositorioPedidos";
import { formatearFecha, formatearPrecio } from "../utilidades/formato";

function CompraExitosa() {
    const { id } = useParams();
    const numeroPedido = Number(id);
    const pedido = Number.isInteger(numeroPedido) && numeroPedido > 0
        ? buscarPedidoPorId(numeroPedido)
        : null;

    if (!pedido) {
        return(
            <section className="sv-seccion">
                <h1>Pedido no encontrado</h1>
                <p className="sv-pendiente">
                    No encontramos un pedido con ese número. Revisa el correo de confirmación o
                    vuelve a comprar desde el catálogo.
                </p>
                <div className="text-center">
                    <Boton texto="Ir al catálogo" to="/catalogo" variante="contorno" />
                </div>
            </section>
        )
    }

    return(
        <section className="sv-seccion sv-seccion-ancha">
            <h1>Compra realizada</h1>

            <p className="sv-lead">
                Tu pedido quedó registrado con el número <strong>#{pedido.id}</strong> y está
                en estado <strong>{pedido.estado}</strong>. Te contactaremos al teléfono que
                dejaste en el despacho para coordinar la entrega.
            </p>

            <div className="row g-4">
                <div className="col-12 col-lg-7">
                    <div className="sv-panel">
                        <h2>Productos del pedido</h2>
                        <div className="table-responsive mt-3">
                            <table className="table table-dark align-middle mb-0">
                                <thead>
                                    <tr>
                                        <th>Producto</th>
                                        <th>Cantidad</th>
                                        <th>Precio</th>
                                        <th>Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pedido.items.map((item) => (
                                        <tr key={item.productoId}>
                                            <td>{item.nombre}</td>
                                            <td>{item.cantidad}</td>
                                            <td>{formatearPrecio(item.precioUnitario)}</td>
                                            <td>{formatearPrecio(item.subtotal)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <p className="sv-total mt-3 mb-0">
                            Total pagado: {formatearPrecio(pedido.total)}
                        </p>
                    </div>
                </div>

                <div className="col-12 col-lg-5">
                    <div className="sv-panel">
                        <h2>Despacho</h2>
                        {pedido.despacho ? (
                            <ul className="sv-detalle-datos mt-3">
                                <li>Destinatario: {pedido.despacho.nombre}</li>
                                <li>Teléfono: {pedido.despacho.telefono}</li>
                                <li>Dirección: {pedido.despacho.direccion}</li>
                                <li>{pedido.despacho.comuna}, {pedido.despacho.region}</li>
                                {pedido.despacho.referencia !== "" && (
                                    <li>Referencia: {pedido.despacho.referencia}</li>
                                )}
                                <li>Fecha: {formatearFecha(pedido.fechaCreacion)}</li>
                            </ul>
                        ) : (
                            <p className="sv-pendiente">
                                El pedido todavía no tiene datos de despacho.
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <div className="d-flex flex-wrap gap-2 mt-4">
                <Boton texto="Seguir comprando" to="/catalogo" />
                <Boton texto="Volver al inicio" to="/" variante="contorno" />
            </div>
        </section>
    )
}

export default CompraExitosa
