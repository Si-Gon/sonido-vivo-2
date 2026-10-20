import { Route, Routes } from 'react-router-dom'
import './App.css'
import LayoutPublico from './Componentes/organismos/LayoutPublico'
import LayoutAdmin from './Componentes/organismos/LayoutAdmin'
import Inicio from './Paginas/Inicio'
import Nosotros from './Paginas/Nosotros'
import Catalogo from './Paginas/Catalogo'
import DetalleProducto from './Paginas/DetalleProducto'
import Carrito from './Paginas/Carrito'
import Novedades from './Paginas/Novedades'
import NovedadDetalle from './Paginas/NovedadDetalle'
import Contacto from './Paginas/Contacto'
import Login from './Paginas/Login'
import Registro from './Paginas/Registro'
import Admin from './Paginas/Admin'
import AdminProductos from './Paginas/AdminProductos'
import AdminUsuarios from './Paginas/AdminUsuarios'
import NoEncontrada from './Paginas/NoEncontrada'

function App() {

  return(
    <Routes>
      <Route element={<LayoutPublico/>}>

        <Route
        path='/'
        element={<Inicio/>}
        />

        <Route
        path='/nosotros'
        element={<Nosotros/>}
        />

        <Route
        path='/catalogo'
        element={<Catalogo/>}
        />

        <Route
        path='/producto/:id'
        element={<DetalleProducto/>}
        />

        <Route
        path='/carrito'
        element={<Carrito/>}
        />

        <Route
        path='/novedades'
        element={<Novedades/>}
        />

        <Route
        path='/novedad/:id'
        element={<NovedadDetalle/>}
        />

        <Route
        path='/contacto'
        element={<Contacto/>}
        />

        <Route
        path='/login'
        element={<Login/>}
        />

        <Route
        path='/registro'
        element={<Registro/>}
        />

        <Route
        path='*'
        element={<NoEncontrada/>}
        />

      </Route>

      <Route path='/admin' element={<LayoutAdmin/>}>

        <Route
        index
        element={<Admin/>}
        />

        <Route
        path='productos'
        element={<AdminProductos/>}
        />

        <Route
        path='usuarios'
        element={<AdminUsuarios/>}
        />

      </Route>

    </Routes>
  )
}

export default App
