const clave = "usuarios";

export type Rol = "Cliente" | "Administrador";

export type Usuario = {
    id: number;
    nombre: string;
    rut: string;
    email: string;
    region: string;
    comuna: string;
    password: string;
    rol: Rol;
    activo: boolean;
};

export type UsuarioNuevo = Omit<Usuario, "id" | "rol" | "activo">;

export type ResultadoRegistro =
    | { ok: true; usuario: Usuario }
    | { ok: false; motivo: string };

export type ResultadoOperacion =
    | { ok: true; usuario: Usuario }
    | { ok: false; motivo: string };

const administrador: Usuario = {
    id: 1,
    nombre: "Administrador",
    rut: "12.345.678-5",
    email: "admin@sonidovivo.cl",
    region: "",
    comuna: "",
    password: "admin123",
    rol: "Administrador",
    activo: true
};

const normalizarEmail = (email: string) => email.trim().toLowerCase();
const limpiarRut = (rut: string) => rut.replace(/[^0-9kK]/g, "").toUpperCase();

function leerGuardados(): Usuario[] {
    const guardado = localStorage.getItem(clave);
    if (!guardado) return [];

    try {
        const datos = JSON.parse(guardado);
        return Array.isArray(datos) ? (datos as Usuario[]) : [];
    } catch {
        return [];
    }
}

function guardarUsuarios(usuarios: Usuario[]) {
    localStorage.setItem(clave, JSON.stringify(usuarios));
}

export function listarUsuarios(): Usuario[] {
    if (localStorage.getItem(clave) === null) {
        guardarUsuarios([administrador]);
    }
    return leerGuardados();
}

export function registrarUsuario(datos: UsuarioNuevo): ResultadoRegistro {
    const usuarios = listarUsuarios();
    const email = normalizarEmail(datos.email);

    if (usuarios.some((u) => u.email === email)) {
        return { ok: false, motivo: "Ya existe una cuenta con ese correo." };
    }
    if (usuarios.some((u) => limpiarRut(u.rut) === limpiarRut(datos.rut))) {
        return { ok: false, motivo: "Ya existe una cuenta con ese RUT." };
    }

    const siguienteId = usuarios.reduce((mayor, u) => Math.max(mayor, u.id), 0) + 1;
    const usuario: Usuario = {
        ...datos,
        id: siguienteId,
        nombre: datos.nombre.trim(),
        email,
        rol: "Cliente",
        activo: true
    };

    guardarUsuarios([...usuarios, usuario]);
    return { ok: true, usuario };
}

export function validarCredenciales(email: string, password: string): Usuario | undefined {
    const correo = normalizarEmail(email);
    return listarUsuarios().find((u) => u.email === correo && u.password === password);
}

export function crearUsuarioAdministrado(
    datos: Omit<Usuario, "id">
): ResultadoRegistro {
    const usuarios = listarUsuarios();
    const email = normalizarEmail(datos.email);

    if (!esRolValido(datos.rol)) {
        return { ok: false, motivo: "El rol no es válido." };
    }

    if (usuarios.some((u) => normalizarEmail(u.email) === email)) {
        return { ok: false, motivo: "Ya existe una cuenta con ese correo." };
    }

    if (usuarios.some((u) => limpiarRut(u.rut) === limpiarRut(datos.rut))) {
        return { ok: false, motivo: "Ya existe una cuenta con ese RUT." };
    }

    const usuario: Usuario = {
        ...datos,
        id: usuarios.reduce((mayor, u) => Math.max(mayor, u.id), 0) + 1,
        nombre: datos.nombre.trim(),
        email,
    };

    guardarUsuarios([...usuarios, usuario]);

    return { ok: true, usuario };
}

export function cambiarRolUsuario(
    id: number,
    rol: Rol
): ResultadoOperacion {
    if (!esRolValido(rol)) {
        return { ok: false, motivo: "El rol no es válido." };
    }

    const usuarios = listarUsuarios();
    const usuario = usuarios.find((u) => u.id === id);

    if (!usuario) {
        return { ok: false, motivo: "Usuario no encontrado." };
    }

    if (
        usuario.activo &&
        usuario.rol === "Administrador" &&
        rol !== "Administrador" &&
        !usuarios.some(
            (u) => u.id !== id && u.activo && u.rol === "Administrador"
        )
    ) {
        return {
            ok: false,
            motivo: "No puedes quitar el rol al último administrador activo."
        };
    }

    const actualizados = usuarios.map((u) =>
        u.id === id ? { ...u, rol } : u
    );

    guardarUsuarios(actualizados);

    return {
        ok: true,
        usuario: actualizados.find((u) => u.id === id)!
    };
}

export function cambiarEstadoUsuario(
    id: number,
    activo: boolean
): ResultadoOperacion {
    const usuarios = listarUsuarios();
    const usuario = usuarios.find((u) => u.id === id);

    if (!usuario) {
        return { ok: false, motivo: "Usuario no encontrado." };
    }

    if (
        !activo &&
        usuario.activo &&
        usuario.rol === "Administrador" &&
        !usuarios.some(
            (u) => u.id !== id && u.activo && u.rol === "Administrador"
        )
    ) {
        return {
            ok: false,
            motivo: "No puedes desactivar al último administrador activo."
        };
    }

    const actualizados = usuarios.map((u) =>
        u.id === id ? { ...u, activo } : u
    );

    guardarUsuarios(actualizados);

    return {
        ok: true,
        usuario: actualizados.find((u) => u.id === id)!
    };
}

function esRolValido(rol: unknown): rol is Rol {
    return rol === "Cliente" || rol === "Administrador";
}