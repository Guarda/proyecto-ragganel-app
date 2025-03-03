import { CategoriasAccesoriosBase } from "./categoriasaccesoriosbase";
import { EstadosConsolas } from "./estados";

export interface AccesoriosBase extends EstadosConsolas, CategoriasAccesoriosBase{
    ProductosCompatibles: string;
    IdModeloPK: number;
    CodigoAccesorio: number;
    ModeloAccesorio: number;
    ColorAccesorio: number;
    EstadoAccesorio: number;
    FechaIngreso: Date;
    Comentario: string;
    PrecioBase: number;
    NumeroSerie: string;
    
}