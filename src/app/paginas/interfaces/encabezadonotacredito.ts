export interface EncabezadoNotaCredito {
  IdNotaCreditoPK: number;
  FechaEmision: string;
  TotalCredito: number;
  EstadoNota: 'Activa' | 'Anulada';
  VentaOriginal: string;
  NombreCliente: string;
  RUC: string | null;
  DNI: string | null;
  UsuarioEmisor: string;
  Motivo: string;
  ObservacionesAdicionales: string;
  
  // --- CAMPOS NUEVOS (pueden ser nulos si la nota está activa) ---
  UsuarioAnulador?: string | null;
  FechaAnulacion?: string | null;
  MotivoAnulacion?: string | null;
}