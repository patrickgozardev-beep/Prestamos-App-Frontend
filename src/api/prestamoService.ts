import type { PrestamoDetalleDTO, PrestamoDTO } from "../types/Prestamo";
import api from "./axios/axios";

const prestamoService = {
    // POST: Crear préstamo diario
    crearDiario: async (dto: PrestamoDTO): Promise<PrestamoDTO> => {
      const response = await api.post<PrestamoDTO>("/prestamos/diario", dto);
      return response.data;
    },
  
    // POST: Crear préstamo semanal
    crearSemanal: async (dto: PrestamoDTO): Promise<PrestamoDTO> => {
      const response = await api.post<PrestamoDTO>("/prestamos/semanal", dto);
      return response.data;
    },

    // POST: Reprogramar préstamo (Usa params para el @RequestParam del back)
    reprogramar: async (prestamoId: number, nuevasCuotas: number, interes: number): Promise<PrestamoDTO> => {
      const response = await api.post<PrestamoDTO>(
        `/prestamos/${prestamoId}/reprogramar`, 
        null, 
        {
          params: { 
            nuevasCuotas, 
            interes 
          } 
        }
      );
      return response.data;
    },
  
    // GET: Ver préstamos por cliente
    listarPorCliente: async (clienteId: number): Promise<PrestamoDTO[]> => {
      const response = await api.get<PrestamoDTO[]>(`/prestamos/cliente/${clienteId}`);
      return response.data;
    },
  
    // GET: Ver préstamos por usuario (General)
    listarPorUsuario: async (usuarioId: number): Promise<PrestamoDTO[]> => {
      const response = await api.get<PrestamoDTO[]>(`/prestamos/usuario/${usuarioId}`);
      return response.data;
    },
    
    listarPorId: async (prestamoId: number): Promise<PrestamoDetalleDTO> => {
      const response = await api.get<PrestamoDetalleDTO>(`/prestamos/${prestamoId}`);
      return response.data;
    },
    getMetricasDashboard : async () => {
      const response = await api.get(`/prestamos/dashboard/resumen`);
      return response.data;
    }

  };
  
  export default prestamoService;