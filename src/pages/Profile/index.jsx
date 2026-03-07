import { Activity, Edit, Mail, Save, Shield, User, X } from "lucide-react"
import { useAppStore } from "../../store/useAppStore"
import { useEffect, useState } from "react"
import axios from "axios"
import Swal from "sweetalert2"
import { useForm } from "react-hook-form"
import CardUser from "../../components/Profile/CardUser"
import PopupEditUser from "../../components/Profile/PopupEditUser"

const Profile = () => {

    const { user, apiUrl, updateUser } = useAppStore()

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        defaultValues: {
            name: user?.name,
            email: user?.email,
            avatar: user?.avatar
        }
    })

    const [isShowPopUp, setIsShowPopUp] = useState(false)
    const [loading, setLoading] = useState(false)

    const onSubmit = async (data) => {

        console.log("data: ", data)

        try {
            setLoading(true)
            const response = await axios.patch(`${apiUrl}/users/${user?.id}`, data)
            console.log("response: ", response)
            if (response?.status === 200) {
                Swal.fire({
                    title: 'Perfil actualizado',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: true
                })
                setIsShowPopUp(false)
                updateUser(response.data)
            }
        }
        catch (error) {
            console.log("error", error)
        }
        finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-12 relative">
            <CardUser
                user={user}
                setIsShowPopUp={setIsShowPopUp}
            />

            {
                isShowPopUp &&
                <PopupEditUser
                    {...{
                        setIsShowPopUp,
                        handleSubmit,
                        onSubmit,
                        register,
                        errors,
                        loading
                    }}
                />
            }

        </div>
    )
}

export default Profile