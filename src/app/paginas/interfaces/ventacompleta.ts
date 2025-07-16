export interface VentaCompleta {
NombreMetodoPago: any;
  IdVentaPK: number;
  FechaCreacion: string;
  NumeroDocumento: string;
  SubtotalVenta: number;
  IVA: number;
  TotalVenta: number;
  Observaciones: string;
  NombreCliente: string;
  RUC: string;
  DNI: string;
  NombreUsuario: string;
  IdUsuario: number;
  NombreMargen: string;
  // ...y cualquier otro campo que devuelva el primer SELECT del SP.
}