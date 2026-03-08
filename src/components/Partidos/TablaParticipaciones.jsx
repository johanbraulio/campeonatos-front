import { Plus, Trash2 } from "lucide-react"

const TablaParticipaciones = ({ equipo, equipoNombre, equipoId, participaciones, jugadores, onAgregarFila, onEliminarFila, onActualizarFila }) => {
    // Filtra jugadores disponibles para un select dado
    const getJugadoresDisponibles = (jugadores, participaciones, idRowActual) => {
        const idsUsados = participaciones
            .filter(p => p.idRow !== idRowActual && p.jugadorId !== "")
            .map(p => p.jugadorId)

        return jugadores.filter(j => !idsUsados.includes(j.id))
    }

    return (
        <div style={{ border: "1px solid #ddd", borderRadius: 6, padding: "0.75rem", background: "#fafafa" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem", borderBottom: "1px solid #eee", paddingBottom: "0.4rem" }}>
                <p style={{ margin: 0, fontWeight: 700, fontSize: "0.95rem" }}>
                    {equipoNombre}
                </p>
                <button
                    onClick={() => onAgregarFila(equipo, equipoId)}
                    style={{ background: "#333", color: "#fff", border: "none", padding: "0.3rem 0.6rem", borderRadius: 4, fontSize: "0.8rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.3rem" }}
                >
                    <Plus size={14} /> Detalle
                </button>
            </div>

            {participaciones.length === 0 ? (
                <p style={{ margin: 0, fontSize: "0.85rem", color: "#888", textAlign: "center", padding: "1rem 0" }}>
                    Sin detalles. Clic en "Detalle" para agregar.
                </p>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {participaciones.map((part) => {
                        const disponibles = getJugadoresDisponibles(jugadores, participaciones, part.idRow)

                        return (
                            <div key={part.idRow} style={{ background: "#fff", border: "1px solid #ccc", borderRadius: 4, padding: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>

                                {/* Select de Jugador */}
                                <div style={{ flex: "1 1 200px" }}>
                                    <label style={{ fontSize: "0.7rem", color: "#666", display: "block" }}>Jugador</label>
                                    <select
                                        value={part.jugadorId}
                                        onChange={e => onActualizarFila(equipo, part.idRow, 'jugadorId', e.target.value)}
                                        style={{ width: "100%", padding: "0.25rem", border: "1px solid #ccc", borderRadius: 4, fontSize: "0.85rem" }}
                                    >
                                        <option value="">-- Seleccionar --</option>
                                        {/* Si ya tiene jugador, mostramos ese jugador aunque no esté en disponibles */}
                                        {part.jugadorId !== "" && !disponibles.some(d => d.id === part.jugadorId) && (
                                            <option value={part.jugadorId}>
                                                {jugadores.find(j => j.id === part.jugadorId)?.nombres} {jugadores.find(j => j.id === part.jugadorId)?.apellidoPaterno}
                                            </option>
                                        )}
                                        {disponibles.map(j => (
                                            <option key={j.id} value={j.id}>{j.nombres} {j.apellidoPaterno}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Inputs de stats */}
                                <div style={{ display: "flex", gap: "0.5rem" }}>
                                    {[
                                        { key: "goles", label: "⚽ Gol" },
                                        { key: "ta", label: "🟨 TA" },
                                        { key: "trd", label: "🟥 TRD" },
                                        { key: "tri", label: "🟥 TRI" },
                                    ].map(({ key, label }) => (
                                        <div key={key} style={{ width: "45px" }}>
                                            <label style={{ fontSize: "0.7rem", color: "#666", display: "block", textAlign: "center" }}>{label}</label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={part[key]}
                                                onChange={e => onActualizarFila(equipo, part.idRow, key, e.target.value)}
                                                style={{ width: "100%", padding: "0.2rem", border: "1px solid #ccc", borderRadius: 4, textAlign: "center", fontSize: "0.85rem", boxSizing: "border-box" }}
                                            />
                                        </div>
                                    ))}
                                </div>

                                {/* Eliminar fila */}
                                <button
                                    onClick={() => onEliminarFila(equipo, part.idRow)}
                                    style={{ background: "#ffebee", border: "1px solid #ffcdd2", color: "#d32f2f", borderRadius: 4, padding: "0.3rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", marginTop: "0.9rem" }}
                                    title="Eliminar fila"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default TablaParticipaciones
