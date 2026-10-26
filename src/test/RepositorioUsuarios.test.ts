import { beforeEach, describe, expect, test } from "vitest";
import {
    cambiarEstadoUsuario,
    cambiarRolUsuario,
    crearUsuarioAdministrado,
    listarUsuarios,
    registrarUsuario,
    validarCredenciales,
    type UsuarioNuevo,
} from "../datos/repositorioUsuarios";

const usuarioPrueba: UsuarioNuevo = {
    nombre: "Cliente de prueba",
    rut: "11.111.111-1",
    email: "cliente@prueba.cl",
    region: "Valparaíso",
    comuna: "San Felipe",
    password: "Clave123",
};

beforeEach(() => {
    localStorage.clear();
});

describe("repositorioUsuarios", () => {
    test("inicializa la lista con el administrador", () => {
        const usuarios = listarUsuarios();

        expect(usuarios).toHaveLength(1);
        expect(usuarios[0]).toMatchObject({
            id: 1,
            email: "admin@sonidovivo.cl",
            rol: "Administrador",
            activo: true,
        });
    });

    test("registra un usuario como cliente activo", () => {
        const resultado = registrarUsuario(usuarioPrueba);

        expect(resultado.ok).toBe(true);
        if (!resultado.ok) return;

        expect(resultado.usuario).toMatchObject({
            nombre: "Cliente de prueba",
            email: "cliente@prueba.cl",
            rol: "Cliente",
            activo: true,
        });
        expect(listarUsuarios()).toHaveLength(2);
    });

    test("normaliza el correo y el nombre al registrar", () => {
        const resultado = registrarUsuario({
            ...usuarioPrueba,
            nombre: "  Cliente Nuevo  ",
            email: "  CLIENTE@PRUEBA.CL  ",
        });

        expect(resultado.ok).toBe(true);
        if (!resultado.ok) return;

        expect(resultado.usuario.nombre).toBe("Cliente Nuevo");
        expect(resultado.usuario.email).toBe("cliente@prueba.cl");
    });

    test("rechaza un correo duplicado", () => {
        registrarUsuario(usuarioPrueba);

        const resultado = registrarUsuario({
            ...usuarioPrueba,
            rut: "11.111.111-1",
        });

        expect(resultado).toEqual({
            ok: false,
            motivo: "Ya existe una cuenta con ese correo.",
        });
    });

    test("rechaza un RUT duplicado aunque cambie el formato", () => {
        registrarUsuario(usuarioPrueba);

        const resultado = registrarUsuario({
            ...usuarioPrueba,
            email: "otro@prueba.cl",
            rut: "111111111",
        });

        expect(resultado).toEqual({
            ok: false,
            motivo: "Ya existe una cuenta con ese RUT.",
        });
    });

    test("valida las credenciales correctamente", () => {
        registrarUsuario(usuarioPrueba);

        expect(
            validarCredenciales(" CLIENTE@PRUEBA.CL ", "Clave123")?.nombre,
        ).toBe("Cliente de prueba");

        expect(
            validarCredenciales("cliente@prueba.cl", "incorrecta"),
        ).toBeUndefined();
    });

    test("crea un usuario administrado con el rol indicado", () => {
        const resultado = crearUsuarioAdministrado({
            ...usuarioPrueba,
            email: "admin.creado@prueba.cl",
            rut: "10.222.333-4",
            rol: "Administrador",
            activo: true,
        });

        expect(resultado.ok).toBe(true);
        if (!resultado.ok) return;

        expect(resultado.usuario.rol).toBe("Administrador");
        expect(resultado.usuario.activo).toBe(true);
    });

    test("cambia el rol de un usuario existente", () => {
        const creado = registrarUsuario(usuarioPrueba);
        expect(creado.ok).toBe(true);
        if (!creado.ok) return;

        const resultado = cambiarRolUsuario(creado.usuario.id, "Administrador");

        expect(resultado.ok).toBe(true);
        expect(
            listarUsuarios().find((u) => u.id === creado.usuario.id)?.rol,
        ).toBe("Administrador");
    });

    test("rechaza cambiar el rol de un usuario inexistente", () => {
        expect(cambiarRolUsuario(999, "Cliente")).toEqual({
            ok: false,
            motivo: "Usuario no encontrado.",
        });
    });

    test("activa y desactiva un usuario existente", () => {
        const creado = registrarUsuario(usuarioPrueba);
        expect(creado.ok).toBe(true);
        if (!creado.ok) return;

        const desactivado = cambiarEstadoUsuario(creado.usuario.id, false);
        expect(desactivado.ok).toBe(true);
        expect(
            listarUsuarios().find((u) => u.id === creado.usuario.id)?.activo,
        ).toBe(false);

        const activado = cambiarEstadoUsuario(creado.usuario.id, true);
        expect(activado.ok).toBe(true);
        expect(
            listarUsuarios().find((u) => u.id === creado.usuario.id)?.activo,
        ).toBe(true);
    });

    test("rechaza desactivar al último administrador activo", () => {
        const resultado = cambiarEstadoUsuario(1, false);

        expect(resultado).toEqual({
            ok: false,
            motivo: "No puedes desactivar al último administrador activo.",
        });
    });

    test("rechaza quitar el rol al último administrador activo", () => {
        const resultado = cambiarRolUsuario(1, "Cliente");

        expect(resultado).toEqual({
            ok: false,
            motivo: "No puedes quitar el rol al último administrador activo.",
        });
    });

    test("rechaza operaciones sobre usuarios inexistentes", () => {
        expect(cambiarEstadoUsuario(999, false)).toEqual({
            ok: false,
            motivo: "Usuario no encontrado.",
        });
    });

    test("rechaza un rol inválido", () => {
        const resultado = cambiarRolUsuario(1, "SuperAdmin" as never);

    expect(resultado).toEqual({
        ok: false,
        motivo: "El rol no es válido.",
    });
    });

    test("rechaza correos duplicados al crear usuarios administrados", () => {
        crearUsuarioAdministrado({
            ...usuarioPrueba,
            email: "admin.creado@prueba.cl",
            rut: "10.222.333-4",
            rol: "Cliente",
            activo: true,
        });

        const resultado = crearUsuarioAdministrado({
            ...usuarioPrueba,
            email: " ADMIN.CREADO@PRUEBA.CL ",
            rut: "10.222.333-5",
            rol: "Cliente",
            activo: true,
        });

        expect(resultado).toEqual({
            ok: false,
            motivo: "Ya existe una cuenta con ese correo.",
        });
    });

    test("rechaza RUT duplicados al crear usuarios administrados", () => {
        crearUsuarioAdministrado({
            ...usuarioPrueba,
            email: "primero@prueba.cl",
            rut: "10.222.333-4",
            rol: "Cliente",
            activo: true,
        });

        const resultado = crearUsuarioAdministrado({
            ...usuarioPrueba,
            email: "segundo@prueba.cl",
            rut: "102223334",
            rol: "Cliente",
            activo: true,
        });

        expect(resultado).toEqual({
            ok: false,
            motivo: "Ya existe una cuenta con ese RUT.",
        });
        });

    test("mantiene los usuarios guardados al volver a consultar el repositorio", () => {
        const resultado = registrarUsuario(usuarioPrueba);

        expect(resultado.ok).toBe(true);

        const usuariosGuardados = listarUsuarios();

        expect(usuariosGuardados).toHaveLength(2);
        expect(usuariosGuardados[1]).toMatchObject({
            nombre: "Cliente de prueba",
            email: "cliente@prueba.cl",
            rol: "Cliente",
            activo: true,
        });
    });
});