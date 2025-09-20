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

import { FabricanteAccesorioService } from '../../../services/fabricante-accesorio.service';
import { FabricanteAccesorio } from '../../interfaces/fabricantesaccesorios';
import { CategoriaAccesorioService } from '../../../services/categoria-accesorio.service';
import { categoriasAccesorios } from '../../interfaces/categoriasaccesorios';
import { SubcategoriaAccesorioService } from '../../../services/subcategoria-accesorio.service';
import { SubcategoriasAccesorios } from '../../interfaces/subcategoriasaccesorios';

import { CategoriasAccesoriosService } from '../../../services/categorias-accesorios.service';
import { CategoriasAccesoriosBase } from '../../interfaces/categoriasaccesoriosbase';
import { SharedService } from '../../../services/shared.service';
import { ImageUploadComponent } from '../../../utiles/images/image-upload/image-upload.component';
import { ImageUploadAccesorioComponent } from "../../../utiles/images/image-upload-accesorio/image-upload-accesorio.component";


@Component({
    selector: 'app-agregar-categorias-accesorios',
    imports: [MatFormField, MatLabel, FormsModule, MatDialogModule, ReactiveFormsModule, MatInputModule, MatOptionModule,
        NgFor, MatSelectModule, MatButtonModule, MatIcon, MatFormFieldModule,
        ImageUploadComponent, ImageUploadAccesorioComponent],
    templateUrl: './agregar-categorias-accesorios.component.html',
    styleUrl: './agregar-categorias-accesorios.component.css'
})
export class AgregarCategoriasAccesoriosComponent {

  Agregado = new EventEmitter();

  CategoriaForm!: FormGroup;
  categoriasaccesorios: CategoriasAccesoriosBase[] = [];

  TextoFabricante!: string;
  recievedFileName!: string;

  selectedFabricante: FabricanteAccesorio[] = [];
  selectedCategoriaAccesorio: categoriasAccesorios[] = [];
  selectedSubCategoriaAccesorio: SubcategoriasAccesorios[] = [];


  constructor(
    public categoriaService: CategoriasAccesoriosService,
    public fabricanteService: FabricanteAccesorioService,
    public categoriaaccesorioService: CategoriaAccesorioService,
    public subcategoriaaccesorioService: SubcategoriaAccesorioService,
    private cdr: ChangeDetectorRef,
    private sharedService: SharedService,
    private router: Router) {

    this.CategoriaForm = new FormGroup({
      FabricanteAccesorio: new FormControl('', Validators.required),
      CateAccesorio: new FormControl('', Validators.required),
      SubCategoriaAccesorio: new FormControl('', Validators.required),
      CodigoModeloAccesorio: new FormControl('', Validators.required),
      LinkImagen: new FormControl('', Validators.required)
    });

    this.fabricanteService.getAll().subscribe((data: FabricanteAccesorio[]) => {
      this.selectedFabricante = data;
    })

    /*PARA REVISAR SI HAY CAMBIOS EN EL FORM, PARA MANDAR A LLAMAR NUEVAMENTE LA LISTA DE LAS CATEGORIAS ACORDE AL FABRICANTE*/
    this.CategoriaForm.get('FabricanteAccesorio')?.valueChanges.subscribe(selectedId => {
      this.categoriaaccesorioService.find(selectedId).subscribe((data: categoriasAccesorios[]) => {
        this.selectedCategoriaAccesorio = data;
        
      })
      this.CategoriaForm.get('SubCategoriaAccesorio')?.reset();
    });

    this.CategoriaForm.get('CateAccesorio')?.valueChanges.subscribe(selectedId => {
      this.subcategoriaaccesorioService.find(selectedId).subscribe((data: SubcategoriasAccesorios[]) => {
       
        this.selectedSubCategoriaAccesorio = data;
      })
    });
    // Subscribe to value changes to update the first letter
    //const inputValue = this.CategoriaForm.controls['Fabricante'].value;
    //this.CategoriaForm.controls['IdModeloConsolaPK'].setValue('N11');
  }

  ngOnInit(): void {
    // Subscribe once to updates for the uploaded image name
    this.sharedService.dataNombreArchivoAccesorio$.subscribe(data => {
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
      this.router.navigateByUrl('listado-categorias-accesorios');
    });

  }

}
