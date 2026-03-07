import { useAppStore } from "@/store/useAppStore"
import { Box, Button, Modal, Typography } from "@mui/material"
import axios from "axios";
import { Activity, Eye, Save, ShoppingCart, X } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 450,
    bgcolor: 'background.paper',
    // border: '1px solid #000',
    borderRadius: "20px",
    boxShadow: 24,
    p: 4,
};

const Product = ({ item, handlePopup, hadnleProduct, addToCart }) => {

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        defaultValues: {
            title: item?.title,
            description: item?.description,
            price: item?.price,
            image: item?.images[0]
        }
    })

    const [loading, setLoading] = useState(false)

    const { hasRole, apiUrl } = useAppStore()
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const onSubmit = async (data) => {
        console.log("data: ", data)

        const objData = {
            title: data.title,
            description: data.description,
            price: Number(data.price),
            images: [...item.images, data.image],
        }

        try {
            setLoading(true)
            const res = await axios.patch(`${apiUrl}/products/${item?.id}`, objData)
            console.log("res: ", res)
            if (res?.status === 200) {
                Swal.fire({
                    title: 'Producto actualizado con éxito',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1000,
                    timerProgressBar: true,
                })

                setTimeout(() => {
                    handleClose()
                    reset()
                    window.location.reload()
                }, 1000)
            }
        }
        catch (error) {

        }
        finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-white shadow-lg rounded-lg max-w-75 h-115 overflow-hidden pb-3">
            <img
                src={item?.images[0]}
                alt="prodcut"
                className="w-full h-75 object-cover"
            />
            <div className="p-3">
                <div className="flex justify-start gap-5 items-center">
                    <h1 className="truncate font-bold">{item?.title}</h1>
                    <span className="text-indigo-500 font-extrabold">S/.{item?.price}</span>
                </div>
                <p className="line-clamp-2">{item?.description}</p>
            </div>

            <div className="flex flex-col gap-1 px-3">
                <div className={`grid ${hasRole(["admin"]) ? "grid-cols-3" : "grid-cols-2"} items-center gap-1`}>
                    <button
                        className="text-white bg-slate-900 flex gap-1 items-center justify-center px-4 py-2 rounded-md font-bold w-full hover:bg-slate-950 cursor-pointer h-9"
                        onClick={() => {
                            handlePopup(true)
                            hadnleProduct(item)
                        }}
                    >
                        <Eye
                            className="text-white -mt-[0.05rem]"
                            size={20}
                        />
                    </button>
                    <button
                        onClick={() => addToCart(item)}
                        className="text-white bg-slate-900 flex gap-2 items-center justify-center px-4 py-2 rounded-md font-bold w-full hover:bg-slate-950 cursor-pointer h-9"
                    >
                        <ShoppingCart
                            className="text-white -mt-[0.20rem]"
                            size={20}
                        />
                    </button>
                    {
                        hasRole(["admin"]) &&
                        <Button
                            onClick={handleOpen}
                            variant="outlined"
                            color="warning"
                        >
                            Editar
                        </Button>
                    }
                </div>
            </div>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden relative">

                            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50">
                                <h2 className="text-xl font-bold text-slate-800">Editar Información</h2>
                                <button
                                    onClick={handleClose}
                                    className="text-slate-400 hover:text-slate-800 bg-white p-1.5 rounded-full shadow-sm border border-slate-200"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <form
                                onSubmit={handleSubmit(onSubmit)}
                                className="p-6 space-y-4"
                            >
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Nombre de Producto</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none"
                                        {...register("title", {
                                            required: {
                                                value: true,
                                                message: "El nombre del producto es requerido"
                                            },
                                            minLength: {
                                                value: 3,
                                                message: "El nombre del producto debe tener al menos 3 caracteres"
                                            }
                                        })}
                                    />
                                    {
                                        errors.title &&
                                        <span className="text-red-500 text-xs font-bold">{errors.title.message}</span>
                                    }
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Descripción del Producto</label>
                                    <textarea
                                        type="text"
                                        rows={5}
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
                                        {...register("description", {
                                            required: {
                                                value: true,
                                                message: "La Descripción es requerida"
                                            }
                                        })}
                                    />
                                    {
                                        errors.description &&
                                        <span className="text-red-500 text-xs font-bold">{errors.description.message}</span>
                                    }
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Precio de Producto</label>
                                    <input
                                        // type="number"
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
                                        {...register("price", {
                                            required: {
                                                value: true,
                                                message: "El precio es requerido"
                                            },
                                            type: "number",
                                            min: {
                                                value: 1,
                                                message: "El precio debe ser mayor a 0"
                                            }
                                        })}
                                    />
                                    {
                                        errors.price &&
                                        <span className="text-red-500 text-xs font-bold">{errors.price.message}</span>
                                    }
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">URL de Foto de Producto</label>
                                    <input
                                        type="text"
                                        placeholder="link de imagen"
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all text-sm"
                                        {...register("image", {
                                            required: {
                                                value: true,
                                                message: "La url de la imagen es requerida"
                                            }
                                        })}
                                    />
                                    {
                                        errors.image &&
                                        <span className="text-red-500 text-xs font-bold">{errors.image.message}</span>
                                    }
                                </div>

                                <div className="pt-4 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={handleClose}
                                        className="w-1/2 py-3 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-1/2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white font-bold py-3 rounded-xl transition-all shadow-md flex justify-center items-center gap-2"
                                    >
                                        {loading ? <Activity className="animate-spin" size={20} /> : <><Save size={20} /> Guardar Cambios</>}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </Box>
            </Modal>

        </div>
    )
}

export default Product