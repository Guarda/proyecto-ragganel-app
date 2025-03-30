export interface Cliente {
    idClientePK: number;
    nombreCliente: string;
    dni: string;
    ruc: string;
    telefono?: string | null;
    correoElectronico?: string | null;
    direccion?: string | null;
    fechaRegistro: Date;
    estado: boolean;
}