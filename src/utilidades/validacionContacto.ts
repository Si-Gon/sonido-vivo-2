// Reglas de validacion del formulario de contacto, separadas de la pantalla
// para poder probarlas y para que el componente quede facil de leer.

export type DatosContacto = {
    nombre: string;
    email: string;
    region: string;
    comuna: string;
    mensaje: string;
};

export type CampoContacto = keyof DatosContacto;
export type ErroresContacto = Partial<Record<CampoContacto, string>>;

export const MAXIMO_NOMBRE = 150;
export const MAXIMO_CORREO = 150;
export const MINIMO_MENSAJE = 15;
export const MAXIMO_MENSAJE = 500;

const SOLO_LETRAS = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' -]+$/;
const FORMATO_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validarCampo(campo: CampoContacto, datos: DatosContacto): string | undefined {
    const valor = datos[campo].trim();

    if (campo === "nombre") {
        if (!valor) return "Escribe tu nombre.";
        if (valor.length < 3) return "El nombre debe tener al menos 3 caracteres.";
        if (valor.length > MAXIMO_NOMBRE) return `El nombre no puede superar los ${MAXIMO_NOMBRE} caracteres.`;
        if (!SOLO_LETRAS.test(valor)) return "El nombre solo puede tener letras y espacios.";
        return undefined;
    }

    if (campo === "email") {
        if (!valor) return "Escribe tu correo electrónico.";
        if (valor.length > MAXIMO_CORREO) return `El correo no puede superar los ${MAXIMO_CORREO} caracteres.`;
        if (!FORMATO_CORREO.test(valor)) return "El correo no tiene un formato válido (ejemplo: nombre@dominio.cl).";
        return undefined;
    }

    if (campo === "region") {
        return valor ? undefined : "Selecciona una región.";
    }

    if (campo === "comuna") {
        if (!datos.region.trim()) return "Selecciona primero una región.";
        return valor ? undefined : "Selecciona una comuna.";
    }

    // mensaje
    if (!valor) return "Escribe tu mensaje.";
    if (valor.length < MINIMO_MENSAJE) return `Cuéntanos un poco más: al menos ${MINIMO_MENSAJE} caracteres.`;
    if (valor.length > MAXIMO_MENSAJE) return `El mensaje no puede superar los ${MAXIMO_MENSAJE} caracteres.`;
    return undefined;
}

export function validarContacto(datos: DatosContacto): ErroresContacto {
    const errores: ErroresContacto = {};
    const campos: CampoContacto[] = ["nombre", "email", "region", "comuna", "mensaje"];

    for (const campo of campos) {
        const error = validarCampo(campo, datos);
        if (error) errores[campo] = error;
    }

    return errores;
}
