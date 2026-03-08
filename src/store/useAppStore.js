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
                            user: {
                                name: respuesta?.data?.nombre,
                                role: respuesta?.data?.rol,
                            },
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
        }),
        {
            name: "info-profile",
            storage: createJSONStorage(() => localStorage)
        }
    )
)