// Define esta nueva interfaz que representa un servicio en la lista
export interface ServicioListado {
  IdServicioPK: number;
  DescripcionServicio: string;
  Estado: boolean; // O el tipo que corresponda
  FechaIngreso: string | Date;
  PrecioBase: number;
  Comentario: string;
}