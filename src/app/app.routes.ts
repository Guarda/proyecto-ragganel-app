import { Routes } from '@angular/router';
import { ListarProductosComponent } from './paginas/productos/listar-productos/listar-productos.component';
import { AppComponent } from './app.component';
import { PruebaComponent } from './paginas/prueba/prueba.component';

export const routes: Routes = [
     {path: '', component: AppComponent},
    //{ path: 'post', redirectTo: 'post/index', pathMatch: 'full' },
    { path: 'listado', component: ListarProductosComponent },
    { path: 'agregar', component: PruebaComponent   }
];
