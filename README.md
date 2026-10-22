# Sonido Vivo · sitio en React + Vite + TypeScript

Sitio de la tienda de instrumentos musicales Sonido Vivo (Viña del Mar, Región de Valparaíso),
construido con React, Vite, TypeScript, React Router y Bootstrap, organizado con Atomic Design.

## Cómo ejecutarlo

```
npm install
npm run dev
```

## Comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` | Levanta el sitio en modo desarrollo |
| `npm run build` | Genera la versión de producción en `dist/` |
| `npm run preview` | Sirve la versión de producción |
| `npm run test` | Ejecuta las pruebas con Vitest y React Testing Library |
| `npm run test:coverage` | Ejecuta las pruebas y genera el reporte de cobertura |
| `npm run lint` | Revisa el código con ESLint |

## Estructura

```
src/
├── Componentes/
│   ├── atomos/         Boton, Input, Select, Aviso, Icono
│   ├── moleculas/      CardProducto, CardNovedad, CampoFormulario, CampoSeleccion, ItemCarrito
│   └── organismos/     Navbar, NavbarAdmin, PiePagina, Carrusel, FiltrosCatalogo, layouts
├── Paginas/            una página por ruta
├── datos/              módulos de datos: productos, novedades, historia, carrito, repositorio
├── utilidades/         formateo de precios y fechas
└── test/               pruebas con Vitest + React Testing Library
```

## Datos

El catálogo se sirve desde `src/datos/repositorioProductos.ts`, que actúa como fuente de datos
simulada y mantiene los productos en `localStorage` (clave `productos`), de modo que el alta,
la edición, la eliminación y el descuento de stock por venta quedan disponibles para el panel
de administración sin base de datos.
