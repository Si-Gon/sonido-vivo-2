import { useEffect, useState } from "react";
import Boton from "../Componentes/atomos/Boton";
import { listarMisCompras, type Boleta, type EstadoBoleta } from "../datos/repositorioBoletas";
import { formatearFecha, formatearPrecio } from "../utilidades/formato";

// Cada cuánto se vuelve a preguntar: si el admin cambia el estado, el cliente lo ve sin recargar.
const REFRESCO_MS = 15000;

// Los pasos que ve el cliente. Son los mismos estados que el admin elige en "Gestión de pedidos",
// con nombres pensados para quien compró (DESPACHADO = "En camino").
const PASOS: { valor: EstadoBoleta; etiqueta: string }[] = [
    { valor: "PENDIENTE", etiqueta: "Recibido" },
    { valor: "EN_PREPARACION", etiqueta: "En preparación" },
    { valor: "DESPACHADO", etiqueta: "En camino" },
    { valor: "ENTREGADO", etiqueta: "Entregado" }
];

function etiquetaEstado(estado: EstadoBoleta): string {
    if (estado === "CANCELADO") return "Cancelado";
    return PASOS.find((paso) => paso.valor === estado)?.etiqueta ?? estado;
}

function MisCompras() {
    const [compras, setCompras] = useState<Boleta[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let vigente = true;

        const cargar = async () => {
            try {
                const lista = await listarMisCompras();
                if (!vigente) return;
                setCompras(lista);
                setError("");
            } catch (err) {
                if (vigente) setError(err instanceof Error ? err.message : "No se pudieron cargar tus compras.");
            } finally {
                if (vigente) setCargando(false);
            }
        };

        void cargar();

        const temporizador = setInterval(() => {
            if (document.visibilityState === "visible") void cargar();
        }, REFRESCO_MS);

        // Al volver a la pestaña se refresca de inmediato.
        const alVolver = () => {
            if (document.visibilityState === "visible") void cargar();
        };

        document.addEventListener("visibilitychange", alVolver);

        return () => {
            vigente = false;
            clearInterval(temporizador);
            document.removeEventListener("visibilitychange", alVolver);
        };
    }, []);

    return (
        <section className="sv-seccion sv-seccion-ancha">
            <h1>Mis compras</h1>
            <p className="sv-lead">
                Aquí ves tus pedidos y en qué estado van. Se actualiza solo cuando la tienda cambia el estado.
            </p>

            {error && <p className="text-danger" role="alert">{error}</p>}

            {cargando ? (
                <p>Cargando tus compras…</p>
            ) : compras.length === 0 && !error ? (
                <div className="sv-sin-resultados">
                    <p>Todavía no tienes compras.</p>
                    <Boton texto="Ir al catálogo" to="/catalogo" variante="contorno" />
                </div>
            ) : (
                <div className="d-grid gap-3">
                    {compras.map((compra) => {
                        const cancelado = compra.estado === "CANCELADO";
                        const pasoActual = PASOS.findIndex((paso) => paso.valor === compra.estado);
                        const unidades = compra.items.reduce((suma, item) => suma + item.cantidad, 0);

                        return (
                            <article className="sv-panel sv-compra" key={compra.id}>
                                <div className="sv-compra-cabecera">
                                    <div>
                                        <h2>Pedido #{compra.id}</h2>
                                        <p className="sv-compra-meta">
                                            {formatearFecha(compra.fechaCreacion)} · {unidades} {unidades === 1 ? "producto" : "productos"} · {formatearPrecio(Number(compra.total))}
                                        </p>
                                    </div>

                                    <span className={`sv-compra-estado sv-compra-estado-${compra.estado.toLowerCase()}`}>
                                        {etiquetaEstado(compra.estado)}
                                    </span>
                                </div>

                                {cancelado ? (
                                    <p className="sv-compra-cancelado">
                                        Este pedido fue cancelado. Si tienes dudas, escríbenos desde Contacto.
                                    </p>
                                ) : (
                                    <ol className="sv-seguimiento" aria-label={`Seguimiento del pedido ${compra.id}`}>
                                        {PASOS.map((paso, indice) => (
                                            <li
                                            key={paso.valor}
                                            className={indice < pasoActual ? "hecho" : indice === pasoActual ? "actual" : ""}
                                            aria-current={indice === pasoActual ? "step" : undefined}
                                            >
                                                <span className="sv-seguimiento-punto" />
                                                <span className="sv-seguimiento-texto">{paso.etiqueta}</span>
                                            </li>
                                        ))}
                                    </ol>
                                )}

                                <ul className="sv-compra-items">
                                    {compra.items.map((item) => (
                                        <li key={item.productoId}>
                                            <span>{item.cantidad} × {item.nombreProducto}</span>
                                            <span>{formatearPrecio(Number(item.subtotal))}</span>
                                        </li>
                                    ))}
                                </ul>

                                <div>
                                    <Boton texto="Ver comprobante" to={`/compra-exitosa/${compra.id}`} variante="contorno" />
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}
        </section>
    );
}

export default MisCompras;