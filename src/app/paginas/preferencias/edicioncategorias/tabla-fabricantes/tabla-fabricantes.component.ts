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
import { AgregarFabricantesDialogComponent } from '../agregar-fabricantes-dialog/agregar-fabricantes-dialog.component';
import { EliminarFabricanteDialogComponent } from '../eliminar-fabricante-dialog/eliminar-fabricante-dialog.component';

@Component({
  selector: 'app-tabla-fabricantes',
  standalone: true,
  imports: [MatTableModule, MatIcon, MatFormField, MatLabel, MatInputModule, MatButtonModule, AgregarFabricantesDialogComponent],
  templateUrl: './tabla-fabricantes.component.html',
  styleUrl: './tabla-fabricantes.component.css'
})
export class TablaFabricantesComponent {
  displayedColumns: string[] = ['IdFabricante', 'NombreFabricante', 'delete'];
  clickedRows = new Set<FabricanteProducto>();
  dataSource = new MatTableDataSource<FabricanteProducto>();
  
  constructor(
    public fabricanteService: FabricanteService,
    private sharedService: SharedService,
    private dialog: MatDialog
  ) {
    this.fabricanteService.getAll().subscribe((data: FabricanteProducto[]) => {      
      this.dataSource.data = data;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();  // Filter is case insensitive
  }

  openDialogAgregar(){
    const dialogRef = this.dialog.open(AgregarFabricantesDialogComponent, {
      disableClose: true,
      height: '30%',
      width: '35%',
    });
    dialogRef.componentInstance.Agregado.subscribe(() => {
      //Mensaje de agregado
      this.fabricanteService.getAll().subscribe((data: FabricanteProducto[]) => {      
        this.dataSource.data = data;
      });
    });
  }

  deleteFabricante(codigo: number, nombre: string) {
    const dialogRef = this.dialog.open(EliminarFabricanteDialogComponent, {
      disableClose: true,
      height: '30%',
      width: '35%',
    });
    dialogRef.componentInstance.Borrado.subscribe(() => {
      //Mensaje de agregado
      this.fabricanteService.getAll().subscribe((data: FabricanteProducto[]) => {      
        this.dataSource.data = data;
      });
    });
  }

  sendData(codigo: number, nombre: string) {
    console.log(nombre)
    this.sharedService.codigoFabricante(codigo);
    this.sharedService.codigoCategoria(0);
    this.sharedService.nombreFabricante(nombre);
  }
}