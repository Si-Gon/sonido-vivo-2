import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CampoFormulario from "../Componentes/moleculas/CampoFormulario";
import Boton from "../Componentes/atomos/Boton";
import { useLocation, useNavigate } from "react-router-dom";
import Aviso from "../Componentes/atomos/Aviso";
import { validarCredenciales } from "../datos/repositorioUsuarios";
import { iniciarSesion } from "../datos/sesion";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    
    const navigate = useNavigate();
    const location = useLocation();

    const [aviso, setAviso] = useState(() => (
    (location.state as { registroExitoso?: boolean } | null)?.registroExitoso
        ? "¡Cuenta creada con éxito! Ya puedes iniciar sesión."
        : ""
    ));

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!email.trim() || !password.trim()) {
            setError("Por favor ingrese correo y contraseña.");
            return;
        }

        if (email === "admin@sonidovivo.cl" && password === "admin123") {
            navigate("/admin");
        } else {
            navigate("/catalogo");
        }
    };

    return (
        <section className="sv-seccion">
            <div className="container" style={{ maxWidth: "450px" }}>
                <form className="sv-panel" onSubmit={handleLogin}>
                    <h2 className="text-center mb-4">Iniciar Sesión</h2>

                    {error && <p className="text-danger text-center">{error}</p>}

                    <CampoFormulario
                        etiqueta="Correo electrónico"
                        tipo="email"
                        nombre="email"
                        valor={email}
                        marcador="correo@ejemplo.com"
                        alCambiar={setEmail}
                    />

                    <CampoFormulario
                        etiqueta="Contraseña"
                        tipo="password"
                        nombre="password"
                        valor={password}
                        marcador="••••••••"
                        alCambiar={setPassword}
                    />

                    <div className="mt-4">
                        <Boton texto="Ingresar" tipo="submit" />
                    </div>
                </form>
            </div>
        </section>
    );
}

export default Login;