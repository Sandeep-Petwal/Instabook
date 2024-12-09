import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: apiUrl,
});

// Add Interceptors Directly
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("insta_admin");

    if (token) {
      config.headers.insta_admin = token;
      config.headers.instabook_token = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("insta_admin");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
