import axios from "axios";

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
// Response interceptor handles 401 by attempting refresh-token rotation
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("authUser");
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        // call refresh endpoint (no auth header required)
        const res = await axios.post("http://localhost:3000/api/auth/refresh", {
          refreshToken,
        });
        const { token: newAccessToken, refreshToken: newRefreshToken } =
          res.data;
        // store new tokens
        localStorage.setItem("authToken", newAccessToken);
        if (newRefreshToken)
          localStorage.setItem("refreshToken", newRefreshToken);
        // update header and retry original request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // refresh failed -> clear storage and redirect to login
        localStorage.removeItem("authToken");
        localStorage.removeItem("authUser");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
