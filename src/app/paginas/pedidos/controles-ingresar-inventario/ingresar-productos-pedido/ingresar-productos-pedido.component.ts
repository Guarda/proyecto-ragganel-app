import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { CategoriasConsolas } from '../../../interfaces/categorias';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule, NgFor } from '@angular/common';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';

import { CategoriasConsolasService } from '../../../../services/categorias-consolas.service';
import { EstadosConsolas } from '../../../interfaces/estados';
import { EstadoConsolasService } from '../../../../services/estado-consolas.service';
import { ProductosService } from '../../../productos/productos.service';
import { TipoProducto } from '../../../interfaces/tipoproducto';
import { FabricanteProducto } from '../../../interfaces/fabricantesproductos';
import { categoriasProductos } from '../../../interfaces/categoriasproductos';
import { SubcategoriasProductos } from '../../../interfaces/subcategoriasproductos';


import { TiposProductosService } from '../../../../services/tipos-productos.service';
import { FabricanteService } from '../../../../services/fabricante.service';
import { CategoriaProductoService } from '../../../../services/categoria-producto.service';
import { SubcategoriaProductoService } from '../../../../services/subcategoria-producto.service';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { TiposAccesoriosService } from '../../../../services/tipos-accesorios.service';
import { Producto } from '../../../interfaces/producto';
import { MatCardActions, MatCardContent } from '@angular/material/card';

@Component({
  selector: 'app-ingresar-productos-pedido',
  standalone: true,
  imports: [NgFor, ReactiveFormsModule, MatSelectModule, MatDialogModule, MatButtonModule, MatIcon,
    MatFormField, MatLabel, FormsModule, MatInputModule, MatFormFieldModule, MatChipsModule, CommonModule, MatCardContent, MatCardActions
  ],
  templateUrl: './ingresar-productos-pedido.component.html',
  styleUrl: './ingresar-productos-pedido.component.css'
})
export class IngresarProductosPedidoComponent {
  @Input() stepperIndex: number = 0;
  @Input() form!: FormGroup; // 👈 Asegurar que el componente recibe 'form'
  @Input() articulo!: any; // Recibe el artículo desde el padre

  @Output() productoAgregado = new EventEmitter<any>();
  keywords = signal(['']);
  todolistKeywords = signal(['Limpiar']);
  announcer = inject(LiveAnnouncer);

  Agregado = new EventEmitter();

  productoForm!: FormGroup;
  producto!: Producto;

  categoriasconsolas: CategoriasConsolas[] = [];
  categoria!: CategoriasConsolas;
  categoria2!: CategoriasConsolas;

  selectedCategoria: any[] = [];

  selectedTipoProducto: TipoProducto[] = [];
  selectedFabricante: FabricanteProducto[] = [];
  selectedCategoriaProducto: categoriasProductos[] = [];
  selectedSubCategoriaProducto: SubcategoriasProductos[] = [];

  // estadoconsolas: EstadosConsolas[] = [];
  selectedEstado: EstadosConsolas[] = [];

  IdModeloPK: any;
  IdTipoProd: any;
  Fabricante: any;
  Categoria: any;
  Subcategoria: any;

  public ConsoleId: any;
  public consoleCode: any;
  public consoleColor: any;
  public consoleState: any;
  public consoleHack: any;
  public consoleComment: any;
  public consolePrice: any;
  public consoleManufacturer: any;
  public consoleCate: any;
  public consoleSubCate: any;
  public consoleSerialCode: any;
  public consoleAccesories: any;
  // public consoleCurrency: any;



  public ImagePath: any;


  constructor(
    public categorias: CategoriasConsolasService,
    public estados: EstadoConsolasService,
    public TiposProductosService: TiposProductosService,
    public fabricanteService: FabricanteService,
    public categoriaproductoService: CategoriaProductoService,
    public subcategoriaproductoService: SubcategoriaProductoService,
    public productoService: ProductosService,
    public accesoriosService: TiposAccesoriosService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef, private router: Router) {


  }

  ngOnInit(): void {
    // Verificación de seguridad para asegurar que los @Inputs se recibieron
    if (!this.form || !this.articulo) {
      console.error('⚠️ Componente "IngresarProductosPedido" no recibió un formulario o artículo válido.');
      return;
    }

    this.cargarDatosParaSelects();
    this.establecerValoresIniciales();
    this.cargarDatosDinamicosDelArticulo();
  }

  private cargarDatosParaSelects(): void {
    this.estados.getAll().subscribe(data => this.selectedEstado = data);
    this.fabricanteService.getAllBase().subscribe(data => this.selectedFabricante = data);
    this.categoriaproductoService.getAllBase().subscribe(data => this.selectedCategoriaProducto = data);

    if (this.articulo.CategoriaArticulo) {
      this.subcategoriaproductoService.findBase(this.articulo.CategoriaArticulo)
        .subscribe(data => this.selectedSubCategoriaProducto = data);
    }
  }

  private establecerValoresIniciales(): void {
    this.form.patchValue({
      Fabricante: this.articulo.FabricanteArticulo,
      Cate: this.articulo.CategoriaArticulo,
      SubCategoria: this.articulo.SubcategoriaArticulo,
      PrecioBase: this.formatNumber(this.articulo.Precio),
      NumeroSerie: this.articulo.NumeroSerie || '',
      ColorConsola: this.articulo.ColorConsola || '',
      EstadoConsola: this.articulo.EstadoConsola || '',
      HackConsola: this.articulo.HackConsola || '0', // Valor por defecto
      ComentarioConsola: this.articulo.Comentario || '',
      IdPedido: this.articulo.IdCodigoPedidoFK
    });

    // Inicializa los "chips" de tareas y accesorios desde el formulario
    const initialTodos = this.form.get('TodoList')?.value;
    this.todolistKeywords.set(Array.isArray(initialTodos) && initialTodos.length > 0 ? initialTodos : ['Limpiar']);

    const initialAccessories = this.form.get('Accesorios')?.value;
    this.keywords.set(Array.isArray(initialAccessories) ? initialAccessories : []);

    this.cdr.detectChanges();
  }

  private cargarDatosDinamicosDelArticulo(): void {
    this.categorias.find(this.articulo.IdModeloPK).subscribe(data => {
      if (data && data.length > 0) {
        const categoria = data[0];
        this.ImagePath = this.getimagePath(categoria.LinkImagen);

        // Carga los accesorios sugeridos para este tipo de producto
        this.accesoriosService.find(categoria.TipoProducto).subscribe((accesorios: any[]) => {
          const nombresAccesorios = accesorios.map((a: any) => a.DescripcionAccesorio);
          this.keywords.set(nombresAccesorios); // Actualiza los chips de accesorios
          this.form.get('Accesorios')?.setValue(nombresAccesorios); // Actualiza el valor en el formulario
          this.cdr.detectChanges();
        });
      }
    });
  }


  trackByAccessory(index: number, accessory: string): string {
    return accessory; // or index, depending on your unique identifiers
  }

  formatNumber(value: number | null) {
    if (value == null) {
      return 0;
    }
    else {
      return value.toFixed(2); // Formats the number to 2 decimal places
    }
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

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our keyword
    if (value) {
      this.keywords.update(keywords => [...keywords, value]);
      this.productoForm.get('Accesorios')?.setValue(this.keywords()); // Update the form control
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  addt(valor: String): void {
    const value = (valor || '').trim();

    // Add our keyword
    if (value) {
      this.keywords.update(keywords => [...keywords, value]);
      console.log(this.keywords());

      this.productoForm.get('Accesorios')?.setValue(this.keywords());
      this.productoForm.get('Accesorios')?.markAsDirty();
      // Force change detection
      this.cdr.detectChanges();
    }

    // Clear the input value
    //

  }

  ngAfterViewInit() {
    // Se debe usar 'this.form' en lugar de 'this.productoForm'
    // Se añade una comprobación para asegurar que el control existe antes de suscribirse
    if (this.form?.get('SubCategoria')) {
      this.form.get('SubCategoria')?.valueChanges.subscribe(selectedId => {
        console.log('ID de Subcategoría seleccionado:', selectedId);
      });
    }
  }

  // Add this method inside your IngresarProductosPedidoComponent class

get precioFinalIngreso(): number {
  const precioBase = parseFloat(this.form?.value?.PrecioBase || '0');
  const costoDistribuido = parseFloat(this.form?.value?.CostoDistribuido || '0');
  return precioBase + costoDistribuido;
}


  get f() {

    return this.productoForm.controls;

  }

  // getimagePath(l: string | null) {
  //   if (l == null || l == '') {
  //     //console.log(l);
  //     return '/img-consolas/' + 'nestoploader.jpg';
  //   }
  //   else {
  //     return '/img-consolas/' + l;
  //   }
  // }

  getimagePath(l: string | null) {
    const baseUrl = 'http://localhost:3000'; // Updated to match the Express server port

    if (l == null || l === '') {
      return `${baseUrl}/img-consolas/nestoploader.jpg`;
    } else {
      return `${baseUrl}/img-consolas/${l}`;
    }
  }

  removeReactiveKeyword(keyword: string) {
    this.todolistKeywords.update(keywords => {
      const index = keywords.indexOf(keyword);
      if (index < 0) {
        return keywords;
      }

      keywords.splice(index, 1);
      this.announcer.announce(`removed ${keyword} from reactive form`);
      return [...keywords];
    });
  }

  addReactiveKeyword(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our keyword
    if (value) {
      this.todolistKeywords.update(keywords => [...keywords, value]);
      this.productoForm.get('TodoList')?.setValue(this.keywords());
      this.announcer.announce(`added ${value} to reactive form`);
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  // Helper method to return the current keywords array
  nkeywords(): string[] {
    return this.todolistKeywords();
  }



}

