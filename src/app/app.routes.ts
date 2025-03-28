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

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    {
      path: 'home',
      component: MenuSidebarComponent,
      canActivate: [AuthGuard],
      children: [
        { path: 'modulo-en-construccion', component: ModuloEnConstruccionComponent },
        {
          path: 'listado-productos',
          component: ListarProductosComponent,
          canActivate: [AuthGuard, RoleGuard],
          data: { expectedRoles: [1, 3] } // Corrected
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
          data: { expectedRoles: [1, 3] } // Corrected
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
          path: 'listado-accesorios',
          component: ListarAccesoriosComponent,
          canActivate: [AuthGuard, RoleGuard],
          data: { expectedRoles: [1, 3] } // Corrected
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
          data: { expectedRoles: [1, 3] } // Corrected
        },
        {
          path: 'preferencias/index-categorias-accesorios',
          component: IndexEdicioncategoriasAccesoriosComponent,
          canActivate: [AuthGuard]
        },
        {
          path: 'listado-pedidos',
          component: ListarPedidosComponent,
          canActivate: [AuthGuard]
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
          data: { expectedRoles: [1] } // Corrected
        }
      ]
    }
  ];