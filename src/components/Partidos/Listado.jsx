import { useEffect, useState } from "react"
import { API_URL } from "@/config/api"
import { useAppStore } from "@/store/useAppStore"
import axios from "axios"
import { Pencil } from "lucide-react"
import ModalEditarPartido from "./ModalEditarPartido"

const ListadoPartidos = () => {
    const { token } = useAppStore()
    const [partidos, setPartidos] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [filtroJornada, setFiltroJornada] = useState("Todas")
    const [partidoSeleccionado, setPartidoSeleccionado] = useState(null)

    const cargarPartidos = async () => {
        try {
            setLoading(true)
            const respuesta = await axios.get(`${API_URL}/api/partidos`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setPartidos(respuesta.data)
        } catch (err) {
            setError("Error al cargar los partidos. Verifica tu sesión.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        cargarPartidos()
    }, [token])

    // Jornadas únicas para el filtro
    const jornadas = ["Todas", ...new Set(partidos.map(p => p.jornadaNumero))]

    const partidosFiltrados =
        filtroJornada === "Todas"
            ? partidos
            : partidos.filter(p => p.jornadaNumero === filtroJornada)

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-16 text-slate-500 gap-4">
                <div className="w-10 h-10 border-4 border-slate-200 border-t-indigo-500 rounded-full animate-spin"></div>
                <p>Cargando partidos...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="p-8 text-center text-red-500">
                <p className="font-semibold">⚠️ {error}</p>
            </div>
        )
    }

    return (
        <div className="p-8 max-w-6xl mx-auto text-slate-900">
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                <h2 className="text-3xl font-bold text-slate-900 m-0">🏆 Listado de Partidos</h2>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                    <label htmlFor="filtroJornada">Filtrar por jornada:</label>
                    <select
                        id="filtroJornada"
                        value={filtroJornada}
                        onChange={e => setFiltroJornada(e.target.value)}
                        className="px-4 py-2 border border-slate-200 bg-white rounded-lg text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium"
                    >
                        {jornadas.map(j => (
                            <option key={j} value={j}>{j}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                        <tr>
                            <th className="p-4 text-center font-semibold text-sm uppercase tracking-wider">#</th>
                            <th className="p-4 text-center font-semibold text-sm uppercase tracking-wider">Jornada</th>
                            <th className="p-4 text-center font-semibold text-sm uppercase tracking-wider">Equipo A</th>
                            <th className="p-4 text-center font-semibold text-sm uppercase tracking-wider">Resultado</th>
                            <th className="p-4 text-center font-semibold text-sm uppercase tracking-wider">Equipo B</th>
                            <th className="p-4 text-center font-semibold text-sm uppercase tracking-wider">Estado</th>
                            <th className="p-4 text-center font-semibold text-sm uppercase tracking-wider">W.O.</th>
                            <th className="p-4 text-center font-semibold text-sm uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {partidosFiltrados.length === 0 ? (
                            <tr>
                                <td colSpan="8" className="p-8 text-center text-slate-500 italic">
                                    No hay partidos para esta jornada.
                                </td>
                            </tr>
                        ) : (
                            partidosFiltrados.map(partido => (
                                <tr key={partido.partidoId} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-3 text-center text-slate-500 font-medium">{partido.partidoId}</td>
                                    <td className="p-3 text-center">
                                        <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold border border-indigo-200">
                                            {partido.jornadaNumero}
                                        </span>
                                    </td>
                                    <td className="p-3 text-center font-bold text-slate-700">
                                        {partido.equipoANombre}
                                    </td>
                                    <td className="p-3 text-center">
                                        {partido.golesA !== null && partido.golesB !== null
                                            ? <span className="bg-slate-800 text-white px-3 py-1 rounded-full font-bold tracking-wider">{partido.golesA} - {partido.golesB}</span>
                                            : <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full font-bold border border-slate-200">vs</span>
                                        }
                                    </td>
                                    <td className="p-3 text-center font-bold text-slate-700">
                                        {partido.equipoBNombre}
                                    </td>
                                    <td className="p-3 text-center">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${partido.estado.toLowerCase() === 'jugado' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-amber-50 text-amber-600 border-amber-200'}`}>
                                            {partido.estado}
                                        </span>
                                    </td>
                                    <td className="p-3 text-center">
                                        {partido.esWO
                                            ? <span className="bg-red-50 text-red-600 border border-red-200 px-2 py-1 rounded-full text-xs font-bold">W.O.</span>
                                            : <span className="text-slate-400 text-lg">—</span>
                                        }
                                    </td>
                                    <td className="p-3 text-center">
                                        <button
                                            className="inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-300 transition-colors shadow-sm"
                                            onClick={() => setPartidoSeleccionado(partido)}
                                            title="Editar partido"
                                        >
                                            <Pencil size={14} />
                                            Editar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 text-right text-slate-500 text-sm">
                <p>Total de partidos: <strong className="text-slate-900">{partidosFiltrados.length}</strong></p>
            </div>

            {/* Modal de edición */}
            {partidoSeleccionado && (
                <ModalEditarPartido
                    partido={partidoSeleccionado}
                    onClose={() => setPartidoSeleccionado(null)}
                    onGuardado={cargarPartidos}
                />
            )}
        </div>
    )
}

export default ListadoPartidos
