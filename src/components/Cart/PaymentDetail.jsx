import { Activity, CreditCard } from "lucide-react"

const PaymentDetail = ({ cart, totalAmount, handleCheckout, isCheckingOut }) => {
    return (
        <div className="lg:col-span-1">
            <div className="bg-slate-900 rounded-2xl p-6 shadow-xl text-white sticky top-24">
                <h2 className="text-xl font-bold mb-6 pb-4 border-b border-slate-700">Resumen del Pedido</h2>

                <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-slate-300">
                        <span>Subtotal ({cart.length} items)</span>
                        <span>S/.{totalAmount}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                        <span>Envío</span>
                        <span className="text-green-400 font-bold">Gratis</span>
                    </div>
                </div>

                <div className="flex justify-between items-end mb-8 pt-4 border-t border-slate-700">
                    <span className="text-lg font-bold">Total a Pagar</span>
                    <span className="text-4xl font-black text-indigo-400">S/.{totalAmount}</span>
                </div>

                <button
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-indigo-500/25 flex justify-center items-center gap-2 text-lg cursor-pointer"
                >
                    {isCheckingOut ? <Activity className="animate-spin" /> : <><CreditCard /> Proceder al Pago</>}
                </button>
            </div>
        </div>
    )
}

export default PaymentDetail