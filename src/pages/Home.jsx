import { API_URL } from "@/config/api";
import { useEffect, useState } from "react";
import axios from "axios";
import JornadaCard from "@/components/Home/JornadaCard";
import TablaPosiciones from "@/components/Home/TablaPosiciones";
import { Loader2, AlertTriangle, CalendarDays, BarChart3 } from "lucide-react";
import PartidoDetalle from "@/components/Home/PartidoDetalle";

const TABS = [
    { key: "jornadas", label: "Jornadas", icon: CalendarDays },
    { key: "posiciones", label: "Posiciones", icon: BarChart3 },
];

const Home = () => {
    const [jornadas, setJornadas] = useState([])
    const [posiciones, setPosiciones] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [tabActivo, setTabActivo] = useState("jornadas")
    const [show, setShow] = useState(false)
    const [partido, setPartido] = useState(null)

    useEffect(() => {
        const fetchDatos = async () => {
            setLoading(true)
            setError(null)
            try {
                const [responseJornadas, responsePosiciones] = await Promise.all([
                    axios.get(`${API_URL}/api/jornadas/resumen`),
                    axios.get(`${API_URL}/api/estadisticas/posiciones`),
                ])
                setJornadas(responseJornadas.data)
                setPosiciones(responsePosiciones.data)
            }
            catch (err) {
                //console.log(err)
                setError("No se pudo cargar la información del campeonato.")
            }
            finally {
                setLoading(false)
            }
        }

        fetchDatos()
    }, [])

    const handlePartidoDetalle = (active) => {
        setShow(active);
    }
    const handlePartido = (partidoOnly) => {
        setPartido(partidoOnly)
    }

    return (
        <div className="min-h-screen bg-slate-900 text-white">

            {/* Header */}
            <div className="border-b border-slate-700">
                <div className="max-w-5xl mx-auto px-4 py-8">
                    <h1 className="text-2xl font-bold text-white mb-1">Campeonato de Fútbol Sala</h1>
                    <p className="text-slate-400 text-sm mb-6">Resultados y posiciones actualizados</p>

                    {/* Tabs */}
                    <div className="flex gap-1 border-b border-slate-700 -mb-px">
                        {TABS.map(({ key, label, icon: Icon }) => (
                            <button
                                key={key}
                                onClick={() => setTabActivo(key)}
                                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors cursor-pointer
                                    ${tabActivo === key
                                        ? "border-indigo-500 text-indigo-400"
                                        : "border-transparent text-slate-400 hover:text-slate-300"
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                {label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Contenido */}
            <div className="max-w-5xl mx-auto px-4 py-8">

                {/* Cargando */}
                {loading && (
                    <div className="flex items-center justify-center py-20 gap-3 text-slate-400">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span className="text-sm">Cargando...</span>
                    </div>
                )}

                {/* Error */}
                {!loading && error && (
                    <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm">
                        <AlertTriangle className="w-4 h-4 shrink-0" />
                        {error}
                    </div>
                )}

                {/* Jornadas */}
                {!loading && !error && tabActivo === "jornadas" && (
                    <>
                        {jornadas.length === 0 ? (
                            <p className="text-slate-500 text-sm text-center py-20">Aún no hay jornadas registradas.</p>
                        ) : (
                            <div className="flex flex-col gap-5">
                                {jornadas.map((jornada) => (
                                    <JornadaCard key={jornada.id} jornada={jornada} handlePartido={handlePartido} handlePartidoDetalle={handlePartidoDetalle} />
                                ))}
                            </div>
                        )}
                    </>
                )}

                {/* Posiciones */}
                {!loading && !error && tabActivo === "posiciones" && (
                    <TablaPosiciones posiciones={posiciones} />
                )}
            </div>
            {
                show &&
                <PartidoDetalle
                    {...{
                        partido,
                        handlePartidoDetalle,
                        handlePartido
                    }}
                />
            }
        </div>
    )
}

export default Home