import { ChangeDetectorRef, Component, EventEmitter, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoriasConsolas } from '../../interfaces/categorias';
import { CategoriasConsolasService } from '../../../services/categorias-consolas.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormField, MatInputModule, MatLabel } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { NgFor } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';

import { TipoProducto } from '../../interfaces/tipoproducto';
import { FabricanteProducto } from '../../interfaces/fabricantesproductos';
import { categoriasProductos } from '../../interfaces/categoriasproductos';
import { SubcategoriasProductos } from '../../interfaces/subcategoriasproductos';

import { TiposProductosService } from '../../../services/tipos-productos.service';
import { FabricanteService } from '../../../services/fabricante.service';
import { CategoriaProductoService } from '../../../services/categoria-producto.service';
import { SubcategoriaProductoService } from '../../../services/subcategoria-producto.service';
@Component({
    selector: 'app-editar-categorias',
    imports: [MatFormField, MatLabel, FormsModule, MatDialogModule, ReactiveFormsModule, MatInputModule, MatOptionModule,
        NgFor, MatSelectModule, MatButtonModule, MatIcon, MatFormFieldModule],
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
    private cdr: ChangeDetectorRef,
    private router: Router,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public idCategory: any
  ) {
  }

  ngOnInit(): void {


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

      //Initialize the form with the product data
      this.categoriaForm = this.fb.group({
        IdModeloConsolaPK: [this.IdModeloConsolaPK],
        Fabricante: [this.Fabricante],
        Cate: [this.Categoria],
        SubCategoria: [this.Subcategoria],
        CodigoModeloConsola: [this.CodigoModeloConsola],
        LinkImagen: [this.LinkImagen],
        TipoProducto: [this.TipoProducto]
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

    this.categoriaForm = new FormGroup({
      IdModeloConsolaPK: new FormControl(''),
      Fabricante: new FormControl('', Validators.required),
      Cate: new FormControl('', Validators.required),
      SubCategoria: new FormControl('', Validators.required),
      CodigoModeloConsola: new FormControl('', Validators.required),
      LinkImagen: new FormControl('', Validators.required),
      TipoProducto: new FormControl('', Validators.required)
    });
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
      this.Editado.emit();
      this.router.navigateByUrl('listado-categorias');
    })

  }

}
