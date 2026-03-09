import { Clock, CheckCircle2, Trophy } from "lucide-react";
import { useState } from "react";

const estadoConfig = {
    PENDIENTE: {
        label: "Pendiente",
        color: "text-amber-400",
        bg: "bg-amber-400/10",
        icon: <Clock className="w-3 h-3" />,
    },
    JUGADO: {
        label: "Jugado",
        color: "text-emerald-400",
        bg: "bg-emerald-400/10",
        icon: <CheckCircle2 className="w-3 h-3" />,
    },
};

const formatHora = (fechaIso) => {
    if (!fechaIso) return "—";
    const date = new Date(fechaIso);
    return date.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" });
};

const formatFecha = (fechaIso) => {
    if (!fechaIso) return "—";
    const date = new Date(fechaIso);
    return date.toLocaleDateString("es-PE", { day: "2-digit", month: "short" });
};

const PartidoCard = ({ partido, handlePartido, handlePartidoDetalle }) => {
    const {
        equipoANombre,
        equipoBNombre,
        estadoPartido,
        fechaHora,
        ganadorNombre,
        golesA,
        golesB,
        esWo,
    } = partido;

    const estado = estadoConfig[estadoPartido] ?? estadoConfig["PENDIENTE"];
    const finalizado = estadoPartido === "JUGADO";
    const hayMarcador = golesA !== null && golesB !== null;
    const esGanadorA = ganadorNombre === equipoANombre;
    const esGanadorB = ganadorNombre === equipoBNombre;

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);

    return (
        <div className="rounded-lg border border-slate-200 bg-white shadow-sm flex flex-col transition-all hover:shadow-md">

            {/* Fecha y estado */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100 bg-slate-50/50">
                <span className="text-xs text-slate-500 font-medium">
                    {formatFecha(fechaHora)} · {formatHora(fechaHora)}
                </span>
                {esWo ? (
                    <div className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded text-amber-500 bg-amber-500/10 border border-amber-500/30">
                        W.O.
                    </div>
                ) : null}
                <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded ${estado.color} ${estado.bg}`}>
                    {estado.icon}
                    {estado.label}
                </span>
            </div>

            {/* Equipos y marcador */}
            <div className="flex items-center justify-between gap-2 px-3 py-4">

                {/* Equipo A */}
                <div className={`flex-1 text-right ${finalizado && !esGanadorA ? "opacity-50" : ""}`}>
                    <p className={`text-sm font-bold leading-tight ${esGanadorA ? "text-slate-900" : "text-slate-600"}`}>
                        {/* {esGanadorA && (
                            <div className="flex items-center justify-end gap-1 mb-0.5">
                                <Trophy className="w-3 h-3 text-yellow-400" />
                            </div>
                        )} */}
                        {equipoANombre}
                    </p>
                </div>

                {/* Marcador */}
                <div className="shrink-0 text-center flex flex-col items-center">
                    {hayMarcador ? (
                        <>
                            <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                                <span className={`text-lg font-bold tabular-nums w-6 text-center ${esGanadorA ? "text-slate-900" : "text-slate-500"}`}>
                                    {golesA}
                                </span>
                                <span className="text-slate-400 text-sm font-semibold">-</span>
                                <span className={`text-lg font-bold tabular-nums w-6 text-center ${esGanadorB ? "text-slate-900" : "text-slate-500"}`}>
                                    {golesB}
                                </span>
                            </div>
                        </>
                    ) : (
                        <span className="text-slate-600 text-sm font-medium">vs</span>
                    )}
                </div>

                {/* Equipo B */}
                <div className={`flex-1 ${finalizado && !esGanadorB ? "opacity-50" : ""}`}>
                    {/* {esGanadorB && (
                        <div className="flex items-center gap-1 mb-0.5">
                            <Trophy className="w-3 h-3 text-yellow-400" />
                        </div>
                    )} */}
                    <p className={`text-sm font-bold leading-tight ${esGanadorB ? "text-slate-900" : "text-slate-600"}`}>
                        {equipoBNombre}
                    </p>
                </div>
            </div>

            {/* Botón detalle - Solo si el partido ya se jugó */}
            {finalizado && (
                <div className="border-t border-slate-100 px-3 py-2 bg-slate-50/30 rounded-b-lg">
                    <button
                        className="w-full text-xs font-semibold text-slate-500 hover:text-indigo-600 py-1.5 hover:bg-white border border-transparent hover:border-slate-200 hover:shadow-sm rounded transition-all cursor-pointer flex items-center justify-center gap-1"
                        onClick={() => {
                            handlePartidoDetalle(true)
                            handlePartido(partido)
                        }}
                    >
                        Ver detalles
                    </button>
                </div>
            )}
        </div>
    );
};

export default PartidoCard;
