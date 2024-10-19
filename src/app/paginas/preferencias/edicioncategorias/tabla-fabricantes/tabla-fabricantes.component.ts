import {Component} from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import { MatIcon, MatIconModule } from '@angular/material/icon';

import { FabricanteProducto } from '../../../interfaces/fabricantesproductos';
import { FabricanteService } from '../../../../services/fabricante.service';
import { SharedService } from '../../../../services/shared.service';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

@Component({
  selector: 'app-tabla-fabricantes',
  standalone: true,
  imports: [MatTableModule, MatIcon],
  templateUrl: './tabla-fabricantes.component.html',
  styleUrl: './tabla-fabricantes.component.css'
})
export class TablaFabricantesComponent {
  displayedColumns: string[] = ['IdFabricante', 'NombreFabricante', 'delete'];

  clickedRows = new Set<FabricanteProducto>();

  selectedFabricante: FabricanteProducto[] = [];

  constructor(
    public fabricanteService: FabricanteService,
    private sharedService: SharedService){

      this.fabricanteService.getAll().subscribe((data: FabricanteProducto[]) => {      
        this.selectedFabricante = data;
      })

    }

  deleteRow(cons: string){

  }

  deleteFabricante(codigo: number){
    this.fabricanteService.eliminar(String(codigo)).subscribe((res: any) => {
      console.log(res);
    })
    // Refresh the fabricante list after deletion
    this.fabricanteService.getAll().subscribe((data: FabricanteProducto[]) => {
      this.selectedFabricante = data;
    });
  }

  sendData(codigo: number) {
    console.log(codigo);
    this.sharedService.codigoFabricante(codigo);
  }
}
