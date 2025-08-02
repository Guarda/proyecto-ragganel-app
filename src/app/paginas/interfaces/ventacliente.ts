export interface VentaCliente {
    VentaID: number;
    NumeroDocumento: string;
    NombreCliente: string;
    FechaCreacion: string; // Debe ser exactamente 'FechaCreacion'
    TotalVenta: number;
    EstadoVenta: string;
    MotivoAnulacion: string;
}