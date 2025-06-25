import { RolesUsuarios } from "./roles-usuarios";
import { EstadosUsuarios } from "./estados-usuarios";

export interface Usuarios  extends RolesUsuarios, EstadosUsuarios {
    IdUsuarioPK: number;
    IdUsuario: number;
    Nombre: string;
    Correo: string;
    Password: string;
    IdRolFK: number;
    FechaIngresoUsuario: Date;
    IdEstadoFK: number;

    currentPassword: string;
    newPassword: string;

    id: number; // Para el manejo de formularios reactivos
    name: string; // Para el manejo de formularios reactivos
}