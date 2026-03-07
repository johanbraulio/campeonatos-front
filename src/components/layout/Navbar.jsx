import { LogOut, ShoppingBag, ShoppingCart } from "lucide-react"
import { useAppStore } from "../../store/useAppStore"
import { Link } from "react-router-dom"

const Navbar = () => {

    const { user, logout, hasRole, cart, clearCart } = useAppStore()

    return (
        <>
            <div className="sticky top-0 w-full h-16 bg-slate-900 flex justify-between items-center px-2 z-50">
                <div className="flex items-center gap-4">
                    <div className="flex justify-center items-center gap-2">
                        <ShoppingBag className="w-6 h-6 text-indigo-600" />
                        <Link to="/">
                            <h2 className="text-white font-extrabold text-lg">TechStore</h2>
                        </Link>
                    </div>
                    <div>
                        <Link to="/products" className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 px-4 rounded-lg text-xs cursor-pointer">
                            Productos
                        </Link>
                    </div>
                    <div>
                        <Link to="/miscompras" className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 px-4 rounded-lg text-xs cursor-pointer">
                            Mis Compras
                        </Link>
                    </div>

                    {
                        hasRole(["admin", "editor", "manager", "finance", "RRHH"]) &&
                        <div>
                            <Link to="/panel-admin" className="bg-red-400 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-lg text-xs cursor-pointer">
                                Panel Admin
                            </Link>
                        </div>
                    }

                </div>

                {
                    user !== null ?
                        <div className="mr-2 flex items-center gap-6">

                            <Link
                                to="/cart"
                                className="relative"
                            >
                                <ShoppingCart
                                    className="text-indigo-500 hover:text-indigo-400 cursor-pointer"
                                    size={25}
                                />
                                {
                                    cart.length > 0 &&
                                    <span className="absolute -top-2 -right-2 text-xs text-white rounded-full bg-red-500 w-4 flex justify-center items-center">
                                        {cart.length}
                                    </span>
                                }
                            </Link>

                            <Link
                                to="/profile"
                            >
                                <h2 className="text-lg text-white text-right">{user?.name}</h2>
                                <h3 className="text-xs text-gray-400 text-right">{user?.role}</h3>
                            </Link>

                            <LogOut
                                onClick={() => {
                                    logout()
                                    clearCart()
                                }}
                                className="w-10 h-10 text-slate-600 hover:text-slate-400 cursor-pointer bg-slate-800 p-2 rounded-md"
                            />
                        </div>
                        :
                        <Link
                            to="/login"
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg text-xs cursor-pointer"
                        >
                            Iniciar Sesión
                        </Link>
                }
            </div>
        </>
    )
}

export default Navbar