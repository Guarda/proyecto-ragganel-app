 export type Pedido = {
    CodigoPedido: string;
    FechaCreacionPedido: Date;
    FechaArriboUSA: Date;
    FechaEstimadaRecepcion: Date;
    NumeroTracking1: string;
    NumeroTracking2: string;
    PesoPedido: number;
    SitioWeb: string;
    ViaPedido: string;
    SubTotalArticulos: number;
    ShippingUSA: number;
    Impuestos: number;
    ShippingNIC: number;
    EnvioUSA: number;
    EnvioNIC: number;
    PrecioEstimadoDelPedido: number;
    Estado: string;
    Comentarios: string;
    DescripcionEstadoPedido: string;
    DescripcionTipoPedido: string;
    Activo: boolean;
  };
  