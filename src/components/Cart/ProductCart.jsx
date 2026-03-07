import { Minus, Plus, Trash2 } from "lucide-react"

const ProductCart = ({ item, updateQuantity, removeFromCart }) => {
    return (
        <div className="p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-6">
            <img src={item?.product?.images[0]} alt={item?.product?.title} className="w-24 h-24 object-cover rounded-xl border border-slate-100" />

            <div className="flex grow text-center sm:text-left">
                <h3 className="font-bold text-slate-800 text-lg mb-1">{item?.product?.title}</h3>
                <span className="text-indigo-600 font-black">S/. {item?.product?.price} <span className="text-slate-400 font-normal text-sm">c/u</span></span>
            </div>

            <div className="flex items-center gap-3 bg-slate-50 p-1.5 rounded-lg border border-slate-200">
                <button
                    onClick={() => updateQuantity(item?.product?.id, item?.quantity - 1)}
                    className="p-1 bg-white rounded-md text-slate-600 hover:bg-slate-200 shadow-sm transition"
                >
                    <Minus size={16} />
                </button>
                <span className="w-8 text-center font-bold text-slate-800">{item?.quantity}</span>
                <button
                    onClick={() => updateQuantity(item?.product?.id, item?.quantity + 1)}
                    className="p-1 bg-white rounded-md text-slate-600 hover:bg-slate-200 shadow-sm transition"
                >
                    <Plus size={16} />
                </button>
            </div>

            <div className="font-black text-slate-800 text-lg min-w-20 sm:text-right text-center">
                S/. {item?.product?.price * item?.quantity}
            </div>

            <button
                onClick={() => removeFromCart(item?.product?.id)}
                className="p-2 text-rose-400 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition"
                title="Eliminar del carrito"
            >
                <Trash2 size={20} />
            </button>
        </div>
    )
}

export default ProductCart