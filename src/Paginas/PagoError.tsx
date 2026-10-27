import { useLocation } from "react-router-dom";
import Boton from "../Componentes/atomos/Boton";

type EstadoPago = { motivo?: string } | null;

function PagoError() {
    const ubicacion = useLocation();
    const estado = ubicacion.state as EstadoPago;
    const motivo = estado?.motivo ?? "";

    return(
        <section className="sv-seccion">
            <h1>No se pudo completar el pago</h1>

            <div className="alert alert-danger" role="alert">
                <strong>La compra no se realizó.</strong>{" "}
                {motivo !== ""
                    ? motivo
                    : "Ocurrió un problema al procesar el pedido y el cobro no se efectuó."}
            </div>

            <p>
                No se descontó dinero de tu cuenta y los productos siguen en tu carrito. Puedes
                revisar las cantidades y volver a intentarlo, o escribirnos desde la página de
                contacto si el problema continúa.
            </p>

            <div className="d-flex flex-wrap gap-2 mt-4">
                <Boton texto="Volver al carrito" to="/carrito" />
                <Boton texto="Ir al catálogo" to="/catalogo" variante="contorno" />
                <Boton texto="Contacto" to="/contacto" variante="contorno" />
            </div>
        </section>
    )
}

export default PagoError
