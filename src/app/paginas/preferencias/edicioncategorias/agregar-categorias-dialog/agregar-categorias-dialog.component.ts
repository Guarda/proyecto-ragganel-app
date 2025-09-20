import { Component, EventEmitter, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogModule } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { FabricanteService } from '../../../../services/fabricante.service';
import { CategoriaProductoService } from '../../../../services/categoria-producto.service';
import { Router } from '@angular/router';


@Component({
    selector: 'app-agregar-categorias-dialog',
    imports: [MatDialogActions, MatDialogModule, MatButton, MatFormField, MatLabel, ReactiveFormsModule, MatInputModule],
    templateUrl: './agregar-categorias-dialog.component.html',
    styleUrl: './agregar-categorias-dialog.component.css'
})
export class AgregarCategoriasDialogComponent {

  CategoriaForm!: FormGroup;
  Agregado = new EventEmitter();

  constructor(
    public fabricanteService: FabricanteService,
    public categoriaproductoService: CategoriaProductoService,    
    private fb: FormBuilder,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: { value: number; name: string }) {

  }

  ngOnInit(){
    console.log(this.data.name)
    this.CategoriaForm = new FormGroup({
      NombreCategoria: new FormControl('',Validators.required),
      IdFabricante: new FormControl('',Validators.required)
    });

    this.CategoriaForm = this.fb.group({
      NombreCategoria: ['', Validators.required],
      IdFabricante: [this.data.value]
    });
  }

  
  onSubmit() {    // TODO: Use EventEmitter with form value 
    // console.log(this.productoForm.value);
    // console.log(this.productoForm.get('Accesorios')?.value) 
    // console.log("enviado");
    console.log(this.CategoriaForm.get('NombreCategoria')?.value);
    this.categoriaproductoService.create(this.data.value,(this.CategoriaForm.get('NombreCategoria')?.value)).subscribe((res: any) => {
      this.Agregado.emit();
      this.router.navigateByUrl('home/preferencias/index-categorias');
    })
  }

}
