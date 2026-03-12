// src/utils/validaciones.ts

/**
 * Expresiones Regulares (Patterns)
 */
export const REGEX_DNI = /^[0-9]{8}$/;
export const REGEX_TELEFONO = /^9[0-9]{8}$/;

/**
 * Funciones de Validación
 */
export const validarDni = (dni: string): boolean => {
  return REGEX_DNI.test(dni);
};

export const validarTelefono = (telefono: string): boolean => {
  // Solo valida si tiene algo escrito, si está vacío depende de si es obligatorio o no
  if (!telefono) return true; 
  return REGEX_TELEFONO.test(telefono);
};

/**
 * Formateadores (Opcional, pero muy útil para UX)
 */
export const soloNumeros = (valor: string): string => {
  return valor.replace(/\D/g, ""); // Elimina cualquier cosa que no sea número
};