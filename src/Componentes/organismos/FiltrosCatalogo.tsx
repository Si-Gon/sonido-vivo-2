import Boton from "../atomos/Boton";
import type { Opcion } from "../atomos/Select";
import CampoFormulario from "../moleculas/CampoFormulario";
import CampoSeleccion from "../moleculas/CampoSeleccion";
import { categorias } from "../../datos/productos";

const opcionesCategoria: Opcion[] = [
    { valor: "todas", etiqueta: "Todas las categorías" },
    ...categorias.map((categoria) => ({ valor: categoria, etiqueta: categoria }))
];

type Props = {
    categoria: string;
    busqueda: string;
    alCambiarCategoria: (categoria: string) => void;
    alCambiarBusqueda: (busqueda: string) => void;
    alLimpiar: () => void;
};

function FiltrosCatalogo({ categoria, busqueda, alCambiarCategoria, alCambiarBusqueda, alLimpiar }: Props) {

    return(
        <div className="sv-filtros row g-3 align-items-end">
            <div className="col-12 col-md-5">
                <CampoSeleccion
                etiqueta="Categoría"
                nombre="categoria"
                valor={categoria}
                opciones={opcionesCategoria}
                alCambiar={alCambiarCategoria}
                />
            </div>

            <div className="col-12 col-md-5">
                <CampoFormulario
                etiqueta="Buscar por nombre"
                tipo="search"
                nombre="busqueda"
                valor={busqueda}
                marcador="Ej: Guitarra"
                alCambiar={alCambiarBusqueda}
                />
            </div>

            <div className="col-12 col-md-2 d-grid mb-3">
                <Boton
                texto="Limpiar"
                variante="contorno"
                tamano="normal"
                alHacerClick={alLimpiar}
                />
            </div>
        </div>
    )
}

export default FiltrosCatalogo
