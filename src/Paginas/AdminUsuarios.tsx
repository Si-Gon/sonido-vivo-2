import { Fragment, useCallback, useEffect, useState } from "react";
import CampoFormulario from "../Componentes/moleculas/CampoFormulario";
import CampoSeleccion from "../Componentes/moleculas/CampoSeleccion";
import Boton from "../Componentes/atomos/Boton";
import Aviso from "../Componentes/atomos/Aviso";
import { validarRut, formatearRut } from "../utilidades/rut";
import {
    listarUsuarios,
    crearUsuarioAdministrado,
    cambiarRolUsuario as guardarCambioRol,
    cambiarEstadoUsuario,
    type Usuario,
    type Rol
} from "../datos/repositorioUsuarios";
import { ESTADOS_BOLETA, listarBoletasDeUsuario, type Boleta } from "../datos/repositorioBoletas";
import { regionesChile } from "../datos/regiones";
import { formatearFecha, formatearPrecio } from "../utilidades/formato";

function AdminUsuarios() {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [nombre, setNombre] = useState("");
    const [rut, setRut] = useState("");
    const [region, setRegion] = useState("");
    const [comuna, setComuna] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [rol, setRol] = useState<Rol>("Cliente");
    const [error, setError] = useState("");
    const [aviso, setAviso] = useState("");
    const [cargando, setCargando] = useState(true);
    const [historialDe, setHistorialDe] = useState<number | null>(null);
    const [compras, setCompras] = useState<Boleta[]>([]);
    const [cargandoCompras, setCargandoCompras] = useState(false);

    const regionSeleccionada = regionesChile.find((item) => item.nombre === region);

    const cargar = useCallback(async () => {
        try {
            setUsuarios(await listarUsuarios());
        } catch (err) {
            setError(err instanceof Error ? err.message : "No se pudo cargar la lista de usuarios.");
        } finally {
            setCargando(false);
        }
    }, []);

    useEffect(() => {
        void cargar();
    }, [cargar]);

    const alCambiarRut = (valor: string) => {
        setRut(formatearRut(valor));
    };

    const handleCrearUsuario = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!nombre.trim() || !rut.trim() || !email.trim() || !rol || !region || !comuna || !password.trim()) {
            setError("Todos los campos son obligatorios.");
            return;
        }

        if (!validarRut(rut)) {
            setError("El RUT ingresado no es válido.");
            return;
        }

        const correoNormalizado = email.trim().toLowerCase();

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoNormalizado)) {
            setError("Ingrese un correo electrónico válido.");
            return;
        }

        if (password.length < 8) {
            setError("La contraseña debe tener al menos 8 caracteres.");
            return;
        }

        // El servicio vuelve a validar RUT, correo y RUT repetido: acá solo se avisa antes.
        const resultado = await crearUsuarioAdministrado({
            nombre,
            rut,
            email: correoNormalizado,
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

        await cargar();
        setAviso("Usuario registrado exitosamente.");
        setNombre("");
        setRut("");
        setRegion("");
        setComuna("");
        setPassword("");
        setEmail("");
        setRol("Cliente");
    };

    const toggleEstadoUsuario = async (usuario: Usuario) => {
        setError("");
        const resultado = await cambiarEstadoUsuario(usuario.id, !usuario.activo);

        if (!resultado.ok) {
            setError(resultado.motivo);
            return;
        }

        await cargar();
        setAviso("Estado de usuario actualizado.");
    };

    const cambiarRolUsuario = async (id: number, nuevoRol: Rol) => {
        setError("");
        const resultado = await guardarCambioRol(id, nuevoRol);

        if (!resultado.ok) {
            setError(resultado.motivo);
            await cargar();
            return;
        }

        await cargar();
        setAviso("Rol actualizado correctamente.");
    };

    // El historial sale del servicio de boletas, no de una copia local.
    const verHistorial = async (usuario: Usuario) => {
        if (historialDe === usuario.id) {
            setHistorialDe(null);
            return;
        }

        setHistorialDe(usuario.id);
        setCargandoCompras(true);

        try {
            setCompras(await listarBoletasDeUsuario(usuario.id));
        } catch (err) {
            setCompras([]);
            setError(err instanceof Error ? err.message : "No se pudo cargar el historial de compras.");
        } finally {
            setCargandoCompras(false);
        }
    };

    return (
        <section className="sv-seccion sv-seccion-ancha">
            <h1>Gestión de Usuarios</h1>

            <div className="row g-4">
                <div className="col-12 col-lg-5">
                    <form className="sv-panel" onSubmit={handleCrearUsuario}>
                        <h2>Registrar Nuevo Usuario</h2>

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

                        <CampoSeleccion
                            etiqueta="Región"
                            nombre="region"
                            valor={region}
                            opciones={[
                                { valor: "", etiqueta: "Selecciona una región" },
                                ...regionesChile.map((item) => ({
                                    valor: item.nombre,
                                    etiqueta: item.nombre
                                }))
                            ]}
                            alCambiar={(valor) => {
                                setRegion(valor);
                                setComuna("");
                            }}
                        />

                        <CampoSeleccion
                            etiqueta="Comuna"
                            nombre="comuna"
                            valor={comuna}
                            opciones={[
                                { valor: "", etiqueta: "Selecciona una comuna" },
                                ...(regionSeleccionada?.comunas ?? []).map((nombreComuna) => ({
                                    valor: nombreComuna,
                                    etiqueta: nombreComuna
                                }))
                            ]}
                            alCambiar={setComuna}
                        />

                        <CampoFormulario
                            etiqueta="Contraseña"
                            tipo="password"
                            nombre="password"
                            valor={password}
                            marcador="Mínimo 8 caracteres"
                            alCambiar={setPassword}
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
                            alCambiar={(val) => setRol(val as Rol)}
                        />

                        <div className="mt-4">
                            <Boton texto="Registrar Usuario" tipo="submit" />
                        </div>
                    </form>
                </div>

                <div className="col-12 col-lg-7">
                    <div className="sv-panel">
                        <h2>Usuarios Registrados</h2>

                        {cargando ? (
                            <p className="mt-3">Cargando usuarios…</p>
                        ) : usuarios.length === 0 ? (
                            <p className="sv-sin-resultados mb-0">Todavía no hay usuarios registrados.</p>
                        ) : (
                            <div className="table-responsive mt-3">
                                <table className="table table-dark table-hover align-middle">
                                    <thead>
                                        <tr>
                                            <th>Nombre</th>
                                            <th>RUT</th>
                                            <th>Correo</th>
                                            <th>Rol</th>
                                            <th>Estado</th>
                                            <th>Compras</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {usuarios.map((usr) => (
                                            <Fragment key={usr.id}>
                                                <tr>
                                                    <td>{usr.nombre}</td>
                                                    <td>{formatearRut(usr.rut)}</td>
                                                    <td>{usr.email}</td>
                                                    <td>
                                                        <select
                                                            className="form-select form-select-sm bg-dark text-white border-secondary"
                                                            value={usr.rol}
                                                            aria-label={`Rol de ${usr.nombre}`}
                                                            onChange={(e) => void cambiarRolUsuario(usr.id, e.target.value as Rol)}
                                                        >
                                                            <option value="Cliente">Cliente</option>
                                                            <option value="Administrador">Administrador</option>
                                                        </select>
                                                    </td>
                                                    <td>
                                                        <span className={`badge ${usr.activo ? "bg-success" : "bg-danger"}`}>
                                                            {usr.activo ? "Activo" : "Inactivo"}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <button
                                                            className="btn btn-sm btn-outline-warning"
                                                            onClick={() => void verHistorial(usr)}
                                                        >
                                                            {historialDe === usr.id ? "Ocultar" : "Historial"}
                                                        </button>
                                                    </td>
                                                    <td>
                                                        <button
                                                            className={`btn btn-sm ${usr.activo ? "btn-outline-danger" : "btn-outline-success"}`}
                                                            onClick={() => void toggleEstadoUsuario(usr)}
                                                        >
                                                            {usr.activo ? "Desactivar" : "Activar"}
                                                        </button>
                                                    </td>
                                                </tr>

                                                {historialDe === usr.id && (
                                                    <tr>
                                                        <td colSpan={7}>
                                                            <p className="mb-2"><strong>Historial de compras de {usr.nombre}</strong></p>

                                                            {cargandoCompras ? (
                                                                <p className="mb-0">Cargando compras…</p>
                                                            ) : compras.length === 0 ? (
                                                                <p className="sv-sin-resultados mb-0">
                                                                    Este usuario todavía no tiene compras registradas.
                                                                </p>
                                                            ) : (
                                                                <div className="table-responsive">
                                                                    <table className="table table-sm table-dark align-middle mb-0">
                                                                        <thead>
                                                                            <tr>
                                                                                <th>Pedido</th>
                                                                                <th>Fecha</th>
                                                                                <th>Total</th>
                                                                                <th>Estado</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {compras.map((boleta) => (
                                                                                <tr key={boleta.id}>
                                                                                    <td>#{boleta.id}</td>
                                                                                    <td>{formatearFecha(boleta.fechaCreacion)}</td>
                                                                                    <td>{formatearPrecio(Number(boleta.total))}</td>
                                                                                    <td>
                                                                                        {ESTADOS_BOLETA.find((e) => e.valor === boleta.estado)?.etiqueta ?? boleta.estado}
                                                                                    </td>
                                                                                </tr>
                                                                            ))}
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            )}
                                                        </td>
                                                    </tr>
                                                )}
                                            </Fragment>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {aviso && <Aviso mensaje={aviso} alCerrar={() => setAviso("")} />}
        </section>
    );
}

export default AdminUsuarios;
