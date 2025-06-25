export interface Ventas {
    IdVentaPK: number;
    FechaCreacion: Date;
    IdTipoDocumentoFK: number;
    TipoDocumento: string;
    NumeroDocumento: string;
    SubtotalVenta: number;
    IVA: number;
    TotalVenta: number;
    IdEstadoVentaFK: number;
    EstadoVenta: string;
    IdMargenVentaFK: number;
    MargenVenta: string;
    IdClienteFK: number;
    Cliente: string;
    IdUsuarioFK: number;
    Usuario: string;
    Observaciones: string;
}