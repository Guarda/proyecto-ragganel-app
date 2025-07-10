export interface DetalleVentaCompleta {
  TipoArticulo: string;
  CodigoArticulo: string;
  Cantidad: number;
  PrecioUnitario: number;
  SubtotalLinea: number;
  DescuentoPorcentaje: number;
  NombreArticulo: string;
  // ...y cualquier otro campo que devuelva el segundo SELECT del SP.
}