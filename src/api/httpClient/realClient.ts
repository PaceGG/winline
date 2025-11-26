import axios from "axios";

const realClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
});

realClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default realClient;
