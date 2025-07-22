export interface ProformaDetalle {
  MargenAplicado: number | null;
  IdMargenFK: number | null;
  PrecioBaseOriginal: number | null | undefined;
  TipoArticulo: 'Producto' | 'Accesorio' | 'Insumo' | 'Servicio';
  CodigoArticulo: string;
  DescripcionArticulo: string;
  Cantidad: number;
  PrecioVenta: number;
  Descuento: number;
  SubtotalSinIVA: number;
}