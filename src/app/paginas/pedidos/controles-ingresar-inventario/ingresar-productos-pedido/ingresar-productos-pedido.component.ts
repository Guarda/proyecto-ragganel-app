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

@Component({
  selector: 'app-ingresar-productos-pedido',
  standalone: true,
  imports: [NgFor, ReactiveFormsModule, MatSelectModule, MatDialogModule, MatButtonModule, MatIcon,
    MatFormField, MatLabel, FormsModule, MatInputModule, MatFormFieldModule, MatChipsModule, CommonModule
  ],
  templateUrl: './ingresar-productos-pedido.component.html',
  styleUrl: './ingresar-productos-pedido.component.css'
})
export class IngresarProductosPedidoComponent {

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

    if (!this.articulo) {
      console.warn('⚠️ No se recibió un artículo válido.');
      return;
    }

    //console.log("Formulario recibido:", this.form);
    console.log("imagen", this.articulo.ImagePath);


    // Asegurarse de que `form` no sea undefined antes de asignar el listener
    if (this.form) {
      this.form.valueChanges.subscribe(() => {
        if (this.form.valid) {
          this.productoAgregado.emit(this.form.value);
        }
      });
    } else {
      console.warn("El formulario no fue recibido correctamente");
    }


    // this.producto = data[0];
    // console.log(data)
    // this.ConsoleId = this.articulo.;
    this.consoleCode = this.articulo.IdModeloPK;
    // this.consoleColor = this.producto.Color;
    // this.consoleState = this.producto.Estado;
    // this.consoleHack = this.producto.Hack;
    // this.consoleComment = this.producto.Comentario;
    this.consolePrice = this.articulo.Precio;
    console.log(" el precio es:", this.articulo);
    this.consoleManufacturer = this.articulo.FabricanteArticulo;
    this.consoleCate = this.articulo.CategoriaArticulo;
    this.consoleSubCate = this.articulo.SubcategoriaArticulo;
    // this.consoleSerialCode = this.producto.NumeroSerie;
    // this.consoleAccesories = this.producto.Accesorios.split(',');


    this.categorias.find(this.consoleCode).subscribe((data) => {
      this.categoria = data[0];
      console.log(this.categoria.LinkImagen);
      this.ImagePath = this.getimagePath(this.categoria.LinkImagen);
      // console.log(this.ImagePath)
      this.consoleManufacturer = this.categoria.Fabricante;
      // console.log(this.consoleManufacturer)
      this.cdr.detectChanges(); // 🔥 Forzar actualización en Angular
    });

    this.estados.getAll().subscribe((data: EstadosConsolas[]) => {
      // console.log(data);
      this.selectedEstado = data;
    })

    //FABRICANTE
    this.fabricanteService.getAllBase().subscribe((data: FabricanteProducto[]) => {
      // console.log(data);
      this.selectedFabricante = data;
    })

    //CATEGORIA
    this.categoriaproductoService.getAllBase().subscribe((data: categoriasProductos[]) => {
      // console.log(data);
      this.selectedCategoriaProducto = data;
    })

    //SUBCATEGORIA
    // this.subcategoriaproductoService.getAll().subscribe((data: SubcategoriasProductos[]) => {
    //    console.log(data);
    //   this.selectedSubCategoriaProducto = data;
    // })

    this.subcategoriaproductoService.findBase(this.consoleCate).subscribe((data: SubcategoriasProductos[]) => {
      this.selectedSubCategoriaProducto = data;
    })

    //ACCESORIOS
    this.categorias.getbymanufacturer(this.consoleManufacturer, this.consoleCate, this.consoleSubCate).subscribe((data) => {
              
      //UPDATES THE CHIPS OF ACCESORIES OF GIVEN PRODUCT TYPE
      this.IdTipoProd = data[0].TipoProducto;
      this.accesoriosService.find(this.IdTipoProd).subscribe((data) => {     
        this.keywords.update(() => []);        
        for (var val of data) {             
          this.addt(val.DescripcionAccesorio); // prints values: 10, 20, 30, 40
        }
        //this.keywords.update(() => []); 
      })          
    });
      
    // console.log(this.consoleHack);     

    this.productoForm = new FormGroup({
      Fabricante: new FormControl('', Validators.required),
      Cate: new FormControl('', Validators.required),
      SubCategoria: new FormControl('', Validators.required),
      IdModeloConsolaPK: new FormControl('', Validators.required),
      ColorConsola: new FormControl(''),
      PrecioBase: new FormControl('', Validators.required),
      EstadoConsola: new FormControl('', Validators.required),
      HackConsola: new FormControl('', Validators.required),
      ComentarioConsola: new FormControl(''),
      Accesorios: new FormControl(''),
      NumeroSerie: new FormControl(''),
      TodoList: new FormControl('')
    });

    // *USAR this.form PARA ESTABLECER LOS VALORES INICIALES*
    if (this.articulo) { // <-- Verifica que articulo exista
      this.form.patchValue({
        Fabricante: this.consoleManufacturer, // Usa los datos que ya tienes
        IdModeloConsolaPK: this.consoleCode,   // Usa los datos que ya tienes
        PrecioBase: this.formatNumber(this.consolePrice), // Usa los datos que ya tienes
        Cate: this.consoleCate,                 // Usa los datos que ya tienes
        SubCategoria: this.consoleSubCate,       // Usa los datos que ya tienes
        NumeroSerie: this.articulo.NumeroSerie || '', // Usa el valor del articulo o ''
        ColorConsola: this.articulo.ColorConsola || '', // Usa el valor del articulo o ''
        EstadoConsola: this.articulo.EstadoConsola || '', // Usa el valor del articulo o ''
        HackConsola: this.articulo.HackConsola || '', // Usa el valor del articulo o ''
        Accesorios: this.articulo.Accesorios || '', // Usa el valor del articulo o ''
        ComentarioConsola: this.articulo.Comentario || '', // Usa el valor del articulo o ''
        TodoList: this.articulo.TodoList || ''  // Usa el valor del articulo o ''
      });
    }



    this.form.valueChanges.subscribe(() => {
      this.cdr.detectChanges(); // Detectar cambios para el botón disabled
    });
    
    this.cdr.detectChanges(); // Detectar cambios después de patchValue

    // this.productoForm.patchValue({
    //   HackC: this.consoleHack,
    //   SubCategoria: this.consoleSubCate
    // });



    this.categorias.getAll().subscribe((data: CategoriasConsolas[]) => {
      this.keywords.update(() => []);
      this.selectedCategoria = data;
      this.categoria = data[0];
      // this.ImagePath = this.getimagePath(this.categoria.LinkImagen);
    })

    // Inicializar el formulario *SOLO UNA VEZ* y usar el formulario recibido desde el padre
    this.productoForm = this.form; // Asigna el formulario recibido

    this.estados.getAll().subscribe((data: EstadosConsolas[]) => {
      //console.log(data);
      this.selectedEstado = data;
    });

    this.TiposProductosService.getAll().subscribe((data: TipoProducto[]) => {
      this.selectedTipoProducto = data;
      console.log(this.selectedTipoProducto);
    })

    this.fabricanteService.getManufacturerWithModel().subscribe((data: FabricanteProducto[]) => {
      this.selectedFabricante = data;
    })

    this.productoForm.get('TodoList')?.setValue(this.nkeywords());
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
    this.productoForm.get('SubCategoria')?.valueChanges.subscribe(selectedId => {
      console.log(selectedId);
    });
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

