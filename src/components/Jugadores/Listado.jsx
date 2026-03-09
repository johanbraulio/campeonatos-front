import { useEffect, useState } from "react"
import { API_URL } from "@/config/api"
import { useAppStore } from "@/store/useAppStore"
import axios from "axios"
import { Pencil, Plus } from "lucide-react"
import ModalJugador from "./Modal"

const ListadoJugadores = () => {
    const { token } = useAppStore()
    const [jugadores, setJugadores] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [filtroEquipo, setFiltroEquipo] = useState("Todos")

    // Si modalState.isOpen es true, el modal se muestra.
    // modalState.jugador contiene los datos a editar, o null si es uno nuevo.
    const [modalState, setModalState] = useState({ isOpen: false, jugador: null })

    const cargarJugadores = async () => {
        try {
            setLoading(true)
            const respuesta = await axios.get(`${API_URL}/api/jugadores`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setJugadores(respuesta.data)
        } catch (err) {
            setError("Error al cargar los jugadores. Verifica tu sesión.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        cargarJugadores()
    }, [token])

    // Equipos únicos para el filtro
    const equiposFiltrados = ["Todos", ...new Set(jugadores.map(j => j.equipoNombre).filter(Boolean))]

    const jugadoresFiltrados =
        filtroEquipo === "Todos"
            ? jugadores
            : jugadores.filter(j => j.equipoNombre === filtroEquipo)

    const handleNuevoJugador = () => {
        setModalState({ isOpen: true, jugador: null })
    }

    const handleEditarJugador = (jugador) => {
        setModalState({ isOpen: true, jugador })
    }

    const handleCerrarModal = () => {
        setModalState({ isOpen: false, jugador: null })
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-16 text-slate-500 gap-4">
                <div className="w-10 h-10 border-4 border-slate-200 border-t-indigo-500 rounded-full animate-spin"></div>
                <p>Cargando jugadores...</p>
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
                <h2 className="text-3xl font-bold text-slate-900 m-0">👥 Listado de Jugadores</h2>
                <div className="flex items-center gap-6 flex-wrap">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                        <label htmlFor="filtroEquipo">Equipo:</label>
                        <select
                            id="filtroEquipo"
                            value={filtroEquipo}
                            onChange={e => setFiltroEquipo(e.target.value)}
                            className="px-4 py-2 border border-slate-200 bg-white rounded-lg text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium"
                        >
                            {equiposFiltrados.map(eq => (
                                <option key={eq} value={eq}>{eq}</option>
                            ))}
                        </select>
                    </div>
                    <button
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors"
                        onClick={handleNuevoJugador}
                    >
                        <Plus size={16} /> Nuevo Jugador
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                        <tr>
                            <th className="p-4 text-center font-semibold text-sm uppercase tracking-wider">#</th>
                            <th className="p-4 text-left font-semibold text-sm uppercase tracking-wider">Nombres</th>
                            <th className="p-4 text-left font-semibold text-sm uppercase tracking-wider">Apellidos</th>
                            <th className="p-4 text-left font-semibold text-sm uppercase tracking-wider">Equipo</th>
                            <th className="p-4 text-center font-semibold text-sm uppercase tracking-wider">Fecha Nacimiento</th>
                            <th className="p-4 text-center font-semibold text-sm uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {jugadoresFiltrados.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="p-8 text-center text-slate-500 italic">
                                    No hay jugadores registrados.
                                </td>
                            </tr>
                        ) : (
                            jugadoresFiltrados.map(jugador => (
                                <tr key={jugador.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-3 text-center text-slate-500 font-medium">{jugador.id}</td>
                                    <td className="p-3 font-semibold text-slate-900">
                                        {jugador.nombres}
                                    </td>
                                    <td className="p-3 text-slate-600">
                                        {jugador.apellidoPaterno} {jugador.apellidoMaterno}
                                    </td>
                                    <td className="p-3">
                                        <span className="bg-slate-100 text-slate-700 border border-slate-200 px-3 py-1 rounded-lg text-xs font-semibold">
                                            {jugador.equipoNombre || "Sin equipo"}
                                        </span>
                                    </td>
                                    <td className="p-3 text-center text-slate-600">
                                        {jugador.fechaNacimiento ? new Date(jugador.fechaNacimiento).toLocaleDateString("es-PE") : "—"}
                                    </td>
                                    <td className="p-3 text-center">
                                        <button
                                            className="inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-300 transition-colors shadow-sm"
                                            onClick={() => handleEditarJugador(jugador)}
                                            title="Editar jugador"
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
                <p>Total de jugadores: <strong className="text-slate-900">{jugadoresFiltrados.length}</strong></p>
            </div>

            {/* Modal de edición / creación */}
            {modalState.isOpen && (
                <ModalJugador
                    jugador={modalState.jugador}
                    onClose={handleCerrarModal}
                    onGuardado={cargarJugadores}
                />
            )}
        </div>
    )
}

export default ListadoJugadores
