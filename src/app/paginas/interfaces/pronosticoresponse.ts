import { PronosticoData } from "./pronosticodata";
import { PronosticoGraficoItem } from "./pronosticodatoitem";

export interface PronosticoResponse {
  resumen: PronosticoData;
  grafico: PronosticoGraficoItem[];
}