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

export const routes: Routes = [
    
    //{ path: 'post', redirectTo: 'post/index', pathMatch: 'full' },
    { path: 'listado-productos', component: ListarProductosComponent },
    { path: 'agregar-productos', component: PruebaComponent   },
    { path: 'editar-productos', component: EditarProductosComponent},
    { path: 'listado-categorias', component: ListarCategoriasComponent},
    { path: 'listado-productos/ver-producto/:CodigoConsola/view', component: VerProductoComponent},
    { path: 'preferencias/index-categorias', component: IndexEdicioncategoriasComponent},
    { path: 'listado-accesorios', component: ListarAccesoriosComponent},
    { path: 'listado-accesorios/ver-accesorio/:CodigoAccesorio/view', component: VerAccesorioComponent},
    { path: 'listado-categorias-accesorios', component: ListarCategoriasAccesoriosComponent},
    { path: 'preferencias/index-categorias-accesorios', component: IndexEdicioncategoriasAccesoriosComponent},
    { path: 'listado-pedidos', component: ListarPedidosComponent},
    { path: 'crear-pedido', component: AgregarPedidoComponent}
];
