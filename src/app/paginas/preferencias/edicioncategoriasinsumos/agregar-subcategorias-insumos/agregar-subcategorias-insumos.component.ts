import { Component, EventEmitter, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogModule } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { FabricanteInsumoService } from '../../../../services/fabricante-insumo.service';
import { CategoriaInsumoService } from '../../../../services/categoria-insumo.service';
import { Router } from '@angular/router';
import { SubcategoriaInsumoService } from '../../../../services/subcategoria-insumo.service';

@Component({
    selector: 'app-agregar-subcategorias-insumos',
    templateUrl: './agregar-subcategorias-insumos.component.html',
    imports: [MatDialogActions, MatDialogModule, MatButton, MatFormField, MatLabel, ReactiveFormsModule, MatInputModule],
    styleUrls: ['./agregar-subcategorias-insumos.component.scss']
})
export class AgregarSubcategoriasInsumosComponent  {
  SubCategoriaForm!: FormGroup;
    Agregado = new EventEmitter();
  
    constructor(
      public fabricanteInsumoService: FabricanteInsumoService,
      public categoriaInsumoService: CategoriaInsumoService,
      public subCategoriaInsumoService: SubcategoriaInsumoService,    
      private fb: FormBuilder,
      private router: Router,
      @Inject(MAT_DIALOG_DATA) public data: { value: number; name: string }) {
  
    }
  
    ngOnInit(){
      this.SubCategoriaForm = new FormGroup({
        NombreSubCategoriaInsumo: new FormControl('',Validators.required),
        IdCategoriaInsumo: new FormControl('',Validators.required)
      });
  
      this.SubCategoriaForm = this.fb.group({
        NombreSubCategoriaInsumo: ['', Validators.required],
        IdCategoriaInsumo: [this.data.value]
      });
    }
  
    
    onSubmit() {    // TODO: Use EventEmitter with form value 
      // console.log(this.productoForm.value);
      // console.log(this.productoForm.get('Insumos')?.value) 
      // console.log("enviado");
      console.log(this.SubCategoriaForm.get('NombreSubCategoriaInsumo')?.value);
      this.subCategoriaInsumoService.create(this.data.value,(this.SubCategoriaForm.get('NombreSubCategoriaInsumo')?.value)).subscribe((res: any) => {
        this.Agregado.emit();
        this.router.navigateByUrl('home/preferencias/index-categorias-insumos');
      })
    }
  
}