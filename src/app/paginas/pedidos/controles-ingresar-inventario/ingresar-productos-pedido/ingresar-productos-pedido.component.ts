import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { CategoriasConsolas } from '../../../interfaces/categorias';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
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
import { environment } from '../../../../../enviroments/enviroments';

@Component({
    selector: 'app-ingresar-productos-pedido',
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
  producto!: Producto;

  categoriasconsolas: CategoriasConsolas[] = [];
  categoria!: CategoriasConsolas;
  categoria2!: CategoriasConsolas;

  selectedCategoria: any[] = [];

  selectedTipoProducto: TipoProducto[] = [];
  selectedFabricante: FabricanteProducto[] = [];
  selectedCategoriaProducto: categoriasProductos[] = [];
  selectedSubCategoriaProducto: SubcategoriasProductos[] = [];

  selectedEstado: EstadosConsolas[] = [];

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

    // --- INICIO DE CAMBIOS: AÑADIR VALIDADORES ---
    this.addValidatorsToForm();
    // --- FIN DE CAMBIOS ---

    this.cargarDatosParaSelects();
    this.establecerValoresIniciales();
    this.cargarDatosDinamicosDelArticulo();
  }

  // --- AÑADIDO: Nuevo método para establecer los validadores ---
  private addValidatorsToForm(): void {
    // Límites basados en sp_UpsertPreIngresoProducto
    
    // p_NumeroSerie: VARCHAR(100)
    this.form.get('NumeroSerie')?.setValidators([Validators.maxLength(100)]);
    
    // p_Color: VARCHAR(100)
    this.form.get('ColorConsola')?.setValidators([Validators.maxLength(100)]);
    
    // p_Comentario: TEXT (Usamos 10000 como en agregar-produtos)
    this.form.get('ComentarioConsola')?.setValidators([Validators.maxLength(10000)]);
    
    // p_PrecioBase: DECIMAL(10,2) (Hasta 99,999,999.99)
    this.form.get('PrecioBase')?.setValidators([
        Validators.required, 
        Validators.pattern(/^\d{1,8}(\.\d{1,2})?$/), // 8 dígitos + 2 decimales
        Validators.max(99999999.99) 
    ]);
    
    // p_CostoDistribuido: DECIMAL(10,2)
    this.form.get('CostoDistribuido')?.setValidators([
        Validators.pattern(/^\d{1,8}(\.\d{1,2})?$/),
        Validators.max(99999999.99)
    ]);
    
    // p_Accesorios: VARCHAR(500)
    this.form.get('Accesorios')?.setValidators([this.jsonLengthValidator(500)]);
    
    // p_TareasPendientes: VARCHAR(1000)
    this.form.get('TodoList')?.setValidators([this.jsonLengthValidator(1000)]);

    // Actualizamos el formulario para que los validadores tomen efecto
    this.form.updateValueAndValidity({ emitEvent: false });
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
    console.log(`%c--- COMPONENTE HIJO (Índice ${this.stepperIndex}) ---`, 'color: purple; font-weight: bold;');
    console.log('%c5. VALORES RECIBIDOS POR EL HIJO (ANTES DE SU LÓGICA):', 'color: purple;', {
      accesorios: this.form.get('Accesorios')?.value,
      todoList: this.form.get('TodoList')?.value
    });

    this.form.patchValue({
      Fabricante: this.articulo.FabricanteArticulo,
      Cate: this.articulo.CategoriaArticulo,
      SubCategoria: this.articulo.SubcategoriaArticulo,
      IdPedido: this.articulo.IdCodigoPedidoFK
    }, { emitEvent: false }); // No disparar valueChanges

    // --- INICIO DE LA CORRECCIÓN ---
    // Inicializa los "chips" de tareas y accesorios desde el formulario.
    // Si el valor ya es un array, significa que fue cargado desde un borrador.
    // Si no, es un formulario nuevo y podemos establecer valores por defecto.

    const initialTodos = this.form.get('TodoList')?.value;
    if (Array.isArray(initialTodos)) {
      // Valor cargado de un borrador (puede ser un array vacío).
      this.todolistKeywords.set(initialTodos);
    } else {
      // Formulario nuevo, establecer valor por defecto.
      const defaultTodos = ['Limpiar'];
      this.todolistKeywords.set(defaultTodos);
      this.form.get('TodoList')?.setValue(defaultTodos, { emitEvent: false });
    }

    const initialAccessories = this.form.get('Accesorios')?.value;
    // Si el valor es un array (de un borrador) lo usamos, si es null (nuevo) inicializamos con array vacío.
    this.keywords.set(initialAccessories || []);
    // --- FIN DE LA CORRECCIÓN ---

    this.cdr.detectChanges();
  }

 private cargarDatosDinamicosDelArticulo(): void {
    // Use the correct service: categorias (which is CategoriasConsolasService)
    this.categorias.find(this.articulo.IdModeloPK).subscribe(data => {
      if (data && data.length > 0) {
        const categoria = data[0]; // This is the CatalogConsolas object
        this.ImagePath = this.getimagePath(categoria.LinkImagen);

        // --- CORRECTION STARTS HERE ---

        // Now use TiposProductosService to get accessories for the PRODUCT TYPE
        // Use categoria.TipoProducto (the product type ID from CatalogConsolas)
        this.TiposProductosService.find(categoria.TipoProducto).subscribe({
          next: (productTypeData: any) => { // Expect an object like { ..., accesorios: [1, 5] }
            const accessoryIds: number[] = productTypeData.accesorios || []; // Get the array of IDs

            // Now you need the actual accessory objects (names) for the chips
            // Fetch all active accessories ONCE if you don't have them already
            // Or, if you already loaded them elsewhere, use that list.
            // For simplicity, let's fetch them here if needed:
            this.accesoriosService.getActivos().subscribe(allActiveAccessories => {
              const defaultAccessoryNames = accessoryIds
                .map(id => allActiveAccessories.find(acc => acc.IdTipoAccesorioPK === id)?.DescripcionAccesorio)
                .filter((name): name is string => !!name); // Filter out undefined/null names

              // Only set default accessories if the form hasn't been populated (e.g., from a draft)
              const accesoriosActuales = this.form.get('Accesorios')?.value;
              if (accesoriosActuales === null || accesoriosActuales === undefined) {
                  this.keywords.set(defaultAccessoryNames); // Update chip UI
                  this.form.get('Accesorios')?.setValue(defaultAccessoryNames, { emitEvent: false }); // Update form
              }
              this.cdr.markForCheck(); // Needed for OnPush
            });
          },
          error: (err) => console.error(`Error fetching product type details for ID ${categoria.TipoProducto}:`, err)
        });
         // --- CORRECTION ENDS HERE ---
      }
    });
  }

  // --- AÑADIDO: Validador genérico de `agregar-produtos.ts` ---
  /**
   * Validador personalizado para la longitud total de un array (chips).
   * Comprueba la longitud del array de strings una vez convertido a JSON,
   * que es como se enviará al backend.
   * @param max La longitud máxima permitida para el string JSON.
   */
  jsonLengthValidator(max: number) {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value as string[];
      if (!value || value.length === 0) {
        return null; // Válido si está vacío
      }
      
      const jsonString = JSON.stringify(value);
      
      return jsonString.length > max 
        ? { 'totalLengthExceeded': { requiredLength: max, actualLength: jsonString.length } } 
        : null;
    };
  }

  

  removeKeyword(keyword: string) {
    this.keywords.update(keywords => {
      const index = keywords.indexOf(keyword);
      if (index < 0) {
        return keywords;
      }

      keywords.splice(index, 1);
      // Actualizamos el valor en el formulario para que se guarde el cambio
      this.form.get('Accesorios')?.setValue([...keywords]);
      this.announcer.announce(`removed ${keyword}`);
      return [...keywords];
    });
  }
  
  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our keyword
    if (value) {
      this.keywords.update(keywords => [...keywords, value]);
      // Actualizamos el valor en el formulario para que se guarde el cambio
      this.form.get('Accesorios')?.setValue(this.keywords());
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  // Add this method inside your IngresarProductosPedidoComponent class

get precioFinalIngreso(): number {
  const precioBase = parseFloat(this.form?.value?.PrecioBase || '0');
  const costoDistribuido = parseFloat(this.form?.value?.CostoDistribuido || '0');
  return precioBase + costoDistribuido;
}

  getimagePath(l: string | null) {
    const baseUrl = environment.apiUrl;

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
      this.form.get('TodoList')?.setValue([...keywords]);
      this.announcer.announce(`removed ${keyword} from reactive form`);
      return [...keywords];
    });
  }
  addReactiveKeyword(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our keyword
    if (value) {
      this.todolistKeywords.update(keywords => [...keywords, value]);
      this.form.get('TodoList')?.setValue(this.todolistKeywords());
      this.announcer.announce(`added ${value} to reactive form`);
    }

    // Clear the input value
    event.chipInput!.clear();
  }
}
