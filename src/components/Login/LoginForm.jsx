import { Loader2 } from "lucide-react"

const LoginForm = ({ handleSubmit, username, setUsername, password, setPassword, isLoading }) => {

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
            <div className="w-full max-w-sm">

                {/* Cabecera */}
                <div className="mb-8">
                    <h1 className="text-xl font-bold text-white">Campeonato de Fútbol Sala</h1>
                    <p className="text-slate-400 text-sm mt-1">Ingresa tus credenciales para continuar</p>
                </div>

                {/* Formulario */}
                <form
                    onSubmit={handleSubmit}
                    className="bg-slate-800 border border-slate-700 rounded-xl p-6 flex flex-col gap-4"
                >
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5">
                            Usuario
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            placeholder="Nombre de usuario"
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full mt-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Ingresando...
                            </>
                        ) : (
                            "Ingresar"
                        )}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default LoginForm