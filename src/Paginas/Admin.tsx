import Boton from "../Componentes/atomos/Boton";

function Admin() {
    return (
        <section className="sv-seccion sv-seccion-ancha">
            <h1>Panel de Administración</h1>
            <div className="d-flex flex-wrap gap-2 mt-3">
                <Boton texto="Gestión de productos" to="/admin/productos" tamano="normal" />
                <Boton texto="Gestión de usuarios" to="/admin/usuarios" tamano="normal" variante="contorno" />
            </div>
        </section>
    );
}

export default Admin;