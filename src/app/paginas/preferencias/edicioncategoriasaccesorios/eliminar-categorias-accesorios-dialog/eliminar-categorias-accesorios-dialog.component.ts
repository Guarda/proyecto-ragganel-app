import { Component, EventEmitter, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SharedService } from '../../../../services/shared.service';
import { MatButton, MatButtonModule } from '@angular/material/button';

import { categoriasAccesorios } from '../../../interfaces/categoriasaccesorios';
import { CategoriaAccesorioService } from '../../../../services/categoria-accesorio.service';


@Component({
  selector: 'app-eliminar-categorias-accesorios-dialog',
  standalone: true,
  imports: [MatDialogModule, MatDialogActions, MatButton, MatButtonModule],
  templateUrl: './eliminar-categorias-accesorios-dialog.component.html',
  styleUrl: './eliminar-categorias-accesorios-dialog.component.css'
})
export class EliminarCategoriasAccesoriosDialogComponent {

  Borrado = new EventEmitter();
  receivedCodigoCategoriaAccesorio!: number;
  receivedNombreCategoriaAccesorio!: string;

  constructor(
    public categoriaService: CategoriaAccesorioService,
    private sharedService: SharedService,
    private dialog: MatDialog,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: { value: number; name: string }
  ) {
  }

  ngOnInit(): void {
    // Subscribe to the shared service to listen for the updated fabricante ID
    this.sharedService.dataCategoriaAccesorio$.subscribe(data => {
     // console.log('Received Fabricante ID:', data);
     this.receivedCodigoCategoriaAccesorio = data;      
   });
   // Subscribe to the shared service to listen for the updated fabricante ID
   this.sharedService.dataNombreCategoriaAccesorio$.subscribe(data => {
     // console.log('Received Fabricante ID:', data);
     this.receivedNombreCategoriaAccesorio = data.toString();      
   });
 }

 onEliminar(){
   this.categoriaService.eliminar(String(this.receivedCodigoCategoriaAccesorio)).subscribe((res: any) => {
     console.log(res);
     // Refresh the categoria list after deletion
     this.categoriaService.getAll().subscribe((data: categoriasAccesorios[]) => {        
       this.Borrado.emit();
       this.sharedService.codigoCategoriaAccesorio(0);
       this.router.navigateByUrl('home/preferencias/index-categorias-accesorios');
     });
   });
 }

}
