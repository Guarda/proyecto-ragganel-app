import { ChangeDetectorRef, Component, EventEmitter, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoriasConsolas } from '../../interfaces/categorias';
import { CategoriasConsolasService } from '../../../services/categorias-consolas.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatInputModule, MatLabel } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { NgFor } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';

import { TipoProducto } from '../../interfaces/tipoproducto';
import { FabricanteProducto } from '../../interfaces/fabricantesproductos';
import { categoriasProductos } from '../../interfaces/categoriasproductos';
import { SubcategoriasProductos } from '../../interfaces/subcategoriasproductos';

import { TiposProductosService } from '../../../services/tipos-productos.service';
import { FabricanteService } from '../../../services/fabricante.service';
import { CategoriaProductoService } from '../../../services/categoria-producto.service';
import { SubcategoriaProductoService } from '../../../services/subcategoria-producto.service';
import { ImageUploadComponent } from '../../../utiles/images/image-upload/image-upload.component';
import { SharedService } from '../../../services/shared.service';
import { ValidationService } from '../../../services/validation.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
@Component({
    selector: 'app-editar-categorias',
    standalone: true,
    imports: [CommonModule, MatFormField, MatLabel, FormsModule, MatDialogModule, ReactiveFormsModule, MatInputModule, MatOptionModule, NgFor, MatSelectModule, MatButtonModule, MatIconModule, MatFormFieldModule, ImageUploadComponent, MatCardModule, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatProgressSpinnerModule],
    templateUrl: './editar-categorias.component.html',
    styleUrl: './editar-categorias.component.css'
})
export class EditarCategoriasComponent {

  Editado = new EventEmitter();

  categoriaForm!: FormGroup;

  categoria!: CategoriasConsolas;
  categoriasconsolas: CategoriasConsolas[] = [];

  selectedTipoProducto: TipoProducto[] = [];
  selectedFabricante: FabricanteProducto[] = [];
  selectedCategoriaProducto: categoriasProductos[] = [];
  selectedSubCategoriaProducto: SubcategoriasProductos[] = [];

  public IdModeloConsolaPK: any;
  public Fabricante: any;
  public Categoria: any;
  public Subcategoria: any;
  public CodigoModeloConsola: any;
  public LinkImagen: any;
  public ImagePath: any;
  public TipoProducto: any;

  /*VARIABLE YA NO SE USA */
  // public DescripcionConsola: any;

  constructor(public categoriaService: CategoriasConsolasService,
    public TiposProductosService: TiposProductosService,
    public fabricanteService: FabricanteService,
    public categoriaproductoService: CategoriaProductoService,
    public subcategoriaproductoService: SubcategoriaProductoService,
    private route: ActivatedRoute,
    private sharedService: SharedService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private fb: FormBuilder,
    private validationService: ValidationService,
    private dialogRef: MatDialogRef<EditarCategoriasComponent>,
    @Inject(MAT_DIALOG_DATA) public idCategory: any
  ) {
    // FIX 1: Inicializar el formulario en el constructor con una estructura vacía.
    this.categoriaForm = this.fb.group({
      IdModeloConsolaPK: [''],
      Fabricante: ['', Validators.required],
      Cate: ['', Validators.required],
      SubCategoria: ['', Validators.required],
      CodigoModeloConsola: ['', 
        [Validators.required], // Validadores síncronos
        // Le pasamos una función que devuelve el código original.
        [this.validationService.codeExistsValidator(() => this.CodigoModeloConsola)] 
      ],
      LinkImagen: ['', Validators.required],
      TipoProducto: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    
    this.sharedService.dataNombreArchivo$.subscribe(nombreArchivo => {
      if (nombreArchivo && nombreArchivo !== '') {
        this.categoriaForm.get('LinkImagen')?.setValue(nombreArchivo);
      }
    });

    this.categoriaService.find(this.idCategory.value).subscribe((data) => {

      console.log(data);
      this.categoria = data[0];
      this.IdModeloConsolaPK = this.idCategory.value;
      this.Fabricante = this.categoria.Fabricante;
      this.Categoria = this.categoria.Categoria;
      this.Subcategoria = this.categoria.Subcategoria;
      this.CodigoModeloConsola = this.categoria.CodigoModeloConsola;
      this.LinkImagen = this.categoria.LinkImagen;
      this.ImagePath = this.getimagePath(this.categoria.LinkImagen);
      this.TipoProducto = this.categoria.TipoProducto;

      this.TiposProductosService.getAll().subscribe((data: TipoProducto[]) => {
        //console.log(data);
        this.selectedTipoProducto = data;
      })

      this.fabricanteService.getAll().subscribe((data: FabricanteProducto[]) => {
        this.selectedFabricante = data;
      })      

      this.categoriaproductoService.find(String(this.Fabricante)).subscribe((data: categoriasProductos[]) => {
        this.selectedCategoriaProducto = data;
      })
      
      this.subcategoriaproductoService.find(String(this.Categoria)).subscribe((data: SubcategoriasProductos[]) => {
        this.selectedSubCategoriaProducto = data;
      })       

      // FIX 2: Usar patchValue para llenar el formulario ya creado.
      this.categoriaForm.patchValue({
        IdModeloConsolaPK: this.IdModeloConsolaPK,
        Fabricante: this.Fabricante,
        Cate: this.Categoria,
        SubCategoria: this.Subcategoria,
        CodigoModeloConsola: this.CodigoModeloConsola,
        LinkImagen: this.LinkImagen,
        TipoProducto: this.TipoProducto
      });

      /*PARA REVISAR SI HAY CAMBIOS EN EL FORM, PARA MANDAR A LLAMAR NUEVAMENTE LA LISTA DE LAS CATEGORIAS ACORDE AL FABRICANTE*/
      this.categoriaForm.get('Fabricante')?.valueChanges.subscribe(selectedId => {
        // console.log("cambio");
        this.categoriaproductoService.find(selectedId).subscribe((data: categoriasProductos[]) => {
          this.selectedCategoriaProducto = data;
        })
        
        this.categoriaForm.get('SubCategoria')?.reset();
      });      

      this.categoriaForm.get('Cate')?.valueChanges.subscribe(selectedId => {
        this.subcategoriaproductoService.find(selectedId).subscribe((data: SubcategoriasProductos[]) => {
          console.log(data);
          this.selectedSubCategoriaProducto = data;
        })
      });
      
    });

  }

  // Helper para acceder fácilmente al formulario en la plantilla
  get form() {
    return this.categoriaForm.controls;
  }

  getimagePath(l: string | null) {
    const baseUrl = 'http://localhost:3000'; // Updated to match the Express server port
  
    if (l == null || l === '') {
      return `${baseUrl}/img-consolas/nestoploader.jpg`;
    } else {
      return `${baseUrl}/img-consolas/${l}`;
    }
  }

  onSubmit() {    // TODO: Use EventEmitter with form value 
    //console.log(this.productoForm.value); 
    this.categoriaForm.value.CodigoConsola = this.idCategory.value;
    console.log(this.categoriaForm.value);
    this.categoriaService.update(this.categoriaForm.value).subscribe((res: any) => {
      this.dialogRef.close(true);
    })

  }

}
