import { Activity, Save, X } from "lucide-react"

const PopupEditUser = ({ setIsShowPopUp, handleSubmit, onSubmit, register, errors, loading }) => {
    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden relative">

                <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50">
                    <h2 className="text-xl font-bold text-slate-800">Editar Información</h2>
                    <button
                        onClick={() => setIsShowPopUp(false)}
                        className="text-slate-400 hover:text-slate-800 bg-white p-1.5 rounded-full shadow-sm border border-slate-200"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="p-6 space-y-4"
                >
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Nombre Completo</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none"
                            {...register("name", {
                                required: {
                                    value: true,
                                    message: "El nombre es requerido"
                                },
                                minLength: {
                                    value: 3,
                                    message: "El nombre debe tener al menos 3 caracteres"
                                }
                            })}
                        />
                        {
                            errors.name &&
                            <span className="text-red-500 text-xs font-bold">{errors.name.message}</span>
                        }
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Correo Electrónico</label>
                        <input
                            type="email"
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
                            {...register("email", {
                                required: {
                                    value: true,
                                    message: "El email es requerido"
                                }
                            })}
                        />
                        {
                            errors.email &&
                            <span className="text-red-500 text-xs font-bold">{errors.email.message}</span>
                        }
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">URL de Foto de Perfil (Avatar)</label>
                        <input
                            type="url"
                            placeholder="link de imagen"
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all text-sm"
                            {...register("avatar", {
                                required: {
                                    value: true,
                                    message: "La url de la imagen es requerida"
                                }
                            })}
                        />
                        {
                            errors.avatar &&
                            <span className="text-red-500 text-xs font-bold">{errors.avatar.message}</span>
                        }
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={() => setIsShowPopUp(false)}
                            className="w-1/2 py-3 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-1/2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white font-bold py-3 rounded-xl transition-all shadow-md flex justify-center items-center gap-2"
                        >
                            {loading ? <Activity className="animate-spin" size={20} /> : <><Save size={20} /> Guardar Cambios</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default PopupEditUser