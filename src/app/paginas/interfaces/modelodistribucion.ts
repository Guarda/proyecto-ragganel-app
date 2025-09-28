export interface ModeloDistribucion {
  IdModeloPK: number;
  TipoArticuloFK: number;
  DescripcionTipoArticulo: string;
  NombreModelo: string;
  CantidadEnPedido: number;
  PorcentajeConfigurado: number;
}