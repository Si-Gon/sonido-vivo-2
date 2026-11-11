import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Boton from "../Componentes/atomos/Boton";
import Aviso from "../Componentes/atomos/Aviso";
import { formatearFecha } from "../utilidades/formato";
import {
    obtenerMensaje,
    cambiarEstadoMensaje,
    eliminarMensaje,
    type EstadoMensaje,
    type Mensaje
} from "../datos/repositorioMensajes";

function AdminMensajeDetalle() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [mensaje, setMensaje] = useState<Mensaje | null>(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");
    const [aviso, setAviso] = useState("");
    const [ocupado, setOcupado] = useState(false);

    useEffect(() => {
        let vigente = true;

        const cargar = async () => {
            setCargando(true);
            const resultado = await obtenerMensaje(Number(id));

            if (!vigente) return;

            setCargando(false);

            if (!resultado.ok) {
                setError(resultado.motivo);
                return;
            }

            setMensaje(resultado.mensaje);
        };

        cargar();
        return () => { vigente = false; };
    }, [id]);

    const cambiarEstado = async () => {
        if (!mensaje) return;

        const nuevo: EstadoMensaje = mensaje.estado === "PENDIENTE" ? "RESPONDIDO" : "PENDIENTE";
        setOcupado(true);
        const resultado = await cambiarEstadoMensaje(mensaje.id, nuevo);
        setOcupado(false);

        if (!resultado.ok) {
            setError(resultado.motivo);
            return;
        }

        setMensaje({ ...mensaje, estado: nuevo });
        setAviso(`Mensaje marcado como ${nuevo.toLowerCase()}.`);
    };

    const borrar = async () => {
        if (!mensaje) return;

        if (!window.confirm(`Eliminar el mensaje de ${mensaje.nombreCompleto}?`)) {
            return;
        }

        setOcupado(true);
        const resultado = await eliminarMensaje(mensaje.id);
        setOcupado(false);

        if (!resultado.ok) {
            setError(resultado.motivo);
            return;
        }

        navigate("/admin/mensajes");
    };

    if (cargando) {
        return (
            <section className="sv-seccion">
                <p className="text-muted">Cargando mensaje...</p>
            </section>
        );
    }

    if (!mensaje) {
        return (
            <section className="sv-seccion">
                <h1>Mensaje</h1>
                <p className="text-danger" role="alert">{error || "No se encontro el mensaje."}</p>
                <Link to="/admin/mensajes">Volver a la bandeja</Link>
            </section>
        );
    }

    const asunto = encodeURIComponent(`Respuesta a tu consulta en Sonido Vivo`);
    const ubicacion = [mensaje.comuna, mensaje.region].filter(Boolean).join(", ");

    return (
        <section className="sv-seccion">
            <p className="mb-2">
                <Link to="/admin/mensajes">Volver a la bandeja</Link>
            </p>

            <h1>Mensaje de {mensaje.nombreCompleto}</h1>

            {error && <p className="text-danger" role="alert">{error}</p>}

            <div className="sv-panel mb-3">
                <dl className="row mb-0">
                    <dt className="col-sm-3">Estado</dt>
                    <dd className="col-sm-9">
                        {mensaje.estado === "PENDIENTE" ? (
                            <span className="badge bg-warning text-dark">Pendiente</span>
                        ) : (
                            <span className="badge bg-success">Respondido</span>
                        )}
                    </dd>

                    <dt className="col-sm-3">Fecha de recepción</dt>
                    <dd className="col-sm-9">{formatearFecha(mensaje.fechaCreacion)}</dd>

                    <dt className="col-sm-3">Nombre</dt>
                    <dd className="col-sm-9">{mensaje.nombreCompleto}</dd>

                    <dt className="col-sm-3">Correo</dt>
                    <dd className="col-sm-9">
                        <a href={`mailto:${mensaje.correo}?subject=${asunto}`}>{mensaje.correo}</a>
                    </dd>

                    <dt className="col-sm-3">Ubicación</dt>
                    <dd className="col-sm-9">{ubicacion || "Sin datos"}</dd>

                    <dt className="col-sm-3">Identificador</dt>
                    <dd className="col-sm-9">#{mensaje.id}</dd>
                </dl>
            </div>

            <div className="sv-panel">
                <h2 className="h5">Mensaje completo</h2>
                <p className="sv-mensaje-completo mb-0">{mensaje.mensaje}</p>
            </div>

            <div className="d-flex flex-wrap gap-2 mt-3">
                <Boton
                    texto={mensaje.estado === "PENDIENTE" ? "Marcar respondido" : "Marcar pendiente"}
                    variante="contorno"
                    deshabilitado={ocupado}
                    alHacerClick={cambiarEstado}
                />
                <a className="btn btn-dark btn-sm" href={`mailto:${mensaje.correo}?subject=${asunto}`}>
                    Responder por correo
                </a>
                <Boton
                    texto="Eliminar"
                    variante="contorno"
                    deshabilitado={ocupado}
                    alHacerClick={borrar}
                />
            </div>

            {aviso && <Aviso mensaje={aviso} alCerrar={() => setAviso("")} />}
        </section>
    );
}

export default AdminMensajeDetalle;
