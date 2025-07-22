export interface ArticuloVenta {
  PrecioVentaDisplay: number;
  MargenAplicado: number | null;
  IdMargenFK: number | null;
  Tipo: string;
  NombreArticulo: string;
  PrecioBase: number | null;
  LinkImagen: string;
  Codigo: string;
  Cantidad: number | null;
  Estado: number;
  DescuentoPorcentaje?: number | null; 
  PrecioOriginalSinMargen?: number | null; // Precio original sin aplicar margen, si es necesario
  SubtotalSinIVA?: number | null; // Subtotal sin IVA
  Descripcion?: string; // Descripción del artículo
}
