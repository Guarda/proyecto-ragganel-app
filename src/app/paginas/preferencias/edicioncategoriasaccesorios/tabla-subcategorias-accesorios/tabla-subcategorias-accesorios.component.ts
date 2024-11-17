import { Component } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIcon, MatIconModule } from '@angular/material/icon';

import { SubcategoriaAccesorioService } from '../../../../services/subcategoria-accesorio.service';
import { SubcategoriasAccesorios } from '../../../interfaces/subcategoriasaccesorios';
import { SharedService } from '../../../../services/shared.service';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';

import { AgregarSubcategoriasAccesoriosDialogComponent } from '../agregar-subcategorias-accesorios-dialog/agregar-subcategorias-accesorios-dialog.component';
import { EliminarSubcategoriasAccesoriosDialogComponent } from '../eliminar-subcategorias-accesorios-dialog/eliminar-subcategorias-accesorios-dialog.component';


@Component({
  selector: 'app-tabla-subcategorias-accesorios',
  standalone: true,
  imports: [MatTableModule, MatIcon, MatFormField, MatLabel, MatInputModule, MatButtonModule],
  templateUrl: './tabla-subcategorias-accesorios.component.html',
  styleUrl: './tabla-subcategorias-accesorios.component.css'
})
export class TablaSubcategoriasAccesoriosComponent {
  displayedColumns: string[] = ['IdSubCategoria', 'NombreSubCategoria', 'delete'];

  clickedRows = new Set<SubcategoriasAccesorios>();

  dataSource = new MatTableDataSource<SubcategoriasAccesorios>();
  receivedCodigoCategoriaAccesorio!: number;
  receivedNombreCategoriaAccesorio!: string;

  constructor(
    public subcategoriaService: SubcategoriaAccesorioService,
    private sharedService: SharedService,
    private dialog: MatDialog) {



  }

  ngOnInit() {
    // Listen for changes in Fabricante selection
    this.sharedService.dataFabricanteAccesorio$.subscribe(() => {
      // Clear subcategories when a new Fabricante is selected
      this.dataSource.data = [];
    });

    // Listen for Categoria selection
    this.sharedService.dataCategoriaAccesorio$.subscribe(data => {
      // console.log('Received Categoria ID:', data);
      this.receivedCodigoCategoriaAccesorio = data;

      // Fetch subcategories based on the updated Categoria ID
      this.subcategoriaService.find(String(this.receivedCodigoCategoriaAccesorio)).subscribe((data: SubcategoriasAccesorios[]) => {
        this.dataSource.data = data;
      });
    });

    // Listen for Categoria selection
    this.sharedService.dataNombreCategoriaAccesorio$.subscribe(data => {
      this.receivedNombreCategoriaAccesorio = data;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();  // Filter is case insensitive
  }

  openDialogAgregar(IdCat: number, CategoriaName: string) {
    const dialogRef = this.dialog.open(AgregarSubcategoriasAccesoriosDialogComponent, {
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
    this.sharedService.dataCategoriaAccesorio$.subscribe(data => {
      console.log('Received Categoria ID:', data);
      this.receivedCodigoCategoriaAccesorio = data;

      // Fetch subcategories based on the updated Categoria ID
      this.subcategoriaService.find(String(this.receivedCodigoCategoriaAccesorio)).subscribe((data: SubcategoriasAccesorios[]) => {
        this.dataSource.data = data;
      });
    });
  }

  deleteSubcategoria(codigo: number, SubcategoriaName: string) {

    const dialogRef = this.dialog.open(EliminarSubcategoriasAccesoriosDialogComponent, {
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
      this.sharedService.dataCategoriaAccesorio$.subscribe(data => {
        console.log('Received Categoria ID:', data);
        this.receivedCodigoCategoriaAccesorio = data;

        // Fetch subcategories based on the updated Categoria ID
        this.subcategoriaService.find(String(this.receivedCodigoCategoriaAccesorio)).subscribe((data: SubcategoriasAccesorios[]) => {
          this.dataSource.data = data;
        });
      });
    });
  }


}
