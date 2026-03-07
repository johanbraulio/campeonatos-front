import axios from "axios"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import Swal from 'sweetalert2'
import { API_URL } from "@/config/api";

export const useAppStore = create(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isLoading: false,
            error: null,
            login: async (username, password) => {
                try {
                    set({
                        isLoading: true
                    })
                    const respuesta = await axios.post(`${API_URL}/auth/login`, {
                        username: username,
                        password: password
                    })
                    if (respuesta?.data?.token) {
                        set({
                            user: respuesta?.data?.nombre,
                            token: respuesta?.data?.token
                        })
                    }
                }
                catch (err) {
                    Swal.fire({
                        title: 'Error',
                        text: "Error al iniciar sesión, verifique sus credenciales",
                        icon: 'error',
                    })
                }
                finally {
                    set({
                        isLoading: false
                    })
                }
            },
            logout: () => {
                set({
                    user: null,
                    token: null,
                    isLoading: false,
                    error: null
                })
            },
            hasRole: (roles) => {
                const currentRole = get().user
                if (currentRole === null) {
                    return false
                }
                if (Array.isArray(roles)) {
                    const hasRole = roles?.includes(currentRole.role)
                    return hasRole
                }
                return currentRole.role === roles
            },
            updateUser: (newDataUser) => set((state) => ({
                user: { ...state.user, ...newDataUser }
            })),
            /* addToCart: (product) => {
                set((state) => {
                    const existingItem = state.cart.find(item => item.product.id == product.id)
                    if (existingItem) {
                        Swal.fire({
                            title: "Ya tienes este producto en el carrito",
                            icon: "warning",
                            toast: true,
                            position: "top-end",
                            showConfirmButton: false,
                            timer: 2000,
                            timerProgressBar: true
                        })
                        return {
                            cart: [...state.cart]
                        }
                    }
                    else {
                        Swal.fire({
                            title: "Agregado al carrito",
                            icon: "success",
                            toast: true,
                            position: "top-end",
                            showConfirmButton: false,
                            timer: 2000,
                            timerProgressBar: true
                        })
                        return {
                            cart: [...state.cart, { product, quantity: 1 }]
                        }
                    }
                })
            },
            updateQuantity: (productId, newQuantity) => set((state) => ({
                cart: state.cart.map(item =>
                    item.product.id == productId ?
                        { ...item, quantity: Math.max(1, newQuantity) }
                        :
                        item
                )
            })),
            removeFromCart: (productId) => set((state) => ({
                cart: state.cart.filter(item => item.product.id !== productId)
            })),
            clearCart: () => set(
                {
                    cart: []
                }
            ) */
        }),
        {
            name: "info-profile",
            storage: createJSONStorage(() => localStorage)
        }
    )
)