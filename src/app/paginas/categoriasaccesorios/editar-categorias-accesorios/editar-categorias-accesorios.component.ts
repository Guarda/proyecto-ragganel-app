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

import { FabricanteAccesorio } from '../../interfaces/fabricantesaccesorios';
import { categoriasAccesorios } from '../../interfaces/categoriasaccesorios';
import { SubcategoriasAccesorios } from '../../interfaces/subcategoriasaccesorios';

import { FabricanteAccesorioService } from '../../../services/fabricante-accesorio.service';
import { CategoriaAccesorioService } from '../../../services/categoria-accesorio.service';
import { SubcategoriaAccesorioService } from '../../../services/subcategoria-accesorio.service';
import { CategoriasAccesoriosBase } from '../../interfaces/categoriasaccesoriosbase';
import { CategoriasAccesoriosService } from '../../../services/categorias-accesorios.service';

@Component({
  selector: 'app-editar-categorias-accesorios',
  standalone: true,
  imports: [MatFormField, MatLabel, FormsModule, MatDialogModule, ReactiveFormsModule, MatInputModule, MatOptionModule,
    NgFor, MatSelectModule, MatButtonModule, MatIcon, MatFormFieldModule],
  templateUrl: './editar-categorias-accesorios.component.html',
  styleUrl: './editar-categorias-accesorios.component.css'
})
export class EditarCategoriasAccesoriosComponent {

  Editado = new EventEmitter();

  categoriaForm!: FormGroup;

  categoria!: CategoriasAccesoriosBase;
  categoriasaccesorios: CategoriasAccesoriosBase[] = [];

  selectedFabricante: FabricanteAccesorio[] = [];
  selectedCategoriaAccesorio: categoriasAccesorios[] = [];
  selectedSubCategoriaAccesorio: SubcategoriasAccesorios[] = [];

  public IdModeloAccesorioPK: any;
  public FabricanteAccesorio: any;
  public CategoriaAccesorio: any;
  public SubcategoriaAccesorio: any;
  public CodigoModeloAccesorio: any;
  public LinkImagen: any;
  public ImagePath: any;

  /*VARIABLE YA NO SE USA */
  // public DescripcionConsola: any;

  constructor(public categoriaService: CategoriasAccesoriosService,
    public fabricanteaccesorioService: FabricanteAccesorioService,
    public categoriaaccesorioService: CategoriaAccesorioService,
    public subcategoriaaccesorioService: SubcategoriaAccesorioService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public idCategory: any
  ){  }

  ngOnInit(): void {


    this.categoriaService.find(this.idCategory.value).subscribe((data) => {

      console.log(data);
      this.categoria = data[0];
      this.IdModeloAccesorioPK = this.idCategory.value;
      this.FabricanteAccesorio = this.categoria.FabricanteAccesorio;
      this.CategoriaAccesorio = this.categoria.CategoriaAccesorio;
      this.SubcategoriaAccesorio = this.categoria.SubcategoriaAccesorio;
      this.CodigoModeloAccesorio = this.categoria.CodigoModeloAccesorio;
      this.LinkImagen = this.categoria.LinkImagen;
      this.ImagePath = this.getimagePath(this.categoria.LinkImagen);

      this.fabricanteaccesorioService.getAll().subscribe((data: FabricanteAccesorio[]) => {
        this.selectedFabricante = data;
      })      

      this.categoriaaccesorioService.find(String(this.FabricanteAccesorio)).subscribe((data: categoriasAccesorios[]) => {
        this.selectedCategoriaAccesorio = data;
      })
      
      this.subcategoriaaccesorioService.find(String(this.CategoriaAccesorio)).subscribe((data: SubcategoriasAccesorios[]) => {
        this.selectedSubCategoriaAccesorio = data;
      })       

      //Initialize the form with the product data
      this.categoriaForm = this.fb.group({
        IdModeloAccesorioPK: [this.IdModeloAccesorioPK],
        FabricanteAccesorio: [this.FabricanteAccesorio],
        CateAccesorio: [this.CategoriaAccesorio],
        SubCategoriaAccesorio: [this.SubcategoriaAccesorio],
        CodigoModeloAccesorio: [this.CodigoModeloAccesorio],
        LinkImagen: [this.LinkImagen]
      });

      /*PARA REVISAR SI HAY CAMBIOS EN EL FORM, PARA MANDAR A LLAMAR NUEVAMENTE LA LISTA DE LAS CATEGORIAS ACORDE AL FABRICANTE*/
      this.categoriaForm.get('FabricanteAccesorio')?.valueChanges.subscribe(selectedId => {
        // console.log("cambio");
        this.categoriaaccesorioService.find(selectedId).subscribe((data: categoriasAccesorios[]) => {
          this.selectedCategoriaAccesorio = data;
        })
        
        this.categoriaForm.get('SubCategoriaAccesorio')?.reset();
      });      

      this.categoriaForm.get('CateAccesorio')?.valueChanges.subscribe(selectedId => {
        this.subcategoriaaccesorioService.find(selectedId).subscribe((data: SubcategoriasAccesorios[]) => {
          console.log(data);
          this.selectedSubCategoriaAccesorio = data;
        })
      });
      
    });

    this.categoriaForm = new FormGroup({
      IdModeloAccesorioPK: new FormControl(''),
      FabricanteAccesorio: new FormControl('', Validators.required),
      CateAccesorio: new FormControl('', Validators.required),
      SubCategoriaAccesorio: new FormControl('', Validators.required),
      CodigoModeloAccesorio: new FormControl('', Validators.required),
      LinkImagen: new FormControl('', Validators.required)
    });
  }

  getimagePath(l: string | null) {
    const baseUrl = 'http://localhost:3000'; // Updated to match the Express server port
  
    if (l == null || l === '') {
      return `${baseUrl}/img-accesorios/GameCube_controller-1731775589376.png`;
    } else {
      return `${baseUrl}/img-accesorios/${l}`;
    }
  }

  onSubmit() {    // TODO: Use EventEmitter with form value 
    console.log(this.categoriaForm.value); 
    // this.categoriaForm.value.CodigoConsola = this.idCategory.value;
    // console.log(this.categoriaForm.value);
    this.categoriaService.update(this.categoriaForm.value).subscribe((res: any) => {
      this.Editado.emit();
      this.router.navigateByUrl('listado-categorias-accesorios');
    })

  }

}
