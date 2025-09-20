import {Component} from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { FabricanteProducto } from '../../../interfaces/fabricantesproductos';
import { FabricanteService } from '../../../../services/fabricante.service';
import { SharedService } from '../../../../services/shared.service';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';

import { AgregarFabricantesAccesoriosDialogComponent } from '../agregar-fabricantes-accesorios-dialog/agregar-fabricantes-accesorios-dialog.component';
import { EliminarFabricantresAccesoriosDialogComponent } from '../eliminar-fabricantres-accesorios-dialog/eliminar-fabricantres-accesorios-dialog.component';
import { FabricanteAccesorio } from '../../../interfaces/fabricantesaccesorios';
import { FabricanteAccesorioService } from '../../../../services/fabricante-accesorio.service';

@Component({
    selector: 'app-tabla-fabricantes-accesorios',
    imports: [MatTableModule, MatIcon, MatFormField, MatLabel, MatInputModule, MatButtonModule, AgregarFabricantesAccesoriosDialogComponent],
    templateUrl: './tabla-fabricantes-accesorios.component.html',
    styleUrl: './tabla-fabricantes-accesorios.component.css'
})
export class TablaFabricantesAccesoriosComponent {
  displayedColumns: string[] = ['IdFabricante', 'NombreFabricante', 'delete'];
  clickedRows = new Set<FabricanteAccesorio>();
  dataSource = new MatTableDataSource<FabricanteAccesorio>();

  constructor(
    public fabricanteService: FabricanteAccesorioService,
    private sharedService: SharedService,
    private dialog: MatDialog
  ) {
    this.fabricanteService.getAll().subscribe((data: FabricanteAccesorio[]) => {      
      this.dataSource.data = data;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();  // Filter is case insensitive
  }

  openDialogAgregar(){
    const dialogRef = this.dialog.open(AgregarFabricantesAccesoriosDialogComponent, {
      disableClose: true,
      height: '30%',
      width: '35%',
    });
    dialogRef.componentInstance.Agregado.subscribe(() => {
      //Mensaje de agregado
      this.fabricanteService.getAll().subscribe((data: FabricanteAccesorio[]) => {      
        this.dataSource.data = data;
      });
    });
  }

  deleteFabricante(codigo: number, nombre: string) {
    const dialogRef = this.dialog.open(EliminarFabricantresAccesoriosDialogComponent, {
      disableClose: true,
      height: '30%',
      width: '35%',
    });
    dialogRef.componentInstance.Borrado.subscribe(() => {
      //Mensaje de agregado
      this.fabricanteService.getAll().subscribe((data: FabricanteAccesorio[]) => {      
        this.dataSource.data = data;
      });
    });
  }

  sendData(codigo: number, nombre: string) {
    console.log(nombre)
    this.sharedService.codigoFabricanteAccesorio(codigo);
    this.sharedService.codigoCategoriaAccesorio(0);
    this.sharedService.nombreFabricanteAccesorio(nombre);
  }
}
