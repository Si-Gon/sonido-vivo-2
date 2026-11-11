import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import CampoFormulario from "../Componentes/moleculas/CampoFormulario";
import CampoSeleccion from "../Componentes/moleculas/CampoSeleccion";
import Boton from "../Componentes/atomos/Boton";
import Aviso from "../Componentes/atomos/Aviso";
import { regionesChile } from "../datos/regiones";
import { enviarMensaje } from "../datos/repositorioContacto";
import {
    validarCampo,
    validarContacto,
    MAXIMO_NOMBRE,
    MAXIMO_CORREO,
    MINIMO_MENSAJE,
    MAXIMO_MENSAJE,
    type CampoContacto
} from "../utilidades/validacionContacto";

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png"
});

function Contacto() {
    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [region, setRegion] = useState("");
    const [comuna, setComuna] = useState("");
    const [mensajeText, setMensajeText] = useState("");
    const [tocados, setTocados] = useState<CampoContacto[]>([]);
    const [intentoEnvio, setIntentoEnvio] = useState(false);
    const [errorServidor, setErrorServidor] = useState("");
    const [aviso, setAviso] = useState("");
    const [enviando, setEnviando] = useState(false);

    const regionSeleccionada = regionesChile.find((r) => r.id === region);
    const opcionesComuna = regionSeleccionada
        ? regionSeleccionada.comunas.map((c) => ({ valor: c, etiqueta: c }))
        : [];

    const datos = { nombre, email, region, comuna, mensaje: mensajeText };

    // El error se calcula con el valor actual, asi desaparece solo cuando el usuario lo corrige.
    const errorDe = (campo: CampoContacto) =>
        tocados.includes(campo) ? validarCampo(campo, datos) : undefined;

    const marcarTocado = (campo: CampoContacto) => {
        setTocados((lista) => (lista.includes(campo) ? lista : [...lista, campo]));
    };

    const alCambiarRegion = (nuevaRegion: string) => {
        setRegion(nuevaRegion);
        setComuna("");
        marcarTocado("region");
        marcarTocado("comuna");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorServidor("");
        setAviso("");
        setIntentoEnvio(true);

        const errores = validarContacto(datos);
        const camposConError = Object.keys(errores) as CampoContacto[];
        setTocados(["nombre", "email", "region", "comuna", "mensaje"]);

        if (camposConError.length > 0) {
            // Lleva el foco al primer campo con problema.
            document.getElementById(camposConError[0])?.focus();
            return;
        }

        setEnviando(true);
        const resultado = await enviarMensaje({
            nombreCompleto: nombre.trim(),
            correo: email.trim(),
            region: regionSeleccionada ? regionSeleccionada.nombre : "",
            comuna,
            mensaje: mensajeText.trim()
        });
        setEnviando(false);

        if (!resultado.ok) {
            setErrorServidor(resultado.motivo);
            return;
        }

        setAviso("¡Mensaje enviado con éxito! Te responderemos a la brevedad.");
        setNombre("");
        setEmail("");
        setRegion("");
        setComuna("");
        setMensajeText("");
        setTocados([]);
        setIntentoEnvio(false);
    };

    const erroresVisibles = (Object.keys(validarContacto(datos)) as CampoContacto[]).length;

    return (
        <section className="sv-seccion sv-seccion-ancha">
            <h1>Contacto</h1>
            <div className="row g-4 align-items-stretch">
                <div className="col-12 col-lg-6 d-flex flex-column">
                    <form className="sv-panel flex-grow-1 d-flex flex-column" onSubmit={handleSubmit} noValidate>
                        <h2>Envíanos tu consulta</h2>

                        {errorServidor && <p className="text-danger mb-3" role="alert">{errorServidor}</p>}

                        {intentoEnvio && erroresVisibles > 0 && (
                            <p className="text-danger mb-3" role="alert">
                                Revisa los {erroresVisibles} {erroresVisibles === 1 ? "campo marcado" : "campos marcados"} en el formulario.
                            </p>
                        )}

                        <CampoFormulario
                            etiqueta="Nombre completo"
                            tipo="text"
                            nombre="nombre"
                            valor={nombre}
                            marcador="Ej: Juan Pérez"
                            error={errorDe("nombre")}
                            maxLongitud={MAXIMO_NOMBRE}
                            deshabilitado={enviando}
                            alCambiar={setNombre}
                            alPerderFoco={() => marcarTocado("nombre")}
                        />

                        <CampoFormulario
                            etiqueta="Correo electrónico"
                            tipo="email"
                            nombre="email"
                            valor={email}
                            marcador="correo@ejemplo.com"
                            error={errorDe("email")}
                            maxLongitud={MAXIMO_CORREO}
                            ayuda="Te responderemos a este correo."
                            deshabilitado={enviando}
                            alCambiar={setEmail}
                            alPerderFoco={() => marcarTocado("email")}
                        />

                        <CampoSeleccion
                            etiqueta="Región"
                            nombre="region"
                            valor={region}
                            error={errorDe("region")}
                            deshabilitado={enviando}
                            opciones={[
                                { valor: "", etiqueta: "Seleccione una región" },
                                ...regionesChile.map((r) => ({ valor: r.id, etiqueta: r.nombre }))
                            ]}
                            alCambiar={alCambiarRegion}
                            alPerderFoco={() => marcarTocado("region")}
                        />

                        <CampoSeleccion
                            etiqueta="Comuna"
                            nombre="comuna"
                            valor={comuna}
                            error={errorDe("comuna")}
                            deshabilitado={enviando}
                            opciones={[
                                { valor: "", etiqueta: region ? "Seleccione una comuna" : "Primero seleccione una región" },
                                ...opcionesComuna
                            ]}
                            alCambiar={setComuna}
                            alPerderFoco={() => marcarTocado("comuna")}
                        />

                        <div className="mb-3">
                            <label className="form-label" htmlFor="mensaje">Mensaje</label>
                            <textarea
                                className={errorDe("mensaje") ? "form-control is-invalid" : "form-control"}
                                id="mensaje"
                                name="mensaje"
                                rows={4}
                                value={mensajeText}
                                onChange={(e) => setMensajeText(e.target.value)}
                                onBlur={() => marcarTocado("mensaje")}
                                disabled={enviando}
                                maxLength={MAXIMO_MENSAJE}
                                aria-invalid={errorDe("mensaje") ? true : undefined}
                                aria-describedby="mensaje-error mensaje-contador"
                                placeholder={`Ej: Consulta por un instrumento (mínimo ${MINIMO_MENSAJE} caracteres)`}
                            />
                            {errorDe("mensaje") && (
                                <div className="invalid-feedback d-block" id="mensaje-error" role="alert">
                                    {errorDe("mensaje")}
                                </div>
                            )}
                            <div className="form-text" id="mensaje-contador">
                                {mensajeText.trim().length} de {MAXIMO_MENSAJE} caracteres
                            </div>
                        </div>

                        <Boton texto={enviando ? "Enviando..." : "Enviar mensaje"} tipo="submit" deshabilitado={enviando} ancho />
                    </form>
                </div>

                <div className="col-12 col-lg-6 d-flex flex-column">
                    <div className="sv-panel flex-grow-1 d-flex flex-column">
                        <h2>Nuestra Ubicación</h2>
                        <p className="sv-pendiente mb-3">Viña del Mar, Región de Valparaíso</p>

                        <div style={{ flex: 1, minHeight: "450px", width: "100%", borderRadius: "8px", overflow: "hidden" }}>
                            <MapContainer
                                center={[-33.0245, -71.5518]}
                                zoom={14}
                                style={{ height: "100%", width: "100%" }}
                            >
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                />
                                <Marker position={[-33.0245, -71.5518]}>
                                    <Popup>
                                        <strong>Sonido Vivo</strong><br />
                                        Tienda de Instrumentos Musicales
                                    </Popup>
                                </Marker>
                            </MapContainer>
                        </div>
                    </div>
                </div>
            </div>

            {aviso && <Aviso mensaje={aviso} alCerrar={() => setAviso("")} />}
        </section>
    );
}

export default Contacto;
