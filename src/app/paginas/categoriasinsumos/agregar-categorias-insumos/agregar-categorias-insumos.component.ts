import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, inject, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { CategoriasConsolas } from '../../interfaces/categorias';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { AbstractControl, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule, NgFor } from '@angular/common';

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
import { ValidationService } from '../../../services/validation.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { catchError, debounceTime, distinctUntilChanged, map, Observable, of, switchMap, tap } from 'rxjs';

@Component({
    selector: 'app-agregar-categorias-insumos',
    standalone: true,
    imports: [CommonModule, MatFormField, MatLabel, FormsModule, MatDialogModule, ReactiveFormsModule, MatInputModule, MatOptionModule,
        NgFor, MatSelectModule, MatButtonModule, MatIconModule, MatFormFieldModule,
        ImageUploadInsumoComponent, MatProgressSpinnerModule, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose
    ],
    templateUrl: './agregar-categorias-insumos.component.html',
    styleUrl: './agregar-categorias-insumos.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
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
    private router: Router,
    private validationService: ValidationService
  ) {

   this.CategoriaForm = new FormGroup({
      FabricanteInsumo: new FormControl('', Validators.required),
      CategoriaInsumo: new FormControl('', Validators.required),
      SubCategoriaInsumo: new FormControl('', Validators.required),
      CodigoModeloInsumo: new FormControl(
        '',
        [Validators.required],
        [this.validationService.codeExistsValidator()]
      ),
      LinkImagen: new FormControl('', Validators.required)
    });

    this.fabricanteService.getAll().subscribe((data: FabricanteInsumos[]) => {
      this.selectedFabricante = data;
      this.cdr.markForCheck();
    });

    this.CategoriaForm.get('FabricanteInsumo')?.valueChanges.subscribe(selectedId => {
      this.categoriainsumoService.find(selectedId).subscribe((data: categoriasInsumos[]) => {
        console.log(data)
        this.selectedCategoriaInsumo = data;
        this.cdr.markForCheck();
      })
      this.CategoriaForm.get('SubCategoriaInsumo')?.reset();
    });

    this.CategoriaForm.get('CategoriaInsumo')?.valueChanges.subscribe(selectedId => {
      this.subcategoriainsumoService.find(selectedId).subscribe((data: SubcategoriasInsumos[]) => {
        this.selectedSubCategoriaInsumo = data;
        this.cdr.markForCheck();
      })
    });
    this.manageCombinationValidator();
  }

  ngOnInit(): void {
    // Subscribe once to updates for the uploaded image name
    this.sharedService.dataNombreArchivoInsumo$.subscribe(data => {
      this.recievedFileName = data;
      this.CategoriaForm.get('LinkImagen')?.setValue(this.recievedFileName);
    });

  }

  private manageCombinationValidator(): void {
    const formGroup = this.CategoriaForm;

    formGroup.valueChanges.pipe(
      debounceTime(500),
      // Adaptar los campos a los nombres del formulario de insumos
      distinctUntilChanged((prev, curr) =>
        prev.FabricanteInsumo === curr.FabricanteInsumo &&
        prev.CategoriaInsumo === curr.CategoriaInsumo &&
        prev.SubCategoriaInsumo === curr.SubCategoriaInsumo
      ),
      switchMap(value => {
        // Adaptar los campos a los nombres del formulario de insumos
        if (!value.FabricanteInsumo || !value.CategoriaInsumo || !value.SubCategoriaInsumo) {
          return of(null);
        }
        
        // Llamar al servicio (que ya tiene checkCombinationExists)
        return this.categoriaService.checkCombinationExists(value.FabricanteInsumo, value.CategoriaInsumo, value.SubCategoriaInsumo).pipe(
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
      this.router.navigateByUrl('home/listado-categorias-insumos');
    });

  }


}
