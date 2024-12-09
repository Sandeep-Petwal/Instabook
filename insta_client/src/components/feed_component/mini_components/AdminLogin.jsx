import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function AdminLogin() {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const getTokenFromURL = () => {
            const urlParams = new URLSearchParams(location.search);
            return urlParams.get('token');
        };

        const token = getTokenFromURL();

        localStorage.setItem('instabook_token', token);
        navigate("/login")

        // if (token) {
        //     navigate('/'); 
        // } else {
        //     console.log('Token not found in the URL');
        // }
    }, [location, navigate]);

    return (
        <div>
            <h1>Admin Login</h1>
            <p>Redirecting...</p>
        </div>
    );
}

export default AdminLogin;
