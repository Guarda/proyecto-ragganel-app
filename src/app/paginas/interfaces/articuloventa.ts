export interface ArticuloVenta {
  Tipo: string;
  NombreArticulo: string;
  PrecioBase: number | null;
  LinkImagen: string;
  Codigo: string;
  Cantidad: number | null;
  Estado: number;
  DescuentoPorcentaje?: number | null; 
}
