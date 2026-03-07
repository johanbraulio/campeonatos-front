const TableGeneral = ({ data, tableType }) => {

    return (
        <table className="w-full border-collapse text-left">
            <thead>
                <tr className={`border-b border-slate-500 text-slate-600 ${tableType === "panelAdmin" && "bg-slate-900 text-white"}`}>
                    {
                        tableType === "panelAdmin" &&
                        <th className="p-4 font-bold tetx-sm text-left">Cliente(Email)</th>
                    }
                    <th className="p-4 font-bold tetx-sm">Producto</th>
                    <th className="p-4 font-bold tetx-sm">Fecha de Transacción</th>
                    <th className="p-4 font-bold tetx-sm text-right">Monto Total</th>
                </tr>
            </thead>
            <tbody>
                {
                    data?.map((item, index) => {
                        return (
                            <tr key={index} className="border-b border-salte-100 hover:bg-slate-50">
                                {
                                    tableType === "panelAdmin" &&
                                    <td className="p-4 font-bold text-indigo-600 text-sm text-left">{item?.userEmail}</td>
                                }
                                <td className="p-4 flex items-center gap-4">
                                    <div>
                                        <img src={item.productImage} alt="product" className="w-12 h-12 object-cover rounded-xs" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <div>
                                            {item.productTitle}
                                        </div>
                                        <div className="text-xs text-slate-500">
                                            Order #{item.id}
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 text-sm text-slate-500">{new Date(item?.date).toLocaleString()}</td>
                                <td className="p-4 font-black text-indigo-600 text-right">S/. {item?.price}</td>
                            </tr>
                        )
                    })
                }
            </tbody>
        </table>
    )
}

export default TableGeneral