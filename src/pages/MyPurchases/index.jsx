import axios from "axios"
import { useEffect, useState } from "react"
import Swal from "sweetalert2"
import { useAppStore } from "../../store/useAppStore"
import { Activity } from "lucide-react"
import TableGeneral from "../../components/TableGeneral"

const MyPurchases = () => {

    const { apiUrl, user } = useAppStore()
    const [purchasesUser, setPurchasesUser] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchPurchasesUser = async () => {
            setLoading(true)
            try {
                const response = await axios.get(`${apiUrl}/orders?userId=${user.id}`)
                console.log("response: ", response)
                if (response?.status === 200) {
                    setPurchasesUser(response.data)
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

        fetchPurchasesUser()
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
            <div className="border-b border-salte-500 pb-4">
                <h2 className="text-2xl font-bold text-salte-900">Mi Historial de Compras</h2>
            </div>
            <div className="mt-3 bg-white rounded-3xl shadow-sm border border-slate-200  overflow-hidden">
                <TableGeneral data={purchasesUser} tableType={"myPurchases"} />
            </div>
        </div>
    )
}

export default MyPurchases