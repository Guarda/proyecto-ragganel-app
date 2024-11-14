
import { categoriasAccesorios } from "./categoriasaccesorios";
import { FabricanteAccesorio } from "./fabricantesaccesorios";
import { SubcategoriasAccesorios } from "./subcategoriasaccesorios";

export interface CategoriasAccesoriosBase extends FabricanteAccesorio, categoriasAccesorios, SubcategoriasAccesorios {
    IdModeloAccesorioPK: number;
    CodigoModeloAccesorio:   string;   
    CategoriaAccesorio: string;
    SubcategoriaAccesorio: String;
    FabricanteAccesorio: string; 
    Activo: boolean;
    LinkImagen: string;
    ImagePath?: string;
}