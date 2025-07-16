import { DetalleVentaCompleta } from "./detalleventacompleta";

export interface ItemDevolucion extends DetalleVentaCompleta {
  cantidadADevolver: number;
  subtotalDevolucion: number;
  reingresarAInventario: boolean;
}