import { Component, EventEmitter, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SharedService } from '../../../../services/shared.service';
import { MatButtonModule } from '@angular/material/button';
import { SubcategoriaInsumoService } from '../../../../services/subcategoria-insumo.service';

@Component({
  selector: 'app-eliminar-subcategorias-insumos',
  standalone: true,
  imports: [MatDialogModule, MatDialogActions, MatButtonModule],
  templateUrl: './eliminar-subcategorias-insumos.component.html',
  styleUrl: './eliminar-subcategorias-insumos.component.css'
})
export class EliminarSubcategoriasInsumosComponent {
   Borrado = new EventEmitter();
  
    constructor(
      public subcategoriaInsumoService: SubcategoriaInsumoService,
      private sharedService: SharedService,
      private dialog: MatDialog,
      private router: Router,
      @Inject(MAT_DIALOG_DATA) public data: { value: number; name: string }
    ) {
      console.log(data.value)
      console.log(data.name)
    }
  
    onEliminar(){    
      console.log(this.data.value);
        this.subcategoriaInsumoService.eliminar(String(this.data.value)).subscribe((res: any) => {
          console.log(this.data.value);
          this.Borrado.emit(); 
        })     
        this.router.navigateByUrl('home/preferencias/index-categorias-accesorios');    
    }
}
