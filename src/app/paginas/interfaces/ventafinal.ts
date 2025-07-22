export interface VentaDetalle {
  TipoArticulo: string;
  CodigoArticulo: string;
  PrecioVenta: number;
  Descuento: number;
  Cantidad: number;
  PrecioBaseOriginal: number;
  MargenAplicado: number;
  IdMargenFK: number | null;
  // El campo 'Subtotal' se elimina porque ya no forma parte del payload final que se envía.
}

// La interfaz principal no necesita cambios, ya que depende de VentaDetalle.
export interface VentaFinalData {
  TipoDocumento: number;
  SubtotalVenta: number;
  IVA: number;
  TotalVenta: number;
  EstadoVenta: number;
  MetodoPago: number;
  Usuario: number;
  Cliente: number;
  Observaciones: string;
  Detalles: VentaDetalle[]; // Ahora usará la definición corregida de VentaDetalle.
}
