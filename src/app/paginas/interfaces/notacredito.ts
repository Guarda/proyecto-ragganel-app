// 1. Definimos la interfaz para la Nota de Crédito
export interface NotaCredito {
  IdNotaCreditoPK: number;
  FechaEmision: string;
  NumeroVentaOriginal: string;
  NombreCliente: string;
  Motivo: string;
  TotalCredito: number;
  UsuarioEmisor: string;
  EstadoNota: 'Activa' | 'Anulada';
}