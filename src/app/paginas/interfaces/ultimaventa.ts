export interface UltimaVenta {
  IdVentaPK: number;
  NumeroDocumento: string;
  NombreCliente: string;
  TotalVenta: number;
  NombreVendedor: string;
  FechaCreacion: string | Date;
  ArticulosVendidos: string; // <-- AÑADIR ESTA LÍNEA
}