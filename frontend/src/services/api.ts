import axios from "axios";
import { type PatientFormValues } from "../types/patient";
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

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
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
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
