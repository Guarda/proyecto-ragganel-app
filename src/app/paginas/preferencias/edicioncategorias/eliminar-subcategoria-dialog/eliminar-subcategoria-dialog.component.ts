import { Component, EventEmitter, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SharedService } from '../../../../services/shared.service';
import { SubcategoriaProductoService } from '../../../../services/subcategoria-producto.service';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-eliminar-subcategoria-dialog',
  standalone: true,
  imports: [MatDialogModule, MatDialogActions, MatButtonModule],
  templateUrl: './eliminar-subcategoria-dialog.component.html',
  styleUrl: './eliminar-subcategoria-dialog.component.css'
})
export class EliminarSubcategoriaDialogComponent {
  Borrado = new EventEmitter();

  constructor(
    public subcategoriaService: SubcategoriaProductoService,
    private sharedService: SharedService,
    private dialog: MatDialog,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: { value: number; name: string }
  ) {
    // console.log(data.value)
    console.log(data.name)
  }

  onEliminar(){    
      this.subcategoriaService.eliminar(String(this.data.value)).subscribe((res: any) => {
        console.log(res);
        this.Borrado.emit(); 
      })     
      this.router.navigateByUrl('/preferencias/index-categorias');    
  }

}
