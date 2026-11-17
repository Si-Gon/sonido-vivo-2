import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ESTADOS_BOLETA, listarBoletas, type Boleta } from "../datos/repositorioBoletas";
import { listarProductosDelServicio, type ProductoAdmin } from "../datos/repositorioCatalogo";
import { listarUsuarios, type Usuario } from "../datos/repositorioUsuarios";
import { formatearFecha, formatearPrecio } from "../utilidades/formato";

const STOCK_BAJO = 3;

// Cada cuánto se vuelven a pedir los datos: así el panel de otro PC ve los cambios sin recargar.
const REFRESCO_MS = 15000;

function AdminDashboard() {
    const [pedidos, setPedidos] = useState<Boleta[]>([]);
    const [productos, setProductos] = useState<ProductoAdmin[]>([]);
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);

    const cargar = useCallback(async () => {
        const [boletas, catalogo, cuentas] = await Promise.allSettled([
            listarBoletas(),
            listarProductosDelServicio(),
            listarUsuarios()
        ]);

        if (boletas.status === "fulfilled") setPedidos(boletas.value);
        if (catalogo.status === "fulfilled" && catalogo.value.ok) setProductos(catalogo.value.datos);
        if (cuentas.status === "fulfilled") setUsuarios(cuentas.value);
    }, []);

    useEffect(() => {
        void cargar();

        const temporizador = setInterval(() => {
            // Con la pestaña en segundo plano no vale la pena consultar.
            if (document.visibilityState === "visible") void cargar();
        }, REFRESCO_MS);

        // Al volver a la pestaña se refresca de inmediato, sin esperar el turno del temporizador.
        const alVolver = () => {
            if (document.visibilityState === "visible") void cargar();
        };

        document.addEventListener("visibilitychange", alVolver);

        return () => {
            clearInterval(temporizador);
            document.removeEventListener("visibilitychange", alVolver);
        };
    }, [cargar]);

    const contarEstado = (estado: string) =>
        pedidos.filter((pedido) => pedido.estado === estado).length;

    const cancelados = contarEstado("CANCELADO");
    const vendido = pedidos
        .filter((pedido) => pedido.estado !== "CANCELADO")
        .reduce((suma, pedido) => suma + Number(Number(pedido.total)), 0);

    const stockBajo = productos.filter((producto) => producto.stock <= STOCK_BAJO).length;
    const sinStock = productos.filter((producto) => producto.stock === 0).length;
    const activos = usuarios.filter((usuario) => usuario.activo).length;

    const ultimos = [...pedidos]
        .sort((a, b) => b.id - a.id)
        .slice(0, 5);

    const cifras = [
        { etiqueta: "Pedidos registrados", valor: String(pedidos.length), nota: `${cancelados} cancelados` },
        { etiqueta: "Pendientes de despacho", valor: String(contarEstado("PENDIENTE")), nota: "por preparar" },
        { etiqueta: "Ventas acumuladas", valor: formatearPrecio(vendido), nota: "sin pedidos cancelados" },
        { etiqueta: "Productos", valor: String(productos.length), nota: `${stockBajo} con stock bajo` },
        { etiqueta: "Usuarios", valor: String(usuarios.length), nota: `${activos} activos` },
        { etiqueta: "Sin stock", valor: String(sinStock), nota: "no se pueden vender" },
    ];

    return(
        <section className="sv-seccion sv-seccion-ancha">
            <h1>Panel de administración</h1>

            <p className="sv-lead">
                Resumen del estado de la tienda. Las cifras se calculan con los mismos datos que
                usan las demás pantallas, así que se actualizan solas al registrar un pedido o
                cambiar el estado de uno.
            </p>

            <div className="row g-3 mb-4">
                {cifras.map((cifra) => (
                    <div className="col-12 col-sm-6 col-lg-4" key={cifra.etiqueta}>
                        <div className="sv-kpi">
                            <p className="sv-kpi-etiqueta">{cifra.etiqueta}</p>
                            <p className="sv-kpi-valor">{cifra.valor}</p>
                            <p className="sv-kpi-nota">{cifra.nota}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="row g-4">
                <div className="col-12 col-lg-7">
                    <div className="sv-panel">
                        <h2>Últimos pedidos</h2>

                        {ultimos.length === 0 ? (
                            <p className="sv-sin-resultados mt-3">
                                Todavía no hay pedidos registrados.
                            </p>
                        ) : (
                            <div className="table-responsive mt-3">
                                <table className="table table-dark table-hover align-middle mb-0">
                                    <thead>
                                        <tr>
                                            <th>Pedido</th>
                                            <th>Cliente</th>
                                            <th>Fecha</th>
                                            <th>Total</th>
                                            <th>Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {ultimos.map((pedido) => (
                                            <tr key={pedido.id}>
                                                <td>#{pedido.id}</td>
                                                <td>{pedido.nombreCliente}</td>
                                                <td>{formatearFecha(pedido.fechaCreacion)}</td>
                                                <td>{formatearPrecio(Number(pedido.total))}</td>
                                                <td>{ESTADOS_BOLETA.find((e) => e.valor === pedido.estado)?.etiqueta ?? pedido.estado}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        <Link className="btn btn-outline-warning mt-3" to="/admin/pedidos">
                            Ver todos los pedidos
                        </Link>
                    </div>
                </div>

                <div className="col-12 col-lg-5">
                    <div className="sv-panel">
                        <h2>Accesos rápidos</h2>
                        <div className="d-grid gap-2 mt-3">
                            <Link className="btn btn-outline-warning" to="/admin/productos">
                                Gestionar productos
                            </Link>
                            <Link className="btn btn-outline-warning" to="/admin/usuarios">
                                Gestionar usuarios
                            </Link>
                            <Link className="btn btn-outline-warning" to="/admin/pedidos">
                                Gestionar pedidos
                            </Link>
                            <Link className="btn btn-outline-warning" to="/admin/perfil">
                                Mi perfil
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default AdminDashboard
