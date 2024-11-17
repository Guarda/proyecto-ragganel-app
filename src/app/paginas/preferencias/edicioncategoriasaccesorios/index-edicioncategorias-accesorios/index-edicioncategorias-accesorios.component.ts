import { Component } from '@angular/core';
import { TablaFabricantesAccesoriosComponent } from '../tabla-fabricantes-accesorios/tabla-fabricantes-accesorios.component';
import { TablaCategoriasAccesoriosComponent } from '../tabla-categorias-accesorios/tabla-categorias-accesorios.component';
import { TablaSubcategoriasAccesoriosComponent } from '../tabla-subcategorias-accesorios/tabla-subcategorias-accesorios.component';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-index-edicioncategorias-accesorios',
  standalone: true,
  imports: [TablaFabricantesAccesoriosComponent, TablaCategoriasAccesoriosComponent,TablaSubcategoriasAccesoriosComponent,
    MatButton
  ],
  templateUrl: './index-edicioncategorias-accesorios.component.html',
  styleUrl: './index-edicioncategorias-accesorios.component.css'
})
export class IndexEdicioncategoriasAccesoriosComponent {

}
