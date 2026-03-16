import axios from "axios";

const api = axios.create({
  //baseURL: "http://localhost:8080/api",
  baseURL: import.meta.env.VITE_API_URL ||"https://prestamos-app-backend-production-71e2.up.railway.app/api",  
  withCredentials: true,
});

// 🚀 AGREGAR ESTO: Interceptor de petición
api.interceptors.request.use(
  (config) => {
    // Recuperamos el token del localStorage
    const token = localStorage.getItem("token");

    // Si el token existe, lo añadimos al header Authorization
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// OPCIONAL: Interceptor de respuesta para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si el servidor responde 401 (No autorizado) o 403 (Prohibido)
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Limpiamos el token porque probablemente ya no es válido
      localStorage.removeItem("token");
      
      // Redirigir al login si no estamos ya ahí
      if (!window.location.pathname.includes("/")) {
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

export default api;