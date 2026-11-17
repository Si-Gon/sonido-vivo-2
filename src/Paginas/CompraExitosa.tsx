import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Boton from "../Componentes/atomos/Boton";
import {
    ESTADOS_BOLETA,
    obtenerBoleta,
    obtenerDespachoDePedido,
    type Boleta,
    type DespachoDelPedido
} from "../datos/repositorioBoletas";
import { formatearFecha, formatearPrecio } from "../utilidades/formato";

function CompraExitosa() {
    const { id } = useParams();
    const numeroPedido = Number(id);

    const [boleta, setBoleta] = useState<Boleta | null>(null);
    const [despacho, setDespacho] = useState<DespachoDelPedido | undefined>(undefined);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!Number.isInteger(numeroPedido) || numeroPedido <= 0) {
            setCargando(false);
            return;
        }

        let vigente = true;

        const cargar = async () => {
            try {
                // La boleta y su despacho se leen de sus servicios: nada queda en el navegador.
                const [encontrada, datosDespacho] = await Promise.all([
                    obtenerBoleta(numeroPedido),
                    obtenerDespachoDePedido(numeroPedido)
                ]);

                if (!vigente) return;

                setBoleta(encontrada ?? null);
                setDespacho(datosDespacho);
            } catch (err) {
                if (vigente) setError(err instanceof Error ? err.message : "No se pudo cargar el pedido.");
            } finally {
                if (vigente) setCargando(false);
            }
        };

        void cargar();

        return () => {
            vigente = false;
        };
    }, [numeroPedido]);

    if (cargando) {
        return (
            <section className="sv-seccion">
                <h1>Compra realizada</h1>
                <p>Cargando el comprobante…</p>
            </section>
        );
    }

    if (error) {
        return (
            <section className="sv-seccion">
                <h1>Pedido no encontrado</h1>
                <p className="text-danger" role="alert">{error}</p>
                <div className="text-center">
                    <Boton texto="Ir al catálogo" to="/catalogo" variante="contorno" />
                </div>
            </section>
        );
    }

    if (!boleta) {
        return (
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
        );
    }

    const estado = ESTADOS_BOLETA.find((e) => e.valor === boleta.estado)?.etiqueta ?? boleta.estado;

    return (
        <section className="sv-seccion sv-seccion-ancha">
            <h1>Compra realizada</h1>

            <p className="sv-lead">
                Tu pedido quedó registrado con el número <strong>#{boleta.id}</strong> y está
                en estado <strong>{estado}</strong>. Te contactaremos al teléfono que
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
                                    {boleta.items.map((item) => (
                                        <tr key={item.productoId}>
                                            <td>{item.nombreProducto}</td>
                                            <td>{item.cantidad}</td>
                                            <td>{formatearPrecio(Number(item.precioUnitario))}</td>
                                            <td>{formatearPrecio(Number(item.subtotal))}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <p className="sv-total mt-3 mb-0">
                            Total pagado: {formatearPrecio(Number(boleta.total))}
                        </p>
                    </div>
                </div>

                <div className="col-12 col-lg-5">
                    <div className="sv-panel">
                        <h2>Entrega</h2>
                        {despacho ? (
                            <ul className="sv-detalle-datos mt-3">
                                <li>
                                    Tipo: {despacho.tipoEntrega === "RETIRO" ? "Retiro en tienda" : "Despacho a domicilio"}
                                </li>
                                <li>Destinatario: {despacho.nombre}</li>
                                <li>Teléfono: {despacho.telefono}</li>
                                {despacho.tipoEntrega === "DOMICILIO" && (
                                    <>
                                        <li>Dirección: {despacho.direccion}</li>
                                        <li>{despacho.comuna}, {despacho.region}</li>
                                    </>
                                )}
                                {despacho.referencia && <li>Referencia: {despacho.referencia}</li>}
                                <li>
                                    Envío: {Number(despacho.costoEnvio) === 0
                                        ? "sin costo"
                                        : formatearPrecio(Number(despacho.costoEnvio))}
                                </li>
                                <li>Fecha: {formatearFecha(boleta.fechaCreacion)}</li>
                            </ul>
                        ) : (
                            <p className="sv-pendiente">
                                El pedido todavía no tiene datos de entrega.
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
    );
}

export default CompraExitosa;
