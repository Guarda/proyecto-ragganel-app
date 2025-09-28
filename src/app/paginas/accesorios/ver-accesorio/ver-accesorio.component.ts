import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { CategoriasConsolasService } from '../../../services/categorias-consolas.service';
import { EstadoConsolasService } from '../../../services/estado-consolas.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router'; // Router no se usa, pero se mantiene por si acaso
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
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
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';

import { AccesoriosBase } from '../../interfaces/accesoriosbase';
import { CategoriasAccesoriosBase } from '../../interfaces/categoriasaccesoriosbase';
import { FabricanteAccesorio } from '../../interfaces/fabricantesaccesorios';
import { categoriasAccesorios } from '../../interfaces/categoriasaccesorios';
import { SubcategoriasAccesorios } from '../../interfaces/subcategoriasaccesorios';
import { TareasAccesorio } from '../../interfaces/tareasaccesorios';
import { EstadosConsolas } from '../../interfaces/estados';

import { AccesorioBaseService } from '../../../services/accesorio-base.service';
import { FabricanteAccesorioService } from '../../../services/fabricante-accesorio.service';
import { CategoriaAccesorioService } from '../../../services/categoria-accesorio.service';
import { SubcategoriaAccesorioService } from '../../../services/subcategoria-accesorio.service';
import { TareasAccesoriosService } from '../../../services/tareas-accesorios.service';
import { CategoriasAccesoriosService } from '../../../services/categorias-accesorios.service';
import { EliminarAccesoriosComponent } from '../eliminar-accesorios/eliminar-accesorios.component';



@Component({
    selector: 'app-ver-accesorio',
    imports: [RouterModule, ReactiveFormsModule, MatFormField, MatLabel, NgFor, NgIf, MatOption, MatInputModule, MatOptionModule,
        MatSelectModule, MatButtonModule, MatIconModule, FormsModule, MatFormFieldModule, MatChipsModule, QRCodeComponent, MatCheckboxModule],
    templateUrl: './ver-accesorio.component.html',
    styleUrls: ['./ver-accesorio.component.css']
})
export class VerAccesorioComponent implements OnInit {
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

  constructor(public categorias: CategoriasAccesoriosService,
    public estados: EstadoConsolasService,
    public accesorioService: AccesorioBaseService,
    public fabricanteaccesorioService: FabricanteAccesorioService,
    public categoriaaccesorioService: CategoriasAccesoriosService,
    public subcategoriaaccesorioService: SubcategoriaAccesorioService,
    public tareasaccesorioService: TareasAccesoriosService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    // --- CAMBIO 1: Inicializa el formulario aquí ---
    this.accesorioForm = this.fb.group({
      FabricanteAccesorio: [''],
      IdModeloAccesorioPK: [''],
      ColorAccesorio: [''],
      EstadoAccesorio: [0],
      ComentarioAccesorio: [''],
      PrecioBase: ['0.00'],
      NumeroSerie: [''],
      CateAccesorio: [''],
      SubCategoriaAccesorio: [''],
      ProductosCompatibles: [[]]
    });
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['CodigoAccesorio'];
    this.accessorieId = this.id;
    this.loadAccessoryData();
    this.loadTasks();
    this.loadDropdownData();
  }

  loadAccessoryData(): void {
    this.accesorioService.find(this.id).subscribe((data) => {
      this.accesorio = data[0];
      const compatibleProducts = this.accesorio.ProductosCompatibles ? this.accesorio.ProductosCompatibles.split(',') : [];

      // --- CAMBIO 2: Usa patchValue para llenar el formulario con los datos de la API ---
      this.accesorioForm.patchValue({
        FabricanteAccesorio: this.accesorio.FabricanteAccesorio,
        IdModeloAccesorioPK: String(this.accesorio.ModeloAccesorio),
        ColorAccesorio: String(this.accesorio.ColorAccesorio),
        EstadoAccesorio: this.accesorio.EstadoAccesorio,
        ComentarioAccesorio: this.accesorio.Comentario,
        PrecioBase: this.formatNumber(this.accesorio.PrecioBase),
        NumeroSerie: this.accesorio.NumeroSerie,
        CateAccesorio: this.accesorio.CategoriaAccesorio,
        SubCategoriaAccesorio: String(this.accesorio.SubcategoriaAccesorio),
        ProductosCompatibles: compatibleProducts
      });

      // --- CAMBIO 3: Actualiza los 'keywords' (chips) de forma segura DESPUÉS de poblar el formulario ---
      this.keywords.set(compatibleProducts);

      this.categorias.find(String(this.accesorio.ModeloAccesorio)).subscribe((catData) => {
        this.categoria = catData[0];
        this.ImagePath = this.getimagePath(this.categoria.LinkImagen);
        // También puedes parchear el fabricante aquí si es necesario
        this.accesorioForm.patchValue({ FabricanteAccesorio: this.categoria.FabricanteAccesorio });
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
    this.categoriaaccesorioService.getAllBase().subscribe((data: categoriasAccesorios[]) => this.selectedCategoriaAccesorio = data);
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
      if (index < 0) {
        return currentKeywords;
      }

      const updatedKeywords = [...currentKeywords];
      updatedKeywords.splice(index, 1);

      this.accesorioForm.get('ProductosCompatibles')?.setValue(updatedKeywords);
      this.accesorioForm.get('ProductosCompatibles')?.markAsDirty();

      this.announcer.announce(`removed ${keyword}`);
      return updatedKeywords;
    });
  }

  onCheckboxChange(task: TareasAccesorio) {
    // Toggle the Realizado value between true and false
    task.Realizado = !task.Realizado; // This will toggle the value

    // Assuming that your backend expects 1 for true and 0 for false,
    // you can convert the boolean to a number before sending the update.
    // Llamamos al service para actualizar la tarea
    // Convert to number (1 for true, 0 for false)
    const realizadoValue = task.Realizado ? 1 : 0;    
    this.tareasaccesorioService.update(task.IdTareaAccesorioPK, realizadoValue).subscribe();

  }

  // En tu archivo ver-producto.component.ts

  private formatNumber(value: number | string | null): string {
    // Si el valor es nulo o una cadena vacía, devuelve '0.00'
    if (value === null || value === '') {
      return '0.00';
    }

    // Convierte el valor a string y luego a número flotante
    const num = parseFloat(String(value));

    // Si la conversión falla (resulta en NaN), devuelve '0.00'
    if (isNaN(num)) {
      return '0.00';
    }

    // Si todo está bien, formatea el número a 2 decimales
    return num.toFixed(2);
  }


  getimagePath(l: string | null) {
    const baseUrl = 'http://localhost:3000'; // Updated to match the Express server port

    if (l == null || l === '') {
      return `${baseUrl}/img-accesorios/GameCube_controller-1731775589376.png`;
    } else {
      return `${baseUrl}/img-accesorios/${l}`;
    }
  }

  trackByComaptibleProduct(index: number, compatibleproduct: string): string {
    return compatibleproduct; // or index, depending on your unique identifiers
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

  onSubmit() {    // TODO: Use EventEmitter with form value 
    if (!this.accesorioForm.dirty) {
      return; // Exit if the form has not been modified
    }
    const formData = {
      ...this.accesorioForm.value,
      CodigoAccesorio: this.id // Asegúrate de enviar el ID para la actualización
    };
    this.accesorioService.update(formData).subscribe((res: any) => {
      this.accesorioForm.markAsPristine(); // Marcar el formulario como "limpio" después de guardar
    })

  }

}
