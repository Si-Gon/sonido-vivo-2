import { useState } from "react";
import CampoFormulario from "../Componentes/moleculas/CampoFormulario";
import CampoSeleccion from "../Componentes/moleculas/CampoSeleccion";
import Boton from "../Componentes/atomos/Boton";
import Aviso from "../Componentes/atomos/Aviso";
import { validarRut, formatearRut } from "../utilidades/rut";

interface Usuario {
    id: number;
    nombre: string;
    rut: string;
    email: string;
    rol: "Cliente" | "Administrador";
    activo: boolean;
}

const usuariosIniciales: Usuario[] = [
    {
        id: 1,
        nombre: "Administrador",
        rut: "12.345.678-5",
        email: "admin@sonidovivo.cl",
        rol: "Administrador",
        activo: true
    }
];

function AdminUsuarios() {
    const [usuarios, setUsuarios] = useState<Usuario[]>(usuariosIniciales);
    const [nombre, setNombre] = useState("");
    const [rut, setRut] = useState("");
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

        const nuevoUsuario: Usuario = {
            id: Date.now(),
            nombre,
            rut,
            email,
            rol,
            activo: true
        };

        setUsuarios([...usuarios, nuevoUsuario]);
        setAviso("Usuario registrado exitosamente.");
        setNombre("");
        setRut("");
        setEmail("");
        setRol("Cliente");
    };

    const toggleEstadoUsuario = (id: number) => {
        setUsuarios(
            usuarios.map((u) =>
                u.id === id ? { ...u, activo: !u.activo } : u
            )
        );
        setAviso("Estado de usuario actualizado.");
    };

    const cambiarRolUsuario = (id: number, nuevoRol: "Cliente" | "Administrador") => {
        setUsuarios(
            usuarios.map((u) =>
                u.id === id ? { ...u, rol: nuevoRol } : u
            )
        );
        setAviso("Rol actualizado correctamente.");
    };

    return (
        <section className="sv-seccion sv-seccion-ancha">
            <h1>Gestión de Usuarios</h1>

            <div className="row g-4">
                <div className="col-12 col-lg-5">
                    <form className="sv-panel" onSubmit={handleCrearUsuario}>
                        <h3>Registrar Nuevo Usuario</h3>

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
                        <h3>Usuarios Registrados</h3>
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
                                                    onClick={() => toggleEstadoUsuario(usr.id)}
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