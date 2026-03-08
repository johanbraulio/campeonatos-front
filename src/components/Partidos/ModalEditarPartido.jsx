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
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }}>
            <div style={{ background: "#fff", borderRadius: 8, width: "100%", maxWidth: 850, maxHeight: "90vh", display: "flex", flexDirection: "column", border: "1px solid #ccc" }}>

                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.9rem 1.2rem", borderBottom: "1px solid #ddd", background: "#f5f5f5" }}>
                    <div>
                        <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 700 }}>Editar Partido</h3>
                        <small style={{ color: "#666" }}>
                            {partido.equipoANombre} vs {partido.equipoBNombre} · {partido.jornadaNumero}
                        </small>
                    </div>
                    <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#444", padding: 4 }}>
                        <X size={18} />
                    </button>
                </div>

                {loading ? (
                    <div style={{ padding: "2rem", textAlign: "center", color: "#666" }}>
                        Cargando datos del partido...
                    </div>
                ) : (
                    <div style={{ overflowY: "auto", padding: "1rem 1.2rem", display: "flex", flexDirection: "column", gap: "1rem" }}>

                        {/* Toggle W.O. */}
                        <div style={{ border: "1px solid #ddd", borderRadius: 6, padding: "0.75rem" }}>
                            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontWeight: 600 }}>
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
                                <p style={{ margin: "0.5rem 0 0", fontSize: "0.85rem", color: "#888" }}>
                                    En partidos W.O. debes seleccionar manualmente el equipo ganador y los detalles de los jugadores serán ignorados.
                                </p>
                            )}
                        </div>

                        {/* Selección de ganador - solo si es W.O. */}
                        {esWO && (
                            <div style={{ border: "1px solid #ddd", borderRadius: 6, padding: "0.75rem" }}>
                                <p style={{ margin: "0 0 0.5rem", fontWeight: 600, fontSize: "0.9rem" }}>Equipo ganador (W.O.)</p>
                                <div style={{ display: "flex", gap: "0.5rem" }}>
                                    {[
                                        { id: partido.equipoAId, nombre: partido.equipoANombre },
                                        { id: partido.equipoBId, nombre: partido.equipoBNombre }
                                    ].map(eq => (
                                        <button
                                            key={eq.id}
                                            onClick={() => setEquipoGanadorId(String(eq.id))}
                                            style={{
                                                flex: 1,
                                                padding: "0.5rem",
                                                borderRadius: 6,
                                                border: equipoGanadorId === String(eq.id) ? "2px solid #333" : "1px solid #ccc",
                                                background: equipoGanadorId === String(eq.id) ? "#333" : "#fff",
                                                color: equipoGanadorId === String(eq.id) ? "#fff" : "#333",
                                                cursor: "pointer",
                                                fontWeight: 600,
                                                fontSize: "0.88rem",
                                            }}
                                        >
                                            {eq.nombre} {equipoGanadorId === String(eq.id) ? "🏆" : ""}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Controles de Jugadores - solo si NO es W.O. */}
                        {!esWO && (
                            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
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
                                <div style={{ background: "#f0f0f0", borderRadius: 6, padding: "0.6rem 0.75rem", fontSize: "0.85rem", color: "#555" }}>
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
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", padding: "0.75rem 1.2rem", borderTop: "1px solid #ddd", background: "#f9f9f9" }}>
                        <button
                            onClick={onClose}
                            style={{ padding: "0.45rem 1rem", border: "1px solid #ccc", borderRadius: 6, background: "#fff", cursor: "pointer" }}
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleGuardar}
                            disabled={saving}
                            style={{ padding: "0.45rem 1rem", border: "none", borderRadius: 6, background: "#333", color: "#fff", cursor: "pointer", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.4rem", opacity: saving ? 0.7 : 1 }}
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
