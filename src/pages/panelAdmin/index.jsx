import axios from "axios"
import { useAppStore } from "../../store/useAppStore"
import { useEffect, useState } from "react"
import { Activity, DollarSign, ShieldAlert } from "lucide-react"
import Swal from "sweetalert2"
import TableGeneral from "../../components/TableGeneral"

const PanelAdmin = () => {

    const { apiUrl } = useAppStore()

    const [purchasesAll, setPurchasesAll] = useState([])
    const [loading, setLoading] = useState(false)

    const totalAmount = purchasesAll?.reduce((acc, item) => {
        return acc + item?.price
    }, 0)

    useEffect(() => {
        const fetchPurchasesAll = async () => {
            setLoading(true)
            try {
                const response = await axios.get(`${apiUrl}/orders`)
                console.log("response: ", response)
                if (response?.status === 200) {
                    setPurchasesAll(response?.data)
                }
            }
            catch (error) {
                console.log("error: ", error)
                Swal.fire({
                    title: 'Error',
                    text: "Hubo un error al momento de traer las compras del usuario",
                    icon: 'error',
                })
            }
            finally {
                setLoading(false)
            }
        }

        fetchPurchasesAll()
    }, [])

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <Activity className="h-20 w-20 text-indigo-600 animate-spin" />
            </div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">

            <div className="flex items-center gap-3 mb-8">
                <ShieldAlert className="text-rose-500" size={32} />
                <h1 className="text-3xl font-black text-slate-900">Panel de Control Global</h1>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8 flex items-center gap-4">
                <div className="bg-green-100 p-4 rounded-xl text-green-600">
                    <DollarSign size={32} />
                </div>
                <div>
                    <p className="text-slate-500 font-bold">Ingresos Totales</p>
                    <p className="text-3xl font-black text-slate-900">S/. {totalAmount}</p>
                </div>
            </div>
            <div className="mt-3 bg-white rounded-3xl shadow-sm border border-slate-200  overflow-hidden">
                <TableGeneral data={purchasesAll} tableType={"panelAdmin"} />
            </div>
        </div>
    )
}

export default PanelAdmin