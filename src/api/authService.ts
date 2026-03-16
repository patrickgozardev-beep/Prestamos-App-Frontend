import type { AuthRequest } from "../types/AuthRequest";
import type { AuthResponse } from "../types/AuthResponse";
import api from "./axios/axios";

const authService = {
  /**
   * Envía las credenciales al backend y guarda el token si es exitoso
   */
  login: async (credentials: AuthRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/login", credentials);
    
    if (response.data.token) {
      // Guardamos el token en localStorage para que persista al recargar
      localStorage.setItem("token", response.data.token);
    }
    
    return response.data;
  },

  /**
   * Cierra la sesión eliminando el token y limpiando cualquier dato sensible
   */
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    
    window.location.href = "/";
  },

  /**
   * Verifica si existe un token guardado
   */
  isLoggedIn: (): boolean => {
    return !!localStorage.getItem("token");
  },

  /**
   * Obtiene el token actual
   */
  getToken: (): string | null => {
    return localStorage.getItem("token");
  }
};

export default authService;