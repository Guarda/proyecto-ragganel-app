export interface UltimaVenta {
  NumeroDocumento: string;
  NombreCliente: string;
  TotalVenta: number;
  NombreVendedor: string;
  FechaCreacion: string | Date;
  ArticulosVendidos: string; // <-- AÑADIR ESTA LÍNEA
}