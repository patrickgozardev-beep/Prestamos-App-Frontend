import api from "./axios";

const publicService = {
  /**
   * Envía una petición al endpoint público para despertar el servidor en Render.
   * No requiere token ni autenticación.
   */
  checkHealth: async (): Promise<any> => {
    // Usamos el endpoint que configuramos en el backend
    const response = await api.get("/public/health");
    return response.data;
  },
};

export default publicService;