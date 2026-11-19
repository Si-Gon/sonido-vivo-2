import { API_GATEWAY, pedirConReintento, cabecerasConToken } from "./apiServicios";

// El servicio nunca devuelve la contraseña: solo viaja al registrar y al iniciar sesión.
export type Usuario = {
    id: number;
    nombre: string;
    rut: string;
    email: string;
    region: string;
    comuna: string;
    rol: Rol;
    activo: boolean;
};

export type Rol = "Cliente" | "Administrador";

/** Datos del registro público (queda como Cliente). */
export type UsuarioNuevo = {
    nombre: string;
    rut: string;
    email: string;
    region: string;
    comuna: string;
    password: string;
};

/** Alta desde el panel: además elige rol y estado. */
export type UsuarioAdministrado = UsuarioNuevo & { rol: Rol; activo: boolean };

export type ResultadoRegistro =
    | { ok: true; usuario: Usuario }
    | { ok: false; motivo: string };

export type ResultadoOperacion = ResultadoRegistro;

export type ResultadoLogin =
    | { ok: true; usuario: Usuario; token: string }
    | { ok: false; motivo: string };

/** Mensaje que mandó el servicio, o uno por defecto si no vino cuerpo. */
async function motivoDeError(respuesta: Response, porDefecto: string): Promise<string> {
    try {
        const cuerpo = (await respuesta.json()) as { motivo?: string };
        return cuerpo.motivo ?? porDefecto;
    } catch {
        return porDefecto;
    }
}

export async function listarUsuarios(): Promise<Usuario[]> {
    const respuesta = await pedirConReintento(`${API_GATEWAY}/api/usuarios`);

    if (!respuesta.ok) {
        throw new Error(`El servicio de usuarios respondió ${respuesta.status}.`);
    }

    return (await respuesta.json()) as Usuario[];
}

export async function obtenerUsuario(id: number): Promise<Usuario | undefined> {
    const respuesta = await pedirConReintento(`${API_GATEWAY}/api/usuarios/${id}`);

    if (!respuesta.ok) return undefined;

    return (await respuesta.json()) as Usuario;
}

/** Registro del sitio: el servicio lo deja como Cliente. */
export async function registrarUsuario(datos: UsuarioNuevo): Promise<ResultadoRegistro> {
    try {
        const respuesta = await pedirConReintento(`${API_GATEWAY}/api/usuarios`, {
            method: "POST",
            headers: cabecerasConToken(),
            body: JSON.stringify(datos)
        });

        if (respuesta.status === 201) {
            return { ok: true, usuario: (await respuesta.json()) as Usuario };
        }

        return { ok: false, motivo: await motivoDeError(respuesta, "No se pudo registrar la cuenta.") };
    } catch {
        return { ok: false, motivo: "No se pudo conectar con el servicio de usuarios." };
    }
}

/** Alta desde el panel: manda también el rol. */
export async function crearUsuarioAdministrado(datos: UsuarioAdministrado): Promise<ResultadoRegistro> {
    try {
        const respuesta = await pedirConReintento(`${API_GATEWAY}/api/usuarios`, {
            method: "POST",
            headers: cabecerasConToken(),
            body: JSON.stringify({ ...datos, activo: true })
        });

        if (respuesta.status === 201) {
            return { ok: true, usuario: (await respuesta.json()) as Usuario };
        }

        return { ok: false, motivo: await motivoDeError(respuesta, "No se pudo registrar el usuario.") };
    } catch {
        return { ok: false, motivo: "No se pudo conectar con el servicio de usuarios." };
    }
}

/** Login: compara la contraseña con el hash en el servicio. */
export async function validarCredenciales(email: string, password: string): Promise<ResultadoLogin> {
    try {
        const respuesta = await pedirConReintento(`${API_GATEWAY}/api/usuarios/login`, {
            method: "POST",
            headers: cabecerasConToken(),
            body: JSON.stringify({ email, password })
        });

        if (respuesta.ok) {
            // El login devuelve { token, usuario }: el token viaja en las siguientes peticiones.
            const cuerpo = (await respuesta.json()) as { token: string; usuario: Usuario };
            return { ok: true, usuario: cuerpo.usuario, token: cuerpo.token };
        }

        return { ok: false, motivo: await motivoDeError(respuesta, "Correo o contraseña incorrectos.") };
    } catch {
        return { ok: false, motivo: "No se pudo conectar con el servicio de usuarios." };
    }
}

export async function cambiarRolUsuario(id: number, rol: Rol): Promise<ResultadoOperacion> {
    return operacion(`/api/usuarios/${id}/rol`, { rol }, "No se pudo cambiar el rol.");
}

export async function cambiarEstadoUsuario(id: number, activo: boolean): Promise<ResultadoOperacion> {
    return operacion(`/api/usuarios/${id}/activo`, { activo }, "No se pudo cambiar el estado.");
}

async function operacion(ruta: string, cuerpo: object, porDefecto: string): Promise<ResultadoOperacion> {
    try {
        const respuesta = await pedirConReintento(`${API_GATEWAY}${ruta}`, {
            method: "PATCH",
            headers: cabecerasConToken(),
            body: JSON.stringify(cuerpo)
        });

        if (respuesta.ok) {
            return { ok: true, usuario: (await respuesta.json()) as Usuario };
        }

        return { ok: false, motivo: await motivoDeError(respuesta, porDefecto) };
    } catch {
        return { ok: false, motivo: "No se pudo conectar con el servicio de usuarios." };
    }
}
