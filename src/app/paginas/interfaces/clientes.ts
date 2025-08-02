export interface Cliente {
    id: number;
    IdClientePK: number;
    idClientePK: number;
    nombreCliente: string;
    nombre: string;
    dni: string;
    ruc: string;
    telefono?: string | null;
    correoElectronico?: string | null;
    direccion?: string | null;
    fechaRegistro: Date;
    estado: boolean;
    Comentarios: string | null; // Añadido para almacenar comentarios del cliente
}