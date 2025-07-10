// 1. Importa las dos interfaces que ya tienes
import { VentaCompleta } from './ventacompleta';
import { DetalleVentaCompleta } from './detalleventacompleta';

// 2. Define la interfaz contenedora
export interface VentaCompletaResponse {
  success: boolean;
  data: {
    venta: VentaCompleta;
    detalles: DetalleVentaCompleta[];
  };
  error?: string; // Propiedad opcional para manejar mensajes de error
}