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
        <div className="border border-slate-200 rounded-md p-3 bg-slate-50">
            <div className="flex justify-between items-center mb-2 border-b border-slate-100 pb-1.5">
                <p className="font-bold text-[0.95rem] m-0 text-slate-800">
                    {equipoNombre}
                </p>
                <button
                    onClick={() => onAgregarFila(equipo, equipoId)}
                    className="bg-slate-800 text-white border-0 px-2.5 py-1.5 rounded text-xs cursor-pointer flex items-center gap-1 hover:bg-slate-700 transition-colors"
                >
                    <Plus size={14} /> Detalle
                </button>
            </div>

            {participaciones.length === 0 ? (
                <p className="m-0 text-sm text-slate-500 text-center py-4">
                    Sin detalles. Clic en "Detalle" para agregar.
                </p>
            ) : (
                <div className="flex flex-col gap-2">
                    {participaciones.map((part) => {
                        const disponibles = getJugadoresDisponibles(jugadores, participaciones, part.idRow)

                        return (
                            <div key={part.idRow} className="bg-white border border-slate-300 rounded p-2 flex items-center gap-2 flex-wrap shadow-sm">

                                {/* Select de Jugador */}
                                <div className="flex-[1_1_200px]">
                                    <label className="text-xs text-slate-500 block font-medium mb-1">Jugador</label>
                                    <select
                                        value={part.jugadorId}
                                        onChange={e => onActualizarFila(equipo, part.idRow, 'jugadorId', e.target.value)}
                                        className="w-full p-1 border border-slate-300 rounded text-sm bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
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
                                <div className="flex gap-2">
                                    {[
                                        { key: "goles", label: "⚽ Gol" },
                                        { key: "ta", label: "🟨 TA" },
                                        { key: "trd", label: "🟥 TRD" },
                                        { key: "tri", label: "🟥 TRI" },
                                    ].map(({ key, label }) => (
                                        <div key={key} className="w-[45px]">
                                            <label className="text-xs text-slate-500 block text-center font-medium mb-1">{label}</label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={part[key]}
                                                onChange={e => onActualizarFila(equipo, part.idRow, key, e.target.value)}
                                                className="w-full p-1 border border-slate-300 rounded text-center text-sm box-border focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                                            />
                                        </div>
                                    ))}
                                </div>

                                {/* Eliminar fila */}
                                <button
                                    onClick={() => onEliminarFila(equipo, part.idRow)}
                                    className="bg-red-50 border border-red-200 text-red-600 rounded p-1.5 cursor-pointer flex items-center justify-center mt-4 hover:bg-red-100 transition-colors"
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
