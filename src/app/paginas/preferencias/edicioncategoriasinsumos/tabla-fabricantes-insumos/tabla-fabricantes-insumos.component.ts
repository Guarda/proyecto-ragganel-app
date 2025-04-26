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

import { AgregarFabricantesInsumosDialogComponent } from '../agregar-fabricantes-insumos-dialog/agregar-fabricantes-insumos-dialog.component';
import { EliminarFabricantesInsumosDialogComponent } from '../eliminar-fabricantes-insumos-dialog/eliminar-fabricantes-insumos-dialog.component';
import { FabricanteInsumos } from '../../../interfaces/fabricantesinsumos';
import { FabricanteInsumoService } from '../../../../services/fabricante-insumo.service';

@Component({
  selector: 'app-tabla-fabricantes-insumos',
  standalone: true,
  imports: [MatTableModule, MatIcon, MatFormField, MatLabel, MatInputModule, MatButtonModule, AgregarFabricantesInsumosDialogComponent],
  templateUrl: './tabla-fabricantes-insumos.component.html',
  styleUrl: './tabla-fabricantes-insumos.component.css'
})
export class TablaFabricantesInsumosComponent {
  displayedColumns: string[] = ['IdFabricante', 'NombreFabricante', 'delete'];
    clickedRows = new Set<FabricanteInsumos>();
    dataSource = new MatTableDataSource<FabricanteInsumos>();
  
    constructor(
      public fabricanteService: FabricanteInsumoService,
      private sharedService: SharedService,
      private dialog: MatDialog
    ) {
      this.fabricanteService.getAll().subscribe((data: FabricanteInsumos[]) => {      
        this.dataSource.data = data;
      });
    }
  
    applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();  // Filter is case insensitive
    }
  
    openDialogAgregar(){
      const dialogRef = this.dialog.open(AgregarFabricantesInsumosDialogComponent, {
        disableClose: true,
        height: '30%',
        width: '35%',
      });
      dialogRef.componentInstance.Agregado.subscribe(() => {
        //Mensaje de agregado
        this.fabricanteService.getAll().subscribe((data: FabricanteInsumos[]) => {      
          this.dataSource.data = data;
        });
      });
    }
  
    deleteFabricante(codigo: number, nombre: string) {
      const dialogRef = this.dialog.open(EliminarFabricantesInsumosDialogComponent, {
        disableClose: true,
        height: '30%',
        width: '35%',
      });
      dialogRef.componentInstance.Borrado.subscribe(() => {
        //Mensaje de agregado
        this.fabricanteService.getAll().subscribe((data: FabricanteInsumos[]) => {      
          this.dataSource.data = data;
        });
      });
    }
  
    sendData(codigo: number, nombre: string) {
      console.log(nombre)
      this.sharedService.codigoFabricanteInsumo(codigo);
      this.sharedService.codigoCategoriaInsumo(0);
      this.sharedService.nombreFabricanteInsumo(nombre);
    }
}
