import { HashRouter, Routes, Route, BrowserRouter, Navigate } from "react-router-dom"
import { useAppStore } from "../store/useAppStore"
import Login from "../pages/Login"
import Home from "../pages/Home"
import Unauthorized from "../pages/Unauthorized"
import Page404 from "../pages/Page404"
import Navbar from "../components/layout/Navbar"
import ListadoPartidosPage from "../pages/Partidos/Listado"

const AppRouter = () => {

    const { user, hasRole } = useAppStore()

    return (
        <BrowserRouter>
            <Navbar />
            <main>
                <Routes>
                    <Route
                        path="/"
                        element={<Home />}
                    />

                    <Route
                        path="/login"
                        element={<Login />}
                    />

                    <Route
                        path="/panel-admin"
                        element={
                            user === null ?
                                <Navigate to="/login" />
                                :
                                hasRole(["ADMIN"/* , "editor", "manager", "finance", "RRHH" */]) ?
                                    <ListadoPartidosPage />
                                    :
                                    <Unauthorized />
                        }
                    />

                    {/* <Route
                        path="/partidos"
                        element={
                            user === null ?
                                <Navigate to="/login" />
                                :
                                <ListadoPartidosPage />
                        }
                    /> */}

                    <Route
                        path="*"
                        element={<Page404 />}
                    />
                </Routes>
            </main>
        </BrowserRouter>
    )
}

export default AppRouter