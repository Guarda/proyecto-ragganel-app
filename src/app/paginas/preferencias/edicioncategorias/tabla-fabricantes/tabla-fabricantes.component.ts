import {Component} from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { FabricanteProducto } from '../../../interfaces/fabricantesproductos';
import { FabricanteService } from '../../../../services/fabricante.service';
import { SharedService } from '../../../../services/shared.service';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-tabla-fabricantes',
  standalone: true,
  imports: [MatTableModule, MatIcon, MatFormField, MatLabel, MatInputModule, MatButtonModule],
  templateUrl: './tabla-fabricantes.component.html',
  styleUrl: './tabla-fabricantes.component.css'
})
export class TablaFabricantesComponent {
  displayedColumns: string[] = ['IdFabricante', 'NombreFabricante', 'delete'];
  clickedRows = new Set<FabricanteProducto>();
  dataSource = new MatTableDataSource<FabricanteProducto>();
  
  constructor(
    public fabricanteService: FabricanteService,
    private sharedService: SharedService
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

  }

  deleteFabricante(codigo: number) {
    this.fabricanteService.eliminar(String(codigo)).subscribe((res: any) => {
      console.log(res);
      // Refresh the fabricante list after deletion
      this.fabricanteService.getAll().subscribe((data: FabricanteProducto[]) => {
        this.dataSource.data = data;
      });
    });
  }

  sendData(codigo: number) {
    console.log(codigo);
    this.sharedService.codigoFabricante(codigo);
  }
}