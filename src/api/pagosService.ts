import type { PagoDTO, PagoResponse } from "../types/Pago";
import api from "./axios/axios";

const pagoService = {
  
  /**
   * POST: Registrar un nuevo pago.
   * Este método activa la lógica de excedentes en el backend.
   */
  registrarPago: async (dto: PagoDTO): Promise<PagoResponse> => {
    const response = await api.post<PagoResponse>("/pagos/registrar", dto);
    return response.data;
  },

  /**
   * GET: Listar todos los pagos realizados a un préstamo específico.
   * Útil para mostrar un historial de transacciones en el detalle del préstamo.
   */
  listarPorPrestamo: async (prestamoId: number): Promise<PagoResponse[]> => {
    const response = await api.get<PagoResponse[]>(`/pagos/prestamo/${prestamoId}`);
    return response.data;
  },

  /**
   * GET: Listar pagos asociados a una cuota (cronograma) específica.
   * Útil si quieres ver si una cuota se pagó en varias partes (PAGOS PARCIALES).
   */
  listarPorCuota: async (cronogramaId: number): Promise<PagoResponse[]> => {
    const response = await api.get<PagoResponse[]>(`/pagos/cronograma/${cronogramaId}`);
    return response.data;
  },

  obtenerPorId: async (pagoId: number) => {
    const response = await api.get(`/pagos/${pagoId}`);
    return response.data;
  },

  // Eliminar un pago (usando la lógica de reversión que creamos en el backend)
  eliminar: async (pagoId: number) => {
    const response = await api.delete(`/pagos/${pagoId}`);
    return response.data;
  }
};

export default pagoService;