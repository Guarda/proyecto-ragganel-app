import { Component, EventEmitter, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FabricanteService } from '../../../../services/fabricante.service';
import { SharedService } from '../../../../services/shared.service';
import { FabricanteProducto } from '../../../interfaces/fabricantesproductos';
import { MatButton, MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-eliminar-fabricante-dialog',
    imports: [MatDialogModule, MatDialogActions, MatButton, MatButtonModule],
    templateUrl: './eliminar-fabricante-dialog.component.html',
    styleUrl: './eliminar-fabricante-dialog.component.css'
})
export class EliminarFabricanteDialogComponent {
  Borrado = new EventEmitter();
  public ConsoleId: any;
  receivedCodigoFabricante!: number;
  receivedNombreFabricante!: string;

  constructor(
    public fabricanteService: FabricanteService,
    private sharedService: SharedService,
    private dialog: MatDialog,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: { value: number; name: string }
  ) {
    
  }

  ngOnInit(): void {
     // Subscribe to the shared service to listen for the updated fabricante ID
     this.sharedService.dataFabricante$.subscribe(data => {
      // console.log('Received Fabricante ID:', data);
      this.receivedCodigoFabricante = data;      
    });
    // Subscribe to the shared service to listen for the updated fabricante ID
    this.sharedService.dataNombreFabricante$.subscribe(data => {
      // console.log('Received Fabricante ID:', data);
      this.receivedNombreFabricante = data.toString();      
    });
  }

  onEliminar(){
    this.fabricanteService.eliminar(String(this.receivedCodigoFabricante)).subscribe((res: any) => {
      console.log(res);
      // Refresh the fabricante list after deletion
      this.fabricanteService.getAll().subscribe((data: FabricanteProducto[]) => {        
        this.Borrado.emit();
        this.sharedService.codigoFabricante(0);
        this.sharedService.codigoCategoria(0);
        this.router.navigateByUrl('home/preferencias/index-categorias');
      });
    });
  }
}
