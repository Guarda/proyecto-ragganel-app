 export type Pedido = {
    CodigoPedido: string ;
    FechaCreacionPedido: Date | null;
    FechaArriboUSA: Date | null;
    FechaEstimadaRecepcion: Date | null;
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
  