import { useEffect, useState } from "react"
import { X, Save } from "lucide-react"
import axios from "axios"
import { API_URL } from "@/config/api"
import { useAppStore } from "@/store/useAppStore"
import Swal from "sweetalert2"
import TablaParticipaciones from "./TablaParticipaciones"

const ModalEditarPartido = ({ partido, onClose, onGuardado }) => {
    const { token } = useAppStore()

    const [detalle, setDetalle] = useState(null)
    const [jugadoresA, setJugadoresA] = useState([])
    const [jugadoresB, setJugadoresB] = useState([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [esWO, setEsWO] = useState(false)
    const [equipoGanadorId, setEquipoGanadorId] = useState("")

    const [participacionesA, setParticipacionesA] = useState([])
    const [participacionesB, setParticipacionesB] = useState([])

    const headers = { Authorization: `Bearer ${token}` }

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                setLoading(true)
                const [resDetalle, resJugA, resJugB] = await Promise.all([
                    axios.get(`${API_URL}/api/partidos/${partido.partidoId}`, { headers }),
                    axios.get(`${API_URL}/api/jugadores/equipo/${partido.equipoAId}`, { headers }),
                    axios.get(`${API_URL}/api/jugadores/equipo/${partido.equipoBId}`, { headers }),
                ])

                const data = resDetalle.data
                const listA = resJugA.data
                const listB = resJugB.data

                setDetalle(data)
                setEsWO(data.esWO ?? false)
                setEquipoGanadorId(data.ganadorId ? String(data.ganadorId) : "")
                setJugadoresA(listA)
                setJugadoresB(listB)

                const detallesServer = data.detalles ?? []

                const partA = []
                const partB = []

                detallesServer.forEach(d => {
                    const esDelA = listA.some(j => j.id === d.jugadorId)
                    const esDelB = listB.some(j => j.id === d.jugadorId)

                    const item = {
                        idRow: Date.now() + Math.random(),
                        id: d.id,
                        equipoId: d.equipoId,
                        jugadorId: d.jugadorId,
                        goles: d.goles ?? 0,
                        ta: d.ta ?? 0,
                        trd: d.trd ?? 0,
                        tri: d.tri ?? 0,
                    }

                    if (esDelA) partA.push(item)
                    if (esDelB) partB.push(item)
                })

                setParticipacionesA(partA)
                setParticipacionesB(partB)
            } catch (err) {
                Swal.fire("Error", "No se pudieron cargar los datos del partido.", "error")
                onClose()
            } finally {
                setLoading(false)
            }
        }
        cargarDatos()
    }, [partido.partidoId])

    const agregarFila = (equipo, equipoId) => {
        const nuevaFila = {
            idRow: Date.now() + Math.random(),
            id: null,
            jugadorId: "",
            equipoId: equipoId,
            goles: 0, ta: 0, trd: 0, tri: 0
        }
        if (equipo === 'A') setParticipacionesA(prev => [...prev, nuevaFila])
        else setParticipacionesB(prev => [...prev, nuevaFila])
    }

    const eliminarFila = (equipo, idRow) => {
        if (equipo === 'A') setParticipacionesA(prev => prev.filter(p => p.idRow !== idRow))
        else setParticipacionesB(prev => prev.filter(p => p.idRow !== idRow))
    }

    const actualizarFila = (equipo, idRow, campo, valor) => {
        const updater = prev => prev.map(p => {
            if (p.idRow !== idRow) return p
            return {
                ...p,
                [campo]: campo === 'jugadorId' ? (valor ? parseInt(valor) : "") : Math.max(0, parseInt(valor) || 0)
            }
        })

        if (equipo === 'A') setParticipacionesA(updater)
        else setParticipacionesB(updater)
    }

    const calcularGanadorId = () => {
        const golesA = participacionesA.reduce((acc, p) => acc + p.goles, 0)
        const golesB = participacionesB.reduce((acc, p) => acc + p.goles, 0)

        if (golesA > golesB) return partido.equipoAId
        if (golesB > golesA) return partido.equipoBId
        return null // empate
    }

    const handleGuardar = async () => {
        let ganadorId

        if (esWO) {
            if (!equipoGanadorId) {
                Swal.fire("Atención", "Debes seleccionar el equipo ganador por W.O.", "warning")
                return
            }
            ganadorId = parseInt(equipoGanadorId)
        } else {
            ganadorId = calcularGanadorId()
            /* if (ganadorId === null) {
                Swal.fire("Atención", "El partido está empatado. Verifica los goles.", "warning")
                return
            } */
            const filasInvalidas = [...participacionesA, ...participacionesB].some(p => p.jugadorId === "")
            if (filasInvalidas) {
                Swal.fire("Atención", "Tienes detalles de jugadores sin seleccionar. Elige un jugador o elimina la fila.", "warning")
                return
            }
        }

        const golesA = participacionesA.reduce((acc, p) => acc + p.goles, 0)
        const golesB = participacionesB.reduce((acc, p) => acc + p.goles, 0)

        const allParticipaciones = [...participacionesA, ...participacionesB].map(p => ({
            jugadorId: p.jugadorId,
            equipoId: p.equipoId,
            id: p.id,
            goles: p.goles,
            ta: p.ta,
            trd: p.trd,
            tri: p.tri
        }))

        const body = {
            golesEquipoA: esWO ? 0 : golesA,
            golesEquipoB: esWO ? 0 : golesB,
            jugadores: esWO ? [] : allParticipaciones,
            esWO,
            equipoGanadorId: ganadorId,
        }

        try {
            setSaving(true)
            await axios.put(
                `${API_URL}/api/partidos/${partido.partidoId}/resultado`,
                body,
                { headers }
            )
            Swal.fire({
                title: "¡Guardado!",
                text: "El resultado fue registrado correctamente.",
                icon: "success",
                timer: 2000,
                showConfirmButton: false,
            })
            onGuardado()
            onClose()
        } catch (err) {
            Swal.fire("Error", "No se pudo guardar el resultado.", "error")
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4">
            <div className="bg-white rounded-lg w-full max-w-[850px] max-h-[90vh] flex flex-col border border-slate-300 shadow-xl overflow-hidden">

                {/* Header */}
                <div className="flex justify-between items-center px-5 py-3.5 border-b border-slate-200 bg-slate-50">
                    <div>
                        <h3 className="m-0 text-base font-bold text-slate-900">Editar Partido</h3>
                        <small className="text-slate-500 font-medium">
                            {partido.equipoANombre} vs {partido.equipoBNombre} · {partido.jornadaNumero}
                        </small>
                    </div>
                    <button onClick={onClose} className="bg-transparent border-0 cursor-pointer text-slate-500 hover:text-slate-800 p-1 hover:bg-slate-200 rounded transition-colors">
                        <X size={18} />
                    </button>
                </div>

                {loading ? (
                    <div className="p-8 text-center text-slate-500">
                        Cargando datos del partido...
                    </div>
                ) : (
                    <div className="overflow-y-auto px-5 py-4 flex flex-col gap-4">

                        {/* Toggle W.O. */}
                        <div className="border border-slate-200 rounded-md p-3">
                            <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
                                <input
                                    type="checkbox"
                                    checked={esWO}
                                    onChange={e => {
                                        setEsWO(e.target.checked)
                                        setEquipoGanadorId("")
                                    }}
                                />
                                Marcar como W.O.
                            </label>
                            {esWO && (
                                <p className="mt-2 mb-0 text-sm text-slate-500">
                                    En partidos W.O. debes seleccionar manualmente el equipo ganador y los detalles de los jugadores serán ignorados.
                                </p>
                            )}
                        </div>

                        {/* Selección de ganador - solo si es W.O. */}
                        {esWO && (
                            <div className="border border-slate-200 rounded-md p-3">
                                <p className="m-0 mb-2 font-semibold text-[0.9rem] text-slate-700">Equipo ganador (W.O.)</p>
                                <div className="flex gap-2">
                                    {[
                                        { id: partido.equipoAId, nombre: partido.equipoANombre },
                                        { id: partido.equipoBId, nombre: partido.equipoBNombre }
                                    ].map(eq => (
                                        <button
                                            key={eq.id}
                                            onClick={() => setEquipoGanadorId(String(eq.id))}
                                            className={`flex-1 p-2 rounded-md font-semibold text-[0.88rem] cursor-pointer transition-colors ${equipoGanadorId === String(eq.id) ? "border-2 border-slate-800 bg-slate-800 text-white shadow-md" : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"}`}
                                        >
                                            {eq.nombre} {equipoGanadorId === String(eq.id) ? "🏆" : ""}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Controles de Jugadores - solo si NO es W.O. */}
                        {!esWO && (
                            <div className="flex flex-col gap-4">
                                <TablaParticipaciones
                                    equipo="A"
                                    equipoNombre={partido.equipoANombre}
                                    equipoId={partido.equipoAId}
                                    participaciones={participacionesA}
                                    jugadores={jugadoresA}
                                    onAgregarFila={agregarFila}
                                    onEliminarFila={eliminarFila}
                                    onActualizarFila={actualizarFila}
                                />

                                <TablaParticipaciones
                                    equipo="B"
                                    equipoNombre={partido.equipoBNombre}
                                    equipoId={partido.equipoBId}
                                    participaciones={participacionesB}
                                    jugadores={jugadoresB}
                                    onAgregarFila={agregarFila}
                                    onEliminarFila={eliminarFila}
                                    onActualizarFila={actualizarFila}
                                />

                                {/* Info ganador calculado automáticamente */}
                                <div className="bg-slate-100 rounded-md py-2.5 px-3 text-sm text-slate-600 border border-slate-200 font-medium">
                                    {(() => {
                                        const id = calcularGanadorId()
                                        if (id === partido.equipoAId) return `🏆 Ganador calculado: ${partido.equipoANombre}`
                                        if (id === partido.equipoBId) return `🏆 Ganador calculado: ${partido.equipoBNombre}`
                                        return "⚖️ Empate — ajusta los goles para determinar un ganador"
                                    })()}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Footer */}
                {!loading && (
                    <div className="flex justify-end gap-2 px-5 py-3 border-t border-slate-200 bg-slate-50">
                        <button
                            onClick={onClose}
                            className="px-4 py-1.5 border border-slate-300 rounded-md bg-white cursor-pointer text-slate-700 hover:bg-slate-50 font-medium transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleGuardar}
                            disabled={saving}
                            className={`px-4 py-1.5 border-0 rounded-md bg-slate-800 text-white cursor-pointer font-semibold flex items-center gap-1.5 hover:bg-slate-900 transition-colors ${saving ? "opacity-70 pointer-events-none" : ""}`}
                        >
                            <Save size={15} />
                            {saving ? "Guardando..." : "Guardar"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ModalEditarPartido
