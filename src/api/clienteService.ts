import type { Cliente } from "../types/Cliente";
import api from "./axios/axios";

const clienteService = {

  // GET: Listar todos
  listarTodos: async (): Promise<Cliente[]> => {
    const response = await api.get<Cliente[]>("/clientes");
    return response.data;
  },

  // GET: Listar clientes por usuario
  listarPorUsuario: async (usuarioId: number): Promise<Cliente[]> => {
      const response = await api.get<Cliente[]>(`/clientes/usuario/${usuarioId}`);
      return response.data;
  },    

  // GET: Buscar por nombre o DNI filtrando por usuario
  buscar: async (usuarioId: number, busqueda: string): Promise<Cliente[]> => {
      const response = await api.get<Cliente[]>("/clientes/buscar", {
        params: {
          usuarioId: usuarioId, // Nombre exacto como en el Controller de Java
          busqueda: busqueda    // Nombre exacto como en el Controller de Java
        }
      });
      return response.data;
    },

  obtenerPorId: async (id: number): Promise<Cliente> => {
    const response = await api.get<Cliente>(`/clientes/${id}`);
    return response.data;
  },

  // POST: Crear nuevo cliente
  crear: async (cliente: Cliente): Promise<Cliente> => {
    const response = await api.post<Cliente>("/clientes", cliente);
    return response.data;
  },

  // PUT: Actualizar cliente
  actualizar: async (id: number, cliente: Cliente): Promise<Cliente> => {
    const response = await api.put<Cliente>(`/clientes/${id}`, cliente);
    return response.data;
  },

  // DELETE: Eliminar cliente
  eliminar: async (id: number): Promise<void> => {
    await api.delete(`/clientes/${id}`);
  }

};

export default clienteService;