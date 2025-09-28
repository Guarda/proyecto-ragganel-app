import { ChangeDetectorRef, Component, inject, Inject, OnInit, signal } from '@angular/core';
import { CategoriasConsolasService } from '../../../services/categorias-consolas.service';
import { EstadoConsolasService } from '../../../services/estado-consolas.service';
import { ProductosService } from '../productos.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';

import { Producto } from '../../interfaces/producto';
import { TipoProducto } from '../../interfaces/tipoproducto';
import { CategoriasConsolas } from '../../interfaces/categorias';
import { EstadosConsolas } from '../../interfaces/estados';
import { FabricanteProducto } from '../../interfaces/fabricantesproductos';
import { categoriasProductos } from '../../interfaces/categoriasproductos';
import { SubcategoriasProductos } from '../../interfaces/subcategoriasproductos';
import { FabricanteService } from '../../../services/fabricante.service';
import { CategoriaProductoService } from '../../../services/categoria-producto.service';
import { SubcategoriaProductoService } from '../../../services/subcategoria-producto.service';

import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatOption, MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { LiveAnnouncer } from '@angular/cdk/a11y'; 
import { QRCodeComponent } from 'angularx-qrcode';
import { MatDialog } from '@angular/material/dialog';

import { TareasProductosService } from '../../../services/tareas-productos.service';
import { TareasProducto } from '../../interfaces/tareasproductos';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import { EliminarProductosComponent } from '../eliminar-productos/eliminar-productos.component';
import { SuccessdialogComponent } from '../../../UI/alerts/successdialog/successdialog.component';


@Component({
    selector: 'app-ver-producto',
    imports: [RouterModule, ReactiveFormsModule, MatFormField, MatLabel, NgFor, NgIf, MatOption, MatInputModule, MatOptionModule,
        MatSelectModule, MatButtonModule, MatIcon, FormsModule, MatFormFieldModule, MatChipsModule, QRCodeComponent, MatCheckboxModule
    ],
    templateUrl: './ver-producto.component.html',
    styleUrl: './ver-producto.component.css'
})
export class VerProductoComponent implements OnInit {
  keywords = signal(['']);
  announcer = inject(LiveAnnouncer);

  productoForm!: FormGroup;

  id!: string;
  producto!: Producto;
  categoria!: CategoriasConsolas;
  
  selectedEstado: EstadosConsolas[] = [];
  tasks: TareasProducto[] = [];
  
  selectedTipoProducto: TipoProducto[] = [];
  selectedFabricante: FabricanteProducto[] = [];
  selectedCategoriaProducto: categoriasProductos[] = [];
  selectedSubCategoriaProducto: SubcategoriasProductos[] = [];

  ConsoleId: string | null = null;

  ImagePath: string = '';

  constructor(
    private categorias: CategoriasConsolasService,
    private estados: EstadoConsolasService,
    private productoService: ProductosService,
    private fabricanteService: FabricanteService,
    private categoriaproductoService: CategoriaProductoService,
    private subcategoriaproductoService: SubcategoriaProductoService,
    private tareasproductoService: TareasProductosService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    // --- CAMBIO 1: Inicializa el formulario aquí ---
    this.productoForm = this.fb.group({
      Fabricante: [''],
      IdModeloConsolaPK: [''],
      ColorConsola: [''],
      EstadoConsola: [0],
      HackConsola: [false],
      ComentarioConsola: [''],
      PrecioBase: ['0.00'],
      NumeroSerie: [''],
      Cate: [''],
      SubCategoria: [''],
      Accesorios: [[]]
    });
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['CodigoConsola'];
    this.ConsoleId = this.id;
    this.loadProductData();
    this.loadTasks();
    this.loadDropdownData();
  }

  loadProductData(): void {
    this.productoService.find(this.id).subscribe((data: Producto[]) => {
      this.producto = data[0];
      const accessories = this.producto.Accesorios ? this.producto.Accesorios.split(',') : [];
      console.log('producto', this.producto);
      // --- CAMBIO 2: Usa patchValue para llenar el formulario con los datos de la API ---
      this.productoForm.patchValue({
        Fabricante: this.producto.Fabricante,
        IdModeloConsolaPK: String(this.producto.Modelo),
        ColorConsola: this.producto.Color,
        EstadoConsola: Number(this.producto.Estado),
        HackConsola: Number(this.producto.Hack),
        ComentarioConsola: this.producto.Comentario,
        PrecioBase: this.formatNumber(this.producto.PrecioBase),
        NumeroSerie: this.producto.NumeroSerie,
        Cate: this.producto.Categoria,
        SubCategoria: String(this.producto.Subcategoria),
        Accesorios: accessories
      });

      // --- CAMBIO 3: Actualiza los 'keywords' (chips) de forma segura DESPUÉS de poblar el formulario ---
      this.keywords.set(accessories);

      this.categorias.find(String(this.producto.Modelo)).subscribe((catData: CategoriasConsolas[]) => {
        this.categoria = catData[0];
        this.ImagePath = this.getimagePath(this.categoria.LinkImagen);
        this.productoForm.patchValue({ Fabricante: this.categoria.Fabricante });
      });
    });
  }

  loadTasks(): void {
    this.tareasproductoService.find(this.id).subscribe((data: TareasProducto[]) => {
      this.tasks = data.map(task => ({
        ...task,
        RealizadoNumber: task.Realizado ? 1 : 0 // Set RealizadoNumber based on Realizado
      }));
    });
  }

  loadDropdownData(): void {
    this.estados.getAll().subscribe((data: EstadosConsolas[]) => {
      this.selectedEstado = data;
    });
    this.fabricanteService.getAllBase().subscribe((data: FabricanteProducto[]) => {
      this.selectedFabricante = data;
    });
    this.categoriaproductoService.getAllBase().subscribe((data: categoriasProductos[]) => {
      this.selectedCategoriaProducto = data;
    });
    // Cargar subcategorías basadas en la categoría inicial del producto
    if (this.productoForm.get('Cate')?.value) {
      this.subcategoriaproductoService.findBase(this.productoForm.get('Cate')?.value).subscribe((data: SubcategoriasProductos[]) => {
        this.selectedSubCategoriaProducto = data;
      });
    }
  }

  onCheckboxChange(task: TareasProducto) {
    task.Realizado = !task.Realizado;
    const realizadoValue = task.Realizado ? 1 : 0;
    this.tareasproductoService.update(task.IdTareaPK, realizadoValue).subscribe();
  }

  removeKeyword(keyword: string) {
    this.keywords.update(keywords => {
      const index = keywords.indexOf(keyword);
      if (index < 0) {
        return keywords;
      }

      keywords.splice(index, 1);
      const updatedKeywords = [...keywords];
      this.productoForm.get('Accesorios')?.setValue(updatedKeywords);
      this.productoForm.get('Accesorios')?.markAsDirty();

      this.announcer.announce(`removed ${keyword}`);
      return updatedKeywords;
    });
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our keyword
    if (value) {
      this.keywords.update(keywords => [...keywords, value]);
      this.productoForm.get('Accesorios')?.setValue(this.keywords());
      this.productoForm.get('Accesorios')?.markAsDirty();
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  trackByAccessory(index: number, accessory: string): string {
    return accessory; // or index, depending on your unique identifiers
  }

  getimagePath(l: string | null) {
    const baseUrl = 'http://localhost:3000'; // Updated to match the Express server port

    if (l == null || l === '') {
      return `${baseUrl}/img-consolas/nestoploader.jpg`;
    } else {
      return `${baseUrl}/img-consolas/${l}`;
    }
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


  openDialogEliminar(cons: string) {
    const dialogRef = this.dialog.open(EliminarProductosComponent, {
      disableClose: true,
      data: { value: cons }
    });
    dialogRef.componentInstance.Borrado.subscribe(() => {
      this.router.navigateByUrl('home/listado-productos');
    });
  }



  onSubmit() {
    if (!this.productoForm.dirty) {
      return; // Exit if the form has not been modified
    }
    const formData = {
      ...this.productoForm.value,
      CodigoConsola: this.id
    };
    this.productoService.update(formData).subscribe((res: any) => {
      this.productoForm.markAsPristine();
      this.dialog.open(SuccessdialogComponent); // Show success dialog
    })

  }

}
