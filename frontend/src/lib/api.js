import axios from "axios";
import { useNavigate } from "react-router-dom";

const nagvigator = useNavigate();
const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

// Add auth token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 responses - redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("authUser");
      navigator("/login");
    }
    return Promise.reject(error);
  }
);

export default api;
