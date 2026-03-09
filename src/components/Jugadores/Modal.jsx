import { useEffect, useState } from "react"
import { X, Save } from "lucide-react"
import axios from "axios"
import { API_URL } from "@/config/api"
import { useAppStore } from "@/store/useAppStore"
import Swal from "sweetalert2"

const ModalJugador = ({ jugador, onClose, onGuardado }) => {
    const { token } = useAppStore()
    const isEdit = !!jugador
    const [saving, setSaving] = useState(false)
    const [equipos, setEquipos] = useState([])

    // Form state
    const [formData, setFormData] = useState({
        nombres: "",
        apellidoPaterno: "",
        apellidoMaterno: "",
        fechaNacimiento: "",
        equipoId: ""
    })

    useEffect(() => {
        const fetchEquipos = async () => {
            try {
                const headers = { Authorization: `Bearer ${token}` }
                const res = await axios.get(`${API_URL}/api/equipos`, { headers })
                setEquipos(res.data)
            } catch (err) {
                console.error("Error al cargar equipos", err)
            }
        }
        fetchEquipos()
    }, [token])

    useEffect(() => {
        if (isEdit) {
            // Formatear la fecha para input type="date" (YYYY-MM-DD)
            let fechaRaw = ""
            if (jugador.fechaNacimiento) {
                const dateObj = new Date(jugador.fechaNacimiento)
                const yyyy = dateObj.getFullYear()
                const mm = String(dateObj.getMonth() + 1).padStart(2, "0")
                const dd = String(dateObj.getDate()).padStart(2, "0")
                fechaRaw = `${yyyy}-${mm}-${dd}`
            }

            setFormData({
                nombres: jugador.nombres || "",
                apellidoPaterno: jugador.apellidoPaterno || "",
                apellidoMaterno: jugador.apellidoMaterno || "",
                fechaNacimiento: fechaRaw,
                equipoId: jugador.equipoId || ""
            })
        }
    }, [isEdit, jugador])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleGuardar = async () => {
        if (!formData.nombres || !formData.apellidoPaterno) {
            Swal.fire("Atención", "Los nombres y el apellido paterno son obligatorios.", "warning")
            return
        }

        const body = {
            id: isEdit ? jugador.id : null,
            nombres: formData.nombres.trim(),
            apellidoPaterno: formData.apellidoPaterno.trim(),
            apellidoMaterno: formData.apellidoMaterno.trim() || null,
            fechaNacimiento: formData.fechaNacimiento || null,
            equipoId: parseInt(formData.equipoId) || null
        }

        //console.log(body);
        try {
            setSaving(true)
            const headers = { Authorization: `Bearer ${token}` }
            let response;
            if (isEdit) {
                response = await axios.put(`${API_URL}/api/jugadores/${jugador.id}`, body, { headers })
            } else {
                response = await axios.post(`${API_URL}/api/jugadores`, body, { headers })
            }

            Swal.fire({
                title: isEdit ? "¡Actualizado!" : "¡Creado!",
                text: `El jugador ha sido ${isEdit ? "actualizado" : "registrado"} con éxito.`,
                icon: "success",
                timer: 2000,
                showConfirmButton: false,
            })
            onGuardado()
            onClose()
        } catch (err) {
            console.error(err)
            Swal.fire("Error", "Ocurrió un error al procesar la solicitud.", "error")
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4">
            <div className="bg-white rounded-lg w-full max-w-[500px] flex flex-col border border-slate-300 shadow-xl overflow-hidden">

                {/* Header */}
                <div className="flex justify-between items-center px-5 py-4 border-b border-slate-200 bg-slate-50">
                    <h3 className="m-0 text-lg font-bold text-slate-900">
                        {isEdit ? "Editar Jugador" : "Nuevo Jugador"}
                    </h3>
                    <button onClick={onClose} className="bg-transparent border-0 cursor-pointer text-slate-500 hover:text-slate-800 p-1 hover:bg-slate-200 rounded transition-colors">
                        <X size={18} />
                    </button>
                </div>

                {/* Formulario */}
                <div className="p-6 flex flex-col gap-4">

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-slate-700">Nombres <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            name="nombres"
                            value={formData.nombres}
                            onChange={handleChange}
                            placeholder="Ej. Juan Carlos"
                            className="p-2 border border-slate-300 rounded-md text-[0.95rem] focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 placeholder-slate-400"
                        />
                    </div>

                    <div className="flex gap-4">
                        <div className="flex flex-col gap-1 flex-1">
                            <label className="text-sm font-semibold text-slate-700">Apellido Paterno <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="apellidoPaterno"
                                value={formData.apellidoPaterno}
                                onChange={handleChange}
                                placeholder="Ej. Pérez"
                                className="p-2 border border-slate-300 rounded-md text-[0.95rem] focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 placeholder-slate-400"
                            />
                        </div>
                        <div className="flex flex-col gap-1 flex-1">
                            <label className="text-sm font-semibold text-slate-700">Apellido Materno</label>
                            <input
                                type="text"
                                name="apellidoMaterno"
                                value={formData.apellidoMaterno}
                                onChange={handleChange}
                                placeholder="Ej. Gómez"
                                className="p-2 border border-slate-300 rounded-md text-[0.95rem] focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 placeholder-slate-400"
                            />
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex flex-col gap-1 flex-1">
                            <label className="text-sm font-semibold text-slate-700">Fecha Nacimiento</label>
                            <input
                                type="date"
                                name="fechaNacimiento"
                                value={formData.fechaNacimiento}
                                onChange={handleChange}
                                className="p-2 border border-slate-300 rounded-md text-[0.95rem] bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900"
                            />
                        </div>
                        <div className="flex flex-col gap-1 flex-1">
                            <label className="text-sm font-semibold text-slate-700">Equipo</label>
                            <select
                                name="equipoId"
                                value={formData.equipoId}
                                onChange={handleChange}
                                className="p-2 border border-slate-300 rounded-md text-[0.95rem] bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900"
                            >
                                <option value="">Seleccione un equipo</option>
                                {equipos.map(eq => (
                                    <option key={eq.id} value={eq.id}>{eq.nombre}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <div className="flex justify-end gap-2 px-5 py-4 border-t border-slate-200 bg-slate-50">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-slate-300 rounded-md bg-white cursor-pointer text-slate-700 hover:bg-slate-50 font-semibold transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleGuardar}
                        disabled={saving}
                        className={`px-4 py-2 border-0 rounded-md bg-slate-900 text-white cursor-pointer font-semibold flex items-center gap-1.5 hover:bg-slate-800 transition-colors ${saving ? "opacity-70 pointer-events-none" : ""}`}
                    >
                        <Save size={15} />
                        {saving ? "Guardando..." : "Guardar"}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ModalJugador
