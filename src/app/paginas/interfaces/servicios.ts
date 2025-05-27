export interface ServiciosBase {
    servicio: {      
      DescripcionServicio: string;
      PrecioBase: number;
      Comentario: string;
    };
    insumos: {
      CodigoInsumoFK: string;
      CantidadDescargue: number;
    }[];
  }
  