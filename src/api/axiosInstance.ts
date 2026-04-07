import axios, { AxiosError } from "axios";
import { environment } from "../environments/environment";

const api = axios.create({
  baseURL: environment.apiBase,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("t");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<any>) => {
    const status = error.response?.status;

    if (status === 401) {
      localStorage.removeItem("t");
      localStorage.removeItem("r");
      window.location.href = "/login";
    }

    if (status && status >= 500) {
      console.error("Server Error");
    }

    return Promise.reject(error);
  },
);

export default api;
