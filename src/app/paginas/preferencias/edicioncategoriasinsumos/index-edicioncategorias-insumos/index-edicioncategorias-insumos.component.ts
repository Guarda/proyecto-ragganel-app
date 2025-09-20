import { Component } from '@angular/core';
import { TablaFabricantesInsumosComponent } from '../tabla-fabricantes-insumos/tabla-fabricantes-insumos.component';
import { TablaCategoriasInsumosComponent } from '../tabla-categorias-insumos/tabla-categorias-insumos.component';
import { TablaSubcategoriasInsumosComponent } from '../tabla-subcategorias-insumos/tabla-subcategorias-insumos.component';

@Component({
    selector: 'app-index-edicioncategorias-insumos',
    imports: [TablaFabricantesInsumosComponent, TablaCategoriasInsumosComponent, TablaSubcategoriasInsumosComponent],
    templateUrl: './index-edicioncategorias-insumos.component.html',
    styleUrl: './index-edicioncategorias-insumos.component.css'
})
export class IndexEdicioncategoriasInsumosComponent {

}
