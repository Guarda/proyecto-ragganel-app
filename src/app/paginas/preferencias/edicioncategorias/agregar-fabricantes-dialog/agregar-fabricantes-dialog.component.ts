import { Component, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDialogActions, MatDialogModule } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { FabricanteService } from '../../../../services/fabricante.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-agregar-fabricantes-dialog',
  standalone: true,
  imports: [MatDialogActions, MatDialogModule, MatButton, MatFormField, MatLabel, ReactiveFormsModule, MatInputModule],
  templateUrl: './agregar-fabricantes-dialog.component.html',
  styleUrl: './agregar-fabricantes-dialog.component.css'
})
export class AgregarFabricantesDialogComponent {

  FabricanteForm!: FormGroup;
  Agregado = new EventEmitter();

  constructor(
    public fabricanteService: FabricanteService,    
    private fb: FormBuilder,
    private router: Router) {

  }

  ngOnInit(){
    this.FabricanteForm = new FormGroup({
      NombreFabricante: new FormControl('',Validators.required)
    });
  }

  
  onSubmit() {    // TODO: Use EventEmitter with form value 
    // console.log(this.productoForm.value);
    // console.log(this.productoForm.get('Accesorios')?.value) 
    // console.log("enviado");
    console.log(this.FabricanteForm.get('NombreFabricante')?.value);
    this.fabricanteService.create((this.FabricanteForm.get('NombreFabricante')?.value)).subscribe((res: any) => {
      this.Agregado.emit();
      this.router.navigateByUrl('/preferencias/index-categorias');
    })
  }
}
