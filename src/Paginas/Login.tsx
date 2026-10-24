import { useState } from "react";
import CampoFormulario from "../Componentes/moleculas/CampoFormulario";
import Boton from "../Componentes/atomos/Boton";
import Aviso from "../Componentes/atomos/Aviso";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [aviso, setAviso] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!email.trim() || !password) {
            setError("Por favor completa todos los campos.");
            return;
        }

        if (!email.includes("@") || !email.includes(".")) {
            setError("Ingrese un correo electrónico válido.");
            return;
        }

        setAviso("¡Inicio de sesión exitoso! Bienvenido de vuelta.");
        setEmail("");
        setPassword("");
    };

    return (
        <section className="sv-seccion">
            <div className="row justify-content-center">
                <div className="col-12 col-md-6 col-lg-5">
                    <form className="sv-panel" onSubmit={handleSubmit}>
                        <h2 className="text-center mb-4">Iniciar Sesión</h2>

                        {error && <p className="text-danger mb-3 text-center">{error}</p>}

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
                            marcador="******"
                            alCambiar={setPassword}
                        />

                        <div className="mt-4">
                            <Boton texto="Ingresar" tipo="submit" />
                        </div>
                    </form>
                </div>
            </div>

            {aviso && <Aviso mensaje={aviso} alCerrar={() => setAviso("")} />}
        </section>
    );
}

export default Login;