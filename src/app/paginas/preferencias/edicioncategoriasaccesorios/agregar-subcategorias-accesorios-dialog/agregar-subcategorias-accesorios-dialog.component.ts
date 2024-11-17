import { Component, EventEmitter, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogModule } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { FabricanteAccesorioService } from '../../../../services/fabricante-accesorio.service';
import { CategoriaAccesorioService } from '../../../../services/categoria-accesorio.service';
import { Router } from '@angular/router';
import { SubcategoriaAccesorioService } from '../../../../services/subcategoria-accesorio.service';


@Component({
  selector: 'app-agregar-subcategorias-accesorios-dialog',
  standalone: true,
  imports: [MatDialogActions, MatDialogModule, MatButton, MatFormField, MatLabel, ReactiveFormsModule, MatInputModule],
  templateUrl: './agregar-subcategorias-accesorios-dialog.component.html',
  styleUrl: './agregar-subcategorias-accesorios-dialog.component.css'
})
export class AgregarSubcategoriasAccesoriosDialogComponent {

  SubCategoriaForm!: FormGroup;
  Agregado = new EventEmitter();

  constructor(
    public fabricanteAccesorioService: FabricanteAccesorioService,
    public categoriaaccesorioService: CategoriaAccesorioService,
    public subCategoriaAccesorioService: SubcategoriaAccesorioService,    
    private fb: FormBuilder,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: { value: number; name: string }) {

  }

  ngOnInit(){
    this.SubCategoriaForm = new FormGroup({
      NombreSubCategoriaAccesorio: new FormControl('',Validators.required),
      IdCategoriaAccesorio: new FormControl('',Validators.required)
    });

    this.SubCategoriaForm = this.fb.group({
      NombreSubCategoriaAccesorio: ['', Validators.required],
      IdCategoriaAccesorio: [this.data.value]
    });
  }

  
  onSubmit() {    // TODO: Use EventEmitter with form value 
    // console.log(this.productoForm.value);
    // console.log(this.productoForm.get('Accesorios')?.value) 
    // console.log("enviado");
    console.log(this.SubCategoriaForm.get('NombreSubCategoriaAccesorio')?.value);
    this.subCategoriaAccesorioService.create(this.data.value,(this.SubCategoriaForm.get('NombreSubCategoriaAccesorio')?.value)).subscribe((res: any) => {
      this.Agregado.emit();
      this.router.navigateByUrl('/preferencias/index-categorias-accesorios');
    })
  }

}
