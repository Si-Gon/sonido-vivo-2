import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Boton from "../Componentes/atomos/Boton";
import Aviso from "../Componentes/atomos/Aviso";
import CampoSeleccion from "../Componentes/moleculas/CampoSeleccion";
import { formatearFecha } from "../utilidades/formato";
import {
    listarMensajes,
    cambiarEstadoMensaje,
    eliminarMensaje,
    type EstadoMensaje,
    type Mensaje
} from "../datos/repositorioMensajes";

type Filtro = "" | EstadoMensaje;

function AdminMensajes() {
    const [mensajes, setMensajes] = useState<Mensaje[]>([]);
    const [filtro, setFiltro] = useState<Filtro>("");
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");
    const [aviso, setAviso] = useState("");
    const [ocupado, setOcupado] = useState<number | null>(null);

    const cargar = useCallback(async (estado: Filtro) => {
        setCargando(true);
        const resultado = await listarMensajes(estado === "" ? undefined : estado);
        setCargando(false);

        if (!resultado.ok) {
            setError(resultado.motivo);
            return;
        }

        setError("");
        setMensajes(resultado.mensajes);
    }, []);

    useEffect(() => {
        cargar(filtro);
    }, [filtro, cargar]);

    const cambiarEstado = async (mensaje: Mensaje) => {
        const nuevo: EstadoMensaje = mensaje.estado === "PENDIENTE" ? "RESPONDIDO" : "PENDIENTE";
        setOcupado(mensaje.id);
        const resultado = await cambiarEstadoMensaje(mensaje.id, nuevo);
        setOcupado(null);

        if (!resultado.ok) {
            setError(resultado.motivo);
            return;
        }

        setAviso(`Mensaje de ${mensaje.nombreCompleto} quedo como ${nuevo.toLowerCase()}.`);
        await cargar(filtro);
    };

    const borrar = async (mensaje: Mensaje) => {
        if (!window.confirm(`Eliminar el mensaje de ${mensaje.nombreCompleto}?`)) {
            return;
        }

        setOcupado(mensaje.id);
        const resultado = await eliminarMensaje(mensaje.id);
        setOcupado(null);

        if (!resultado.ok) {
            setError(resultado.motivo);
            return;
        }

        setAviso("Mensaje eliminado.");
        await cargar(filtro);
    };

    const pendientes = mensajes.filter((mensaje) => mensaje.estado === "PENDIENTE").length;

    return (
        <section className="sv-seccion">
            <h1>Mensajes de contacto</h1>
            <p className="text-muted">
                Consultas enviadas desde el formulario del sitio. {mensajes.length} en total, {pendientes} sin responder.
            </p>

            {error && <p className="text-danger" role="alert">{error}</p>}

            <div className="row g-3 align-items-end mb-3">
                <div className="col-12 col-md-4">
                    <CampoSeleccion
                        etiqueta="Filtrar por estado"
                        nombre="filtroEstado"
                        valor={filtro}
                        opciones={[
                            { valor: "", etiqueta: "Todos los mensajes" },
                            { valor: "PENDIENTE", etiqueta: "Pendientes" },
                            { valor: "RESPONDIDO", etiqueta: "Respondidos" }
                        ]}
                        alCambiar={(valor) => setFiltro(valor as Filtro)}
                    />
                </div>
                <div className="col-12 col-md-4 mb-3 d-flex align-items-end">
                    <Boton texto="Actualizar" variante="contorno" tamano="normal" alHacerClick={() => cargar(filtro)} />
                </div>
            </div>

            {cargando && <p className="text-muted">Cargando mensajes...</p>}

            {!cargando && mensajes.length === 0 && (
                <p className="text-muted">No hay mensajes que mostrar con este filtro.</p>
            )}

            {!cargando && mensajes.length > 0 && (
                <div className="table-responsive">
                    <table className="table table-dark table-hover align-middle">
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Nombre</th>
                                <th>Correo</th>
                                <th>Ubicación</th>
                                <th>Mensaje</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mensajes.map((mensaje) => (
                                <tr key={mensaje.id}>
                                    <td>{formatearFecha(mensaje.fechaCreacion)}</td>
                                    <td>{mensaje.nombreCompleto}</td>
                                    <td>
                                        <a href={`mailto:${mensaje.correo}`}>{mensaje.correo}</a>
                                    </td>
                                    <td>{[mensaje.comuna, mensaje.region].filter(Boolean).join(", ") || "Sin datos"}</td>
                                    <td>
                                        {/* Se recorta a dos lineas; el texto completo esta en el detalle. */}
                                        <Link className="sv-mensaje-corto" to={`/admin/mensajes/${mensaje.id}`}>
                                            {mensaje.mensaje}
                                        </Link>
                                    </td>
                                    <td>
                                        {mensaje.estado === "PENDIENTE" ? (
                                            <span className="badge bg-warning text-dark">Pendiente</span>
                                        ) : (
                                            <span className="badge bg-success">Respondido</span>
                                        )}
                                    </td>
                                    <td className="d-flex gap-2">
                                        <Boton
                                            texto={mensaje.estado === "PENDIENTE" ? "Marcar respondido" : "Marcar pendiente"}
                                            variante="contorno"
                                            deshabilitado={ocupado === mensaje.id}
                                            alHacerClick={() => cambiarEstado(mensaje)}
                                        />
                                        <Boton
                                            texto="Eliminar"
                                            variante="contorno"
                                            deshabilitado={ocupado === mensaje.id}
                                            alHacerClick={() => borrar(mensaje)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {aviso && <Aviso mensaje={aviso} alCerrar={() => setAviso("")} />}
        </section>
    );
}

export default AdminMensajes;
