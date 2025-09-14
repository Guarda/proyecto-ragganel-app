export interface PreIngresoInsumo {
  IdPreIngresoInsumoPK: number;
  IdCodigoPedidoFK: string;
  IdUsuarioFK: number;
  FormIndex: number;
  ModeloInsumo: number;
  EstadoInsumo: number;
  Comentario: string | null;
  PrecioBase: number;
  CostoDistribuido: number;
  NumeroSerie: string | null;
  Cantidad: number;
  StockMinimo: number;
  FechaCreacion: string;
}