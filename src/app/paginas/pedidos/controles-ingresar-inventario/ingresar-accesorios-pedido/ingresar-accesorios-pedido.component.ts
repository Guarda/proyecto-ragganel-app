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

  @Input() form!: FormGroup; // 👈 Asegurar que el componente recibe 'form'
  @Input() articulo!: any; // Recibe el artículo desde el padre

  @Output() accesorioAgregado = new EventEmitter<any>();

  keywords = signal(['']);
  todolistKeywords = signal(['Limpiar']);
  announcer = inject(LiveAnnouncer);

  Agregado = new EventEmitter();

  accesorioForm!: FormGroup;

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

    if (!this.articulo) {
      console.warn('⚠️ No se recibió un artículo válido.');
      return;
    }

    console.log("Formulario recibido:", this.form);
    console.log("imagen", this.articulo.ImagePath);
    console.log("articulo recibido", this.articulo);


    // Asegurarse de que `form` no sea undefined antes de asignar el listener
    if (this.form) {
      this.form.valueChanges.subscribe(() => {
        if (this.form.valid) {
          this.accesorioAgregado.emit(this.form.value);
        }
      });
    } else {
      console.warn("El formulario no fue recibido correctamente");
    }

    this.accessorieCode = this.articulo.IdModeloPK;
    this.accessoriePrice = this.articulo.PrecioBase;
    this.accessorieManufacturer = this.articulo.FabricanteArticulo;
    this.accessorieCate = this.articulo.CategoriaArticulo;
    this.accessorieSubCate = this.articulo.SubcategoriaArticulo;
    this.orderID = this.articulo.IdCodigoPedidoFK;

    this.categorias.find(this.accessorieCode).subscribe((data) => {
      this.categoria = data[0];
    
      console.log("📌 Imagen obtenida de la BD:", this.categoria.LinkImagen); // <-- Verificar valor
    
      this.ImagePath = this.getimagePath(this.categoria.LinkImagen);
    
      console.log("🌟 Imagen generada por getimagePath:", this.ImagePath); // <-- Verificar resultado
    
      this.accessorieManufacturer = this.categoria.FabricanteAccesorio;
    
      this.cdr.markForCheck();
    });
    
    
    


    this.categorias.getAll().subscribe((data: CategoriasAccesoriosBase[]) => {
      this.keywords.update(() => []);
      this.selectedCategoria = data;
      this.categoria = data[0];
     // this.ImagePath = this.getimagePath(this.categoria.LinkImagen);
    })

    this.accesorioForm = this.form;

    if (this.articulo) {
      this.accesorioForm.patchValue({
        FabricanteAccesorio: this.articulo.FabricanteArticulo,
        IdModeloAccesorioPK: this.articulo.IdModeloPK,
        PrecioBase: this.formatNumber(this.articulo.Precio),
        CateAccesorio: this.articulo.CategoriaArticulo,
        SubCategoriaAccesorio: this.articulo.SubcategoriaArticulo,
        NumeroSerie: this.articulo.NumeroSerie || '',
        ColorAccesorio: this.articulo.ColorAccesorio || '',
        EstadoAccesorio: this.articulo.EstadoAccesorio || '',
        ProductosCompatibles: this.articulo.ProductosCompatibles || '',
        ComentarioAccesorio: this.articulo.Comentario || '',
        TodoList: this.articulo.TodoList || '',
        IdPedido: this.articulo.IdCodigoPedidoFK
      });      

      this.cdr.detectChanges();
      console.log("✅ Valores después de patchValue:", this.accesorioForm.value);
    }

    this.cdr.detectChanges(); // Detectar cambios después de patchValue

    this.estados.getAll().subscribe((data: EstadosConsolas[]) => {
      // //console.log(data);
      this.selectedEstado = data;
    });

    this.fabricanteService.getManufacturerWithModel().subscribe((data: FabricanteAccesorio[]) => {
      this.selectedFabricanteAccesorio = data;
    });

    this.categoriaaccesorioService.getAll().subscribe((data: CategoriasAccesoriosBase[]) => {
      this.selectedCategoriaAccesorio = data;
    });

    this.subcategoriaaccesrorioService.getAll().subscribe((data: SubcategoriasAccesorios[]) => {
      this.selectedSubCategoriaAccesorio = data;
    });

    

    this.accesorioForm.get('TodoList')?.setValue(this.nkeywords());

    // this.accesorioForm = this.form;

    this.accesorioForm.valueChanges.subscribe(() => {
      this.cdr.detectChanges(); // 🔥 Forzar detección de cambios en Angular
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


  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our keyword
    if (value) {
      this.keywords.update(keywords => [...keywords, value]);
      this.accesorioForm.get('ProductosCompatibles')?.setValue(this.keywords()); // Update the form control
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

      this.accesorioForm.get('ProductosCompatibles')?.setValue(this.keywords());
      this.accesorioForm.get('ProductosCompatibles')?.markAsDirty();
      // Force change detection
      this.cdr.detectChanges();
    }

    // Clear the input value
    //

  }

  // Helper method to return the current keywords array
  nkeywords(): string[] {
    return this.todolistKeywords();
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
      this.accesorioForm.get('TodoList')?.setValue(this.keywords());
      this.announcer.announce(`added ${value} to reactive form`);
    }

    // Clear the input value
    event.chipInput!.clear();
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
    this.accesorioForm.get('SubCategoriaAccesorio')?.valueChanges.subscribe(selectedId => {
      console.log(selectedId);
    });
  }

  get f() {

    return this.accesorioForm.controls;

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

