import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import PiePagina from "./PiePagina";

function LayoutPublico() {

    return(
        <>
            <Navbar/>
            <main className="container">
                <Outlet/>
            </main>
            <PiePagina/>
        </>
    )
}

export default LayoutPublico
