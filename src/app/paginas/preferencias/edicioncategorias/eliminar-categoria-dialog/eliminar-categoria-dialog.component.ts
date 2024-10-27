import { Component, EventEmitter, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SharedService } from '../../../../services/shared.service';

import { categoriasProductos } from '../../../interfaces/categoriasproductos';
import { CategoriaProductoService } from '../../../../services/categoria-producto.service';
import { MatButton, MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-eliminar-categoria-dialog',
  standalone: true,
  imports: [MatDialogModule, MatDialogActions, MatButton, MatButtonModule],
  templateUrl: './eliminar-categoria-dialog.component.html',
  styleUrl: './eliminar-categoria-dialog.component.css'
})
export class EliminarCategoriaDialogComponent {

  Borrado = new EventEmitter();
  receivedCodigoCategoria!: number;
  receivedNombreCategoria!: string;

  constructor(
    public categoriaService: CategoriaProductoService,
    private sharedService: SharedService,
    private dialog: MatDialog,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: { value: number; name: string }
  ) {
  }

  ngOnInit(): void {
    // Subscribe to the shared service to listen for the updated fabricante ID
    this.sharedService.dataCategoria$.subscribe(data => {
     // console.log('Received Fabricante ID:', data);
     this.receivedCodigoCategoria = data;      
   });
   // Subscribe to the shared service to listen for the updated fabricante ID
   this.sharedService.dataNombreCategoria$.subscribe(data => {
     // console.log('Received Fabricante ID:', data);
     this.receivedNombreCategoria = data.toString();      
   });
 }

 onEliminar(){
   this.categoriaService.eliminar(String(this.receivedCodigoCategoria)).subscribe((res: any) => {
     console.log(res);
     // Refresh the categoria list after deletion
     this.categoriaService.getAll().subscribe((data: categoriasProductos[]) => {        
       this.Borrado.emit();
       this.sharedService.codigoCategoria(0);
       this.router.navigateByUrl('/preferencias/index-categorias');
     });
   });
 }
}
