/* eslint-disable react/prop-types */
import { createContext } from "react";
import { useState } from "react";
const apiUrl = import.meta.env.VITE_API_URL;
import axios from "axios";
import axiosInstance from "../api/axios";

const AdminContext = createContext();
export const AdminContextProvider = ({ children }) => {
    const [user, setUser] = useState({
        isLoggedIn: false,
        user_id: null,
        name: null,
        username: null,
        email: null,
        bio: null,
        profile_url: null,
    });
    const [two_factor_enabled, set_Two_factor_enabled] = useState();

    const logout = async () => {
        console.log("Logging out ::");
        try {
            await axiosInstance.get("/user/logout");
        } catch (error) {
            console.error("Error logging out:", error);
        } finally {
            localStorage.removeItem("insta_admin");
            setUser({ isLoggedIn: false, user_id: null, email: null, name: null });
        }
    };

    // Function to verify user with token from localStorage
    const verifyUser = async (insta_admin) => {
        console.log("context :: verifyUser");
        try {
            // console.log("Verifyieng user : token is :"  + insta_admin)
            const response = await axios.post(
                `${apiUrl}/admin/users/verify-token`,
                {},
                { headers: { insta_admin } }
            );
            console.clear();
            console.log("Token verified");
            const { user_id, email, name, username, bio, profile_url } =
                response.data.data;
            setUser({
                isLoggedIn: true,
                user_id,
                email,
                name,
                username,
                bio,
                profile_url,
            });
            set_Two_factor_enabled(response.data.data.two_factor_enabled);
        } catch (error) {
            console.error("Error verifying user:", error);
            logout();
        }
    };

    return (
        <AdminContext.Provider
            value={{
                user,
                logout,
                verifyUser,
                setUser,
                two_factor_enabled,
                set_Two_factor_enabled,
                admin_user_id : user.user_id
            }}
        >
            {children}
        </AdminContext.Provider>
    );
};

export { AdminContext };
