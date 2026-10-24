import { useState } from "react";
import AdminProductos from "./AdminProductos";
import AdminUsuarios from "./AdminUsuarios";

function Admin() {
    const [vistaActiva, setVistaActiva] = useState<"productos" | "usuarios">("productos");

    return (
        <section className="sv-seccion sv-seccion-ancha">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Panel de Administración</h2>
                <div className="btn-group" role="group">
                    <button
                        type="button"
                        className={`btn ${
                            vistaActiva === "productos" ? "btn-warning" : "btn-outline-warning"
                        }`}
                        onClick={() => setVistaActiva("productos")}
                    >
                        Gestión de Productos
                    </button>
                    <button
                        type="button"
                        className={`btn ${
                            vistaActiva === "usuarios" ? "btn-warning" : "btn-outline-warning"
                        }`}
                        onClick={() => setVistaActiva("usuarios")}
                    >
                        Gestión de Usuarios
                    </button>
                </div>
            </div>

            {vistaActiva === "productos" ? <AdminProductos /> : <AdminUsuarios />}
        </section>
    );
}

export default Admin;