import { CategoriasConsolas } from "./categorias";
import { EstadosConsolas } from "./estados";

export interface Producto extends EstadosConsolas, CategoriasConsolas {
    CodigoConsola:         string;
    DescripcionConsola:    string;
    Color:                 string;
    Estado:                string;
    Hack:                  boolean;   
    Fecha_Ingreso:          Date;
    Comentario:            string;
    PrecioBase: number;
    NumeroSerie: string;
    Accesorios: string;
    // Moneda: string;
}

// export enum Publisher {
//     Modificado = "Modificado",
//     SinModificar = "Sin Modificar",
// }
