# Sonido Vivo · sitio en React + Vite + TypeScript

Sitio de la tienda de instrumentos musicales Sonido Vivo (Viña del Mar, Región de Valparaíso),
migrado desde las páginas HTML de la primera evaluación a componentes de React. Incluye catálogo con
filtros, carrito con control de stock, compra con despacho o retiro, novedades, contacto, registro e
inicio de sesión con roles, y panel de administración de pedidos, productos, movimientos de stock,
usuarios y mensajes.

Construido con React, Vite, TypeScript, React Router, Bootstrap y Atomic Design. Los datos de negocio
**no** viven en el navegador: el sitio consume los microservicios del repositorio `sonido-vivo-servicios`
a través de un gateway.

## Requisitos

* Node.js 20 o superior (probado con 24.17.0)
* npm
* Los servicios del repositorio `servicios` compilados y arriba (ver más abajo), con MySQL disponible

## Cómo ejecutarlo

Primero los servicios, en este orden: `config` (8888) → `eureka` (8761) → `catalogo` (8091),
`usuarios` (8092), `boletas` (8093), `despachos` (8094), `mensajeria` (8095) → `gateway` (8090).

Después el sitio:

```
npm install
npm run dev
```

El sitio queda disponible en `http://localhost:5173`. Sin el gateway arriba, el catálogo y el panel
muestran errores de conexión: todas las llamadas pasan por `http://localhost:8090`.

## Comandos

|Comando|Qué hace|
|-|-|
|`npm run dev`|Levanta el sitio en modo desarrollo|
|`npm run build`|Compila TypeScript y genera la versión de producción en `dist/`|
|`npm run preview`|Sirve la versión de producción|
|`npm run test`|Ejecuta las pruebas con Vitest y React Testing Library|
|`npm run test:watch`|Ejecuta las pruebas en modo interactivo|
|`npm run test:coverage`|Ejecuta las pruebas y genera el reporte en `coverage/`|
|`npm run lint`|Revisa el código con ESLint|

## Rutas

|Ruta|Vista|Acceso|
|-|-|-|
|`/`|Inicio|Público|
|`/nosotros`|Nosotros|Público|
|`/catalogo`|Catálogo con filtros de categoría y búsqueda|Público|
|`/ofertas`|Ofertas: productos con descuento|Público|
|`/producto/:id`|Detalle del producto|Público|
|`/carrito`|Carrito y pago|Público|
|`/despacho/:id`|Datos de entrega del pedido: domicilio o retiro|Público|
|`/compra-exitosa/:id`|Confirmación y comprobante de la compra|Público|
|`/pago-error`|Aviso de pago no realizado|Público|
|`/novedades`|Novedades|Público|
|`/novedad/:id`|Detalle de la novedad|Público|
|`/contacto`|Contacto con formulario y mapa|Público|
|`/login`|Inicio de sesión|Público|
|`/registro`|Crear cuenta|Público|
|`/admin`|Panel con el resumen de la tienda|Solo administrador|
|`/admin/pedidos`|Pedidos, sus estados y detalle de líneas|Solo administrador|
|`/admin/productos`|Productos: alta, edición, stock y baja|Solo administrador|
|`/admin/movimientos`|Historial de stock con filtros y enlace a la boleta|Solo administrador|
|`/admin/usuarios`|Usuarios: alta, rol, estado e historial de compras|Solo administrador|
|`/admin/mensajes`|Bandeja de mensajes del formulario de contacto|Solo administrador|
|`/admin/mensajes/:id`|Detalle de un mensaje|Solo administrador|
|`/admin/perfil`|Perfil del administrador|Solo administrador|
|`*`|Página no encontrada|Público|

Las rutas de administración pasan por `RutaPrivada`, que exige sesión iniciada con rol
`Administrador`; sin sesión redirige al login, y con sesión de cliente redirige al catálogo.

## Estructura

```
src/
├── Componentes/
│   ├── atomos/         Aviso, Boton, Icono, Input, Select
│   ├── moleculas/      CampoFormulario, CampoSeleccion, CardNovedad, CardProducto, ItemCarrito
│   └── organismos/     Carrusel, FiltrosCatalogo, LayoutAdmin, LayoutPublico, Navbar,
│                       NavbarAdmin, PiePagina, RutaPrivada
├── Paginas/            una página por ruta, incluida la administración
├── datos/              clientes de los servicios, carrito, sesión y datos fijos
│                       (novedades, historia, regiones)
├── utilidades/         formato de precios y fechas, validación y formato de RUT
└── test/               pruebas con Vitest y React Testing Library
```

## Cómo se conecta con los servicios

Todas las llamadas pasan por el gateway (`http://localhost:8090`), que reparte cada ruta al
microservicio correspondiente. La dirección vive en un solo lugar (`datos/apiServicios.ts`), así que
cambiar de puerto no obliga a tocar pantallas.

| Módulo de `datos/` | Servicio | Rutas que usa |
|---|---|---|
| `repositorioCatalogo.ts` | catálogo | `/api/productos`, `/api/categorias`, `/api/movimientos` |
| `repositorioUsuarios.ts` | usuarios | `/api/usuarios`, `/api/usuarios/login`, `/{id}/rol`, `/{id}/activo` |
| `repositorioBoletas.ts` | boletas | `/api/pedidos`, `/api/pedidos/{id}`, `/{id}/estado` |
| `repositorioDespachos.ts` | despachos | `/api/despachos`, `/api/despachos/pedido/{id}` |
| `repositorioMensajes.ts` | mensajería | `/api/contacto` |

`pedirConReintento` envuelve las llamadas: si el gateway responde **503/504** (servicio que acaba de
arrancar y todavía no está en la lista de Eureka) reintenta solo, con espera creciente. Un `4xx` nunca
se reintenta, porque es una respuesta del negocio y hay que mostrarla.

Los paneles de pedidos y el resumen se refrescan solos cada 15 segundos mientras la pestaña está
visible, para que un cambio hecho en otro equipo aparezca sin recargar la página.

## Persistencia

Los datos de negocio viven en MySQL, del lado de los servicios: productos, stock y su historial,
usuarios, boletas, despachos y mensajes. En el navegador solo queda estado de la sesión y del
carrito:

|Clave en `localStorage`|Contenido|Módulo|
|-|-|-|
|`sesion`|Sesión activa: id, nombre, correo y rol|`sesion.ts`|
|`carrito`|Ítems del carrito mientras se compra|`carrito.ts`|
|`productos`|Copia del catálogo para pintar el sitio rápido; la fuente es el servicio|`repositorioProductos.ts`|

La sesión se guarda porque el gateway no emite tokens en este proyecto: es la identificación mínima
para que la barra de navegación y las rutas protegidas sepan quién está conectado.

### Flujo de una compra

1. El carrito valida el stock contra el servicio de catálogo.
2. Se emite la boleta (`POST /api/pedidos`): el servicio calcula subtotales y total.
3. El stock baja como `SALIDA` del kardex, con `PEDIDO-<id>` como referencia.
4. Si el descuento falla, se cancela la boleta y el catálogo devuelve solo lo que esa referencia
   había vendido (transacción compensatoria).
5. El cliente completa la entrega (domicilio o retiro) y se registra en el servicio de despachos.
6. El comprobante y el panel leen la boleta y el despacho desde los servicios.

### Usuario de administración

La primera cuenta la crea el servicio de usuarios cuando su base está vacía:

```
correo:     admin@sonidovivo.cl
contraseña: admin123
```

Se puede cambiar con la propiedad `usuarios.admin.password` en la configuración del servicio. La
contraseña se guarda cifrada con BCrypt; el front nunca la guarda ni la recibe de vuelta.

## Sesión y roles

`sesion.ts` guarda la sesión en `localStorage` y expone un hook `useSesion` para que la barra de
navegación y las rutas protegidas reaccionen al cambio sin recargar. Hay dos roles: `Cliente` y
`Administrador`. El panel de administración usa su propia barra (`NavbarAdmin`), con acceso a
pedidos, productos, movimientos, usuarios y mensajes, y un enlace para volver al sitio público.

## Pruebas

Quince casos en trece archivos, con Vitest, React Testing Library y jsdom. Cubren renderizado,
propiedades, listas completas, eventos, validaciones de formulario, comportamiento condicional, las
cuatro operaciones del CRUD, filtros de búsqueda y categoría, navegación con parámetro de ruta y
responsividad. Las pruebas del carrito y del registro simulan las respuestas de los servicios, así
que no necesitan el backend levantado.

```
npm run test            # 13 archivos, 15 pruebas
npm run test:coverage   # además genera coverage/index.html
```

## Diseño

Interfaz con tema oscuro y Bootstrap 5 como base de la grilla y los componentes de formulario. La
organización sigue Atomic Design, con propiedades tipadas en cada componente. El contenedor principal
usa `min(1800px, 92%)`, de modo que el contenido aprovecha el ancho de la pantalla sin estirar los
párrafos en monitores grandes, y las secciones destacadas usan franjas a sangre completa.

## Integrantes

* Silvio Gonzalves (Si-Gon)
* Oscar Garrido (oscargarrido29)
* Maximiliano Quezada (Cachantun82)
