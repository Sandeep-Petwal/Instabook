import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import LoginComponent from '../components/LoginComponent';

document.title = "Login - Instabook"
function Login() {
    const navigate = useNavigate();
    useEffect(() => {
        if (localStorage.getItem("instabook_token")) {
            navigate("/")
        }
    }, [])

    return (
        <div className='w-full h-screen flex justify-center items-center'>
            <LoginComponent />
        </div>
    )
}

export default Login
