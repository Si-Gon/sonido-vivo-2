import { useState } from "react";
import CampoFormulario from "../Componentes/moleculas/CampoFormulario";
import CampoSeleccion from "../Componentes/moleculas/CampoSeleccion";
import Boton from "../Componentes/atomos/Boton";
import { regionesChile } from "../datos/regiones";
import { validarRut, formatearRut } from "../utilidades/rut";
import { useNavigate } from "react-router-dom";
import { registrarUsuario } from "../datos/repositorioUsuarios";


function Registro() {
    const [nombre, setNombre] = useState("");
    const [rut, setRut] = useState("");
    const [email, setEmail] = useState("");
    const [region, setRegion] = useState("");
    const [comuna, setComuna] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    
    const regionSeleccionada = regionesChile.find((r) => r.id === region);
    const opcionesComuna = regionSeleccionada
        ? regionSeleccionada.comunas.map((c) => ({ valor: c, etiqueta: c }))
        : [];

    const alCambiarRut = (valor: string) => {
        setRut(formatearRut(valor));
    };

    const alCambiarRegion = (nuevaRegion: string) => {
        setRegion(nuevaRegion);
        setComuna("");
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!nombre.trim() || !rut.trim() || !email.trim() || !region || !comuna || !password || !confirmPassword) {
            setError("Todos los campos son obligatorios.");
            return;
        }

        if (!validarRut(rut)) {
            setError("El RUT ingresado no es válido.");
            return;
        }

        if (!email.includes("@") || !email.includes(".")) {
            setError("Ingrese un correo electrónico válido.");
            return;
        }

        if (password.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }
        
        const resultado = registrarUsuario({ nombre, rut, email, region, comuna, password }); 
        
        if (!resultado.ok) {
            setError(resultado.motivo);
            return;
            }
            
            setNombre("");
            setRut("");
            setEmail("");
            setRegion("");
            setComuna("");
            setPassword("");
            setConfirmPassword("");

        navigate("/login", { replace: true, state: { registroExitoso: true } });
    };

    return (
        <section className="sv-seccion">
            <div className="row justify-content-center">
                <div className="col-12 col-md-8 col-lg-6">
                    <form className="sv-panel" onSubmit={handleSubmit}>
                        <h1 className="text-center mb-4">Crear cuenta</h1>

                        {error && <p className="text-danger mb-3 text-center">{error}</p>}

                        <CampoFormulario
                            etiqueta="Nombre completo"
                            tipo="text"
                            nombre="nombre"
                            valor={nombre}
                            marcador="Ej: María González"
                            alCambiar={setNombre}
                        />

                        <CampoFormulario
                            etiqueta="RUT / RUN"
                            tipo="text"
                            nombre="rut"
                            valor={rut}
                            marcador="12.345.678-K"
                            alCambiar={alCambiarRut}
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

                        <CampoFormulario
                            etiqueta="Contraseña"
                            tipo="password"
                            nombre="password"
                            valor={password}
                            marcador="******"
                            alCambiar={setPassword}
                        />

                        <CampoFormulario
                            etiqueta="Confirmar contraseña"
                            tipo="password"
                            nombre="confirmPassword"
                            valor={confirmPassword}
                            marcador="******"
                            alCambiar={setConfirmPassword}
                        />

                        <div className="mt-4">
                            <Boton texto="Registrarse" tipo="submit" />
                        </div>
                    </form>
                </div>
            </div>

        </section>
    );

        
}

export default Registro;