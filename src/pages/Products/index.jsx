import axios from "axios"
import { Activity, Eye, ShoppingCart, X } from "lucide-react"
import { useEffect, useState } from "react"
import { useAppStore } from "../../store/useAppStore"
import Product from "../../components/Products/Product"
import PopupDetailsProduct from "../../components/Products/PopupDetailsProduct"

const API = "https://f6280e940fffd701.mokky.dev"

const Products = () => {

    const { addToCart, cart } = useAppStore()

    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(false)
    const [show, setShow] = useState(false)
    const [product, setProduct] = useState(null)

    useEffect(() => {

        const fetchProducts = async () => {
            setLoading(true)
            try {
                const response = await axios.get(`${API}/products`)
                console.log("la respueste es: ", response)
                setProducts(response.data)
            }
            catch (err) {
                console.log("err: ", err)
            }
            finally {
                setLoading(false)
            }


        }

        fetchProducts()

    }, [])

    const handlePopup = (active) => {
        setShow(active)
    }

    const hadnleProduct = (productOnly) => {
        setProduct(productOnly)
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <Activity className="h-20 w-20 text-indigo-600 animate-spin" />
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-start h-screen p-5 relative z-10">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
                Catálogo de Productos
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {
                    products.map((item, index) => {
                        return (
                            <Product
                                key={index}
                                item={item}
                                handlePopup={handlePopup}
                                hadnleProduct={hadnleProduct}
                                addToCart={addToCart}
                            />
                        )
                    })
                }
            </div>

            {
                show &&
                <PopupDetailsProduct
                    {...{
                        product,
                        handlePopup,
                        hadnleProduct,
                        addToCart
                    }}
                />
            }

        </div>
    )
}

export default Products