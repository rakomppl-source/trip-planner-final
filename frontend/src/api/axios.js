import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api"
});

api.interceptors.request.use((config) => {
  const raw = localStorage.getItem("trip_planner_auth");
  if (raw) {
    try {
      const { token } = JSON.parse(raw);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      localStorage.removeItem("trip_planner_auth");
    }
  }

  return config;
});

export default api;
