export interface ArticuloGarantia {
  TipoArticulo: string;
  CodigoArticulo: string;
  Descripcion: string;
  FechaIngreso: string | Date;
  PrecioBase: number;
  IdEstado: number; // <-- AÑADE ESTA LÍNEA
  Estado: string;
  NumeroSerie: string;
  Comentario: string;
}