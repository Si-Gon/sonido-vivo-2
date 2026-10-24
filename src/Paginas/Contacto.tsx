import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import CampoFormulario from "../Componentes/moleculas/CampoFormulario";
import CampoSeleccion from "../Componentes/moleculas/CampoSeleccion";
import Boton from "../Componentes/atomos/Boton";
import Aviso from "../Componentes/atomos/Aviso";
import { regionesChile } from "../datos/regiones";

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
    const [error, setError] = useState("");
    const [aviso, setAviso] = useState("");

    const regionSeleccionada = regionesChile.find((r) => r.id === region);
    const opcionesComuna = regionSeleccionada
        ? regionSeleccionada.comunas.map((c) => ({ valor: c, etiqueta: c }))
        : [];

    const alCambiarRegion = (nuevaRegion: string) => {
        setRegion(nuevaRegion);
        setComuna("");
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!nombre.trim() || !email.trim() || !region || !comuna || !mensajeText.trim()) {
            setError("Todos los campos son obligatorios.");
            return;
        }

        if (!email.includes("@") || !email.includes(".")) {
            setError("Ingrese un correo electrónico válido.");
            return;
        }

        setAviso("¡Mensaje enviado con éxito! Te responderemos a la brevedad.");
        setNombre("");
        setEmail("");
        setRegion("");
        setComuna("");
        setMensajeText("");
    };

    return (
        <section className="sv-seccion sv-seccion-ancha">
            <h1>Contacto</h1>
            <div className="row g-4 align-items-stretch">
                <div className="col-12 col-lg-6 d-flex flex-column">
                    <form className="sv-panel flex-grow-1 d-flex flex-column" onSubmit={handleSubmit}>
                        <h3>Envíanos tu consulta</h3>

                        {error && <p className="text-danger mb-3">{error}</p>}

                        <CampoFormulario
                            etiqueta="Nombre completo"
                            tipo="text"
                            nombre="nombre"
                            valor={nombre}
                            marcador="Ej: Juan Pérez"
                            alCambiar={setNombre}
                        />

                        <CampoFormulario
                            etiqueta="Correo electrónico"
                            tipo="email"
                            nombre="email"
                            valor={email}
                            marcador="correo@ejemplo.com"
                            alCambiar={setEmail}
                        />

                        <CampoSeleccion
                            etiqueta="Región"
                            nombre="region"
                            valor={region}
                            opciones={[
                                { valor: "", etiqueta: "Seleccione una región" },
                                ...regionesChile.map((r) => ({ valor: r.id, etiqueta: r.nombre }))
                            ]}
                            alCambiar={alCambiarRegion}
                        />

                        <CampoSeleccion
                            etiqueta="Comuna"
                            nombre="comuna"
                            valor={comuna}
                            opciones={[
                                { valor: "", etiqueta: region ? "Seleccione una comuna" : "Primero seleccione una región" },
                                ...opcionesComuna
                            ]}
                            alCambiar={setComuna}
                        />

                        <div className="mb-3">
                            <label className="form-label" htmlFor="mensaje">Mensaje</label>
                            <textarea
                                className="form-control"
                                id="mensaje"
                                rows={4}
                                value={mensajeText}
                                onChange={(e) => setMensajeText(e.target.value)}
                                placeholder="Escribe tu mensaje aquí..."
                            />
                        </div>

                        <Boton texto="Enviar mensaje" tipo="submit" />
                    </form>
                </div>

                <div className="col-12 col-lg-6 d-flex flex-column">
                    <div className="sv-panel flex-grow-1 d-flex flex-column">
                        <h3>Nuestra Ubicación</h3>
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