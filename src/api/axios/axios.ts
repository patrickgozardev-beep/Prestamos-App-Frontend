import axios from "axios";

const api = axios.create({
//baseURL: "http://192.168.18.6:8080/api",
 baseURL: import.meta.env.VITE_API_URL ||"https://prestamos-app-backend.onrender.com/api",  
  withCredentials: true,
});

// 🚀 AGREGAR ESTO: Interceptor de petición
api.interceptors.request.use(
  (config) => {
    // Recuperamos el token del localStorage
    const token = localStorage.getItem("token");

    // Si el token existe, lo aña dimos al header Authorization
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

    return Promise.reject(error);
  }
);

export default api;