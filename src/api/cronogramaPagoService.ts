import type { CronogramaDetalladoDTO, CronogramaDTO } from "../types/CronogramaPago";
import api from "./axios/axios"; // Importamos tu instancia configurada

const cronogramaService = {
    listarPorPrestamo: async (prestamoId: number): Promise<CronogramaDTO[]> => {
      const response = await api.get<CronogramaDTO[]>(`/cronogramas/prestamo/${prestamoId}`);
      return response.data;
    },
  
    obtenerPorId: async (cronogramaId: number): Promise<CronogramaDTO> => {
      const response = await api.get<CronogramaDTO>(`/cronogramas/${cronogramaId}`);
      return response.data;
    },

    obtenerProximosCobros: async (): Promise<CronogramaDetalladoDTO[]> => {
        const response = await api.get<CronogramaDetalladoDTO[]>(`/cronogramas/proximos-cobros`);
        return response.data;
    }
};



export default cronogramaService;