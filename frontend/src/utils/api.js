// utils/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // ✅ backend ke routes yahi se start hote hain
  withCredentials: false, // agar cookies use kar rahe ho to true
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
