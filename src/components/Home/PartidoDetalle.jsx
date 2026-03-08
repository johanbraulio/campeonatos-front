import { useEffect, useState } from "react";
import { X, Clock, AlertTriangle, Loader2, Trophy } from "lucide-react";
import axios from "axios";
import { API_URL } from "@/config/api";

const PartidoDetalle = ({ partido, handlePartido, handlePartidoDetalle }) => {
    const [detalle, setDetalle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!partido || !partido.id) return;

        const fetchDetalle = async () => {
            try {
                setLoading(true);
                setError(null);
                const respuesta = await axios.get(`${API_URL}/api/partidos/${partido.id}`);
                setDetalle(respuesta.data);
            } catch (err) {
                setError("No se pudo obtener el detalle del partido.");
            } finally {
                setLoading(false);
            }
        };

        fetchDetalle();
    }, [partido]);

    // Calcular jugadores por equipo
    const detallesEquipoA = detalle?.detalles.filter(d => d.equipoId === detalle.equipoAId) || [];
    const detallesEquipoB = detalle?.detalles.filter(d => d.equipoId === detalle.equipoBId) || [];

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-[1000] p-4">
            <div className="bg-slate-800 rounded-lg w-full max-w-2xl overflow-hidden flex flex-col border border-slate-700">

                {/* Cabecera */}
                <div className="flex justify-between items-center bg-slate-700 px-5 py-3">
                    <h3 className="text-white font-bold text-lg">
                        Detalle del Partido
                    </h3>
                    <button
                        onClick={() => {
                            handlePartidoDetalle(false);
                            handlePartido(null);
                        }}
                        className="text-slate-300 hover:text-white p-1 rounded-full hover:bg-slate-600 transition-colors cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-3">
                        <Loader2 className="w-8 h-8 animate-spin" />
                        <span className="text-sm">Cargando detalles...</span>
                    </div>
                ) : error ? (
                    <div className="flex items-center justify-center py-16 text-red-400 gap-2">
                        <AlertTriangle className="w-5 h-5" />
                        <span>{error}</span>
                    </div>
                ) : (
                    <div className="p-5 flex flex-col gap-6 overflow-y-auto max-h-[80vh]">

                        {/* Marcador Principal */}
                        <div className="bg-slate-900 border border-slate-700 rounded-lg p-5 flex items-center justify-center gap-6">
                            <div className="flex-1 text-right flex flex-col justify-center">
                                {detalle.ganadorId === detalle.equipoAId && (
                                    <div className="flex items-center justify-end gap-1 mb-1 text-yellow-500 text-[10px] font-bold uppercase tracking-wider">
                                        <Trophy className="w-3 h-3" /> Ganador
                                    </div>
                                )}
                                <span className={`text-lg font-bold block ${detalle.ganadorId === detalle.equipoAId ? "text-white" : "text-slate-400"}`}>
                                    {detalle.equipoANombre}
                                </span>
                            </div>

                            <div className="flex flex-col items-center gap-2 shrink-0">
                                {detalle.esWO && (
                                    <div className="bg-amber-500/10 text-amber-500 border border-amber-500/30 px-2 py-0.5 rounded text-xs font-bold tracking-wider mb-1">
                                        W.O.
                                    </div>
                                )}
                                <div className="flex items-center gap-3">
                                    <div className="bg-slate-800 px-4 py-2 rounded text-2xl font-black text-white w-16 text-center shadow-inner">
                                        {detalle.golesA}
                                    </div>
                                    <span className="text-slate-500 font-bold">vs</span>
                                    <div className="bg-slate-800 px-4 py-2 rounded text-2xl font-black text-white w-16 text-center shadow-inner">
                                        {detalle.golesB}
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 text-left flex flex-col justify-center">
                                {detalle.ganadorId === detalle.equipoBId && (
                                    <div className="flex items-center justify-start gap-1 mb-1 text-yellow-500 text-[10px] font-bold uppercase tracking-wider">
                                        <Trophy className="w-3 h-3" /> Ganador
                                    </div>
                                )}
                                <span className={`text-lg font-bold block ${detalle.ganadorId === detalle.equipoBId ? "text-white" : "text-slate-400"}`}>
                                    {detalle.equipoBNombre}
                                </span>
                            </div>
                        </div>



                        {/* Detalles de Jugadores */}
                        {!detalle.esWO && detalle.detalles && detalle.detalles.length > 0 && (
                            <div className="flex flex-col gap-5">

                                {/* Equipo A */}
                                {detallesEquipoA.length > 0 && (
                                    <div className="border border-slate-700 rounded overflow-hidden">
                                        <div className="bg-slate-700/50 px-4 py-2 text-sm font-bold text-white">
                                            {detalle.equipoANombre}
                                        </div>
                                        <table className="w-full text-left text-sm text-slate-300">
                                            <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase">
                                                <tr>
                                                    <th className="px-4 py-2">Jugador</th>
                                                    <th className="px-4 py-2 text-center w-16">Goles</th>
                                                    <th className="px-4 py-2 text-center w-16">T.A.</th>
                                                    <th className="px-4 py-2 text-center w-16">T.R.</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-700/50">
                                                {detallesEquipoA.map((d) => (
                                                    <tr key={d.id} className="hover:bg-slate-700/20">
                                                        <td className="px-4 py-2 font-medium">{d.nombreJugador}</td>
                                                        <td className="px-4 py-2 text-center">{d.goles > 0 ? d.goles : "-"}</td>
                                                        <td className="px-4 py-2 text-center text-amber-400">{d.ta > 0 ? d.ta : "-"}</td>
                                                        <td className="px-4 py-2 text-center text-red-500">{(d.trd + d.tri) > 0 ? (d.trd + d.tri) : "-"}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                {/* Equipo B */}
                                {detallesEquipoB.length > 0 && (
                                    <div className="border border-slate-700 rounded overflow-hidden">
                                        <div className="bg-slate-700/50 px-4 py-2 text-sm font-bold text-white">
                                            {detalle.equipoBNombre}
                                        </div>
                                        <table className="w-full text-left text-sm text-slate-300">
                                            <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase">
                                                <tr>
                                                    <th className="px-4 py-2">Jugador</th>
                                                    <th className="px-4 py-2 text-center w-16">Goles</th>
                                                    <th className="px-4 py-2 text-center w-16">T.A.</th>
                                                    <th className="px-4 py-2 text-center w-16">T.R.</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-700/50">
                                                {detallesEquipoB.map((d) => (
                                                    <tr key={d.id} className="hover:bg-slate-700/20">
                                                        <td className="px-4 py-2 font-medium">{d.nombreJugador}</td>
                                                        <td className="px-4 py-2 text-center">{d.goles > 0 ? d.goles : "-"}</td>
                                                        <td className="px-4 py-2 text-center text-amber-400">{d.ta > 0 ? d.ta : "-"}</td>
                                                        <td className="px-4 py-2 text-center text-red-500">{(d.trd + d.tri) > 0 ? (d.trd + d.tri) : "-"}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                {detallesEquipoA.length === 0 && detallesEquipoB.length === 0 && (
                                    <div className="text-center text-slate-500 italic py-4">
                                        No hay información de jugadores para este partido.
                                    </div>
                                )}
                            </div>
                        )}

                    </div>
                )}
            </div>
        </div>
    );
};

export default PartidoDetalle;