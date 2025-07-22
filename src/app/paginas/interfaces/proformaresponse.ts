import { ProformaData } from "./proformadata";

export interface ProformaResponse {
  success: boolean;
  data: ProformaData;
  error?: string; // Incluimos un campo opcional para el mensaje de error
}