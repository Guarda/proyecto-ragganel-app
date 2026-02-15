import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { Subscription } from 'rxjs';

// Angular Material Imports
import { EstadoConsolasService } from '../../../services/estado-consolas.service';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatOption, MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { LiveAnnouncer } from '@angular/cdk/a11y'; 
import { QRCodeComponent } from 'angularx-qrcode';
import { MatDialog } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SuccessdialogComponent } from '../../../UI/alerts/successdialog/successdialog.component';

// Interfaces
import { AccesoriosBase } from '../../interfaces/accesoriosbase';
import { CategoriasAccesoriosBase } from '../../interfaces/categoriasaccesoriosbase';
import { FabricanteAccesorio } from '../../interfaces/fabricantesaccesorios';
import { categoriasAccesorios } from '../../interfaces/categoriasaccesorios';
import { SubcategoriasAccesorios } from '../../interfaces/subcategoriasaccesorios';
import { TareasAccesorio } from '../../interfaces/tareasaccesorios';
import { EstadosConsolas } from '../../interfaces/estados';
import { Usuarios } from '../../interfaces/usuarios'; // ✅ AÑADIDO

// Services
import { AccesorioBaseService } from '../../../services/accesorio-base.service';
import { FabricanteAccesorioService } from '../../../services/fabricante-accesorio.service';
import { CategoriaAccesorioService } from '../../../services/categoria-accesorio.service';
import { SubcategoriaAccesorioService } from '../../../services/subcategoria-accesorio.service';
import { TareasAccesoriosService } from '../../../services/tareas-accesorios.service';
import { CategoriasAccesoriosService } from '../../../services/categorias-accesorios.service';
import { AuthService } from '../../../UI/session/auth.service'; // ✅ AÑADIDO

// Components
import { EliminarAccesoriosComponent } from '../eliminar-accesorios/eliminar-accesorios.component';
import { environment } from '../../../../enviroments/enviroments';



@Component({
    selector: 'app-ver-accesorio',
    standalone: true, // Se añade standalone: true
    imports: [
        RouterModule, ReactiveFormsModule, MatFormFieldModule, MatLabel, NgFor, NgIf, MatOptionModule,
        MatInputModule, MatSelectModule, MatButtonModule, MatIconModule, FormsModule, MatChipsModule,
        QRCodeComponent, MatCheckboxModule
    ],
    templateUrl: './ver-accesorio.component.html',
    styleUrls: ['./ver-accesorio.component.css']
})
export class VerAccesorioComponent implements OnInit, OnDestroy {
  keywords = signal(['']);
  announcer = inject(LiveAnnouncer);

  accesorioForm!: FormGroup;

  id!: string;
  accesorio!: AccesoriosBase;
  categoria!: CategoriasAccesoriosBase;
  
  selectedEstado: EstadosConsolas[] = [];
  tasks: TareasAccesorio[] = [];

  selectedFabricante: FabricanteAccesorio[] = [];
  selectedCategoriaAccesorio: categoriasAccesorios[] = [];
  selectedSubCategoriaAccesorio: SubcategoriasAccesorios[] = [];

  accessorieId: string | null = null;

  ImagePath: string = '';

  usuario!: Usuarios; // ✅ AÑADIDO
  private subs = new Subscription(); // ✅ AÑADIDO

  // ✅ AÑADIDO: Validador personalizado para la longitud de los chips
  /**
   * Validador personalizado para la longitud total de los productos compatibles.
   */
  productosCompatiblesLengthValidator(max: number) {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value as string[];
      if (!value || value.length === 0) {
        return null; // Válido si está vacío
      }
      // Convertimos el array a un string JSON (ej: ["PS4","PS5"])
      const jsonString = JSON.stringify(value);
      
      return jsonString.length > max 
        ? { 'totalLengthExceeded': { requiredLength: max, actualLength: jsonString.length } } 
        : null;
    };
  }

  constructor(
    public categorias: CategoriasAccesoriosService,
    public estados: EstadoConsolasService,
    public accesorioService: AccesorioBaseService,
    public fabricanteaccesorioService: FabricanteAccesorioService,
    public categoriaaccesorioService: CategoriaAccesorioService, // Corregido el tipo
    public subcategoriaaccesorioService: SubcategoriaAccesorioService,
    public tareasaccesorioService: TareasAccesoriosService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private authService: AuthService // ✅ AÑADIDO
  ) {
    // ✅ CAMBIO: Se actualiza el FormGroup con todos los validadores
    this.accesorioForm = this.fb.group({
      FabricanteAccesorio: [''],
      IdModeloAccesorioPK: [''],

      // --- VALIDACIONES AÑADIDAS ---
      ColorAccesorio: ['', [Validators.maxLength(100)]], // Límite varchar(100)
      
      EstadoAccesorio: [0],
      
      ComentarioAccesorio: ['', [Validators.maxLength(10000)]], // Límite varchar(10000)
      
      PrecioBase: ['0.00', [ // Límite Decimal(6,2)
        Validators.required,
        Validators.pattern(/^\d{1,4}(\.\d{1,2})?$/), // 4 dígitos enteros, 2 decimales
        Validators.max(9999.99)
      ]],
      
      NumeroSerie: ['', [Validators.maxLength(100)]], // Límite varchar(100)
      // --- FIN DE VALIDACIONES ---

      CateAccesorio: [''],
      SubCategoriaAccesorio: [''],
      ProductosCompatibles: [[], [this.productosCompatiblesLengthValidator(500)]] // Límite varchar(500)
    });
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['CodigoAccesorio'];
    this.accessorieId = this.id;
    this.loadAccessoryData();
    this.loadTasks();
    this.loadDropdownData();
    // ✅ AÑADIDO: Se obtiene el usuario al iniciar el componente
    this.subs.add(this.authService.getUser().subscribe(user => this.usuario = user as unknown as Usuarios));
  }

  ngOnDestroy(): void {
    // ✅ AÑADIDO: Se desuscribe para evitar fugas de memoria
    this.subs.unsubscribe();
  }

  loadAccessoryData(): void {
    this.accesorioService.find(this.id).subscribe((data) => {
      if (!data || data.length === 0) return;
      this.accesorio = data[0];
      const compatibleProducts = this.accesorio.ProductosCompatibles ? this.accesorio.ProductosCompatibles.split(',') : [];

      this.accesorioForm.patchValue({
        FabricanteAccesorio: this.accesorio.FabricanteAccesorio,
        IdModeloAccesorioPK: String(this.accesorio.ModeloAccesorio),
        ColorAccesorio: String(this.accesorio.ColorAccesorio),
        EstadoAccesorio: this.accesorio.EstadoAccesorio,
        ComentarioAccesorio: this.accesorio.Comentario,
        PrecioBase: this.formatNumber(this.accesorio.PrecioBase),
        NumeroSerie: this.accesorio.NumeroSerie,
        CateAccesorio: this.accesorio.CategoriaAccesorio,
        SubCategoriaAccesorio: this.accesorio.SubcategoriaAccesorio,
        ProductosCompatibles: compatibleProducts
      });

      this.keywords.set(compatibleProducts);

      this.categorias.find(String(this.accesorio.ModeloAccesorio)).subscribe((catData) => {
        if (catData && catData.length > 0) {
          this.categoria = catData[0];
          this.ImagePath = this.getimagePath(this.categoria.LinkImagen);
        }
      });
    });
  }

  loadTasks(): void {
    this.tareasaccesorioService.find(this.id).subscribe((data: TareasAccesorio[]) => {
      this.tasks = data.map(task => ({
        ...task,
        RealizadoNumber: task.Realizado ? 1 : 0 // Set RealizadoNumber based on Realizado
      }));
    });
  }

  loadDropdownData(): void {
    this.estados.getAll().subscribe((data: EstadosConsolas[]) => this.selectedEstado = data);
    this.fabricanteaccesorioService.getAllBase().subscribe((data: FabricanteAccesorio[]) => this.selectedFabricante = data);
    this.categoriaaccesorioService.getAllBase().subscribe((data: categoriasAccesorios[]) => this.selectedCategoriaAccesorio = data); // Corregido el servicio
    this.subcategoriaaccesorioService.getAll().subscribe((data: SubcategoriasAccesorios[]) => this.selectedSubCategoriaAccesorio = data);
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our keyword
    if (value) {
      this.keywords.update(currentKeywords => [...currentKeywords, value]);
      this.accesorioForm.get('ProductosCompatibles')?.setValue(this.keywords()); // Update the form control
      this.accesorioForm.get('ProductosCompatibles')?.markAsDirty();
    }

    // Clear the input value
    event.chipInput!.clear();
  }
  removeKeyword(keyword: string) {
    this.keywords.update(currentKeywords => {
      const index = currentKeywords.indexOf(keyword);
      if (index < 0) return currentKeywords;

      const updatedKeywords = [...currentKeywords];
      updatedKeywords.splice(index, 1);

      this.accesorioForm.get('ProductosCompatibles')?.setValue(updatedKeywords);
      this.accesorioForm.get('ProductosCompatibles')?.markAsDirty();

      this.announcer.announce(`removed ${keyword}`);
      return updatedKeywords;
    });
  }

  onCheckboxChange(task: TareasAccesorio) {
    task.Realizado = !task.Realizado;
    const realizadoValue = task.Realizado ? 1 : 0;    
    this.tareasaccesorioService.update(task.IdTareaAccesorioPK, realizadoValue).subscribe();

  }

  private formatNumber(value: number | string | null): string {
    if (value === null || value === '') return '0.00';
    const num = parseFloat(String(value));
    return isNaN(num) ? '0.00' : num.toFixed(2);
  }


  getimagePath(l: string | null) {
    const baseUrl = environment.apiUrl;
    return l ? `${baseUrl}/img-accesorios/${l}` : `${baseUrl}/img-accesorios/GameCube_controller-1731775589376.png`;
  }

  trackByComaptibleProduct(index: number, compatibleproduct: string): string {
    return compatibleproduct;
  }

  openDialogEliminar(cons: string) {
    const dialogRef = this.dialog.open(EliminarAccesoriosComponent, {
      disableClose: true,
      data: { value: cons }
    });
    dialogRef.componentInstance.Borrado.subscribe(() => {      
      this.router.navigateByUrl('home/listado-accesorios');
    });
  }

  onSubmit() {
    // --- ✅ AÑADIDO: Guardia de validez ---
    // Marca todos los campos como "tocados" para mostrar errores si no lo están
    this.accesorioForm.markAllAsTouched();

    // Si el formulario es inválido (por el patrón o cualquier otra razón), detiene todo.
    if (this.accesorioForm.invalid) {
      console.error('Formulario inválido, no se enviará.');
      return;
    }
    // --- FIN DEL AÑADIDO ---

    if (!this.accesorioForm.dirty) {
      return;
    }
    // ✅ AÑADIDO: Se verifica que el usuario esté cargado
    if (!this.usuario) {
      console.error('Error: El usuario no ha sido cargado todavía.');
      return;
    }
    
    // ✅ AÑADIDO: Se añade el ID del usuario al objeto que se envía
    const formData = {
      ...this.accesorioForm.value,
      CodigoAccesorio: this.id,
      IdUsuario: this.usuario.id 
    };

    this.accesorioService.update(formData).subscribe((res: any) => {
      this.accesorioForm.markAsPristine();
      this.dialog.open(SuccessdialogComponent);
    });

  }

}
