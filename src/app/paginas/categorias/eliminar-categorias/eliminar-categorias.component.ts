import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, EventEmitter, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CategoriasConsolasService } from '../../../services/categorias-consolas.service';

@Component({
    selector: 'app-eliminar-categorias',
    imports: [MatDialogModule, MatDialogActions],
    templateUrl: './eliminar-categorias.component.html',
    styleUrl: './eliminar-categorias.component.css'
})
export class EliminarCategoriasComponent {
  Borrado = new EventEmitter();
  categoriaForm!: FormGroup;

  
  constructor(
    private router: Router,
    public categoriaService: CategoriasConsolasService, 
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public idCategory: any
  ) {

  }

  public CategoryId: any;

  ngOnInit(): void {
    this.CategoryId = this.idCategory.value;
    this.categoriaForm = this.fb.group({
      IdModeloConsolaPK: [this.idCategory.value]
    });
  }

  onEliminar(){
    this.categoriaService.eliminar(this.categoriaForm.value).subscribe((res: any) => {
      this.Borrado.emit();
      this.router.navigateByUrl('listado-categorias');
    })
  }
}
