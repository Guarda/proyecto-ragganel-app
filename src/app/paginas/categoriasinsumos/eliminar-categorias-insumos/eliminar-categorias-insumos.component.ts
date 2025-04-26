import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, EventEmitter, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CategoriasInsumosService } from '../../../services/categorias-insumos.service';

@Component({
  selector: 'app-eliminar-categorias-insumos',
  standalone: true,
  imports: [MatDialogModule, MatDialogActions],
  templateUrl: './eliminar-categorias-insumos.component.html',
  styleUrl: './eliminar-categorias-insumos.component.css'
})
export class EliminarCategoriasInsumosComponent {
  Borrado = new EventEmitter();
  categoriaForm!: FormGroup;


  constructor(
    private router: Router,
    public categoriaService: CategoriasInsumosService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public idCategory: any
  ) {

  }

  public CategoryId: any;

  ngOnInit(): void {
    this.CategoryId = this.idCategory.value;
    this.categoriaForm = this.fb.group({
      IdModeloInsumoPK: [this.idCategory.value]
    });
  }

  onEliminar() {
    this.categoriaService.eliminar(this.categoriaForm.value).subscribe((res: any) => {
      this.Borrado.emit();
      this.router.navigateByUrl('home/listado-categorias-insumos');
    })
  }

}
