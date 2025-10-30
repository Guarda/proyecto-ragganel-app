import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule, NgFor } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

// 1. IMPORTS NECESARIOS
import { SharedService } from '../../../services/shared.service';
import { ImageUploadInsumoComponent } from '../../../utiles/images/image-upload-insumo/image-upload-insumo.component';

// Interfaces
import { FabricanteInsumos } from '../../interfaces/fabricantesinsumos';
import { categoriasInsumos } from '../../interfaces/categoriasinsumos';
import { SubcategoriasInsumos } from '../../interfaces/subcategoriasinsumos';

// Services
import { FabricanteInsumoService } from '../../../services/fabricante-insumo.service';
import { CategoriaInsumoService } from '../../../services/categoria-insumo.service';
import { SubcategoriaInsumoService } from '../../../services/subcategoria-insumo.service';
import { CategoriasInsumosService } from '../../../services/categorias-insumos.service';
import { ValidationService } from '../../../services/validation.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-editar-categorias-inumos',
  standalone: true, // Convertido a standalone
  imports: [
    CommonModule, MatFormFieldModule, FormsModule, MatDialogModule, ReactiveFormsModule,
    MatInputModule, MatOptionModule, NgFor, MatSelectModule, MatButtonModule, MatProgressSpinnerModule,
    ImageUploadInsumoComponent // Añadir el componente de imagen aquí
  ],
  templateUrl: './editar-categorias-inumos.component.html',
  styleUrls: ['./editar-categorias-inumos.component.css']
})
export class EditarCategoriasInumosComponent implements OnInit {
  categoriaForm!: FormGroup;

  // Propiedades para los datos de los selects
  selectedFabricante: FabricanteInsumos[] = [];
  selectedCategoriaInsumo: categoriasInsumos[] = [];
  selectedSubCategoriaInsumo: SubcategoriasInsumos[] = [];

  // Propiedades para pasar datos al template
  public IdModeloInsumoPK: any;
  public LinkImagen: string | null = null; // Para la imagen inicial
  public originalCodigoModeloInsumos: string | null = null;

  constructor(
    public categoriaService: CategoriasInsumosService,
    public fabricanteinsumoService: FabricanteInsumoService,
    public categoriainsumoService: CategoriaInsumoService,
    public subcategoriainsumoService: SubcategoriaInsumoService,
    private fb: FormBuilder,
    // 2. INYECTAR SERVICIOS FALTANTES
    private sharedService: SharedService,
    private validationService: ValidationService,
    private dialogRef: MatDialogRef<EditarCategoriasInumosComponent>,
    @Inject(MAT_DIALOG_DATA) public idCategory: any
  ) {
    // 3. INICIALIZAR EL FORMULARIO AQUÍ, EN EL CONSTRUCTOR
    // Usamos los nombres en plural que coinciden con la base de datos
    this.categoriaForm = this.fb.group({
      IdModeloInsumosPK: [''],
      
      // --- ✅ CAMBIO: Se inicializan como deshabilitados ---
      FabricanteInsumos: [{ value: '', disabled: true }, Validators.required],
      CategoriaInsumos: [{ value: '', disabled: true }, Validators.required],
      SubcategoriaInsumos: [{ value: '', disabled: true }, Validators.required],
      
      CodigoModeloInsumos: ['',
        // --- ✅ CAMBIO: Se añade maxLength(25) ---
        [Validators.required, Validators.maxLength(25)],
        [this.validationService.codeExistsValidator(() => this.originalCodigoModeloInsumos)]
      ],
      
      // --- ✅ CAMBIO: Se añade maxLength(100) ---
      LinkImagen: ['', [Validators.required, Validators.maxLength(100)]]
    });
  }

  // ... (justo después del constructor)

  ngOnInit(): void {
    // Suscribirse a la imagen seleccionada desde el componente hijo
    this.sharedService.dataNombreArchivoInsumo$.subscribe((nombreArchivo: string) => {
      if (nombreArchivo) {
        this.categoriaForm.get('LinkImagen')?.setValue(nombreArchivo);
      }
    });

    // Separar la lógica en métodos claros
    this.cargarDatosDelInsumo();
    this.setupSelectDependencies();
  }

  cargarDatosDelInsumo(): void {
    const id = this.idCategory.value;
    this.categoriaService.find(id).subscribe((data) => {
      const insumo = data[0];
      this.IdModeloInsumoPK = id;
      this.LinkImagen = insumo.LinkImagen; // Guardamos el nombre de la imagen inicial
      this.originalCodigoModeloInsumos = insumo.CodigoModeloInsumos;

      // Cargar los datos iniciales para los selects
      this.fabricanteinsumoService.getAll().subscribe((dataFab: FabricanteInsumos[]) => {
        this.selectedFabricante = dataFab;
      });

      // Cargar las listas de categorías y subcategorías ANTES de llenar el formulario.
      // Esto asegura que los <mat-option> existan cuando Angular intente seleccionarlos.
      this.categoriainsumoService.find(String(insumo.FabricanteInsumos)).subscribe(dataCat => {
        this.selectedCategoriaInsumo = dataCat;
        this.subcategoriainsumoService.find(String(insumo.CategoriaInsumos)).subscribe(dataSub => {
          this.selectedSubCategoriaInsumo = dataSub;

          // Ahora que todas las listas están cargadas, llenamos el formulario.
          // Esto previene que los selects se queden en blanco.
          this.categoriaForm.patchValue(insumo);
        });
      });
    });
  }

  setupSelectDependencies(): void {
    // Cuando cambia el fabricante, se actualiza la lista de categorías
    this.categoriaForm.get('FabricanteInsumos')?.valueChanges.subscribe(selectedId => {
      if (selectedId) {
        this.categoriainsumoService.find(selectedId).subscribe((dataCat: categoriasInsumos[]) => {
          this.selectedCategoriaInsumo = dataCat;
        });
        // Se resetean los campos dependientes
        this.categoriaForm.get('CategoriaInsumos')?.reset();
        this.categoriaForm.get('SubcategoriaInsumos')?.reset();
      }
    });

    // Cuando cambia la categoría, se actualiza la lista de subcategorías
    this.categoriaForm.get('CategoriaInsumos')?.valueChanges.subscribe(selectedId => {
      if (selectedId) {
        this.subcategoriainsumoService.find(selectedId).subscribe((dataSub: SubcategoriasInsumos[]) => {
          this.selectedSubCategoriaInsumo = dataSub;
        });
      }
    });
  }

  onSubmit(): void {
    if (this.categoriaForm.invalid) {
      return; // Si el formulario es inválido, no hacer nada
    }

    console.log('Formulario a enviar:', this.categoriaForm.value);

    // El formulario ya tiene la estructura correcta que el backend espera
    this.categoriaService.update(this.categoriaForm.value).subscribe({
      next: (response) => {
        console.log('Actualización exitosa:', response);
        // Cerrar el diálogo SÓLO si la actualización fue exitosa
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error('Error al intentar actualizar la categoría:', err);
        // Aquí podrías mostrar una alerta de error al usuario
      }
    });
  }
}