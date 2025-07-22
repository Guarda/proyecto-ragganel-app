export interface ArticuloInventario {
  Tipo: 'Producto' | 'Accesorio' | 'Insumo';
  Codigo: string;
  NombreArticulo: string;
  Estado: string;
  Cantidad: number;
  PrecioBase: number;
  FechaIngreso: string; // La API lo envía como string, se puede convertir a Date si es necesario.
  LinkImagen: string;
  ImagePath_full?: string;
}