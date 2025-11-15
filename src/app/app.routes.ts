import { Routes } from '@angular/router';
import { ListarProductosComponent } from './paginas/productos/listar-productos/listar-productos.component';
import { AppComponent } from './app.component';
import { PruebaComponent } from './paginas/prueba/prueba.component';
import { MenuSidebarComponent } from './UI/ui/menu-sidebar.component';
import { EditarProductosComponent } from './paginas/productos/editar-productos/editar-productos.component';
import { ListarCategoriasComponent } from './paginas/categorias/listar-categorias/listar-categorias.component';
import { VerProductoComponent } from './paginas/productos/ver-producto/ver-producto.component';
import { IndexEdicioncategoriasComponent } from './paginas/preferencias/edicioncategorias/index-edicioncategorias/index-edicioncategorias.component';
import { ListarAccesoriosComponent } from './paginas/accesorios/listar-accesorios/listar-accesorios.component';
import { VerAccesorioComponent } from './paginas/accesorios/ver-accesorio/ver-accesorio.component';
import { ListarCategoriasAccesoriosComponent } from './paginas/categoriasaccesorios/listar-categorias-accesorios/listar-categorias-accesorios.component';
import { IndexEdicioncategoriasAccesoriosComponent } from './paginas/preferencias/edicioncategoriasaccesorios/index-edicioncategorias-accesorios/index-edicioncategorias-accesorios.component';
import { ListarPedidosComponent } from './paginas/pedidos/listar-pedidos/listar-pedidos.component';
import { AgregarPedidoComponent } from './paginas/pedidos/agregar-pedido/agregar-pedido.component';
import { IndexListadoArticulosComponent } from './paginas/pedidos/listado-articulos/index-listado-articulos/index-listado-articulos.component';
import { computed } from '@angular/core';
import { VerPedidoComponent } from './paginas/pedidos/ver-pedido/ver-pedido.component';
import { ListarUsuariosComponent } from './paginas/usuarios/listar-usuarios/listar-usuarios.component';
import { VerUsuarioComponent } from './paginas/usuarios/ver-usuario/ver-usuario.component';
import { AuthGuard } from './UI/session/guards/auth.guard';
import { RoleGuard } from './UI/session/guards/role.guard';
import { LoginComponent } from './UI/session/login/login.component';
import { ModuloEnConstruccionComponent } from './UI/default/modulo-en-construccion/modulo-en-construccion.component';
import { ListadoClientesComponent } from './paginas/clientes/listado-clientes/listado-clientes.component';
import { VerClienteComponent } from './paginas/clientes/ver-cliente/ver-cliente.component';
import { PuntoVentaComponent } from './paginas/ventas/punto-venta/punto-venta.component';
import { ListarInsumosComponent } from './paginas/insumos/listar-insumos/listar-insumos.component';
import { VerInsumoComponent } from './paginas/insumos/ver-insumo/ver-insumo.component';
import { ListarCategoriasInsumosComponent } from './paginas/categoriasinsumos/listar-categorias-insumos/listar-categorias-insumos.component';
import { IndexEdicioncategoriasInsumosComponent } from './paginas/preferencias/edicioncategoriasinsumos/index-edicioncategorias-insumos/index-edicioncategorias-insumos.component';
import { ListadoServiciosComponent } from './paginas/servicios/listado-servicios/listado-servicios.component';
import { VerServicioComponent } from './paginas/servicios/ver-servicio/ver-servicio.component';
import { ListadoVentasComponent } from './paginas/ventas/listado-ventas/listado-ventas.component';
import { VerFacturaComponent } from './paginas/ventas/ver-factura/ver-factura.component';
import { ListarNotasCreditoComponent } from './paginas/ventas/listar-notas-credito/listar-notas-credito.component';
import { VerNotaCreditoComponent } from './paginas/ventas/ver-nota-credito/ver-nota-credito.component';
import { ListadoCarritosComponent } from './paginas/ventas/listado-carritos/listado-carritos.component';
import { ListadoInventarioGeneralComponent } from './paginas/inventario/listado-inventario-general/listado-inventario-general.component';
import { ListadoInventarioGarantiaComponent } from './paginas/inventario/listado-inventario-garantia/listado-inventario-garantia.component';
import { ListadoTiposProductosComponent } from './paginas/categorias/tipos-productos/listado-tipos-productos/listado-tipos-productos.component';
import { ListadoTipoAccesorioComponent } from './paginas/categorias/tipos-accesorios/listado-tipo-accesorio/listado-tipo-accesorio.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'home',
    component: MenuSidebarComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        // CORRECCIÓN: Usar loadComponent para cargar el componente standalone de forma diferida.
        loadComponent: () => import('./paginas/dashboard/dashboard/dashboard.component').then(m => m.DashboardComponent),
        canActivate: [AuthGuard, RoleGuard],
        data: { expectedRoles: [1] }
      },
      { path: 'modulo-en-construccion', component: ModuloEnConstruccionComponent },
      {
        path: 'punto-venta', component: PuntoVentaComponent, canActivate: [AuthGuard, RoleGuard],
        data: { expectedRoles: [1, 2] }
      },
      {
        path: 'listado-ventas', component: ListadoVentasComponent, canActivate: [AuthGuard, RoleGuard],
        data: { expectedRoles: [1, 2] }
      }, 
      {
        path: 'listado-notas-credito', component: ListarNotasCreditoComponent, canActivate: [AuthGuard, RoleGuard],
        data: { expectedRoles: [1, 2] } 
      },
      {
        path: 'listado-notas-credito/ver-nota-credito/:id/view', component: VerNotaCreditoComponent, canActivate: [AuthGuard, RoleGuard],
        data: { expectedRoles: [1, 2] }
      },
      {
        path: 'listado-carritos', component: ListadoCarritosComponent, canActivate: [AuthGuard, RoleGuard],
        data: { expectedRoles: [1, 2] } 
      },
      {
        path: 'listado-ventas/ver-factura/:CodigoVenta/view', component: VerFacturaComponent, canActivate: [AuthGuard, RoleGuard],
        data: { expectedRoles: [1, 2] } 
      },
      {
        path: 'inventario-general', component: ListadoInventarioGeneralComponent, canActivate: [AuthGuard, RoleGuard],
        data: { expectedRoles: [1, 2, 3] } 
      },
      {
        path: 'inventario-garantia', component: ListadoInventarioGarantiaComponent, canActivate: [AuthGuard, RoleGuard],
        data: { expectedRoles: [1, 3] } 
      },
      {
        path: 'listado-productos',
        component: ListarProductosComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { expectedRoles: [1, 3] } 
      },
      {
        path: 'agregar-productos',
        component: PruebaComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'editar-productos',
        component: EditarProductosComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'listado-categorias',
        component: ListarCategoriasComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { expectedRoles: [1, 3] } 
      },
      {
        path: 'listado-productos/ver-producto/:CodigoConsola/view',
        component: VerProductoComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'preferencias/index-categorias',
        component: IndexEdicioncategoriasComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'listado-tipos-productos',
        component: ListadoTiposProductosComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { expectedRoles: [1, 3] } 
      },
      {
        path: 'listado-tipos-accesorios',
        component: ListadoTipoAccesorioComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { expectedRoles: [1, 3] }       
      },
      {
        path: 'listado-accesorios',
        component: ListarAccesoriosComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { expectedRoles: [1, 3] } 
      },
      {
        path: 'listado-accesorios/ver-accesorio/:CodigoAccesorio/view',
        component: VerAccesorioComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'listado-categorias-accesorios',
        component: ListarCategoriasAccesoriosComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { expectedRoles: [1, 3] } 
      },
      {
        path: 'preferencias/index-categorias-accesorios',
        component: IndexEdicioncategoriasAccesoriosComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'listado-insumos',
        component: ListarInsumosComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { expectedRoles: [1, 3] } 
      },
      {
        path: 'listado-insumos/ver-insumo/:CodigoInsumo/view',
        component: VerInsumoComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { expectedRoles: [1, 3] } 
      },
      {
        path: 'listado-categorias-insumos',
        component: ListarCategoriasInsumosComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { expectedRoles: [1, 3] } 
      },
      {
        path: 'preferencias/index-categorias-insumos',
        component: IndexEdicioncategoriasInsumosComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { expectedRoles: [1, 3] } 
      },
      {
        path: 'listado-servicios',
        component: ListadoServiciosComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { expectedRoles: [1, 3] } 
      },
      {
        path: 'listado-servicios/ver-servicio/:CodigoServicio/view',
        component: VerServicioComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { expectedRoles: [1, 3] } 
      },
      {
        path: 'listado-pedidos',
        component: ListarPedidosComponent,
        canActivate: [AuthGuard],
        data: { expectedRoles: [1, 3] } 
      },
      {
        path: 'ingresar-inventario/:CodigoPedido',
        loadComponent: () => import('./paginas/pedidos/ingresar-inventario/ingresar-inventario.component').then(m => m.IngresarInventarioComponent),
        canActivate: [AuthGuard, RoleGuard],
        data: { expectedRoles: [1, 3] }
      },
      {
        path: 'crear-pedido',
        component: AgregarPedidoComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'listado-productos/crear-pedido',
        component: AgregarPedidoComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'index-listado-articulos',
        component: IndexListadoArticulosComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'listado-pedidos/ver-pedido/:CodigoPedido/view',
        component: VerPedidoComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'administracion/ver-usuario/:IdUsuarioPK/view',
        component: VerUsuarioComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'administracion/listado-usuarios',
        component: ListarUsuariosComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { expectedRoles: [1] } 
      },
      {
        path: 'listado-clientes',
        component: ListadoClientesComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { expectedRoles: [1, 2] } 
      },
      {
        path: 'listado-clientes/ver-cliente/:id/view',
        component: VerClienteComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { expectedRoles: [1, 2] } 
      },
    ]
  }
];