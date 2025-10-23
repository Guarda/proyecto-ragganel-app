export interface HistorialArticulo {
  FechaCambio: string | Date;
  EstadoAnteriorDescripcion: string | null;
  EstadoNuevoDescripcion: string;
  StockAnterior: number | null;
  StockNuevo: number | null;
  Usuario: string;
}