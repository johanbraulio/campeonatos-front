import { Link } from "react-router-dom"

const Page404 = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-6 leading-tight">
                404
            </h1>
            <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
                La página que estás buscando no existe
            </p>
            <Link
                to="/"
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-8 rounded-full transition-all shadow-lg hover:shadow-xl inline-flex items-center gap-3 text-lg"
            >
                Volver a la tienda
            </Link>
        </div>
    )
}

export default Page404