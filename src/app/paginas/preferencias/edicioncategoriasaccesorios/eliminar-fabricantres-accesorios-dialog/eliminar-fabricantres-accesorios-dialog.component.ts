import { Component, EventEmitter, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SharedService } from '../../../../services/shared.service';
import { MatButton, MatButtonModule } from '@angular/material/button';

import { FabricanteAccesorioService } from '../../../../services/fabricante-accesorio.service';
import { FabricanteAccesorio } from '../../../interfaces/fabricantesaccesorios';

@Component({
  selector: 'app-eliminar-fabricantres-accesorios-dialog',
  standalone: true,
  imports: [MatDialogModule, MatDialogActions,MatButton, MatButtonModule],
  templateUrl: './eliminar-fabricantres-accesorios-dialog.component.html',
  styleUrl: './eliminar-fabricantres-accesorios-dialog.component.css'
})
export class EliminarFabricantresAccesoriosDialogComponent {

  Borrado = new EventEmitter();
  public ConsoleId: any;
  receivedCodigoFabricanteAccesorio!: number;
  receivedNombreFabricanteAccesorio!: string;

  constructor(
    public fabricanteService: FabricanteAccesorioService,    
    private sharedService: SharedService,
    private dialog: MatDialog,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: { value: number; name: string }
  ) {
    
  }

  ngOnInit(): void {
    // Subscribe to the shared service to listen for the updated fabricante ID
    this.sharedService.dataFabricanteAccesorio$.subscribe(data => {
     // console.log('Received Fabricante ID:', data);
     this.receivedCodigoFabricanteAccesorio = data;      
   });
   // Subscribe to the shared service to listen for the updated fabricante ID
   this.sharedService.dataNombreFabricanteAccesorio$.subscribe(data => {
     // console.log('Received Fabricante ID:', data);
     this.receivedNombreFabricanteAccesorio = data.toString();      
   });
 }

 onEliminar(){
   this.fabricanteService.eliminar(String(this.receivedCodigoFabricanteAccesorio)).subscribe((res: any) => {
     // Refresh the fabricante list after deletion
     this.fabricanteService.getAll().subscribe((data: FabricanteAccesorio[]) => {        
       this.Borrado.emit();
       this.sharedService.codigoFabricanteAccesorio(0);
       this.sharedService.codigoCategoriaAccesorio(0);
       this.router.navigateByUrl('/preferencias/index-categorias-accesorios');
     });
   });
 }

}
