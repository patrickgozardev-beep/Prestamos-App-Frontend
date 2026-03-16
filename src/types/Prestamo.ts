import type { CronogramaDTO } from "./CronogramaPago";

export interface PrestamoDTO {
    clienteId: number;
    tipoPrestamoId: number;
    monto: number;
    interesPorcentaje: number;
    fechaInicio: string; 
    cantidadCuotas: number;
  }

export interface PrestamoDetalleDTO {
  id: number;
  monto: number;
  montoTotal: number;
  interesPorcentaje: number;
  estado: string;
  cliente: {
      nombres: string;
      dni: string;
  };
  cronogramas: CronogramaDTO[];
}

// Para la creación (Request)
export interface PrestamoCreateDTO {
    clienteId: number;
    tipoPrestamoId: number;
    monto: number;
    interesPorcentaje: number;
    fechaInicio: string; 
    cantidadCuotas: number;
}