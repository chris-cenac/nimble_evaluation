import axios from "axios";
import { type PatientFormValues } from "../types/patient";
import { type AlertColor } from "@mui/material";
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

const getSuccessMessage = (method: string, url?: string) => {
  const endpointMap: { [key: string]: string } = {
    "/auth/login": "Login",
    "/auth/register": "Registration",
    "/patients": "Patient",
  };

  const actionMap: { [key: string]: string } = {
    post: "created",
    put: "updated",
    delete: "deleted",
  };

  const endpoint = url?.split("/")[1] || "";
  const resource =
    endpointMap[`/${endpoint}`] || endpointMap[url || ""] || "Item";

  const singularResource = resource.replace(/s$/, "");

  return `${singularResource} ${actionMap[method]} successfully`;
};

let showNotification: (message: string, type: AlertColor) => void;
export const injectNotification = (fn: typeof showNotification) => {
  showNotification = fn;
};
// Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => {
    const method = response.config.method?.toLowerCase();
    if (method === "post" || method === "put" || method === "delete") {
      const message = getSuccessMessage(method, response.config.url);
      showNotification?.(message, "success");
    }
    return response;
  },
  (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      !originalRequest.url?.includes("/auth/")
    ) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    } else {
      const message = error.response?.data?.message || "An error occurred";
      showNotification?.(message, "error");
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    api.post("/auth/login", credentials),

  register: (data: { email: string; password: string; username: string }) =>
    api.post("/auth/register", data),
};

export const patientAPI = {
  getAll: (search?: string) => api.get("/patients", { params: { id: search } }),
  create: (data: PatientFormValues) => api.post("/patients", data),
  update: (id: string, data: PatientFormValues) =>
    api.put(`/patients/${id}`, data),
  delete: (id: string) => api.delete(`/patients/${id}`),
};

export default api;
