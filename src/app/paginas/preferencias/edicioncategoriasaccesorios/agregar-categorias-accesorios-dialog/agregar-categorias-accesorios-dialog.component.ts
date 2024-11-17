import { Component, EventEmitter, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogModule } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { FabricanteAccesorioService } from '../../../../services/fabricante-accesorio.service';
import { CategoriaAccesorioService } from '../../../../services/categoria-accesorio.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-agregar-categorias-accesorios-dialog',
  standalone: true,
  imports: [MatDialogActions, MatDialogModule, MatButton, MatFormField, MatLabel, ReactiveFormsModule, MatInputModule],
  templateUrl: './agregar-categorias-accesorios-dialog.component.html',
  styleUrl: './agregar-categorias-accesorios-dialog.component.css'
})
export class AgregarCategoriasAccesoriosDialogComponent {

  CategoriaForm!: FormGroup;
  Agregado = new EventEmitter();

  constructor(
    public fabricanteaccesorioService: FabricanteAccesorioService,
    public categoriaaccesorioproductoService: CategoriaAccesorioService,    
    private fb: FormBuilder,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: { value: number; name: string }) {

  }

  ngOnInit(){
    console.log(this.data.name)
    this.CategoriaForm = new FormGroup({
      NombreCategoriaAccesorio: new FormControl('',Validators.required),
      IdFabricanteAccesorio: new FormControl('',Validators.required)
    });

    this.CategoriaForm = this.fb.group({
      NombreCategoriaAccesorio: ['', Validators.required],
      IdFabricanteAccesorio: [this.data.value]
    });
  }

  
  onSubmit() {    // TODO: Use EventEmitter with form value 
    // console.log(this.productoForm.value);
    // console.log(this.productoForm.get('Accesorios')?.value) 
    // console.log("enviado");
    console.log(this.CategoriaForm.get('NombreCategoriaAccesorio')?.value);
    this.categoriaaccesorioproductoService.create(this.data.value,(this.CategoriaForm.get('NombreCategoriaAccesorio')?.value)).subscribe((res: any) => {
      this.Agregado.emit();
      this.router.navigateByUrl('/preferencias/index-categorias-accesorios');
    })
  }


}
