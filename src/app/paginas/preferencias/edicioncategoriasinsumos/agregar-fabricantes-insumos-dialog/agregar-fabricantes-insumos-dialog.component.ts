import { Component, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDialogActions, MatDialogModule } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { FabricanteInsumoService } from '../../../../services/fabricante-insumo.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-agregar-fabricantes-insumos-dialog',
    imports: [MatDialogActions, MatDialogModule, MatButton, MatFormField, MatLabel, ReactiveFormsModule, MatInputModule],
    templateUrl: './agregar-fabricantes-insumos-dialog.component.html',
    styleUrl: './agregar-fabricantes-insumos-dialog.component.css'
})
export class AgregarFabricantesInsumosDialogComponent {
  InsumoForm!: FormGroup;
  Agregado = new EventEmitter();

  constructor(
    public fabricanteService: FabricanteInsumoService,
    private fb: FormBuilder,
    private router: Router) {

  }

  ngOnInit() {
    this.InsumoForm = new FormGroup({
      NombreFabricanteInsumo: new FormControl('', Validators.required)
    });
  }


  onSubmit() {    // TODO: Use EventEmitter with form value 
    // console.log(this.productoForm.value);
    // console.log(this.productoForm.get('Accesorios')?.value) 
    // console.log("enviado");
    console.log(this.InsumoForm.get('NombreFabricanteInsumo')?.value);
    this.fabricanteService.create((this.InsumoForm.get('NombreFabricanteInsumo')?.value)).subscribe((res: any) => {
      this.Agregado.emit();
      this.router.navigateByUrl('home/preferencias/index-categorias-insumos');
    })
  }

}
