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

import { MatOptionModule } from '@angular/material/core';

import { FabricanteInsumoService } from '../../../services/fabricante-insumo.service';
import { FabricanteInsumos } from '../../interfaces/fabricantesinsumos';
import { CategoriaInsumoService } from '../../../services/categoria-insumo.service';
import { categoriasInsumos } from '../../interfaces/categoriasinsumos';
import { SubcategoriaInsumoService } from '../../../services/subcategoria-insumo.service';
import { SubcategoriasInsumos } from '../../interfaces/subcategoriasinsumos';

import { CategoriasInsumosService } from '../../../services/categorias-insumos.service';
import { CategoriasInsumosBase } from '../../interfaces/categoriasinsumosbase';
import { SharedService } from '../../../services/shared.service';

import { ImageUploadInsumoComponent } from '../../../utiles/images/image-upload-insumo/image-upload-insumo.component';
import { ImageUploadComponent } from '../../../utiles/images/image-upload/image-upload.component';

@Component({
    selector: 'app-agregar-categorias-insumos',
    imports: [MatFormField, MatLabel, FormsModule, MatDialogModule, ReactiveFormsModule, MatInputModule, MatOptionModule,
        NgFor, MatSelectModule, MatButtonModule, MatIcon, MatFormFieldModule,
        ImageUploadComponent, ImageUploadInsumoComponent],
    templateUrl: './agregar-categorias-insumos.component.html',
    styleUrl: './agregar-categorias-insumos.component.css'
})
export class AgregarCategoriasInsumosComponent {

  Agregado = new EventEmitter();

  CategoriaForm!: FormGroup;
  categoriasinsumos: CategoriasInsumosBase[] = [];

  TextoFabricante!: string;
  recievedFileName!: string;

  selectedFabricante: FabricanteInsumos[] = [];
  selectedCategoriaInsumo: categoriasInsumos[] = [];
  selectedSubCategoriaInsumo: SubcategoriasInsumos[] = [];


  constructor(
    public categoriaService: CategoriasInsumosService,
    public fabricanteService: FabricanteInsumoService,
    public categoriainsumoService: CategoriaInsumoService,
    public subcategoriainsumoService: SubcategoriaInsumoService,
    private cdr: ChangeDetectorRef,
    private sharedService: SharedService,
    private router: Router
  ) {

    this.CategoriaForm = new FormGroup({
      FabricanteInsumo: new FormControl('', Validators.required),
      CategoriaInsumo: new FormControl('', Validators.required),
      SubCategoriaInsumo: new FormControl('', Validators.required),
      CodigoModeloInsumo: new FormControl('', Validators.required),
      LinkImagen: new FormControl('', Validators.required)
    });

    this.fabricanteService.getAll().subscribe((data: FabricanteInsumos[]) => {
      this.selectedFabricante = data;
    });

    this.CategoriaForm.get('FabricanteInsumo')?.valueChanges.subscribe(selectedId => {
      this.categoriainsumoService.find(selectedId).subscribe((data: categoriasInsumos[]) => {
        console.log(data)
        this.selectedCategoriaInsumo = data;

      })
      this.CategoriaForm.get('SubCategoriaInsumo')?.reset();
    });

    this.CategoriaForm.get('CategoriaInsumo')?.valueChanges.subscribe(selectedId => {
      this.subcategoriainsumoService.find(selectedId).subscribe((data: SubcategoriasInsumos[]) => {

        this.selectedSubCategoriaInsumo = data;
      })
    });
    // Subscribe to value changes to update the first letter
    //const inputValue = this.CategoriaForm.controls['Fabricante'].value;
    //this.CategoriaForm.controls['IdModeloConsolaPK'].setValue('N11');

  }

  ngOnInit(): void {
    // Subscribe once to updates for the uploaded image name
    this.sharedService.dataNombreArchivoInsumo$.subscribe(data => {
      this.recievedFileName = data;
      this.CategoriaForm.get('LinkImagen')?.setValue(this.recievedFileName);
    });

  }

  ngAfterView() {

  }

  onSubmit() { 
    // TODO: Use EventEmitter with form value
    // console.log(this.CategoriaForm.value); 
    // console.log("enviado");
    this.categoriaService.create(this.CategoriaForm.value).subscribe((res: any) => {
      this.Agregado.emit();
      this.router.navigateByUrl('home/listado-categorias-insumos');
    });

  }


}
