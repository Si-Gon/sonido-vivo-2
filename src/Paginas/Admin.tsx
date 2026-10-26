
import { useState} from "react";
import AdminProductos from "./AdminProductos";
import AdminUsuarios from "./AdminUsuarios";
import AdminPedidos from "./AdminPedidos";

type VistaAdmin = "productos" | "usuarios" | "pedidos";

function Admin() {
    const [vistaActiva, setVistaActiva] = useState<VistaAdmin>("productos");
    const claseBoton = (vista: VistaAdmin) =>
        `btn ${vistaActiva === vista ? "btn-warning" : "btn-outline-warning"}`;
 
    return (
        <section className="sv-seccion sv-seccion-ancha">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Panel de Administración</h1>
                <div className="btn-group" role="group">
                    <button
                        type="button"
                        className={claseBoton("productos")}
                        onClick={() => setVistaActiva("productos")}>
                        Gestión de Productos
                    </button>
                    <button
                        type="button"
                        className={claseBoton("usuarios")}
                        onClick={() => setVistaActiva("usuarios")}>
                        Gestión de Usuarios
                    </button>
                    <button
                        type="button"
                        className={claseBoton("pedidos")}
                        onClick={() => setVistaActiva("pedidos")}>
                        Gestión de Pedidos
                    </button>
                </div>
            </div>
            {vistaActiva === "productos" ? <AdminProductos incrustado /> : vistaActiva === "usuarios" ? <AdminUsuarios incrustado /> : <AdminPedidos incrustado />}
        </section>
    );
}

export default Admin;