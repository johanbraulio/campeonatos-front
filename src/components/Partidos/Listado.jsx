import { useEffect, useState } from "react"
import { API_URL } from "@/config/api"
import { useAppStore } from "@/store/useAppStore"
import axios from "axios"
import { Pencil } from "lucide-react"
import ModalEditarPartido from "./ModalEditarPartido"

const ListadoPartidos = () => {
    const { token } = useAppStore()
    const [partidos, setPartidos] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [filtroJornada, setFiltroJornada] = useState("Todas")
    const [partidoSeleccionado, setPartidoSeleccionado] = useState(null)

    const cargarPartidos = async () => {
        try {
            setLoading(true)
            const respuesta = await axios.get(`${API_URL}/api/partidos`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setPartidos(respuesta.data)
        } catch (err) {
            setError("Error al cargar los partidos. Verifica tu sesión.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        cargarPartidos()
    }, [token])

    // Jornadas únicas para el filtro
    const jornadas = ["Todas", ...new Set(partidos.map(p => p.jornadaNumero))]

    const partidosFiltrados =
        filtroJornada === "Todas"
            ? partidos
            : partidos.filter(p => p.jornadaNumero === filtroJornada)

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Cargando partidos...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="error-container">
                <p className="error-msg">⚠️ {error}</p>
            </div>
        )
    }

    return (
        <div className="partidos-container">
            <div className="partidos-header">
                <h2 className="partidos-title">🏆 Listado de Partidos</h2>
                <div className="filtro-group">
                    <label htmlFor="filtroJornada">Filtrar por jornada:</label>
                    <select
                        id="filtroJornada"
                        value={filtroJornada}
                        onChange={e => setFiltroJornada(e.target.value)}
                        className="filtro-select"
                    >
                        {jornadas.map(j => (
                            <option key={j} value={j}>{j}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="tabla-wrapper">
                <table className="partidos-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Jornada</th>
                            <th>Equipo A</th>
                            <th>Resultado</th>
                            <th>Equipo B</th>
                            <th>Estado</th>
                            <th>W.O.</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {partidosFiltrados.length === 0 ? (
                            <tr>
                                <td colSpan="8" className="no-data">
                                    No hay partidos para esta jornada.
                                </td>
                            </tr>
                        ) : (
                            partidosFiltrados.map(partido => (
                                <tr key={partido.partidoId}>
                                    <td>{partido.partidoId}</td>
                                    <td>
                                        <span className="badge-jornada">
                                            {partido.jornadaNumero}
                                        </span>
                                    </td>
                                    <td className="equipo equipo-a">
                                        {partido.equipoANombre}
                                    </td>
                                    <td className="resultado">
                                        {partido.golesA !== null && partido.golesB !== null
                                            ? <span className="marcador">{partido.golesA} - {partido.golesB}</span>
                                            : <span className="marcador pendiente">vs</span>
                                        }
                                    </td>
                                    <td className="equipo equipo-b">
                                        {partido.equipoBNombre}
                                    </td>
                                    <td>
                                        <span className={`badge-estado ${partido.estado.toLowerCase()}`}>
                                            {partido.estado}
                                        </span>
                                    </td>
                                    <td>
                                        {partido.esWO
                                            ? <span className="badge-wo">W.O.</span>
                                            : <span className="badge-normal">—</span>
                                        }
                                    </td>
                                    <td>
                                        <button
                                            className="btn-editar"
                                            onClick={() => setPartidoSeleccionado(partido)}
                                            title="Editar partido"
                                        >
                                            <Pencil size={15} />
                                            Editar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="partidos-footer">
                <p>Total de partidos: <strong>{partidosFiltrados.length}</strong></p>
            </div>

            {/* Modal de edición */}
            {partidoSeleccionado && (
                <ModalEditarPartido
                    partido={partidoSeleccionado}
                    onClose={() => setPartidoSeleccionado(null)}
                    onGuardado={cargarPartidos}
                />
            )}

            <style>{`
                .partidos-container {
                    padding: 2rem;
                    max-width: 1100px;
                    margin: 0 auto;
                    font-family: 'Segoe UI', sans-serif;
                }
                .partidos-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1.5rem;
                    flex-wrap: wrap;
                    gap: 1rem;
                }
                .partidos-title {
                    font-size: 1.8rem;
                    font-weight: 700;
                    color: #1e293b;
                    margin: 0;
                }
                .filtro-group {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.95rem;
                    color: #475569;
                }
                .filtro-select {
                    padding: 0.5rem 1rem;
                    border: 2px solid #cbd5e1;
                    border-radius: 8px;
                    background: #fff;
                    font-size: 0.95rem;
                    color: #1e293b;
                    cursor: pointer;
                    transition: border-color 0.2s;
                }
                .filtro-select:focus {
                    outline: none;
                    border-color: #6366f1;
                }
                .tabla-wrapper {
                    overflow-x: auto;
                    border-radius: 12px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
                }
                .partidos-table {
                    width: 100%;
                    border-collapse: collapse;
                    background: #fff;
                }
                .partidos-table thead {
                    background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    color: #fff;
                }
                .partidos-table thead th {
                    padding: 1rem 1.2rem;
                    text-align: center;
                    font-weight: 600;
                    font-size: 0.9rem;
                    letter-spacing: 0.05em;
                    text-transform: uppercase;
                }
                .partidos-table tbody tr {
                    border-bottom: 1px solid #f1f5f9;
                    transition: background 0.15s;
                }
                .partidos-table tbody tr:hover {
                    background: #f8fafc;
                }
                .partidos-table tbody td {
                    padding: 0.85rem 1.2rem;
                    text-align: center;
                    color: #334155;
                    font-size: 0.95rem;
                }
                .equipo {
                    font-weight: 600;
                    font-size: 0.95rem;
                }
                .equipo-a { color: #2563eb; }
                .equipo-b { color: #dc2626; }
                .marcador {
                    background: #1e293b;
                    color: #fff;
                    padding: 0.3rem 0.8rem;
                    border-radius: 20px;
                    font-weight: 700;
                    font-size: 1rem;
                    letter-spacing: 0.05em;
                }
                .marcador.pendiente {
                    background: #94a3b8;
                }
                .badge-jornada {
                    background: #ede9fe;
                    color: #7c3aed;
                    padding: 0.25rem 0.7rem;
                    border-radius: 20px;
                    font-size: 0.82rem;
                    font-weight: 600;
                }
                .badge-estado {
                    padding: 0.25rem 0.75rem;
                    border-radius: 20px;
                    font-size: 0.82rem;
                    font-weight: 600;
                    text-transform: uppercase;
                }
                .badge-estado.jugado {
                    background: #dcfce7;
                    color: #16a34a;
                }
                .badge-estado.pendiente {
                    background: #fef9c3;
                    color: #ca8a04;
                }
                .badge-wo {
                    background: #fee2e2;
                    color: #dc2626;
                    padding: 0.25rem 0.6rem;
                    border-radius: 20px;
                    font-size: 0.82rem;
                    font-weight: 700;
                }
                .badge-normal {
                    color: #94a3b8;
                    font-size: 1.1rem;
                }
                .btn-editar {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.35rem;
                    padding: 0.4rem 0.85rem;
                    border-radius: 8px;
                    border: none;
                    background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    color: #fff;
                    font-size: 0.82rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: opacity 0.2s, transform 0.15s;
                    box-shadow: 0 2px 8px rgba(99,102,241,0.3);
                }
                .btn-editar:hover {
                    opacity: 0.9;
                    transform: translateY(-1px);
                }
                .no-data {
                    color: #94a3b8;
                    padding: 2rem;
                    font-style: italic;
                }
                .partidos-footer {
                    margin-top: 1rem;
                    text-align: right;
                    color: #64748b;
                    font-size: 0.9rem;
                }
                .loading-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 4rem;
                    color: #64748b;
                    gap: 1rem;
                }
                .spinner {
                    width: 40px;
                    height: 40px;
                    border: 4px solid #e2e8f0;
                    border-top-color: #6366f1;
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                }
                @keyframes spin { to { transform: rotate(360deg); } }
                .error-container {
                    padding: 2rem;
                    text-align: center;
                }
                .error-msg {
                    color: #dc2626;
                    font-size: 1rem;
                }
            `}</style>
        </div>
    )
}

export default ListadoPartidos
