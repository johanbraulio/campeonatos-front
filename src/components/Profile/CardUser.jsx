import { Edit, Mail, Shield, User } from "lucide-react";

const CardUser = ({ user, setIsShowPopUp }) => {
    return (
        <div className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden relative">

            <div className="h-32 bg-linear-to-r from-indigo-500 to-purple-600"></div>

            <div className="px-8 pb-8">

                <div className="relative flex justify-between items-end -mt-16 mb-8">
                    <img
                        src={user.avatar}
                        alt="Perfil"
                        className="w-32 h-32 rounded-full border-4 border-white object-cover bg-slate-100 shadow-md"

                    />
                    <button
                        onClick={() => setIsShowPopUp(true)}
                        className="bg-slate-900 hover:bg-indigo-600 text-white font-bold py-2.5 px-6 rounded-xl transition-colors flex items-center gap-2 shadow-sm"
                    >
                        <Edit size={18} /> Editar Perfil
                    </button>
                </div>

                <h1 className="text-3xl font-black text-slate-900 mb-1">{user.name}</h1>
                <p className="text-slate-500 flex items-center gap-2 mb-6">
                    <Mail size={16} /> {user.email}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-100 pt-6">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-4">
                        <div className="bg-indigo-100 p-3 rounded-lg text-indigo-600">
                            <Shield size={24} />
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Rol de Cuenta</p>
                            <p className="font-bold text-slate-800 capitalize">{user.role}</p>
                        </div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-4">
                        <div className="bg-indigo-100 p-3 rounded-lg text-indigo-600">
                            <User size={24} />
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">ID Interno</p>
                            <p className="font-bold text-slate-800 font-mono">#{user.id}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CardUser;