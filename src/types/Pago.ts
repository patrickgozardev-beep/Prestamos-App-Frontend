export interface PagoDTO {
    cronogramaId: number;
    monto: number;
    metodo: string; 
    foto?: string;
  }

  export interface PagoResponse {
    id: number;
    monto: number;
    metodo: string;
    fechaPago: string;
    fotoPago?: string;
    cronograma?: any; // Opcional, dependiendo de si necesitas los datos de la cuota
  }