export interface ProformaInfo {
  IdVentaPK: number;
  FechaCreacion: string; // O puedes usar el tipo Date si lo transformas
  NumeroDocumento: string;
  SubtotalVenta: number;
  IVA: number;
  TotalVenta: number;
  Observaciones: string;
  NombreCliente: string;
  Telefono: string;
  CorreoElectronico: string;
  Vendedor: string;
  EstadoVenta: string;
  MetodoPago: string;
  IdClienteFK: number;
  IdMetodoDePagoFK: number;
}