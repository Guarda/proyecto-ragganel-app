import { categoriasProductos } from "./categoriasproductos";
import { FabricanteProducto } from "./fabricantesproductos";
import { SubcategoriasProductos } from "./subcategoriasproductos";
import { TipoProducto } from "./tipoproducto";

export interface CategoriasConsolas extends TipoProducto, FabricanteProducto, categoriasProductos, SubcategoriasProductos {
    IdModeloConsolaPK: number;
    CodigoModeloConsola:   string;
    DescripcionConsola: string;
    Categoria: string;
    Subcategoria: String;
    Fabricante: string; 
    Activo: boolean;
    LinkImagen: string;
    ImagePath?: string;
    TipoProducto: number;
}