# Sonido Vivo · sitio en React + Vite + TypeScript

Sitio de la tienda de instrumentos musicales Sonido Vivo (Viña del Mar, Región de Valparaíso),
migrado desde las páginas HTML de la primera evaluación a componentes de React. Incluye catálogo con
filtros, carrito con control de stock, compra con despacho, novedades, contacto con mapa, registro e
inicio de sesión con roles, y panel de administración de productos, usuarios y pedidos.

Construido con React, Vite, TypeScript, React Router, Bootstrap y Atomic Design.

## Requisitos

- Node.js 20 o superior (probado con 24.17.0)
- npm

## Cómo ejecutarlo

```
npm install
npm run dev
```

El sitio queda disponible en `http://localhost:5173`.

## Comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` | Levanta el sitio en modo desarrollo |
| `npm run build` | Compila TypeScript y genera la versión de producción en `dist/` |
| `npm run preview` | Sirve la versión de producción |
| `npm run test` | Ejecuta las pruebas con Vitest y React Testing Library |
| `npm run test:watch` | Ejecuta las pruebas en modo interactivo |
| `npm run test:coverage` | Ejecuta las pruebas y genera el reporte en `coverage/` |
| `npm run lint` | Revisa el código con ESLint |

## Rutas

| Ruta | Vista | Acceso |
|---|---|---|
| `/` | Inicio | Público |
| `/nosotros` | Nosotros | Público |
| `/catalogo` | Catálogo con filtros de categoría y búsqueda | Público |
| `/producto/:id` | Detalle del producto | Público |
| `/carrito` | Carrito y pago | Público |
| `/despacho/:id` | Datos de despacho del pedido | Público |
| `/novedades` | Novedades | Público |
| `/novedad/:id` | Detalle de la novedad | Público |
| `/contacto` | Contacto con formulario y mapa | Público |
| `/login` | Inicio de sesión | Público |
| `/registro` | Crear cuenta | Público |
| `/admin` | Redirige a `/admin/pedidos` | Solo administrador |
| `/admin/pedidos` | Gestión de pedidos y sus estados | Solo administrador |
| `/admin/productos` | Gestión de productos: alta, edición y baja | Solo administrador |
| `/admin/usuarios` | Gestión de usuarios: alta, rol y estado | Solo administrador |
| `*` | Página no encontrada | Público |

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
├── datos/              fuente de datos simulada: productos, usuarios, pedidos, carrito,
│                       sesión, novedades, historia y regiones
├── utilidades/         formato de precios y fechas, validación y formato de RUT
└── test/               pruebas con Vitest y React Testing Library
```

## Datos

No hay backend: la fuente de datos es un conjunto de módulos en `src/datos/` que se persiste en
`localStorage`, de modo que los cambios del panel sobreviven a la recarga sin base de datos.

| Clave en `localStorage` | Contenido | Módulo |
|---|---|---|
| `productos` | Catálogo (51 productos) y su stock | `repositorioProductos.ts` |
| `usuarios` | Usuarios registrados, con rol y estado | `repositorioUsuarios.ts` |
| `sonido-vivo:pedidos` | Pedidos con sus datos de despacho y estado | `repositorioPedidos.ts` |
| `carrito` | Ítems del carrito | `carrito.ts` |
| `sesion` | Sesión activa | `sesion.ts` |

Los repositorios exponen las operaciones que usa la interfaz: el de productos implementa el CRUD
completo más el descuento de stock al confirmar una compra; el de usuarios registra, valida
credenciales y administra rol y estado; el de pedidos crea el pedido, guarda el despacho y cambia su
estado (Pendiente de despacho, En preparación, Despachado, Entregado, Cancelado).

### Usuario de administración

Para entrar al panel, el proyecto siembra un administrador:

```
correo:     admin@sonidovivo.cl
contraseña: admin123
```

## Sesión y roles

`sesion.ts` guarda la sesión en `localStorage` y expone un hook `useSesion` para que la barra de
navegación y las rutas protegidas reaccionen al cambio sin recargar. Hay dos roles: `Cliente` y
`Administrador`. El panel de administración usa su propia barra (`NavbarAdmin`), con acceso a
pedidos, productos y usuarios, y un enlace para volver al sitio público.

## Pruebas

Quince casos en trece archivos, con Vitest, React Testing Library y jsdom. Cubren renderizado,
propiedades, listas completas, eventos, validaciones de formulario, comportamiento condicional, las
cuatro operaciones del CRUD, filtros de búsqueda y categoría, navegación con parámetro de ruta y
responsividad.

```
npm run test            # 13 archivos, 15 pruebas
npm run test:coverage   # además genera coverage/index.html
```

La cobertura actual es de 53,43 % de líneas. Las pantallas de administración y el despacho no tienen
pruebas propias y quedan declaradas como pendientes en el documento de testing de la entrega.

## Diseño

Interfaz con tema oscuro y Bootstrap 5 como base de la grilla y los componentes de formulario. La
organización sigue Atomic Design, con propiedades tipadas en cada componente. El contenedor principal
usa `min(1800px, 92%)`, de modo que el contenido aprovecha el ancho de la pantalla sin estirar los
párrafos en monitores grandes, y las secciones destacadas usan franjas a sangre completa.

## Integrantes

- Silvio Gonzalves (Si-Gon)
- Oscar Garrido (oscargarrido29)
- Maximiliano Quezada (Cachantun82)
