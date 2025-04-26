import { Component, EventEmitter, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogModule } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { FabricanteInsumoService } from '../../../../services/fabricante-insumo.service';
import { CategoriaInsumoService } from '../../../../services/categoria-insumo.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-agregar-categorias-insumos-dialog',
  standalone: true,
  imports: [MatDialogActions, MatDialogModule, MatButton, MatFormField, MatLabel, ReactiveFormsModule, MatInputModule],
  templateUrl: './agregar-categorias-insumos-dialog.component.html',
  styleUrl: './agregar-categorias-insumos-dialog.component.css'
})
export class AgregarCategoriasInsumosDialogComponent {

  CategoriaForm!: FormGroup;
  Agregado = new EventEmitter();

  constructor(
    public fabricanteinsumoService: FabricanteInsumoService,
    public categoriainsumoproductoService: CategoriaInsumoService,    
    private fb: FormBuilder,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: { value: number; name: string }) {

  }

  ngOnInit(){
    console.log(this.data.name)
    this.CategoriaForm = new FormGroup({
      NombreCategoriaInsumo: new FormControl('',Validators.required),
      IdFabricanteInsumo: new FormControl('',Validators.required)
    });

    this.CategoriaForm = this.fb.group({
      NombreCategoriaInsumo: ['', Validators.required],
      IdFabricanteInsumo: [this.data.value]
    });
  }

  
  onSubmit() {    
    console.log(this.CategoriaForm.get('NombreCategoriaInsumo')?.value);
    this.categoriainsumoproductoService.create(this.data.value,(this.CategoriaForm.get('NombreCategoriaInsumo')?.value)).subscribe((res: any) => {
      this.Agregado.emit();
      this.router.navigateByUrl('home/preferencias/index-categorias-insumos');
    })
  }
}

