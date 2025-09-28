import { Component, EventEmitter, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule, NgFor } from '@angular/common';
import { MatFormField, MatInputModule, MatLabel } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SharedService } from '../../../services/shared.service';
import { ImageUploadAccesorioComponent } from '../../../utiles/images/image-upload-accesorio/image-upload-accesorio.component';
import { ValidationService } from '../../../services/validation.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FabricanteAccesorio } from '../../interfaces/fabricantesaccesorios';
import { categoriasAccesorios } from '../../interfaces/categoriasaccesorios';
import { SubcategoriasAccesorios } from '../../interfaces/subcategoriasaccesorios';
import { FabricanteAccesorioService } from '../../../services/fabricante-accesorio.service';
import { CategoriaAccesorioService } from '../../../services/categoria-accesorio.service';
import { SubcategoriaAccesorioService } from '../../../services/subcategoria-accesorio.service';
import { CategoriasAccesoriosBase } from '../../interfaces/categoriasaccesoriosbase';
import { CategoriasAccesoriosService } from '../../../services/categorias-accesorios.service';

@Component({
  selector: 'app-editar-categorias-accesorios',
  standalone: true,
  imports: [
    CommonModule, MatProgressSpinnerModule, MatFormField, MatLabel, FormsModule, MatDialogModule,
    ReactiveFormsModule, MatInputModule, MatOptionModule, NgFor, MatSelectModule, MatButtonModule,
    MatIconModule, MatFormFieldModule, ImageUploadAccesorioComponent
  ],
  templateUrl: './editar-categorias-accesorios.component.html',
  styleUrls: ['./editar-categorias-accesorios.component.css']
})
export class EditarCategoriasAccesoriosComponent {
  Editado = new EventEmitter();
  categoriaForm!: FormGroup; // La declaración se mantiene igual

  // ... (otras propiedades se mantienen igual)
  selectedFabricante: FabricanteAccesorio[] = [];
  selectedCategoriaAccesorio: categoriasAccesorios[] = [];
  selectedSubCategoriaAccesorio: SubcategoriasAccesorios[] = [];
  public IdModeloAccesorioPK: any;
  public LinkImagen: any;
  public originalCodigoModeloAccesorio: string | null = null;
  public ImagePath: any;

  constructor(
    public categoriaService: CategoriasAccesoriosService,
    public fabricanteaccesorioService: FabricanteAccesorioService,
    public categoriaaccesorioService: CategoriaAccesorioService,
    public subcategoriaaccesorioService: SubcategoriaAccesorioService,
    private router: Router,
    private fb: FormBuilder,
    private sharedService: SharedService,
    private validationService: ValidationService,
    private dialogRef: MatDialogRef<EditarCategoriasAccesoriosComponent>,
    @Inject(MAT_DIALOG_DATA) public idCategory: any
  ) {
    // FIX 1: Inicializar el formulario en el constructor con una estructura vacía.
    this.categoriaForm = this.fb.group({
      IdModeloAccesorioPK: [''],
      FabricanteAccesorio: ['', Validators.required],
      CateAccesorio: ['', Validators.required],
      SubCategoriaAccesorio: ['', Validators.required],
      CodigoModeloAccesorio: ['',
        [Validators.required],
        [this.validationService.codeExistsValidator(() => this.originalCodigoModeloAccesorio)]
      ],
      LinkImagen: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Suscripción a la imagen (ahora funciona porque el form ya existe)
    this.sharedService.dataNombreArchivoAccesorio$.subscribe((nombreArchivo: string) => {
      if (nombreArchivo && nombreArchivo !== '') {
        this.categoriaForm.get('LinkImagen')?.setValue(nombreArchivo);
      }
    });

    // Cargar los datos del accesorio y llenar el formulario
    this.cargarDatosDelAccesorio();

    // Suscripciones para los selects anidados
    this.setupSelectDependencies();
  }

  cargarDatosDelAccesorio(): void {
    this.categoriaService.find(this.idCategory.value).subscribe((data) => {
      const categoria = data[0];
      this.IdModeloAccesorioPK = this.idCategory.value;
      this.LinkImagen = categoria.LinkImagen;
      this.originalCodigoModeloAccesorio = categoria.CodigoModeloAccesorio;
      this.ImagePath = this.getimagePath(categoria.LinkImagen);

      // FIX 2: Usar patchValue para llenar el formulario ya creado.
      this.categoriaForm.patchValue({
        IdModeloAccesorioPK: this.IdModeloAccesorioPK,
        FabricanteAccesorio: categoria.FabricanteAccesorio,
        CateAccesorio: categoria.CategoriaAccesorio,
        SubCategoriaAccesorio: categoria.SubcategoriaAccesorio,
        CodigoModeloAccesorio: categoria.CodigoModeloAccesorio,
        LinkImagen: categoria.LinkImagen
      });

      // Cargar los datos para los selects
      this.fabricanteaccesorioService.getAll().subscribe((dataFab: FabricanteAccesorio[]) => {
        this.selectedFabricante = dataFab;
      });
      this.categoriaaccesorioService.find(String(categoria.FabricanteAccesorio)).subscribe((dataCat: categoriasAccesorios[]) => {
        this.selectedCategoriaAccesorio = dataCat;
      });
      this.subcategoriaaccesorioService.find(String(categoria.CategoriaAccesorio)).subscribe((dataSub: SubcategoriasAccesorios[]) => {
        this.selectedSubCategoriaAccesorio = dataSub;
      });
    });
  }

  setupSelectDependencies(): void {
    this.categoriaForm.get('FabricanteAccesorio')?.valueChanges.subscribe(selectedId => {
      if (selectedId) {
        this.categoriaaccesorioService.find(selectedId).subscribe((dataCat: categoriasAccesorios[]) => {
          this.selectedCategoriaAccesorio = dataCat;
        });
        this.categoriaForm.get('CateAccesorio')?.reset();
        this.categoriaForm.get('SubCategoriaAccesorio')?.reset();
      }
    });

    this.categoriaForm.get('CateAccesorio')?.valueChanges.subscribe(selectedId => {
      if (selectedId) {
        this.subcategoriaaccesorioService.find(selectedId).subscribe((dataSub: SubcategoriasAccesorios[]) => {
          this.selectedSubCategoriaAccesorio = dataSub;
        });
      }
    });
  }

  getimagePath(l: string | null): string {
    const baseUrl = 'http://localhost:3000';
    if (!l) {
      return `${baseUrl}/img-accesorios/default.png`; 
    }
    return `${baseUrl}/img-accesorios/${l}`;
  }

  onSubmit(): void {
    // AÑADE ESTA LÍNEA PARA DEPURAR
    console.log('Estado del formulario al intentar guardar:', this.categoriaForm);

    if (this.categoriaForm.invalid) {
      return;
    }
    this.categoriaService.update(this.categoriaForm.value).subscribe(() => {
      this.dialogRef.close(true); // Cierra el diálogo y devuelve 'true' para indicar éxito
    });
  }
}