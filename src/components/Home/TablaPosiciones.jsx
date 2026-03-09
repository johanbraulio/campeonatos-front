const columnas = [
    { key: "pj", label: "PJ", title: "Partidos Jugados" },
    { key: "pg", label: "PG", title: "Ganados" },
    { key: "pe", label: "PE", title: "Empatados" },
    { key: "pp", label: "PP", title: "Perdidos" },
    { key: "gf", label: "GF", title: "Goles a Favor" },
    { key: "gc", label: "GC", title: "Goles en Contra" },
    { key: "dg", label: "DG", title: "Diferencia de Goles" },
    { key: "puntos", label: "PTS", title: "Puntos" },
];

const TablaPosiciones = ({ posiciones = [] }) => {

    if (posiciones.length === 0) {
        return (
            <p className="text-slate-500 text-sm text-center py-20">Aún no hay datos de posiciones.</p>
        );
    }

    return (
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">

            {/* Cabecera */}
            <div className="px-5 py-4 border-b border-slate-200">
                <h2 className="text-sm font-bold text-slate-900">Tabla de Posiciones</h2>
                <p className="text-xs text-slate-500 mt-0.5">{posiciones.length} equipos</p>
            </div>

            {/* Tabla */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-slate-200 bg-slate-50">
                            <th className="py-2.5 px-4 text-left text-xs text-slate-500 font-medium w-8">#</th>
                            <th className="py-2.5 px-4 text-left text-xs text-slate-500 font-medium">Equipo</th>
                            {columnas.map(col => (
                                <th
                                    key={col.key}
                                    title={col.title}
                                    className={`py-2.5 px-3 text-center text-xs font-medium ${col.key === "puntos" ? "text-indigo-400" : "text-slate-500"}`}
                                >
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {posiciones.map((equipo, index) => (
                            <tr
                                key={equipo.equipoId}
                                className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                            >
                                {/* Posición */}
                                <td className="py-3 px-4">
                                    <span className={`text-xs font-bold ${index === 0 ? "text-yellow-400" : index === 1 ? "text-slate-300" : index === 2 ? "text-orange-400" : "text-slate-500"}`}>
                                        {index + 1}
                                    </span>
                                </td>

                                {/* Nombre */}
                                <td className="py-3 px-4">
                                    <span className={`text-sm font-bold ${index < 3 ? "text-slate-900" : "text-slate-600"}`}>
                                        {equipo.equipo}
                                    </span>
                                </td>

                                {/* Stats */}
                                {columnas.map(col => (
                                    <td key={col.key} className="py-3 px-3 text-center">
                                        {col.key === "puntos" ? (
                                            <span className="font-bold text-indigo-400">{equipo[col.key]}</span>
                                        ) : col.key === "dg" ? (
                                            <span className={`text-xs ${equipo[col.key] > 0 ? "text-emerald-400" : equipo[col.key] < 0 ? "text-red-400" : "text-slate-500"}`}>
                                                {equipo[col.key] > 0 ? `+${equipo[col.key]}` : equipo[col.key]}
                                            </span>
                                        ) : (
                                            <span className="text-xs text-slate-400">{equipo[col.key]}</span>
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Leyenda */}
            <div className="px-5 py-3 border-t border-slate-200 flex flex-wrap gap-x-5 gap-y-1 bg-slate-50/50">
                {columnas.map(col => (
                    <span key={col.key} className="text-[10px] text-slate-600">
                        <span className="text-slate-500 font-medium">{col.label}</span>: {col.title}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default TablaPosiciones;
