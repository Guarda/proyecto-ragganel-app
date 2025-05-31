import { ArticuloVenta } from "./articuloventa";

export interface GrupoArticulos {
  nombre: string;
  articulos: ArticuloVenta[];
  imagenUrl: string;
}
