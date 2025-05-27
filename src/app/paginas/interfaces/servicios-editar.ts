export interface ServicioEditar {
    CodigoServicio: number;
    DescripcionServicio: string;
    Estado: string;
    Fecha_Ingreso: string; // Formatted as 'dd/MM/yyyy'
    Comentario: string;
    PrecioBase: number;
}