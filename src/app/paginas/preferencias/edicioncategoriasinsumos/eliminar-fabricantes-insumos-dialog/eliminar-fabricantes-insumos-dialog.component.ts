import { Component, EventEmitter, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SharedService } from '../../../../services/shared.service';
import { MatButton, MatButtonModule } from '@angular/material/button';

import { FabricanteInsumoService } from '../../../../services/fabricante-insumo.service';
import { FabricanteInsumos } from '../../../interfaces/fabricantesinsumos';

@Component({
    selector: 'app-eliminar-fabricantes-insumos-dialog',
    imports: [MatDialogModule, MatDialogActions, MatButton, MatButtonModule],
    templateUrl: './eliminar-fabricantes-insumos-dialog.component.html',
    styleUrl: './eliminar-fabricantes-insumos-dialog.component.css'
})
export class EliminarFabricantesInsumosDialogComponent {
  Borrado = new EventEmitter();
    public ConsoleId: any;
    receivedCodigoFabricanteInsumo!: number;
    receivedNombreFabricanteInsumo!: string;
  
    constructor(
      public fabricanteService: FabricanteInsumoService,    
      private sharedService: SharedService,
      private dialog: MatDialog,
      private router: Router,
      @Inject(MAT_DIALOG_DATA) public data: { value: number; name: string }
    ) {
      
    }
  
    ngOnInit(): void {
      // Subscribe to the shared service to listen for the updated fabricante ID
      this.sharedService.dataFabricanteInsumo$.subscribe(data => {
       // console.log('Received Fabricante ID:', data);
       this.receivedCodigoFabricanteInsumo = data;      
     });
     // Subscribe to the shared service to listen for the updated fabricante ID
     this.sharedService.dataNombreFabricanteInsumo$.subscribe(data => {
       // console.log('Received Fabricante ID:', data);
       this.receivedNombreFabricanteInsumo = data.toString();      
     });
   }
  
   onEliminar(){
    console.log(this.receivedCodigoFabricanteInsumo)
     this.fabricanteService.eliminar(String(this.receivedCodigoFabricanteInsumo)).subscribe((res: any) => {
       // Refresh the fabricante list after deletion
       
       this.fabricanteService.getAll().subscribe((data: FabricanteInsumos[]) => {        
         this.Borrado.emit();
         this.sharedService.codigoFabricanteInsumo(0);
         this.sharedService.codigoCategoriaInsumo(0);
         this.router.navigateByUrl('home/preferencias/index-categorias-insumos');
       });
     });
   }
}
