import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PermisosMenuService {
  private userRole: number;

  constructor() {
    // This is just an example. You should get the user role from your authentication service.
    this.userRole = 1; // or 'Vendedor', 'Logistica'
  }

  setRole(role: number): void {
    this.userRole = role;
  }

  getRole(): number {
    return this.userRole;
  }

  hasPermission(permission: string): boolean {
    const rolePermissions: { [key: string]: string[] } = {
      1: [
        'Dashboard', 'Ventas', 'Ventas/Listado General', 'Ventas/Crear', 'Ventas/Devoluciones', 'Ventas/Anulación',
        'Inventario', 'Inventario/Listado General', 'Inventario/Productos/Listado', 'Inventario/Productos/Crear',
        'Inventario/Productos/Ver', 'Inventario/Productos/Editar', 'Inventario/Productos/Eliminar',
        'Inventario/Accesorios/Listado', 'Inventario/Accesorios/Crear', 'Inventario/Accesorios/Ver',
        'Inventario/Accesorios/Editar', 'Inventario/Accesorios/Eliminar', 'Inventario/Insumos/Listado',
        'Inventario/Insumos/Ver', 'Inventario/Insumos/Crear', 'Inventario/Insumos/Editar', 'Inventario/Insumos/Eliminar',
        'Inventario/Proveedores', 'Servicios', 'Servicios/Listado General', 'Servicios/Ver', 'Servicios/Crear',
        'Servicios/Editar', 'Servicios/Eliminar', 'Clientes', 'Clientes/Listado General', 'Clientes/Ver', 'Clientes/Crear',
        'Clientes/Editar', 'Clientes/Eliminar', 'Pedidos', 'Pedidos/Listado General', 'Pedidos/Crear', 'Pedidos/Ver',
        'Pedidos/Editar', 'Pedidos/Cancelar', 'Pedidos/Eliminar', 'Taller', 'Administración', 'Administración/Usuarios',
        'Administración/Crear Respaldo de Base de datos', 'Configuraciones', 'Configuraciones/Tipo de cambio',
        'Configuraciones/configuración de productos', 'Configuraciones/Configuración de Accesorios',
        'Configuraciones/Configuración de Insumos', 'Salir'
      ],
      'Vendedor': [
        'Ventas', 'Ventas/Listado General', 'Ventas/Crear', 'Ventas/Devoluciones', 'Ventas/Anulación',
        'Inventario', 'Inventario/Listado General', 'Inventario/Productos/Listado', 'Inventario/Productos/Ver',
        'Inventario/Accesorios/Listado', 'Inventario/Accesorios/Ver', 'Inventario/Insumos/Listado', 'Inventario/Insumos/Ver',
        'Clientes', 'Clientes/Listado General', 'Clientes/Ver', 'Clientes/Crear', 'Clientes/Editar', 'Clientes/Eliminar',
        'Salir'
      ],
      'Logistica': [
        'Inventario', 'Inventario/Listado General', 'Inventario/Productos/Listado', 'Inventario/Productos/Ver',
        'Inventario/Productos/Crear', 'Inventario/Productos/Editar', 'Inventario/Productos/Eliminar',
        'Inventario/Accesorios/Listado', 'Inventario/Accesorios/Ver', 'Inventario/Accesorios/Crear',
        'Inventario/Accesorios/Editar', 'Inventario/Accesorios/Eliminar', 'Inventario/Insumos/Listado',
        'Inventario/Insumos/Ver', 'Inventario/Insumos/Crear', 'Inventario/Insumos/Editar', 'Inventario/Insumos/Eliminar',
        'Inventario/Proveedores', 'Pedidos', 'Pedidos/Listado General', 'Pedidos/Crear', 'Pedidos/Ver', 'Pedidos/Editar',
        'Pedidos/Cancelar', 'Pedidos/Eliminar', 'Salir'
      ]
    };

    return rolePermissions[this.userRole].includes(permission);
  }
}