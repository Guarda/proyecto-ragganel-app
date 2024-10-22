import { Component } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIcon, MatIconModule } from '@angular/material/icon';

import { SubcategoriasProductos } from '../../../interfaces/subcategoriasproductos';
import { SubcategoriaProductoService } from '../../../../services/subcategoria-producto.service';
import { SharedService } from '../../../../services/shared.service';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-tabla-subcategorias',
  standalone: true,
  imports: [MatTableModule, MatIcon, MatFormField, MatLabel, MatInputModule, MatButtonModule],
  templateUrl: './tabla-subcategorias.component.html',
  styleUrl: './tabla-subcategorias.component.css'
})
export class TablaSubcategoriasComponent {
  displayedColumns: string[] = ['IdSubCategoria', 'NombreSubCategoria', 'delete'];

  clickedRows = new Set<SubcategoriasProductos>();

  dataSource = new MatTableDataSource<SubcategoriasProductos>();  
  receivedCodigoCategoria!: number;

  constructor(
    public subcategoriaService: SubcategoriaProductoService,
    private sharedService: SharedService) {



  }

  ngOnInit() {   
    // Listen for changes in Fabricante selection
    this.sharedService.dataFabricante$.subscribe(() => {
      // Clear subcategories when a new Fabricante is selected
      this.dataSource.data = [];
    });

    // Listen for Categoria selection
    this.sharedService.dataCategoria$.subscribe(data => {
      console.log('Received Categoria ID:', data);
      this.receivedCodigoCategoria = data;

      // Fetch subcategories based on the updated Categoria ID
      this.subcategoriaService.find(String(this.receivedCodigoCategoria)).subscribe((data: SubcategoriasProductos[]) => {
        this.dataSource.data = data;
      });
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();  // Filter is case insensitive
  }

  openDialogAgregar(){

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
        this.dataSource.data = data;
      });
    });
    
  }


}
