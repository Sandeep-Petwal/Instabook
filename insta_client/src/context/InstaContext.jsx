/* eslint-disable react/prop-types */
import { createContext, useState } from "react";
import axiosInstance from "@/api/axios";

const InstaContext = createContext();

export const InstaContextProvider = ({ children }) => {

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

  const login = (user_id, email, name, username) => {
    setUser({ isLoggedIn: true, user_id, email, name, username });
  };

  const logout = async () => {
    console.log("Logging out ::");
    try {
      if (localStorage.getItem("instabook_token")) {
        await axiosInstance.get("/user/logout");
      }
      
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      localStorage.removeItem("instabook_token");
      setUser({ isLoggedIn: false, user_id: null, email: null, name: null, username: null, });
    }
  };

  const verifyUser = async (instabook_token) => {
    console.log("context :: verifyUser");
    try {
      const response = await axiosInstance.post(`/user/verify`);
      console.log("Token verified");
      const { user_id, email, name, username, bio, profile_url } =
        response.data.data;
      set_Two_factor_enabled(response.data.data.two_factor_enabled);

      setUser({
        isLoggedIn: true,
        user_id,
        email,
        name,
        username,
        bio,
        profile_url,
        two_factor_enabled,
      });
    } catch (error) {
      console.error("Error verifying user:", error);
      logout();
    }
  };

  return (
    <InstaContext.Provider
      value={{
        user,
        login,
        logout,
        verifyUser,
        setUser,
        two_factor_enabled,
        set_Two_factor_enabled,
      }}
    >
      {children}
    </InstaContext.Provider>
  );
};

export { InstaContext };
