export interface CronogramaDTO {
    id: number;
    numeroCuota: number;
    monto: number;
    montoPagado: number;
    montoPendiente: number; // Nuevo: viene del cálculo en Java
    fechaVencimiento: string; // Cambiado de fechaPago para coincidir con el Back
    estado: 'PENDIENTE' | 'PAGADO' | 'ATRASADO' | 'PARCIAL' | 'INACTIVO';
    fechaPagado?: string; // Opcional, solo si ya se pagó
}