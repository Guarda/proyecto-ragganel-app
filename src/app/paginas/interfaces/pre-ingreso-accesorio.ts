export interface PreIngresoAccesorio {
  IdPreIngresoAccesorioPK: number;
  IdCodigoPedidoFK: string;
  IdUsuarioFK: number;
  FormIndex: number;
  ModeloAccesorio: number;
  ColorAccesorio: string;
  EstadoAccesorio: number;
  Comentario: string | null;
  PrecioBase: number;
  CostoDistribuido: number;
  NumeroSerie: string | null;
  ProductosCompatibles: string | null;
  FechaCreacion: string;
  TareasPendientes: string | null;
}