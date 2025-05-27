import { CategoriasInsumosBase } from "./categoriasinsumosbase";
import { EstadosConsolas } from "./estados";

export interface InsumosBase extends CategoriasInsumosBase, EstadosConsolas {
    CodigoInsumoFK: string;
    CodigoInsumo: number;
    ModeloInsumo: number;
    EstadoInsumo: number
    FechaIngreso: Date;
    Comentario: string;
    NumeroSerie: string;
    Cantidad: number;
    StockMinimo: number;
    PrecioBase: number;
}