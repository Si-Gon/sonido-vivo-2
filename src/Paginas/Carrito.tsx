import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Aviso from "../Componentes/atomos/Aviso";
import Boton from "../Componentes/atomos/Boton";
import ItemCarrito from "../Componentes/moleculas/ItemCarrito";
import { agregarAlCarrito, contarUnidades, leerCarrito, mensajeDeAgregado, quitarDelCarrito, quitarUnaUnidad, vaciarCarrito, type ItemCarrito as ItemGuardado } from "../datos/carrito";
import { listarProductos } from "../datos/repositorioProductos";
import type { Producto } from "../datos/productos";
import { formatearPrecio, precioVigente } from "../utilidades/formato";
import { leerSesion } from "../datos/sesion";
import { descontarStockEnServicio } from "../datos/repositorioCatalogo";
import { cambiarEstadoBoleta, emitirBoletaEnServicio } from "../datos/repositorioBoletas";

function Carrito() {
    const navigate = useNavigate();
    const [items, setItems] = useState<ItemGuardado[]>(() => leerCarrito());
    const [productos, setProductos] = useState<Producto[]>([]);
    const [aviso, setAviso] = useState("");

    // Los datos de cada producto se piden al servicio: el carrito solo guarda id y cantidad.
    useEffect(() => {
        let vigente = true;

        void listarProductos()
            .then((datos) => {
                if (vigente) setProductos(datos);
            })
            .catch(() => {
                if (vigente) setAviso("No se pudo cargar el catálogo. Revisa la conexión con los servicios.");
            });

        return () => {
            vigente = false;
        };
    }, []);

    const agregarUna = (id: number) => {
        const resultado = agregarAlCarrito(id);
        setItems(resultado.items);

        if (!resultado.agregado) {
            setAviso(mensajeDeAgregado(resultado));
        }
    };
    const quitarUna = (id: number) => setItems(quitarUnaUnidad(id));
    const quitarProducto = (id: number) => setItems(quitarDelCarrito(id));

    const vaciar = () => {
        vaciarCarrito();
        setItems([]);
    };

    const pagar = async () => {
        if (items.length === 0) {
            setAviso("El carrito está vacío.");
            return;
        }

        if (!leerSesion()) {
            navigate("/login", {
                state: 
                    {mensaje: "Para comprar tienes que iniciar sesión."}
            });
            return;
        }

        try {
            // 1. Se emite la boleta: el servicio calcula totales y le asigna el id.
            const boleta = await emitirBoletaEnServicio(
                items.map((item) => ({ id: item.id, cantidad: item.cantidad }))
            );

            if (!boleta.ok) {
                throw new Error(boleta.motivo);
            }

            // 2. El stock baja como SALIDA del kardex, con la boleta como referencia.
            const stock = await descontarStockEnServicio(
                items.map((item) => ({ id: item.id, cantidad: item.cantidad })),
                `PEDIDO-${boleta.id}`
            );

            if (!stock.ok) {
                // 3. Compensación: si el stock no alcanzó, se cancela la boleta y el catálogo
                //    devuelve solo lo que esa misma referencia había vendido.
                await cambiarEstadoBoleta(boleta.id, "CANCELADO").catch(() => undefined);
                throw new Error(stock.motivo);
            }

            // El pedido ya existe en el servicio: solo se limpia el carrito y se sigue.
            vaciar();
            navigate(`/despacho/${boleta.id}`);
        } catch (error) {
            const mensaje = error instanceof Error
                ? error.message
                : "No se pudo completar la compra.";

            navigate("/pago-error", { state: { motivo: mensaje } });
        }
    };

    const unidades = contarUnidades(items);

    const filas = items
        .map((item) => ({ item, producto: productos.find((producto) => producto.id === item.id) }))
        .filter((fila): fila is { item: ItemGuardado; producto: Producto } => Boolean(fila.producto));

    // El total sale de los productos del servicio, no de una copia guardada.
    const total = filas.reduce(
        (suma, fila) => suma + precioVigente(fila.producto.precio, fila.producto.descuento) * fila.item.cantidad,
        0
    );

    return(
        <>
            {items.length === 0 ? (
                <section className="sv-seccion">
                    <h1>Carrito de compras</h1>
                    <p className="sv-sin-resultados">El carrito está vacío.</p>
                    <div className="text-center">
                        <Boton
                        texto="Ir al catálogo"
                        to="/catalogo"
                        />
                    </div>
                </section>
            ) : (
                <section className="sv-seccion sv-seccion-ancha">
                    <h1>Carrito de compras</h1>

                    <p className="sv-contador">
                        {unidades} {unidades === 1 ? "unidad" : "unidades"} en {items.length} {items.length === 1 ? "producto" : "productos"}
                    </p>

                    {filas.map((fila) => (
                        <ItemCarrito
                        key={fila.item.id}
                        producto={fila.producto}
                        cantidad={fila.item.cantidad}
                        alAgregarUna={() => agregarUna(fila.item.id)}
                        alQuitarUna={() => quitarUna(fila.item.id)}
                        alQuitarProducto={() => quitarProducto(fila.item.id)}
                        />
                    ))}

                    <p className="sv-total">
                        Total a pagar: {formatearPrecio(total)}
                    </p>

                    <div className="d-flex flex-wrap gap-2">
                        <Boton
                        texto="Pagar"
                        alHacerClick={pagar}
                        />

                        <Boton
                        texto="Vaciar carrito"
                        variante="contorno"
                        alHacerClick={vaciar}
                        />
                    </div>
                </section>
            )}

            {aviso !== "" && (
                <Aviso
                mensaje={aviso}
                alCerrar={() => setAviso("")}
                />
            )}
        </>
    )
}

export default Carrito
