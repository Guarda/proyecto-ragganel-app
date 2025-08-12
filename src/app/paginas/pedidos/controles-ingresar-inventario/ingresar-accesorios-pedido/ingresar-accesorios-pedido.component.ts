import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule, NgFor } from '@angular/common';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';

import { CategoriasAccesoriosService } from '../../../../services/categorias-accesorios.service';
import { EstadosConsolas } from '../../../interfaces/estados';
import { EstadoConsolasService } from '../../../../services/estado-consolas.service';
import { AccesorioBaseService } from '../../../../services/accesorio-base.service';
import { FabricanteAccesorio } from '../../../interfaces/fabricantesaccesorios';
import { categoriasAccesorios } from '../../../interfaces/categoriasaccesorios';
import { SubcategoriasAccesorios } from '../../../interfaces/subcategoriasaccesorios';

import { FabricanteAccesorioService } from '../../../../services/fabricante-accesorio.service';
import { CategoriaAccesorioService } from '../../../../services/categoria-accesorio.service';
import { SubcategoriaAccesorioService } from '../../../../services/subcategoria-accesorio.service';

import { LiveAnnouncer } from '@angular/cdk/a11y';
import { CategoriasAccesoriosBase } from '../../../interfaces/categoriasaccesoriosbase';
import { AccesoriosBase } from '../../../interfaces/accesoriosbase';

@Component({
  selector: 'app-ingresar-accesorios-pedido',
  standalone: true,
  imports: [NgFor, ReactiveFormsModule, MatSelectModule, MatDialogModule, MatButtonModule, MatIcon,
    MatFormField, MatLabel, FormsModule, MatInputModule, MatFormFieldModule, MatChipsModule, CommonModule],
  templateUrl: './ingresar-accesorios-pedido.component.html',
  styleUrl: './ingresar-accesorios-pedido.component.css'
})
export class IngresarAccesoriosPedidoComponent {
  @Input() stepperIndex: number = 0;
  @Input() form!: FormGroup; // 👈 Asegurar que el componente recibe 'form'
  @Input() articulo!: any; // Recibe el artículo desde el padre

  @Output() accesorioAgregado = new EventEmitter<any>();

  keywords = signal(['']);
  todolistKeywords = signal(['Limpiar']);
  announcer = inject(LiveAnnouncer);

  Agregado = new EventEmitter();


  categoriasaccesorios: categoriasAccesorios[] = [];
  categoria!: CategoriasAccesoriosBase;
  categoria2!: CategoriasAccesoriosBase;

  selectedCategoria: any[] = [];

  selectedFabricanteAccesorio: FabricanteAccesorio[] = [];
  selectedCategoriaAccesorio: categoriasAccesorios[] = [];
  selectedSubCategoriaAccesorio: SubcategoriasAccesorios[] = [];

  selectedEstado: EstadosConsolas[] = [];

  idModeloAccesorioPK: any;
  FabricanteAccesorio: any;
  CategoriaAccesorio: any;
  SubcategoriaAccesorio: any;

  public orderID: any;
  public accessorieId: any;
  public accessorieCode: any;
  public accessorieColor: any;
  public accessorieState: any;
  public accessorieComment: any;
  public accessoriePrice: any;
  public accessorieManufacturer: any;
  public accessorieCate: any;
  public accessorieSubCate: any;
  public accessorieSerialCode: any;
  public accessorieCompatibleProducts: any;
  public image: any;

  public ImagePath: any;

  constructor(
    public categorias: CategoriasAccesoriosService,
    public estados: EstadoConsolasService,
    public fabricanteService: FabricanteAccesorioService,
    public categoriaaccesorioService: CategoriaAccesorioService,
    public subcategoriaaccesrorioService: SubcategoriaAccesorioService,
    public accesorioService: AccesorioBaseService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    if (!this.form || !this.articulo) {
      console.error('⚠️ Componente "IngresarAccesoriosPedido" no recibió un formulario o artículo válido.');
      return;
    }
    
    this.cargarDatosParaSelects();
    this.establecerValoresIniciales();
    this.cargarDatosDinamicosDelArticulo();
  }

  private cargarDatosParaSelects(): void {
    this.estados.getAll().subscribe(data => this.selectedEstado = data);
    this.fabricanteService.getManufacturerWithModel().subscribe(data => this.selectedFabricanteAccesorio = data);
    this.categoriaaccesorioService.getAll().subscribe(data => this.selectedCategoriaAccesorio = data);
    // Las subcategorías se pueden cargar dinámicamente si dependen de la categoría seleccionada
    this.subcategoriaaccesrorioService.getAll().subscribe(data => this.selectedSubCategoriaAccesorio = data);
  }

  private establecerValoresIniciales(): void {
    // ✅ Se usa 'this.form' para establecer los valores
    this.form.patchValue({
      FabricanteAccesorio: this.articulo.FabricanteArticulo,
      CateAccesorio: this.articulo.CategoriaArticulo,
      SubCategoriaAccesorio: this.articulo.SubcategoriaArticulo,
      PrecioBase: this.formatNumber(this.articulo.Precio),
      NumeroSerie: this.articulo.NumeroSerie || '',
      ColorAccesorio: this.articulo.ColorAccesorio || '',
      EstadoAccesorio: this.articulo.EstadoAccesorio || '',
      ComentarioAccesorio: this.articulo.Comentario || '',
      IdPedido: this.articulo.IdCodigoPedidoFK
    });

    const initialTodos = this.form.get('TodoList')?.value;
    this.todolistKeywords.set(Array.isArray(initialTodos) && initialTodos.length > 0 ? initialTodos : ['Limpiar']);

    const initialCompat = this.form.get('ProductosCompatibles')?.value;
    this.keywords.set(Array.isArray(initialCompat) ? initialCompat : []);
    
    this.cdr.detectChanges();
  }

  private cargarDatosDinamicosDelArticulo(): void {
    this.categorias.find(this.articulo.IdModeloPK).subscribe(data => {
      if (data && data.length > 0) {
        this.ImagePath = this.getimagePath(data[0].LinkImagen);
        this.cdr.markForCheck();
      }
    });
  }

  removeKeyword(keyword: string) {
    this.keywords.update(keywords => {
      const index = keywords.indexOf(keyword);
      if (index < 0) {
        return keywords;
      }

      keywords.splice(index, 1);
      this.announcer.announce(`removed ${keyword}`);
      return [...keywords];
    });
  }

  formatNumber(value: number | null) {
    if (value == null) {
      return 0;
    }
    else {
      return value.toFixed(2); // Formats the number to 2 decimal places
    }
  }


  // Métodos para Chips de "Productos Compatibles"
  addCompatibleProduct(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.keywords.update(current => [...current, value]);
      this.form.get('ProductosCompatibles')?.setValue(this.keywords());
    }
    event.chipInput!.clear();
  }

  removeCompatibleProduct(keyword: string): void {
    this.keywords.update(current => {
      const index = current.indexOf(keyword);
      if (index >= 0) {
        current.splice(index, 1);
        this.form.get('ProductosCompatibles')?.setValue([...current]);
        this.announcer.announce(`Removed ${keyword}`);
      }
      return [...current];
    });
  }

  // Helper method to return the current keywords array
  nkeywords(): string[] {
    return this.todolistKeywords();
  }

   // Métodos para Chips de "Tareas a Realizar"
  addTodo(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.todolistKeywords.update(keywords => [...keywords, value]);
      // ✅ Corregido: usa 'todolistKeywords()'
      this.form.get('TodoList')?.setValue(this.todolistKeywords());
      this.announcer.announce(`added ${value} to reactive form`);
    }
    event.chipInput!.clear();
  }

  removeTodo(keyword: string): void {
    this.todolistKeywords.update(keywords => {
      const index = keywords.indexOf(keyword);
      if (index >= 0) {
        keywords.splice(index, 1);
        this.form.get('TodoList')?.setValue([...keywords]);
        this.announcer.announce(`removed ${keyword} from reactive form`);
      }
      return [...keywords];
    });
  }
  getimagePath(l: string | null) {
    const baseUrl = 'http://localhost:3000'; // Updated to match the Express server port
    console.log("kkkkkk",l);
    if (l == null || l === '') {
      return `${baseUrl}/img-accesorios/GameCube_controller-1731775589376.png`;
    } else {
      return `${baseUrl}/img-accesorios/${l}`;
    }
  }

  ngAfterViewInit() {
    this.form.get('SubCategoriaAccesorio')?.valueChanges.subscribe(selectedId => {
      console.log(selectedId);
    });
  }

  get precioFinalIngreso(): number {
    const precioBase = parseFloat(this.form?.value?.PrecioBase || '0');
    const costoDistribuido = parseFloat(this.form?.value?.CostoDistribuido || '0');
    return precioBase + costoDistribuido;
  }

  get f() {

    return this.form.controls;

  }

  // onSubmit() {    // TODO: Use EventEmitter with form value 
  //   // console.log(this.accesorioForm.value);
  //   // console.log("enviado");
  //   this.accesorioService.create(this.accesorioForm.value).subscribe((res: any) => {
  //     this.Agregado.emit();
  //     this.router.navigateByUrl('listado-accesorios');
  //   })

  // }

}

