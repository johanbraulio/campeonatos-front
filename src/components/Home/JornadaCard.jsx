import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import PartidoCard from "./PartidoCard";

const JornadaCard = ({ jornada, handlePartido, handlePartidoDetalle }) => {
    const [expandido, setExpandido] = useState(true);
    const { nombre, partidos = [] } = jornada;

    const jugados = partidos.filter(p => p.estadoPartido === "JUGADO").length;
    const pendientes = partidos.filter(p => p.estadoPartido === "PENDIENTE").length;

    return (
        <div className="rounded-xl border border-slate-700 bg-slate-800 overflow-hidden">

            {/* Cabecera */}
            <button
                onClick={() => setExpandido(!expandido)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-700/50 transition-colors cursor-pointer"
            >
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                    <div className="text-left">
                        <p className="font-semibold text-white text-sm">{nombre}</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                            {jugados} jugado{jugados !== 1 ? "s" : ""}
                            {pendientes > 0 && ` · ${pendientes} pendiente${pendientes !== 1 ? "s" : ""}`}
                            {" · "}
                            {partidos.length} en total
                        </p>
                    </div>
                </div>
                <div className="text-slate-500">
                    {expandido ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
            </button>

            {/* Partidos */}
            {expandido && (
                <div className="border-t border-slate-700 p-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                    {partidos.map((partido) => (
                        <PartidoCard key={partido.id} partido={partido} handlePartido={handlePartido} handlePartidoDetalle={handlePartidoDetalle} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default JornadaCard;
