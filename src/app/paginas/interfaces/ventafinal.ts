export interface VentaFinalData {
  fecha: string;
  idTipoDocumento: number;
  subtotal: number;
  iva: number;
  total: number;
  idEstadoVenta: number;
  idMetodoPago: number;
  idMargen: number;
  idUsuario: number;
  idCliente: number;
  observaciones: string;
}
