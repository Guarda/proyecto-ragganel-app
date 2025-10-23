import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, inject, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { CategoriasConsolas } from '../../interfaces/categorias';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
// **** 1. AÑADIR IMPORTS ****
import { AbstractControl, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule, NgFor } from '@angular/common';

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
import { ImageUploadAccesorioComponent } from '../../../utiles/images/image-upload-accesorio/image-upload-accesorio.component';
import { ValidationService } from '../../../services/validation.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// **** 2. AÑADIR IMPORTS DE RxJS ****
import { catchError, debounceTime, distinctUntilChanged, map, Observable, of, switchMap, tap } from 'rxjs';

@Component({
    selector: 'app-agregar-categorias-accesorios',
    standalone: true,
    imports: [CommonModule, MatFormField, MatLabel, FormsModule, MatDialogModule, ReactiveFormsModule, MatInputModule, MatOptionModule,
        NgFor, MatSelectModule, MatButtonModule, MatIconModule, MatFormFieldModule,
        ImageUploadComponent, ImageUploadAccesorioComponent, MatProgressSpinnerModule, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose],
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
    private router: Router,
    private validationService: ValidationService) {

    this.CategoriaForm = new FormGroup({
      FabricanteAccesorio: new FormControl('', Validators.required),
      CateAccesorio: new FormControl('', Validators.required),
      SubCategoriaAccesorio: new FormControl('', Validators.required),
      CodigoModeloAccesorio: new FormControl(
        '', 
        [Validators.required], 
        [this.validationService.codeExistsValidator()] 
      ),
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
    this.manageCombinationValidator();
  }

  ngOnInit(): void {
    // Subscribe once to updates for the uploaded image name
    this.sharedService.dataNombreArchivoAccesorio$.subscribe(data => {
      this.recievedFileName = data;
      this.CategoriaForm.get('LinkImagen')?.setValue(this.recievedFileName);
    });

  }

  private manageCombinationValidator(): void {
    const formGroup = this.CategoriaForm;

    formGroup.valueChanges.pipe(
      debounceTime(500),
      // Adaptar los campos a los nombres del formulario de accesorios
      distinctUntilChanged((prev, curr) =>
        prev.FabricanteAccesorio === curr.FabricanteAccesorio &&
        prev.CateAccesorio === curr.CateAccesorio &&
        prev.SubCategoriaAccesorio === curr.SubCategoriaAccesorio
      ),
      switchMap(value => {
        // Adaptar los campos a los nombres del formulario de accesorios
        if (!value.FabricanteAccesorio || !value.CateAccesorio || !value.SubCategoriaAccesorio) {
          return of(null);
        }
        
        // Llamar al servicio (que ya tiene checkCombinationExists)
        return this.categoriaService.checkCombinationExists(value.FabricanteAccesorio, value.CateAccesorio, value.SubCategoriaAccesorio).pipe(
          map(response =>
            response.existe ? { duplicateCombination: true } : null
          ),
          catchError(() => of(null)) 
        );
      })
    ).subscribe(error => {
      const currentErrors = formGroup.errors;

      if (error) {
        formGroup.setErrors({ ...currentErrors, ...error });
      } else if (formGroup.hasError('duplicateCombination')) {
        delete currentErrors?.['duplicateCombination'];
        formGroup.setErrors(Object.keys(currentErrors || {}).length ? currentErrors : null);
      }

      // Importante para OnPush
      this.cdr.markForCheck();
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
      this.router.navigateByUrl('home/listado-categorias-accesorios');
    });

  }

}
