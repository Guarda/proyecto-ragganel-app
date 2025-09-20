import { Component, EventEmitter, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogModule } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { FabricanteService } from '../../../../services/fabricante.service';
import { CategoriaProductoService } from '../../../../services/categoria-producto.service';
import { Router } from '@angular/router';
import { SubcategoriaProductoService } from '../../../../services/subcategoria-producto.service';


@Component({
    selector: 'app-agregar-subcategorias-dialog',
    imports: [MatDialogActions, MatDialogModule, MatButton, MatFormField, MatLabel, ReactiveFormsModule, MatInputModule],
    templateUrl: './agregar-subcategorias-dialog.component.html',
    styleUrl: './agregar-subcategorias-dialog.component.css'
})
export class AgregarSubcategoriasDialogComponent {
  SubCategoriaForm!: FormGroup;
  Agregado = new EventEmitter();

  constructor(
    public fabricanteService: FabricanteService,
    public categoriaproductoService: CategoriaProductoService,
    public subCategoriaProductoService: SubcategoriaProductoService,    
    private fb: FormBuilder,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: { value: number; name: string }) {

  }

  ngOnInit(){
    this.SubCategoriaForm = new FormGroup({
      NombreSubCategoria: new FormControl('',Validators.required),
      IdCategoria: new FormControl('',Validators.required)
    });

    this.SubCategoriaForm = this.fb.group({
      NombreSubCategoria: ['', Validators.required],
      IdCategoria: [this.data.value]
    });
  }

  
  onSubmit() {    // TODO: Use EventEmitter with form value 
    // console.log(this.productoForm.value);
    // console.log(this.productoForm.get('Accesorios')?.value) 
    // console.log("enviado");
    console.log(this.SubCategoriaForm.get('NombreSubCategoria')?.value);
    this.subCategoriaProductoService.create(this.data.value,(this.SubCategoriaForm.get('NombreSubCategoria')?.value)).subscribe((res: any) => {
      this.Agregado.emit();
      this.router.navigateByUrl('home/preferencias/index-categorias');
    })
  }
}
