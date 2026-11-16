
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { regionesChile } from "../datos/regiones";
import { leerSesion } from "../datos/sesion";
import { registrarDespachoEnServicio } from "../datos/repositorioDespachos";
import {
    buscarPedidoPorId,
    guardarDatosDespacho,
    type DatosDespacho
} from "../datos/repositorioPedidos";

function Despacho() {
    const { id } = useParams();
    const navigate = useNavigate();
    const sesion = leerSesion();
    const pedidoId = Number(id);

    const pedido = Number.isInteger(pedidoId) && pedidoId > 0
        ? buscarPedidoPorId(pedidoId)
        : undefined;

    const [nombre, setNombre] = useState(() => pedido?.despacho?.nombre ?? sesion?.nombre ?? "");
    const [telefono, setTelefono] = useState(() => pedido?.despacho?.telefono ?? "");
    const [region, setRegion] = useState(() => {
        const nombreRegion = pedido?.despacho?.region;
        return regionesChile.find((r) => r.id === nombreRegion || r.nombre === nombreRegion)?.id ?? "";
    });
    const [comuna, setComuna] = useState(() => pedido?.despacho?.comuna ?? "");
    const [direccion, setDireccion] = useState(() => pedido?.despacho?.direccion ?? "");
    const [referencia, setReferencia] = useState(() => pedido?.despacho?.referencia ?? "");
    // DOMICILIO pide dirección; RETIRO se retira en la tienda y no tiene costo de envío.
    const [tipoEntrega, setTipoEntrega] = useState<"DOMICILIO" | "RETIRO">("DOMICILIO");
    const [error, setError] = useState("");

    const COSTO_ENVIO = 4990;
    const esDomicilio = tipoEntrega === "DOMICILIO";
    const costoEnvio = esDomicilio ? COSTO_ENVIO : 0;

    const regionSeleccionada = regionesChile.find((r) => r.id === region);
    const comunas = regionSeleccionada?.comunas ?? [];

    const guardar = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        if (!sesion) {
            navigate("/login", {
                state: { mensaje: "Inicia sesión para completar el despacho." }
            });
            return;
        }

        if (!pedido) {
            setError("No se encontró el pedido.");
            return;
        }

        if (pedido.usuarioId !== sesion.id) {
            setError("No tienes permiso para modificar este pedido.");
            return;
        }

        if (!nombre.trim() || !telefono.trim()) {
            setError("El nombre y el teléfono son obligatorios.");
            return;
        }

        if (esDomicilio && (!region || !comuna || !direccion.trim())) {
            setError("Para entrega a domicilio completa región, comuna y dirección.");
            return;
        }

        if (!/^[+()\d\s-]{8,20}$/.test(telefono.trim())) {
            setError("Ingresa un teléfono válido.");
            return;
        }

        if (esDomicilio && (!regionSeleccionada || !regionSeleccionada.comunas.includes(comuna))) {
            setError("Selecciona una región y comuna válidas.");
            return;
        }

        const datos: DatosDespacho = {
            nombre: nombre.trim(),
            telefono: telefono.trim(),
            region: esDomicilio && regionSeleccionada ? regionSeleccionada.nombre : "",
            comuna: esDomicilio ? comuna : "",
            direccion: esDomicilio ? direccion.trim() : "",
            referencia: referencia.trim()
        };

        try {
            // El despacho se registra en su servicio; la copia local queda para el resumen.
            const enServicio = await registrarDespachoEnServicio({
                pedidoId: pedido.id,
                tipoEntrega,
                nombre: datos.nombre,
                telefono: datos.telefono,
                region: datos.region,
                comuna: datos.comuna,
                direccion: datos.direccion,
                referencia: datos.referencia,
                costoEnvio
            });

            if (!enServicio.ok) {
                setError(enServicio.motivo);
                return;
            }

            guardarDatosDespacho(pedido.id, datos);
            navigate(`/compra-exitosa/${pedido.id}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : "No se pudieron guardar los datos.");
        }
    };

    if (!sesion) {
        return (
            <section className="sv-seccion">
                <h1>Datos de despacho</h1>
                <p>Inicia sesión para continuar.</p>
                <button className="btn btn-warning" onClick={() => navigate("/login")}>
                    Iniciar sesión
                </button>
            </section>
        );
    }

    if (!pedido || pedido.usuarioId !== sesion.id) {
        return (
            <section className="sv-seccion">
                <h1>Datos de despacho</h1>
                <p className="sv-sin-resultados">
                    {pedido ? "No tienes permiso para acceder a este pedido." : "No se encontró el pedido."}
                </p>
                <button className="btn btn-outline-warning" onClick={() => navigate("/catalogo")}>
                    Volver al catálogo
                </button>
            </section>
        );
    }

    return (
        <section className="sv-seccion sv-seccion-ancha">
            <h1>Datos de despacho</h1>
            <p>Pedido #{pedido.id} · Total: ${pedido.total.toLocaleString("es-CL")}</p>

            <form onSubmit={guardar}>
                <fieldset className="mb-3">
                    <legend className="form-label fs-6">Tipo de entrega *</legend>

                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="tipoEntrega"
                            id="entrega-domicilio"
                            checked={esDomicilio}
                            onChange={() => setTipoEntrega("DOMICILIO")}
                        />
                        <label className="form-check-label" htmlFor="entrega-domicilio">
                            Despacho a domicilio (+${COSTO_ENVIO.toLocaleString("es-CL")})
                        </label>
                    </div>

                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="tipoEntrega"
                            id="entrega-retiro"
                            checked={!esDomicilio}
                            onChange={() => setTipoEntrega("RETIRO")}
                        />
                        <label className="form-check-label" htmlFor="entrega-retiro">
                            Retiro en tienda (sin costo)
                        </label>
                    </div>
                </fieldset>

                <div className="mb-3">
                    <label className="form-label" htmlFor="despacho-nombre">Nombre del destinatario *</label>
                    <input
                        id="despacho-nombre"
                        className="form-control"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label" htmlFor="despacho-telefono">Teléfono *</label>
                    <input
                        id="despacho-telefono"
                        className="form-control"
                        type="tel"
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                        required
                    />
                </div>

                {esDomicilio ? (
                    <>
                        <div className="mb-3">
                            <label className="form-label" htmlFor="despacho-region">Región *</label>
                            <select
                                id="despacho-region"
                                className="form-select"
                                value={region}
                                onChange={(e) => {
                                    setRegion(e.target.value);
                                    setComuna("");
                                }}
                                required
                            >
                                <option value="">Selecciona una región</option>
                                {regionesChile.map((r) => (
                                    <option key={r.id} value={r.id}>{r.nombre}</option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="form-label" htmlFor="despacho-comuna">Comuna *</label>
                            <select
                                id="despacho-comuna"
                                className="form-select"
                                value={comuna}
                                onChange={(e) => setComuna(e.target.value)}
                                required
                                disabled={!region}
                            >
                                <option value="">Selecciona una comuna</option>
                                {comunas.map((c) => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="form-label" htmlFor="despacho-direccion">Dirección *</label>
                            <input
                                id="despacho-direccion"
                                className="form-control"
                                value={direccion}
                                onChange={(e) => setDireccion(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label" htmlFor="despacho-referencia">Referencia (opcional)</label>
                            <textarea
                                id="despacho-referencia"
                                className="form-control"
                                value={referencia}
                                onChange={(e) => setReferencia(e.target.value)}
                                rows={3}
                            />
                        </div>
                    </>
                ) : (
                    <div className="sv-aviso mb-3">
                        <p className="mb-1"><strong>Retiras en la tienda</strong></p>
                        <p className="mb-0">Av. Libertad 1348, Viña del Mar · de lunes a sábado, 10:00 a 19:00.</p>
                        <p className="mb-0">Te avisaremos al teléfono cuando el pedido esté listo.</p>
                    </div>
                )}

                <div className="sv-resumen-envio mb-3">
                    <span>Productos: ${pedido.total.toLocaleString("es-CL")}</span>
                    <span>Envío: {costoEnvio === 0 ? "Sin costo" : `$${costoEnvio.toLocaleString("es-CL")}`}</span>
                    <strong>Total a pagar: ${(pedido.total + costoEnvio).toLocaleString("es-CL")}</strong>
                </div>

                {error && <p className="text-danger" role="alert">{error}</p>}

                <button className="btn btn-warning" type="submit">
                    Guardar datos de despacho
                </button>
            </form>
        </section>
    );
}

export default Despacho;
