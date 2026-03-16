import type { ClienteDTO } from "../types/Cliente";
import api from "./axios/axios";

const clienteService = {

  // GET: Listar todos
  listarTodos: async (): Promise<ClienteDTO[]> => {
    const response = await api.get<ClienteDTO[]>("/clientes");
    return response.data;
  },

  // GET: Listar clientes por usuario
  listarPorUsuario: async (): Promise<ClienteDTO[]> => {
      const response = await api.get<ClienteDTO[]>(`/clientes/usuario`);
      return response.data;
  },    

  // GET: Buscar por nombre o DNI filtrando por usuario
  buscar: async (usuarioId: number, busqueda: string): Promise<ClienteDTO[]> => {
      const response = await api.get<ClienteDTO[]>("/clientes/buscar", {
        params: {
          usuarioId: usuarioId, // Nombre exacto como en el Controller de Java
          busqueda: busqueda    // Nombre exacto como en el Controller de Java
        }
      });
      return response.data;
    },

  obtenerPorId: async (id: number): Promise<ClienteDTO> => {
    const response = await api.get<ClienteDTO>(`/clientes/${id}`);
    return response.data;
  },

  // POST: Crear nuevo cliente
  crear: async (cliente: ClienteDTO): Promise<ClienteDTO> => {
    const response = await api.post<ClienteDTO>("/clientes", cliente);
    return response.data;
  },

  // PUT: Actualizar cliente
  actualizar: async (id: number, cliente: ClienteDTO): Promise<ClienteDTO> => {
    const response = await api.put<ClienteDTO>(`/clientes/${id}`, cliente);
    return response.data;
  },

  // DELETE: Eliminar cliente
  eliminar: async (id: number): Promise<void> => {
    await api.delete(`/clientes/${id}`);
  }

};

export default clienteService;