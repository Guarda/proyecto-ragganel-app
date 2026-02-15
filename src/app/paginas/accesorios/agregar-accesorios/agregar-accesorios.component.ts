import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, inject, OnInit, Optional, Output, signal } from '@angular/core'; // Added OnInit
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { AbstractControl, FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule, NgFor } from '@angular/common'; // Import CommonModule
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';

import { CategoriasAccesoriosService } from '../../../services/categorias-accesorios.service';
import { EstadosConsolas } from '../../interfaces/estados';
import { EstadoConsolasService } from '../../../services/estado-consolas.service';
import { AccesorioBaseService } from '../../../services/accesorio-base.service';
import { FabricanteAccesorio } from '../../interfaces/fabricantesaccesorios';
import { categoriasAccesorios } from '../../interfaces/categoriasaccesorios';
import { SubcategoriasAccesorios } from '../../interfaces/subcategoriasaccesorios';

import { FabricanteAccesorioService } from '../../../services/fabricante-accesorio.service';
import { CategoriaAccesorioService } from '../../../services/categoria-accesorio.service';
import { SubcategoriaAccesorioService } from '../../../services/subcategoria-accesorio.service';

import { LiveAnnouncer } from '@angular/cdk/a11y';
import { CategoriasAccesoriosBase } from '../../interfaces/categoriasaccesoriosbase';

// **** 1. IMPORT AuthService ****
import { AuthService } from '../../../UI/session/auth.service';
import { environment } from '../../../../enviroments/enviroments';

@Component({
    selector: 'app-agregar-accesorios',
    standalone: true, // Make it standalone
    imports: [
        CommonModule, // Add CommonModule
        NgFor,
        ReactiveFormsModule,
        MatSelectModule,
        MatDialogModule,
        MatButtonModule,
        MatIcon,
        MatFormField,
        MatLabel,
        FormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatChipsModule
    ],
    templateUrl: './agregar-accesorios.component.html',
    styleUrl: './agregar-accesorios.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush // Added ChangeDetectionStrategy
})
// **** 2. IMPLEMENT OnInit ****
export class AgregarAccesoriosComponent implements OnInit {

  // Initialize signals with correct type
  keywords = signal<string[]>([]);
  todolistKeywords = signal<string[]>(['Limpiar']);
  announcer = inject(LiveAnnouncer);

  Agregado = new EventEmitter();

  accesorioForm!: FormGroup;

  // Initializing category properties just in case
  categoria: CategoriasAccesoriosBase | null = null;
  categoria2: CategoriasAccesoriosBase | null = null;

  selectedCategoria: any[] = []; // Consider using a more specific type if possible

  selectedFabricanteAccesorio: FabricanteAccesorio[] = [];
  selectedCategoriaAccesorio: categoriasAccesorios[] = [];
  selectedSubCategoriaAccesorio: SubcategoriasAccesorios[] = [];

  selectedEstado: EstadosConsolas[] = [];

  idModeloAccesorioPK: any;
  // These seem redundant if form controls are used correctly
  // FabricanteAccesorio: any;
  // CategoriaAccesorio: any;
  // SubcategoriaAccesorio: any;

  public ImagePath: string | null = null; // Use string type

  constructor(
    public categoriasService: CategoriasAccesoriosService, // Renamed 'categorias' to avoid conflict
    public estados: EstadoConsolasService,
    public fabricanteService: FabricanteAccesorioService,
    public categoriaaccesorioService: CategoriaAccesorioService,
    public subcategoriaaccesrorioService: SubcategoriaAccesorioService,
    public accesorioService: AccesorioBaseService,
    // **** 3. INJECT AuthService ****
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private router: Router, // Keep Router if navigation might be needed elsewhere, but not in onSubmit for dialog
    @Optional() private dialogRef: MatDialogRef<AgregarAccesoriosComponent>
  ) {}

  // ✅ AÑADIDO: Validador personalizado para la longitud de los chips
  /**
   * Validador personalizado para la longitud total de los productos compatibles.
   * Comprueba la longitud del array de strings una vez convertido a JSON,
   * que es como se enviará al backend y debe caber en varchar(500).
   * @param max La longitud máxima permitida para el string JSON.
   */
  productosCompatiblesLengthValidator(max: number) {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value as string[];
      if (!value || value.length === 0) {
        return null; // Válido si está vacío
      }
      
      // Convertimos el array a un string JSON (ej: ["PS4","PS5"])
      // para medir su longitud real, que es lo que se guarda.
      const jsonString = JSON.stringify(value);
      
      return jsonString.length > max 
        ? { 'totalLengthExceeded': { requiredLength: max, actualLength: jsonString.length } } 
        : null;
    };
  }

  ngOnInit(): void {
    // ✅ CAMBIO: Se actualiza el FormGroup con todos los validadores
    this.accesorioForm = new FormGroup({
      FabricanteAccesorio: new FormControl('', Validators.required),
      CateAccesorio: new FormControl('', Validators.required),
      SubCategoriaAccesorio: new FormControl('', Validators.required),
      IdModeloAccesorioPK: new FormControl('', Validators.required),

      // --- VALIDACIONES AÑADIDAS ---
      ColorAccesorio: new FormControl('', [Validators.maxLength(100)]), // Límite varchar(100)
      
      PrecioBase: new FormControl('', [ // Límite Decimal(6,2)
        Validators.required, 
        Validators.pattern(/^\d{1,4}(\.\d{1,2})?$/), // 4 dígitos enteros, 2 decimales
        Validators.max(9999.99) 
      ]),
      
      EstadoAccesorio: new FormControl('', Validators.required),
      
      ComentarioAccesorio: new FormControl('', [Validators.maxLength(10000)]), // Límite varchar(10000)
      
      NumeroSerie: new FormControl('', [Validators.maxLength(100)]), // Límite varchar(100)
      
      TodoList: new FormControl(this.nkeywords()), // Use signal value for init
      
      ProductosCompatibles: new FormControl([], [this.productosCompatiblesLengthValidator(500)]) // Límite varchar(500)
      // --- FIN DE VALIDACIONES ---
    });

    // Load initial data for dropdowns and image
    this.loadInitialData();
    this.setupValueChangeListeners();
  }

  // Helper to load initial static data
  private loadInitialData(): void {
    // Load category list for image fallback (if needed immediately)
    // Consider if this is truly needed or if image updates only on selection
    this.categoriasService.getAll().subscribe((data: CategoriasAccesoriosBase[]) => {
      // It seems you use the first item only for a default image path?
      if (data && data.length > 0) {
        this.categoria = data[0];
        this.ImagePath = this.getimagePath(this.categoria?.LinkImagen ?? null); // Use optional chaining and null coalescing
      } else {
         this.ImagePath = this.getimagePath(null); // Set default if no categories
      }
      this.cdr.markForCheck();
    });

    this.estados.getAll().subscribe((data: EstadosConsolas[]) => {
      this.selectedEstado = data;
      this.cdr.markForCheck();
    });

    this.fabricanteService.getManufacturerWithModel().subscribe((data: FabricanteAccesorio[]) => {
      this.selectedFabricanteAccesorio = data;
      this.cdr.markForCheck();
    });
  }

  // Helper to set up listeners for dropdown changes
  private setupValueChangeListeners(): void {
    /*PARA REVISAR SI HAY CAMBIOS EN EL FORM, PARA MANDAR A LLAMAR NUEVAMENTE LA LISTA DE LAS CATEGORIAS ACORDE AL FABRICANTE*/
    this.accesorioForm.get('FabricanteAccesorio')?.valueChanges.subscribe(selectedId => {
      if (selectedId) {
        this.categoriaaccesorioService.findWithModel(selectedId).subscribe((data: categoriasAccesorios[]) => {
          this.selectedCategoriaAccesorio = data;
          // Reset dependent fields and clear data
          this.accesorioForm.get('CateAccesorio')?.reset(null, { emitEvent: false });
          this.accesorioForm.get('SubCategoriaAccesorio')?.reset(null, { emitEvent: false });
          this.selectedSubCategoriaAccesorio = [];
          this.ImagePath = this.getimagePath(null);
          this.keywords.set([]);
          this.accesorioForm.get('ProductosCompatibles')?.setValue([], { emitEvent: false });
          this.accesorioForm.get('IdModeloAccesorioPK')?.setValue(null, { emitEvent: false });
          this.cdr.markForCheck();
        });
      } else {
        // Clear dependent lists if parent is cleared
        this.selectedCategoriaAccesorio = [];
        this.selectedSubCategoriaAccesorio = [];
        this.cdr.markForCheck();
      }
    });

    this.accesorioForm.get('CateAccesorio')?.valueChanges.subscribe(selectedId => {
      if (selectedId) {
        this.subcategoriaaccesrorioService.findWithModel(selectedId).subscribe((data: SubcategoriasAccesorios[]) => {
          this.selectedSubCategoriaAccesorio = data;
           // Reset dependent fields and clear data
          this.accesorioForm.get('SubCategoriaAccesorio')?.reset(null, { emitEvent: false });
          this.ImagePath = this.getimagePath(null);
          this.keywords.set([]);
          this.accesorioForm.get('ProductosCompatibles')?.setValue([], { emitEvent: false });
          this.accesorioForm.get('IdModeloAccesorioPK')?.setValue(null, { emitEvent: false });
          this.cdr.markForCheck();
        });
      } else {
         // Clear dependent lists if parent is cleared
        this.selectedSubCategoriaAccesorio = [];
        this.cdr.markForCheck();
      }
    });

    this.accesorioForm.get('SubCategoriaAccesorio')?.valueChanges.subscribe(selectedId => {
      const fabId = this.accesorioForm.value.FabricanteAccesorio;
      const catId = this.accesorioForm.value.CateAccesorio;

      if (fabId && catId && selectedId){
        this.categoriasService.getbymanufacturer(fabId, catId, selectedId).subscribe((data) => {
          if (data && data.length > 0 && data[0]) {
            this.idModeloAccesorioPK = data[0].IdModeloAccesorioPK;
            this.accesorioForm.get('IdModeloAccesorioPK')?.setValue(this.idModeloAccesorioPK, { emitEvent: false }); // Update form

            // Fetch specific category details to update image
            this.categoriasService.find(this.idModeloAccesorioPK).subscribe((catData) => {
              if (catData && catData.length > 0 && catData[0]) { // Check response structure
                this.categoria = catData[0]; // Assuming find returns array
                this.ImagePath = this.getimagePath(this.categoria?.LinkImagen ?? null); // Use optional chaining and null coalescing
                this.cdr.markForCheck();
              } else {
                 this.ImagePath = this.getimagePath(null); // Reset image if find fails
                 this.cdr.markForCheck();
              }
            });
          } else {
            // Handle case where getbymanufacturer returns nothing
            console.warn(`No active Catalog Accessory found for F:${fabId}, C:${catId}, S:${selectedId}`);
            this.idModeloAccesorioPK = null;
            this.accesorioForm.get('IdModeloAccesorioPK')?.setValue(null, { emitEvent: false });
            this.ImagePath = this.getimagePath(null);
            this.cdr.markForCheck();
          }
        });
      } else {
         // Reset if any parent dropdown is cleared
         this.idModeloAccesorioPK = null;
         this.accesorioForm.get('IdModeloAccesorioPK')?.setValue(null, { emitEvent: false });
         this.ImagePath = this.getimagePath(null);
         this.cdr.markForCheck();
      }
    });
  }


  // --- Chip list logic (ProductosCompatibles) ---
  removeKeyword(keyword: string) {
    this.keywords.update(keywords => {
      const index = keywords.indexOf(keyword);
      if (index < 0) return keywords;
      keywords.splice(index, 1);
      this.accesorioForm.get('ProductosCompatibles')?.setValue([...keywords]); // Update form on removal
      this.announcer.announce(`removed ${keyword}`);
      return [...keywords]; // Return new array reference
    });
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.keywords.update(keywords => [...keywords, value]);
      this.accesorioForm.get('ProductosCompatibles')?.setValue(this.keywords()); // Update form on add
    }
    event.chipInput!.clear();
  }

  // This seems redundant, add() handles user input directly
  // addt(valor: String): void { ... }


  // --- Chip list logic (TodoList) ---
  nkeywords(): string[] {
    return this.todolistKeywords();
  }

  removeReactiveKeyword(keyword: string) {
    this.todolistKeywords.update(keywords => {
      const index = keywords.indexOf(keyword);
      if (index < 0) return keywords;
      keywords.splice(index, 1);
      this.accesorioForm.get('TodoList')?.setValue([...keywords]); // Update form on removal
      this.announcer.announce(`removed ${keyword} from reactive form`);
      return [...keywords]; // Return new array reference
    });
  }

  addReactiveKeyword(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.todolistKeywords.update(keywords => [...keywords, value]);
      this.accesorioForm.get('TodoList')?.setValue(this.todolistKeywords()); // Update form on add
      this.announcer.announce(`added ${value} to reactive form`);
    }
    event.chipInput!.clear();
  }

  // --- Image Path ---
  getimagePath(l: string | null): string { // Ensure return type is string
    const baseUrl = environment.apiUrl;
    // Use a more generic default image if specific one isn't found
    const defaultImage = `${baseUrl}/assets/placeholder.png`; // Example default image in assets

    if (l == null || l === '') {
      return defaultImage; // Return default
    } else {
      // Assuming images are served from /img-accesorios route in Node.js
      return `${baseUrl}/img-accesorios/${l}`;
    }
  }

  // ngAfterViewInit() {
  //   // It's generally better to put subscription logic in ngOnInit or specific methods
  // }

  // --- Form Accessor ---
  get f() {
    return this.accesorioForm.controls;
  }

  // **** 4. MODIFY onSubmit ****
  onSubmit() {
    if (this.accesorioForm.invalid) {
      console.error("Form is invalid:", this.accesorioForm.errors);
      // Mark fields as touched to show errors
      this.accesorioForm.markAllAsTouched();
      return;
    }

    // 1. Get current user
    const usuarioActual = this.authService.getUserValue();

    // 2. Validate user
    if (!usuarioActual || !usuarioActual.id) { // Also check for id property
      console.error("Error: No se pudo obtener el ID del usuario para registrar el accesorio.");
      // Optional: Show user-friendly error
      return;
    }

    // 3. Get current chip values explicitly before sending
    const formValue = this.accesorioForm.value;
    formValue.ProductosCompatibles = this.keywords(); // Get current signal value
    formValue.TodoList = this.todolistKeywords();     // Get current signal value

    // 4. Build final data object including User ID
    const accesorioData = {
      ...formValue,
      IdUsuario: usuarioActual.id // Add the user ID
    };

    console.log("Submitting accesorio data:", accesorioData); // Log for debugging

    // 5. Send data to service
    this.accesorioService.create(accesorioData).subscribe({
      next: (res: any) => {
        this.Agregado.emit();
        
        if (this.dialogRef) {
          this.dialogRef.close(true);
        }
        // Si es página independiente, la navegación se manejaría aquí si fuera necesario
      },
      error: (err) => {
        console.error("Error creating accesorio:", err);
        // Optional: Show user-friendly error message (e.g., using MatSnackBar)
      }
    });
  }
}