import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, inject, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { CategoriasConsolas } from '../../interfaces/categorias';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgFor } from '@angular/common';

import { CategoriasConsolasService } from '../../../services/categorias-consolas.service';

@Component({
  selector: 'app-agregar-categorias',
  standalone: true,
  imports: [MatFormField, MatLabel, FormsModule, MatDialogModule, ReactiveFormsModule, MatInputModule ],
  templateUrl: './agregar-categorias.component.html',
  styleUrl: './agregar-categorias.component.css'
})
export class AgregarCategoriasComponent {

  Agregado = new EventEmitter();

  CategoriaForm!: FormGroup;
  categoriasconsolas: CategoriasConsolas[] = [];

  TextoFabricante!: string;

  
  constructor(public categoriaService: CategoriasConsolasService,private cdr: ChangeDetectorRef, private router: Router){

    this.CategoriaForm = new FormGroup({
      CodigoModeloConsola: new FormControl('',Validators.required),
      DescripcionConsola: new FormControl('', Validators.required),
      Fabricante: new FormControl('', Validators.required),
      LinkImagen: new FormControl('', Validators.required)
    });

    
    // Subscribe to value changes to update the first letter
    //const inputValue = this.CategoriaForm.controls['Fabricante'].value;
    //this.CategoriaForm.controls['IdModeloConsolaPK'].setValue('N11');
  }

  ngOnInit(): void {
    
    
  }

  onSubmit() {    // TODO: Use EventEmitter with form value 
    // console.log(this.CategoriaForm.value); 
    // console.log("enviado");
    this.categoriaService.create(this.CategoriaForm.value).subscribe((res: any) => {
      this.Agregado.emit();
      this.router.navigateByUrl('listado-categorias');
    })

  }
}
