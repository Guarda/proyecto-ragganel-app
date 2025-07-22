import { ProformaInfo } from "./proformainfo";
import { ProformaDetalle } from "./proformadetalle";
import { ItemNoDisponible } from "./itemnodisponible";

export interface ProformaData {
  proforma: ProformaInfo;
  detalles: ProformaDetalle[];
  itemsNoDisponibles: ItemNoDisponible[];
}