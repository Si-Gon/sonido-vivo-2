export type Novedad = {
    id: number;
    titulo: string;
    fecha: string;
    categoria: string;
    imagen: string;
    resumen: string;
    parrafos: string[];
};

export const novedades: Novedad[] = [
    {
        id: 1,
        titulo: "Sonido Vivo cumple 11 años acompañando a los músicos de la Región de Valparaíso",
        fecha: "2026-10-15",
        categoria: "Aniversario",
        imagen: "/img/carrusel/festival001.jpg",
        resumen: "Once años de mostrador, talleres y escenario. Lo celebramos con descuentos en instrumentos seleccionados y una jornada de música en vivo.",
        parrafos: [
            "En octubre de 2015 abrimos las puertas de Sonido Vivo en Viña del Mar con un mostrador, una vitrina de cuerdas y una idea clara: equipar a un músico no es venderle un instrumento, es ayudarlo a encontrar su sonido. Once años después el catálogo supera las 340 referencias y el equipo sigue siendo el mismo de siempre, el dueño y dos vendedores que conocen cada instrumento de la tienda.",
            "Para celebrarlo, durante toda la semana hay descuentos en guitarras acústicas y accesorios seleccionados, y el sábado cerramos con una jornada de música en vivo en el local. Trae tu instrumento: hay amplificadores, enchufes y espacio para tocar.",
            "Gracias a quienes compran, preguntan y vuelven. Once años de sonido vivo son, en el fondo, once años de su música."
        ]
    },
    {
        id: 2,
        titulo: "Ya puedes comprar en línea con el stock actualizado",
        fecha: "2026-10-08",
        categoria: "Tienda en línea",
        imagen: "/img/carrusel/instrumento001.avif",
        resumen: "El catálogo completo con precios y disponibilidad en tiempo real, y un carrito que respeta las unidades que hay en bodega.",
        parrafos: [
            "Hasta hace poco, la única forma de saber si una guitarra estaba disponible era escribirnos por WhatsApp y esperar respuesta. Ahora el catálogo completo está en línea, con el precio y las unidades disponibles de cada producto actualizadas al momento.",
            "El carrito no permite agregar más unidades de las que hay en bodega, así que no te vas a encontrar con la sorpresa de un producto agotado después de confirmar tu compra. Al registrar la venta, el stock se descuenta automáticamente y el equipo ve el cambio al instante.",
            "Seguimos atendiendo en el mesón de Viña del Mar, pero ya no hace falta llamar antes para consultar disponibilidad. Los clientes de otras ciudades pueden revisar el catálogo por su cuenta y hacer su pedido formal en línea."
        ]
    },
    {
        id: 3,
        titulo: "Taller de luthería: mantenimiento de instrumentos de cuerda",
        fecha: "2026-09-26",
        categoria: "Talleres",
        imagen: "/img/carrusel/lutheria001.webp",
        resumen: "Cuatro sábados para aprender a cambiar cuerdas, ajustar la acción y calibrar la afinación de tu guitarra o bajo.",
        parrafos: [
            "El taller de luthería nace de una pregunta que nos hacen todas las semanas: por qué mi guitarra dejó de sonar como antes. Durante cuatro sesiones de dos horas vamos a trabajar sobre instrumentos reales: cambio de cuerdas y limpieza del diapasón, ajuste del alma y de la acción, calibración de la octavación y afinación final.",
            "Las clases son presenciales en el local de Viña del Mar, los sábados de 10:00 a 12:00, con cupos limitados a ocho personas para que cada uno trabaje en su propio instrumento. No hace falta experiencia previa: trae tu guitarra o tu bajo y las herramientas las ponemos nosotros.",
            "Recordamos además que el servicio de reparación de instrumentos de cuerda sigue disponible en el mesón, con presupuesto sin costo."
        ]
    },
    {
        id: 4,
        titulo: "Llegó la línea de amplificadores Marshall",
        fecha: "2026-09-12",
        categoria: "Productos",
        imagen: "/img/productos/am002.webp",
        resumen: "El amplificador Marshall MG40GFX de 40 W con cuatro canales y efectos digitales ya está disponible en tienda.",
        parrafos: [
            "Sumamos a nuestro catálogo el amplificador Marshall MG40GFX: 40 W, cuatro canales conmutables, reverberación y efectos digitales integrados, pensado para ensayo y para tocar en vivo en espacios chicos.",
            "Puedes probarlo en el local con tu propia guitarra y, si prefieres comprarlo desde otra ciudad, el despacho se coordina el mismo día por Starken o Chilexpress con número de seguimiento.",
            "Es el complemento natural de las guitarras eléctricas que ya tenemos en catálogo y por estos días está con precio de lanzamiento."
        ]
    },
    {
        id: 5,
        titulo: "Despacho a todo Chile y retiro en tienda",
        fecha: "2026-08-29",
        categoria: "Despacho",
        imagen: "/img/productos/ga001.jpg",
        resumen: "Pedidos despachados por Starken y Chilexpress, o listos para retirar en Viña del Mar el mismo día.",
        parrafos: [
            "Los pedidos que llegan desde otras ciudades se despachan por Starken o Chilexpress y siempre viajan con número de seguimiento, que enviamos apenas el paquete sale de bodega.",
            "Si prefieres retirar, puedes pasar por el local de Viña del Mar: los instrumentos se guardan embalados y el retiro se coordina el mismo día. Para instrumentos grandes, como baterías o pianos digitales, te recomendamos escribirnos antes para reservar el espacio de carga.",
            "Cada instrumento se embala con protección para cuerdas, herrajes y clavijero antes de salir, y las cajas viajan identificadas con el número de pedido."
        ]
    }
];

export const categoriasDeNovedades: string[] = [...new Set(novedades.map((novedad) => novedad.categoria))];

export function buscarNovedad(id: number): Novedad | undefined {
    return novedades.find((novedad) => novedad.id === id);
}

export function novedadesPorFecha(): Novedad[] {
    return [...novedades].sort((primera, segunda) => segunda.fecha.localeCompare(primera.fecha));
}
