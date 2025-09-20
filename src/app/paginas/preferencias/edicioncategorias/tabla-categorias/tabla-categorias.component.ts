import { Component } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIcon, MatIconModule } from '@angular/material/icon';

import { categoriasProductos } from '../../../interfaces/categoriasproductos';
import { CategoriaProductoService } from '../../../../services/categoria-producto.service';
import { SharedService } from '../../../../services/shared.service';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { AgregarCategoriasDialogComponent } from '../agregar-categorias-dialog/agregar-categorias-dialog.component';
import { EliminarCategoriaDialogComponent } from '../eliminar-categoria-dialog/eliminar-categoria-dialog.component';

@Component({
    selector: 'app-tabla-categorias',
    imports: [MatTableModule, MatIcon, MatFormField, MatLabel, MatInputModule, MatButtonModule],
    templateUrl: './tabla-categorias.component.html',
    styleUrl: './tabla-categorias.component.css'
})
export class TablaCategoriasComponent {
  displayedColumns: string[] = ['IdCategoria', 'NombreCategoria', 'delete'];

  clickedRows = new Set<categoriasProductos>();

  dataSource = new MatTableDataSource<categoriasProductos>();
  receivedCodigoFabricante!: number;
  receivedNombreFabricante!: string;

  constructor(
    public categoriaService: CategoriaProductoService,
    private sharedService: SharedService,
    private dialog: MatDialog) {

    

  }

  ngOnInit() {    

    // Subscribe to the shared service to listen for the updated fabricante ID
    this.sharedService.dataFabricante$.subscribe(data => {
      // console.log('Received Fabricante ID:', data);
      this.receivedCodigoFabricante = data;

      // Fetch categories based on the updated fabricante ID
      this.categoriaService.find(String(this.receivedCodigoFabricante)).subscribe((data: categoriasProductos[]) => {
        this.dataSource.data = data;
      });
    });

    // Subscribe to the shared service to listen for the updated fabricante ID
    this.sharedService.dataNombreFabricante$.subscribe(data => {
      // console.log('Received Fabricante ID:', data);
      this.receivedNombreFabricante = data.toString();      
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();  // Filter is case insensitive
  }

  openDialogAgregar(IdFab: number, FabricanteName: string){
    console.log(FabricanteName);
    const dialogRef = this.dialog.open(AgregarCategoriasDialogComponent, {
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
    this.sharedService.dataFabricante$.subscribe(data => {
      // console.log('Received Fabricante ID:', data);
      this.receivedCodigoFabricante = data;

      // Fetch categories based on the updated fabricante ID
      this.categoriaService.find(String(this.receivedCodigoFabricante)).subscribe((data: categoriasProductos[]) => {
        this.dataSource.data = data;
      });
    });
  }

  deleteCategoria(codigo: number, nombre: string){
    const dialogRef = this.dialog.open(EliminarCategoriaDialogComponent, {
      disableClose: true,
      height: '30%',
      width: '35%',
    });
    dialogRef.componentInstance.Borrado.subscribe(() => {
      // Refresh the fabricante list after deletion
      // Fetch categories based on the updated fabricante ID
      this.sharedService.dataFabricante$.subscribe(data => {
      // console.log('Received Fabricante ID:', data);
      this.receivedCodigoFabricante = data;

      // Fetch categories based on the updated fabricante ID
      this.categoriaService.find(String(this.receivedCodigoFabricante)).subscribe((data: categoriasProductos[]) => {
        this.dataSource.data = data;
      });
    });
    });
    
  }

  sendData(codigo: number, nombre: string) {
    console.log(codigo);
    this.sharedService.codigoCategoria(codigo);
    this.sharedService.nombreCategoria(nombre);
  }

}
