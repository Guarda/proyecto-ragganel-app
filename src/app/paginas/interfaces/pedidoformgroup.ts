import { FormControl } from "@angular/forms";

 export type PedidoFormGroup = {
    FechaCreacionPedido: FormControl<Date | null>;
    FechaArrivoUSA: FormControl<Date | null>;
    FechaEstimadaRecepcion: FormControl<Date | null>;
    NumeroTracking1: FormControl<string | null>;
    NumeroTracking2: FormControl<string | null>;
    PesoPedido: FormControl<number| null>;
    SitioWeb: FormControl<string | null>;
    ViaPedido: FormControl<string | null>;
    SubTotalArticulos: FormControl<number | null>;
    ShippingUSA: FormControl<number | null>;
    Impuestos: FormControl<number | null>;
    ShippingNIC: FormControl<number | null>;
    PrecioEstimadoDelPedido: FormControl<number | null>;
    Estado: FormControl<string | null>;
    Comentarios: FormControl<string | null>;
  };
  