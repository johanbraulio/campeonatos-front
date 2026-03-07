import { HashRouter, Routes, Route, BrowserRouter, Navigate } from "react-router-dom"
import { useAppStore } from "../store/useAppStore"
import Cart from "../pages/Cart"
import Login from "../pages/Login"
import Home from "../pages/Home"
import Profile from "../pages/Profile"
import Products from "../pages/Products"
import MyPurchases from "../pages/MyPurchases"
import Unauthorized from "../pages/Unauthorized"
import PanelAdmin from "../pages/panelAdmin"
import Page404 from "../pages/Page404"
import Navbar from "../components/layout/Navbar"

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
                        path="/profile"
                        element={
                            user === null ?
                                <Navigate to="/login" />
                                :
                                <Profile />
                        }
                    />

                    <Route
                        path="/products"
                        element={
                            user === null ?
                                <Navigate to="/login" />
                                :
                                <Products />
                        }
                    />

                    <Route
                        path="/miscompras"
                        element={
                            user === null ?
                                <Navigate to="/login" />
                                :
                                <MyPurchases />
                        }
                    />

                    <Route
                        path="/panel-admin"
                        element={
                            user === null ?
                                <Navigate to="/login" />
                                :
                                hasRole(["admin", "editor", "manager", "finance", "RRHH"]) ?
                                    <PanelAdmin />
                                    :
                                    <Unauthorized />
                        }
                    />

                    <Route
                        path="/cart"
                        element={
                            user === null ?
                                <Navigate to="/login" />
                                :
                                <Cart />
                        }
                    />

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