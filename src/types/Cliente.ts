export interface ClienteDTO {
    id?: number;
    nombres: string;
    dni: string;
    telefono?: string;
    googleMapsLink?: string;
    dniPdf?: string;
    // Campos extra que podrías necesitar en el UI
    estado?: string; 
    montoTotal?: string; 
  }