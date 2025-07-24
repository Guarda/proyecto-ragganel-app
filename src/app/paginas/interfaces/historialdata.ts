import { HistorialArticulo } from "./historialarticulo";

export interface HistorialData {
  codigo: string;
  tipo: string;
  historial: HistorialArticulo[];
}