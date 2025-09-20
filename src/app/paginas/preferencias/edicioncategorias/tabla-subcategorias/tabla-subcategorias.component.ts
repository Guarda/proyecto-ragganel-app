import { Component } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIcon, MatIconModule } from '@angular/material/icon';

import { SubcategoriasProductos } from '../../../interfaces/subcategoriasproductos';
import { SubcategoriaProductoService } from '../../../../services/subcategoria-producto.service';
import { SharedService } from '../../../../services/shared.service';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AgregarSubcategoriasDialogComponent } from '../agregar-subcategorias-dialog/agregar-subcategorias-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { EliminarSubcategoriaDialogComponent } from '../eliminar-subcategoria-dialog/eliminar-subcategoria-dialog.component';

@Component({
    selector: 'app-tabla-subcategorias',
    imports: [MatTableModule, MatIcon, MatFormField, MatLabel, MatInputModule, MatButtonModule],
    templateUrl: './tabla-subcategorias.component.html',
    styleUrl: './tabla-subcategorias.component.css'
})
export class TablaSubcategoriasComponent {
  displayedColumns: string[] = ['IdSubCategoria', 'NombreSubCategoria', 'delete'];

  clickedRows = new Set<SubcategoriasProductos>();

  dataSource = new MatTableDataSource<SubcategoriasProductos>();
  receivedCodigoCategoria!: number;
  receivedNombreCategoria!: string;

  constructor(
    public subcategoriaService: SubcategoriaProductoService,
    private sharedService: SharedService,
    private dialog: MatDialog) {



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

    // Listen for Categoria selection
    this.sharedService.dataNombreCategoria$.subscribe(data => {
      this.receivedNombreCategoria = data;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();  // Filter is case insensitive
  }

  openDialogAgregar(IdCat: number, CategoriaName: string) {
    const dialogRef = this.dialog.open(AgregarSubcategoriasDialogComponent, {
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
    this.sharedService.dataCategoria$.subscribe(data => {
      console.log('Received Categoria ID:', data);
      this.receivedCodigoCategoria = data;

      // Fetch subcategories based on the updated Categoria ID
      this.subcategoriaService.find(String(this.receivedCodigoCategoria)).subscribe((data: SubcategoriasProductos[]) => {
        this.dataSource.data = data;
      });
    });
  }

  deleteSubcategoria(codigo: number, SubcategoriaName: string) {

    const dialogRef = this.dialog.open(EliminarSubcategoriaDialogComponent, {
      disableClose: true,
      data: { 
        value: codigo,
        name: SubcategoriaName 
      },
      height: '30%',
      width: '35%',
    });
    dialogRef.componentInstance.Borrado.subscribe(() => {
      console.log("BORRADO !!!")
      // Listen for Categoria selection
      this.sharedService.dataCategoria$.subscribe(data => {
        console.log('Received Categoria ID:', data);
        this.receivedCodigoCategoria = data;

        // Fetch subcategories based on the updated Categoria ID
        this.subcategoriaService.find(String(this.receivedCodigoCategoria)).subscribe((data: SubcategoriasProductos[]) => {
          this.dataSource.data = data;
        });
      });
    });
  }

}
