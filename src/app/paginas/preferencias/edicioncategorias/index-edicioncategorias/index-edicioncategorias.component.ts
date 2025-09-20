import { Component } from '@angular/core';
import { TablaFabricantesComponent } from "../tabla-fabricantes/tabla-fabricantes.component";
import { TablaCategoriasComponent } from '../tabla-categorias/tabla-categorias.component';
import { TablaSubcategoriasComponent } from '../tabla-subcategorias/tabla-subcategorias.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-index-edicioncategorias',
    imports: [TablaFabricantesComponent, TablaCategoriasComponent, TablaSubcategoriasComponent, MatButtonModule],
    templateUrl: './index-edicioncategorias.component.html',
    styleUrl: './index-edicioncategorias.component.css'
})
export class IndexEdicioncategoriasComponent {

}
