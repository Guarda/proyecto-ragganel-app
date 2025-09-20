import { Component, EventEmitter, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SharedService } from '../../../../services/shared.service';
import { MatButtonModule } from '@angular/material/button';
import { SubcategoriaAccesorioService } from '../../../../services/subcategoria-accesorio.service';

@Component({
    selector: 'app-eliminar-subcategorias-accesorios-dialog',
    imports: [MatDialogModule, MatDialogActions, MatButtonModule],
    templateUrl: './eliminar-subcategorias-accesorios-dialog.component.html',
    styleUrl: './eliminar-subcategorias-accesorios-dialog.component.css'
})
export class EliminarSubcategoriasAccesoriosDialogComponent {
  Borrado = new EventEmitter();

  constructor(
    public subcategoriaAccesorioService: SubcategoriaAccesorioService,
    private sharedService: SharedService,
    private dialog: MatDialog,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: { value: number; name: string }
  ) {
    // console.log(data.value)
    // console.log(data.name)
  }

  onEliminar(){    
      this.subcategoriaAccesorioService.eliminar(String(this.data.value)).subscribe((res: any) => {
        console.log(this.data.value);
        this.Borrado.emit(); 
      })     
      this.router.navigateByUrl('home/preferencias/index-categorias-accesorios');    
  }

}
