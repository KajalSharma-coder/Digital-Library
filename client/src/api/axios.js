import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const auth = localStorage.getItem("dlms-auth");
  const parsed = auth ? JSON.parse(auth) : null;

  if (parsed?.token) {
    config.headers.Authorization = `Bearer ${parsed.token}`;
  }

  return config;
});

export default api;

