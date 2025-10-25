import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogActions, MatDialogContent, MatDialogClose, MatDialogTitle } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgFor } from '@angular/common';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatCardModule } from '@angular/material/card';

import { CategoriasConsolas } from '../../interfaces/categorias';
import { CategoriasConsolasService } from '../../../services/categorias-consolas.service';
import { EstadosConsolas } from '../../interfaces/estados';
import { EstadoConsolasService } from '../../../services/estado-consolas.service';
import { ProductosService } from '../productos.service';
import { TipoProducto } from '../../interfaces/tipoproducto';
import { FabricanteProducto } from '../../interfaces/fabricantesproductos';
import { categoriasProductos } from '../../interfaces/categoriasproductos';
import { SubcategoriasProductos } from '../../interfaces/subcategoriasproductos';

import { TiposProductosService } from '../../../services/tipos-productos.service';
import { FabricanteService } from '../../../services/fabricante.service';
import { CategoriaProductoService } from '../../../services/categoria-producto.service';
import { SubcategoriaProductoService } from '../../../services/subcategoria-producto.service';
import { TiposAccesoriosService } from '../../../services/tipos-accesorios.service';
// ✅ MANTENIDO: Importación del tipo específico para la lógica segura
import { TipoAccesorio } from '../../../services/tipos-accesorios.service';
// ✅ AÑADIDO: Importación del servicio de autenticación
import { AuthService } from '../../../UI/session/auth.service';

@Component({
  selector: 'app-agregar-produtos',
  standalone: true,
  imports: [NgFor, ReactiveFormsModule, MatSelectModule, MatDialogModule, MatButtonModule, MatIcon, MatFormField, MatLabel,
    FormsModule, MatInputModule, MatFormFieldModule, MatChipsModule, MatCardModule, MatDialogActions,
    MatDialogContent, MatDialogClose, MatDialogTitle],
  templateUrl: './agregar-produtos.component.html',
  styleUrl: './agregar-produtos.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AgregarProdutosComponent {

  keywords = signal(['']);
  todolistKeywords = signal(['Limpiar']);
  announcer = inject(LiveAnnouncer);

  Agregado = new EventEmitter();

  productoForm!: FormGroup;

  categoriasconsolas: CategoriasConsolas[] = [];
  categoria!: CategoriasConsolas;
  categoria2!: CategoriasConsolas;

  selectedCategoria: any[] = [];

  selectedTipoProducto: TipoProducto[] = [];
  selectedFabricante: FabricanteProducto[] = [];
  selectedCategoriaProducto: categoriasProductos[] = [];
  selectedSubCategoriaProducto: SubcategoriasProductos[] = [];

  selectedEstado: EstadosConsolas[] = [];

  IdModeloPK: any;
  IdTipoProd: any;
  Fabricante: any;
  Categoria: any;
  Subcategoria: any;

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
    // ✅ AÑADIDO: Inyección del servicio de autenticación
    private authService: AuthService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef, private router: Router) {
  }

  ngOnInit(): void {
    this.categorias.getAll().subscribe((data: CategoriasConsolas[]) => {
      this.keywords.update(() => []);
      this.selectedCategoria = data;
      this.categoria = data[0];
      this.ImagePath = this.getimagePath(this.categoria.LinkImagen);
    })

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

    this.estados.getAll().subscribe((data: EstadosConsolas[]) => {
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

    this.productoForm.get('Fabricante')?.valueChanges.subscribe(selectedId => {
      this.categoriaproductoService.findWithModel(selectedId).subscribe((data: categoriasProductos[]) => {
        this.selectedCategoriaProducto = data;
      })
      this.productoForm.get('SubCategoria')?.reset();
    });


    this.productoForm.get('Cate')?.valueChanges.subscribe(selectedId => {
      this.subcategoriaproductoService.findWithModel(selectedId).subscribe((data: SubcategoriasProductos[]) => {
        this.selectedSubCategoriaProducto = data;
      })

    });

    this.productoForm.get('SubCategoria')?.valueChanges.subscribe(selectedId => {
      if (this.productoForm.value.Fabricante != undefined && this.productoForm.value.Cate != undefined && this.productoForm.get('SubCategoria')?.value != undefined) {

        this.categorias.getbymanufacturer(this.productoForm.value.Fabricante, this.productoForm.value.Cate, this.productoForm.get('SubCategoria')?.value).subscribe((data) => {

          this.IdModeloPK = data[0].IdModeloConsolaPK;
          this.IdTipoProd = data[0].TipoProducto;

          this.categorias.find(this.IdModeloPK).subscribe((catData) => {
            this.categoria = catData[0];
            this.ImagePath = this.getimagePath(this.categoria.LinkImagen);
            
            // Esto evita que el 'valueChanges' de IdModeloConsolaPK se dispare
            this.productoForm.get('IdModeloConsolaPK')?.setValue(this.IdModeloPK, { emitEvent: false });

            this.accesoriosService.findbyIdProductType(this.IdTipoProd).subscribe((resp: TipoAccesorio | TipoAccesorio[]) => {
              console.log(resp);
              const accessoryData = Array.isArray(resp) ? resp : [resp];

              const newKeywords: string[] = [];
              for (const val of accessoryData) {
                if (val && (val as any).DescripcionAccesorio) {
                  newKeywords.push((val as any).DescripcionAccesorio.trim());
                }
              }
              this.keywords.update(() => newKeywords);
              this.productoForm.get('Accesorios')?.setValue(newKeywords);
              this.productoForm.get('Accesorios')?.markAsDirty();
              this.cdr.detectChanges(); 
            });
          });
        });
      }
    });

    // Watch for changes to the selected category
    this.productoForm.get('IdModeloConsolaPK')?.valueChanges.subscribe(selectedId => {
      this.categorias.find(selectedId).subscribe((data) => {
        this.categoria2 = data[0];
        this.ImagePath = this.getimagePath(this.categoria2.LinkImagen);
        this.cdr.detectChanges();
      });
    });
  }

  // ... (Las funciones removeKeyword, add, addt, ngAfterViewInit, f, y getimagePath son idénticas y se mantienen) ...

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
  }

  ngAfterViewInit() {
    this.productoForm.get('SubCategoria')?.valueChanges.subscribe(selectedId => {
      console.log(selectedId);
    });
  }


  get f() {
    return this.productoForm.controls;
  }

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

  nkeywords(): string[] {
    return this.todolistKeywords();
  }

  get form() {
    return this.productoForm.controls;
  }

  // ✅ FUSIÓN: Lógica de onSubmit de la nueva versión + navegación de la versión original
  onSubmit() {
    if (this.productoForm.invalid) {
      return;
    }

    // Obtener el objeto de usuario actual
    const usuarioActual = this.authService.getUserValue();

    // Verificación de seguridad
    if (!usuarioActual) {
      console.error("Error: No se pudo obtener el usuario actual. El usuario podría no haber iniciado sesión.");
      return;
    }

    // Combinar datos del formulario con el ID del usuario
    const productoData = {
      ...this.productoForm.value,
      IdUsuario: usuarioActual.id // Aquí se añade la trazabilidad
    };

    // Llamar al servicio con los datos completos
    this.productoService.create(productoData).subscribe((res: any) => {
      this.Agregado.emit();
      // ✅ AÑADIDO: Navegación que faltaba en la nueva versión
      this.router.navigateByUrl('home/listado-productos');
    });
  }
}