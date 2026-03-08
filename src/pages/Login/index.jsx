import { Activity } from "lucide-react";
import { use, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../../store/useAppStore";
import LoginForm from "../../components/Login/LoginForm";

const Login = () => {

    const navigate = useNavigate()

    const { login, user, isLoading } = useAppStore();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        await login(username, password);

    }

    useEffect(() => {
        if (user !== null) {
            navigate("/panel-admin")
        }
    }, [user])

    return (
        <LoginForm handleSubmit={handleSubmit} username={username} setUsername={setUsername} password={password} setPassword={setPassword} isLoading={isLoading} />
    )
}

export default Login