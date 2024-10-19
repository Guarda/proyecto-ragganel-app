import { Routes } from '@angular/router';
import { ListarProductosComponent } from './paginas/productos/listar-productos/listar-productos.component';
import { AppComponent } from './app.component';
import { PruebaComponent } from './paginas/prueba/prueba.component';
import { MenuSidebarComponent } from './UI/ui/menu-sidebar.component';
import { EditarProductosComponent } from './paginas/productos/editar-productos/editar-productos.component';
import { ListarCategoriasComponent } from './paginas/categorias/listar-categorias/listar-categorias.component';
import { VerProductoComponent } from './paginas/productos/ver-producto/ver-producto.component';
import { IndexEdicioncategoriasComponent } from './paginas/preferencias/edicioncategorias/index-edicioncategorias/index-edicioncategorias.component';

export const routes: Routes = [
    
    //{ path: 'post', redirectTo: 'post/index', pathMatch: 'full' },
    { path: 'listado-productos', component: ListarProductosComponent },
    { path: 'agregar-productos', component: PruebaComponent   },
    { path: 'editar-productos', component: EditarProductosComponent},
    { path: 'listado-categorias', component: ListarCategoriasComponent},
    { path: 'listado-productos/ver-producto/:CodigoConsola/view', component: VerProductoComponent},
    { path: 'preferencias/index-categorias', component: IndexEdicioncategoriasComponent}
];
