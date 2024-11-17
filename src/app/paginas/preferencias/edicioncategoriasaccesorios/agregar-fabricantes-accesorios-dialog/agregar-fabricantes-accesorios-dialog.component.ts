import { Component, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDialogActions, MatDialogModule } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { FabricanteAccesorioService } from '../../../../services/fabricante-accesorio.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-agregar-fabricantes-accesorios-dialog',
  standalone: true,
  imports: [MatDialogActions, MatDialogModule, MatButton, MatFormField, MatLabel, ReactiveFormsModule, MatInputModule],
  templateUrl: './agregar-fabricantes-accesorios-dialog.component.html',
  styleUrl: './agregar-fabricantes-accesorios-dialog.component.css'
})
export class AgregarFabricantesAccesoriosDialogComponent {

  AccesorioForm!: FormGroup;
  Agregado = new EventEmitter();

  constructor(
    public fabricanteService: FabricanteAccesorioService,    
    private fb: FormBuilder,
    private router: Router) {

  }

  ngOnInit(){
    this.AccesorioForm = new FormGroup({
      NombreFabricanteAccesorio: new FormControl('',Validators.required)
    });
  }

  
  onSubmit() {    // TODO: Use EventEmitter with form value 
    // console.log(this.productoForm.value);
    // console.log(this.productoForm.get('Accesorios')?.value) 
    // console.log("enviado");
    console.log(this.AccesorioForm.get('NombreFabricanteAccesorio')?.value);
    this.fabricanteService.create((this.AccesorioForm.get('NombreFabricanteAccesorio')?.value)).subscribe((res: any) => {
      this.Agregado.emit();
      this.router.navigateByUrl('/preferencias/index-categorias-accesorios');
    })
  }

}
