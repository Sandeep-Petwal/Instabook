import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: apiUrl,
});

// Add Interceptors Directly
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("instabook_token");
    if (token) {
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
      localStorage.removeItem("instabook_token");
      window.location.href = "/login";
    }
    return Promise.reject(error); 
  }
);

export default axiosInstance;
