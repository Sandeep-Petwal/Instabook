import { useInstaContext } from '@/hooks/useInstaContext';
import { GoogleLogin } from '@react-oauth/google';
const SERVER_URL = import.meta.env.VITE_SERVER_URL;
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from 'react-router-dom';

const GoogleLoginButton = () => {
    const navigate = useNavigate();
    const { verifyUser } = useInstaContext();


    const handleSuccess = async (response) => {
        console.log('Login Success:', response);
        const idToken = response.credential;
        if (!idToken) {
            console.error("ID Token not found in response. Ensure your Google OAuth configuration is correct.");
            return;
        }

        try {
            const res = await fetch(`${SERVER_URL}/api/user/auth/google`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idToken }), // Send the idToken to the server
            });

            const data = await res.json();

            if (res.ok) {
                toast.success(data.message);
                localStorage.setItem('instabook_token', data.token);
                verifyUser();
                navigate('/home');
                console.log('Backend Response:', data);
            } else {
                toast.error(data.error);
                console.error('Error from backend:', data.error);
            }
        } catch (error) {
            toast.error('Error during fetch');
            console.error('Error during fetch:', error);
        }
    };

    const handleError = (error) => {
        console.error('Login Failed:', error);
    };

    return (

        <>
            <GoogleLogin
                onSuccess={handleSuccess}
                onError={handleError}
            />
            <Toaster position="top-center" reverseOrder={false} />

        </>
    );
};

export default GoogleLoginButton;
