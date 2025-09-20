import { Component } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIcon, MatIconModule } from '@angular/material/icon';

import { categoriasAccesorios } from '../../../interfaces/categoriasaccesorios';
import { CategoriaAccesorioService } from '../../../../services/categoria-accesorio.service';
import { SharedService } from '../../../../services/shared.service';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';

import { AgregarCategoriasAccesoriosDialogComponent } from '../agregar-categorias-accesorios-dialog/agregar-categorias-accesorios-dialog.component';
import { EliminarCategoriasAccesoriosDialogComponent } from '../eliminar-categorias-accesorios-dialog/eliminar-categorias-accesorios-dialog.component';
import { CategoriasAccesoriosBase } from '../../../interfaces/categoriasaccesoriosbase';

@Component({
    selector: 'app-tabla-categorias-accesorios',
    imports: [MatTableModule, MatIcon, MatFormField, MatLabel, MatInputModule, MatButtonModule],
    templateUrl: './tabla-categorias-accesorios.component.html',
    styleUrl: './tabla-categorias-accesorios.component.css'
})
export class TablaCategoriasAccesoriosComponent {

  displayedColumns: string[] = ['IdCategoria', 'NombreCategoria', 'delete'];

  clickedRows = new Set<categoriasAccesorios>();

  dataSource = new MatTableDataSource<categoriasAccesorios>();
  receivedCodigoFabricanteAccesorio!: number;
  receivedNombreFabricanteAccesorio!: string;

  constructor(
    public categoriaService: CategoriaAccesorioService,
    private sharedService: SharedService,
    private dialog: MatDialog) {

    

  }

  ngOnInit() {    

    // Subscribe to the shared service to listen for the updated fabricante ID
    this.sharedService.dataFabricanteAccesorio$.subscribe(data => {
      // console.log('Received Fabricante ID:', data);
      this.receivedCodigoFabricanteAccesorio = data;

      // Fetch categories based on the updated fabricante ID
      this.categoriaService.find(String(this.receivedCodigoFabricanteAccesorio)).subscribe((data: categoriasAccesorios[]) => {
        this.dataSource.data = data;
      });
    });

    // Subscribe to the shared service to listen for the updated fabricante ID
    this.sharedService.dataNombreFabricanteAccesorio$.subscribe(data => {
      // console.log('Received Fabricante ID:', data);
      this.receivedNombreFabricanteAccesorio = data.toString();      
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();  // Filter is case insensitive
  }

  openDialogAgregar(IdFab: number, FabricanteName: string){
    const dialogRef = this.dialog.open(AgregarCategoriasAccesoriosDialogComponent, {
      disableClose: true,
      data: { 
        value: IdFab,
        name: FabricanteName 
      },
      height: '30%',
      width: '35%',
    });
    dialogRef.componentInstance.Agregado.subscribe(() => {
      //Mensaje de agregado
      this.cargarCategoriasxFabricante();
    });
  }

  cargarCategoriasxFabricante(){
    // Subscribe to the shared service to listen for the updated fabricante ID
    this.sharedService.dataFabricanteAccesorio$.subscribe(data => {
      // console.log('Received Fabricante ID:', data);
      this.receivedCodigoFabricanteAccesorio = data;

      // Fetch categories based on the updated fabricante ID
      this.categoriaService.find(String(this.receivedCodigoFabricanteAccesorio)).subscribe((data: categoriasAccesorios[]) => {
        this.dataSource.data = data;
      });
    });
  }

  deleteCategoria(codigo: number, nombre: string){
    const dialogRef = this.dialog.open(EliminarCategoriasAccesoriosDialogComponent, {
      disableClose: true,
      height: '30%',
      width: '35%',
    });
    dialogRef.componentInstance.Borrado.subscribe(() => {
      // Refresh the fabricante list after deletion
      // Fetch categories based on the updated fabricante ID
      this.sharedService.dataFabricanteAccesorio$.subscribe(data => {
      // console.log('Received Fabricante ID:', data);
      this.receivedCodigoFabricanteAccesorio = data;

      // Fetch categories based on the updated fabricante ID
      this.categoriaService.find(String(this.receivedCodigoFabricanteAccesorio)).subscribe((data: categoriasAccesorios[]) => {
        this.dataSource.data = data;
      });
    });
    });
    
  }

  sendData(codigo: number, nombre: string) {
    console.log(codigo);
    this.sharedService.codigoCategoriaAccesorio(codigo);
    this.sharedService.nombreCategoriaAccesorio(nombre);
  }

}
