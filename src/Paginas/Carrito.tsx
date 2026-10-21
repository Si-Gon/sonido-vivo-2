import { useState } from "react";
import Aviso from "../Componentes/atomos/Aviso";
import Boton from "../Componentes/atomos/Boton";
import ItemCarrito from "../Componentes/moleculas/ItemCarrito";
import { agregarAlCarrito, calcularTotal, contarUnidades, leerCarrito, mensajeDeAgregado, quitarDelCarrito, quitarUnaUnidad, vaciarCarrito, type ItemCarrito as ItemGuardado } from "../datos/carrito";
import { buscarProducto, descontarStock } from "../datos/repositorioProductos";
import type { Producto } from "../datos/productos";
import { formatearPrecio } from "../utilidades/formato";

function Carrito() {
    const [items, setItems] = useState<ItemGuardado[]>(() => leerCarrito());
    const [aviso, setAviso] = useState("");

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

    const pagar = () => {
        const monto = formatearPrecio(calcularTotal(items));
        descontarStock(items);
        setAviso(`Pago realizado por ${monto}`);
        vaciar();
    };

    const total = calcularTotal(items);
    const unidades = contarUnidades(items);

    const filas = items
        .map((item) => ({ item, producto: buscarProducto(item.id) }))
        .filter((fila): fila is { item: ItemGuardado; producto: Producto } => Boolean(fila.producto));

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
