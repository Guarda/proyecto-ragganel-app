import { Component } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIcon, MatIconModule } from '@angular/material/icon';

import { SubcategoriaInsumoService } from '../../../../services/subcategoria-insumo.service';
import { SubcategoriasInsumos } from '../../../interfaces/subcategoriasinsumos';
import { SharedService } from '../../../../services/shared.service';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';

import { AgregarSubcategoriasInsumosComponent } from '../agregar-subcategorias-insumos/agregar-subcategorias-insumos.component';
import { EliminarSubcategoriasInsumosComponent } from '../eliminar-subcategorias-insumos/eliminar-subcategorias-insumos.component';

@Component({
  selector: 'app-tabla-subcategorias-insumos',
  standalone: true,
  imports: [MatTableModule, MatIcon, MatFormField, MatLabel, MatInputModule, MatButtonModule],
  templateUrl: './tabla-subcategorias-insumos.component.html',
  styleUrl: './tabla-subcategorias-insumos.component.css'
})
export class TablaSubcategoriasInsumosComponent {
  displayedColumns: string[] = ['IdSubCategoria', 'NombreSubCategoria', 'delete'];
  
    clickedRows = new Set<SubcategoriasInsumos>();
  
    dataSource = new MatTableDataSource<SubcategoriasInsumos>();
    receivedCodigoCategoriaInsumo!: number;
    receivedNombreCategoriaInsumo!: string;
  
    constructor(
      public subcategoriaService: SubcategoriaInsumoService,
      private sharedService: SharedService,
      private dialog: MatDialog) {
  
  
  
    }
  
    ngOnInit() {
      // Listen for changes in Fabricante selection
      this.sharedService.dataFabricanteInsumo$.subscribe(() => {
        // Clear subcategories when a new Fabricante is selected
        this.dataSource.data = [];
      });
  
      // Listen for Categoria selection
      this.sharedService.dataCategoriaInsumo$.subscribe(data => {
        // console.log('Received Categoria ID:', data);
        this.receivedCodigoCategoriaInsumo = data;
  
        // Fetch subcategories based on the updated Categoria ID
        this.subcategoriaService.find(String(this.receivedCodigoCategoriaInsumo)).subscribe((data: SubcategoriasInsumos[]) => {
          this.dataSource.data = data;
        });
      });
  
      // Listen for Categoria selection
      this.sharedService.dataNombreCategoriaInsumo$.subscribe(data => {
        this.receivedNombreCategoriaInsumo = data;
      });
    }
  
    applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();  // Filter is case insensitive
    }
  
    openDialogAgregar(IdCat: number, CategoriaName: string) {
      const dialogRef = this.dialog.open(AgregarSubcategoriasInsumosComponent, {
        disableClose: true,
        data: {
          value: IdCat,
          name: CategoriaName
        },
        height: '30%',
        width: '35%',
      });
      dialogRef.componentInstance.Agregado.subscribe(() => {
        //Mensaje de agregado
        this.cargarSubCategoriasxCategoria();
      });
    }
  
    cargarSubCategoriasxCategoria() {
      // Listen for Categoria selection
      this.sharedService.dataCategoriaInsumo$.subscribe(data => {
        console.log('Received Categoria ID:', data);
        this.receivedCodigoCategoriaInsumo = data;
  
        // Fetch subcategories based on the updated Categoria ID
        this.subcategoriaService.find(String(this.receivedCodigoCategoriaInsumo)).subscribe((data: SubcategoriasInsumos[]) => {
          this.dataSource.data = data;
        });
      });
    }
  
    deleteSubcategoria(codigo: number, SubcategoriaName: string) {
  
      const dialogRef = this.dialog.open(EliminarSubcategoriasInsumosComponent, {
        disableClose: true,
        data: { 
          value: codigo,
          name: SubcategoriaName 
        },
        height: '30%',
        width: '35%',
      });
      dialogRef.componentInstance.Borrado.subscribe(() => {
        // Listen for Categoria selection
        this.sharedService.dataCategoriaInsumo$.subscribe(data => {
          console.log('Received Categoria ID:', data);
          this.receivedCodigoCategoriaInsumo = data;
  
          // Fetch subcategories based on the updated Categoria ID
          this.subcategoriaService.find(String(this.receivedCodigoCategoriaInsumo)).subscribe((data: SubcategoriasInsumos[]) => {
            this.dataSource.data = data;
          });
        });
      });
    }
}
