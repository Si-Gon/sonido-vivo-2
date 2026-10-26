import { useState } from "react";
import CampoFormulario from "../Componentes/moleculas/CampoFormulario";
import CampoSeleccion from "../Componentes/moleculas/CampoSeleccion";
import Boton from "../Componentes/atomos/Boton";
import Aviso from "../Componentes/atomos/Aviso";
import { validarRut, formatearRut } from "../utilidades/rut";
import { listarUsuarios, crearUsuarioAdministrado, cambiarRolUsuario as guardarCambioRol, cambiarEstadoUsuario, type Usuario, type Rol } from "../datos/repositorioUsuarios";

type Props = {
    incrustado?: boolean;
};

function AdminUsuarios({ incrustado }: Props) {
    const Titulo = incrustado ? "h2" : "h1";
    const Subtitulo = incrustado ? "h3" : "h2";
    const [usuarios, setUsuarios] = useState<Usuario[]>(() => listarUsuarios());
    const [nombre, setNombre] = useState("");
    const [rut, setRut] = useState("");
    const [region, setRegion] = useState("");
    const [comuna, setComuna] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [rol, setRol] = useState<"Cliente" | "Administrador">("Cliente");
    const [error, setError] = useState("");
    const [aviso, setAviso] = useState("");

    const alCambiarRut = (valor: string) => {
        setRut(formatearRut(valor));
    };

    const handleCrearUsuario = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!nombre.trim() || !rut.trim() || !email.trim() || !rol) {
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

        const resultado = crearUsuarioAdministrado({
            nombre,
            rut,
            email,
            region,
            comuna,
            password,
            rol,
            activo: true
        });

        if (!resultado.ok) {
            setError(resultado.motivo);
            return;
        }



        setUsuarios(listarUsuarios());
        setAviso("Usuario registrado exitosamente.");
        setNombre("");
        setRut("");
        setRegion("");
        setComuna("");
        setPassword("");
        setEmail("");
        setRol("Cliente");
    };

    const toggleEstadoUsuario = (usuario: Usuario) => {
        const resultado = cambiarEstadoUsuario(usuario.id, !usuario.activo);

        if (!resultado.ok) {
            setError(resultado.motivo);
            return;
        }
        
        setUsuarios(listarUsuarios());
        setAviso("Estado de usuario actualizado.");
    };

    const cambiarRolUsuario = (id: number, nuevoRol : Rol) => {
        const resultado = guardarCambioRol(id, nuevoRol);

        if (!resultado.ok) {
            setError(resultado.motivo);
            setUsuarios(listarUsuarios());
            return;
        }
        
        setUsuarios(listarUsuarios());
        setError("");
        setAviso("Rol actualizado correctamente.");
    };

    return (
        <section className="sv-seccion sv-seccion-ancha">
            <Titulo>Gestión de Usuarios</Titulo>

            <div className="row g-4">
                <div className="col-12 col-lg-5">
                    <form className="sv-panel" onSubmit={handleCrearUsuario}>
                        <Subtitulo>Registrar Nuevo Usuario</Subtitulo>

                        {error && <p className="text-danger mb-3">{error}</p>}

                        <CampoFormulario
                            etiqueta="Nombre completo"
                            tipo="text"
                            nombre="nombre"
                            valor={nombre}
                            marcador="Ej: Carlos Tapia"
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
                            etiqueta="Rol asignado"
                            nombre="rol"
                            valor={rol}
                            opciones={[
                                { valor: "Cliente", etiqueta: "Cliente" },
                                { valor: "Administrador", etiqueta: "Administrador" }
                            ]}
                            alCambiar={(val) => setRol(val as "Cliente" | "Administrador")}
                        />

                        <div className="mt-4">
                            <Boton texto="Registrar Usuario" tipo="submit" />
                        </div>
                    </form>
                </div>

                <div className="col-12 col-lg-7">
                    <div className="sv-panel">
                        <Subtitulo>Usuarios Registrados</Subtitulo>
                        <div className="table-responsive mt-3">
                            <table className="table table-dark table-hover align-middle">
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>RUT</th>
                                        <th>Correo</th>
                                        <th>Rol</th>
                                        <th>Estado</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {usuarios.map((usr) => (
                                        <tr key={usr.id}>
                                            <td>{usr.nombre}</td>
                                            <td>{usr.rut}</td>
                                            <td>{usr.email}</td>
                                            <td>
                                                <select
                                                    className="form-select form-select-sm bg-dark text-white border-secondary"
                                                    value={usr.rol}
                                                    onChange={(e) =>
                                                        cambiarRolUsuario(
                                                            usr.id,
                                                            e.target.value as "Cliente" | "Administrador"
                                                        )
                                                    }
                                                >
                                                    <option value="Cliente">Cliente</option>
                                                    <option value="Administrador">Administrador</option>
                                                </select>
                                            </td>
                                            <td>
                                                <span
                                                    className={`badge ${
                                                        usr.activo ? "bg-success" : "bg-danger"
                                                    }`}
                                                >
                                                    {usr.activo ? "Activo" : "Inactivo"}
                                                </span>
                                            </td>
                                            <td>
                                                <button
                                                    className={`btn btn-sm ${
                                                        usr.activo ? "btn-outline-danger" : "btn-outline-success"
                                                    }`}
                                                    onClick={() => toggleEstadoUsuario(usr)}
                                                >
                                                    {usr.activo ? "Desactivar" : "Activar"}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {aviso && <Aviso mensaje={aviso} alCerrar={() => setAviso("")} />}
        </section>
    );
}

export default AdminUsuarios;