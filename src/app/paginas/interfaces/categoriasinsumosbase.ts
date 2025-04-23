import { categoriasInsumos } from "./categoriasinsumos";
import { FabricanteInsumos } from "./fabricantesinsumos";
import { SubcategoriasInsumos } from "./subcategoriasinsumos";

export interface CategoriasInsumosBase extends FabricanteInsumos, categoriasInsumos, SubcategoriasInsumos {
    IdModeloInsumosPK: number;
    CodigoModeloInsumos:   string;   
    CategoriaInsumos: string;
    SubcategoriaInsumos: String;
    FabricanteInsumos: string; 
    Activo: boolean;
    LinkImagen: string;
    ImagePath?: string;
}