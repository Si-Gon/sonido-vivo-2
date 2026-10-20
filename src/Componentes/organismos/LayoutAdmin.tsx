import { Outlet } from "react-router-dom";
import NavbarAdmin from "./NavbarAdmin";
import PiePagina from "./PiePagina";

function LayoutAdmin() {

    return(
        <>
            <NavbarAdmin/>
            <main className="container">
                <Outlet/>
            </main>
            <PiePagina/>
        </>
    )
}

export default LayoutAdmin
