import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatIcon, MatIconModule } from '@angular/material/icon';

import { SubcategoriasProductos } from '../../../interfaces/subcategoriasproductos';
import { SubcategoriaProductoService } from '../../../../services/subcategoria-producto.service';
import { SharedService } from '../../../../services/shared.service';

@Component({
  selector: 'app-tabla-subcategorias',
  standalone: true,
  imports: [MatTableModule, MatIcon],
  templateUrl: './tabla-subcategorias.component.html',
  styleUrl: './tabla-subcategorias.component.css'
})
export class TablaSubcategoriasComponent {
  displayedColumns: string[] = ['IdSubCategoria', 'NombreSubCategoria', 'delete'];

  clickedRows = new Set<SubcategoriasProductos>();

  selectedSubCategoria: SubcategoriasProductos[] = [];
  receivedCodigoCategoria!: number;

  constructor(
    public subcategoriaService: SubcategoriaProductoService,
    private sharedService: SharedService) {



  }

  ngOnInit() {   
    // Listen for changes in Fabricante selection
    this.sharedService.dataFabricante$.subscribe(() => {
      // Clear subcategories when a new Fabricante is selected
      this.selectedSubCategoria = [];
    });

    // Listen for Categoria selection
    this.sharedService.dataCategoria$.subscribe(data => {
      console.log('Received Categoria ID:', data);
      this.receivedCodigoCategoria = data;

      // Fetch subcategories based on the updated Categoria ID
      this.subcategoriaService.find(String(this.receivedCodigoCategoria)).subscribe((data: SubcategoriasProductos[]) => {
        this.selectedSubCategoria = data;
      });
    });
  }

  deleteRow(cons: string) {

  }

  deleteSubcategoria(codigo: number){
    this.subcategoriaService.eliminar(String(codigo)).subscribe((res: any) => {
      console.log(res);
    }) 

    // Listen for Categoria selection
    this.sharedService.dataCategoria$.subscribe(data => {
      console.log('Received Categoria ID:', data);
      this.receivedCodigoCategoria = data;

      // Fetch subcategories based on the updated Categoria ID
      this.subcategoriaService.find(String(this.receivedCodigoCategoria)).subscribe((data: SubcategoriasProductos[]) => {
        this.selectedSubCategoria = data;
      });
    });
    
  }


}
