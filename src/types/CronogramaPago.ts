export interface CronogramaDTO {
    id: number;
    numeroCuota: number;
    monto: number;
    montoPagado: number;
    montoPendiente: number; 
    fechaVencimiento: string; 
    estado: 'PENDIENTE' | 'PAGADO' | 'ATRASADO' | 'PARCIAL' | 'INACTIVO';
    fechaPagado?: string;
}
export interface CronogramaDetalladoDTO {
    id: number;
    prestamoId:number;
    nombreCliente:string;
    numeroCuota: number;
    monto: number;
    montoPagado: number;
    montoPendiente: number;
    fechaVencimiento: string; 
    estado: 'PENDIENTE' | 'PAGADO' | 'ATRASADO' | 'PARCIAL' | 'INACTIVO';
    fechaPagado?: string; 
}