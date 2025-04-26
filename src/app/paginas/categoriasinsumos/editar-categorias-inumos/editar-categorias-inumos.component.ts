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

import { FabricanteInsumos } from '../../interfaces/fabricantesinsumos';
import { categoriasInsumos } from '../../interfaces/categoriasinsumos';
import { SubcategoriasInsumos } from '../../interfaces/subcategoriasinsumos';

import { FabricanteInsumoService } from '../../../services/fabricante-insumo.service';
import { CategoriaInsumoService } from '../../../services/categoria-insumo.service';
import { SubcategoriaInsumoService } from '../../../services/subcategoria-insumo.service';
import { CategoriasInsumosBase } from '../../interfaces/categoriasinsumosbase';
import { CategoriasInsumosService } from '../../../services/categorias-insumos.service';

@Component({
  selector: 'app-editar-categorias-inumos',
  standalone: true,
  imports: [MatFormField, MatLabel, FormsModule, MatDialogModule, ReactiveFormsModule, MatInputModule, MatOptionModule,
    NgFor, MatSelectModule, MatButtonModule, MatIcon, MatFormFieldModule],
  templateUrl: './editar-categorias-inumos.component.html',
  styleUrl: './editar-categorias-inumos.component.css'
})
export class EditarCategoriasInumosComponent {
  Editado = new EventEmitter();

  categoriaForm!: FormGroup;

  categoria!: CategoriasInsumosBase;
  categoriasinsumos: CategoriasInsumosBase[] = [];

  selectedFabricante: FabricanteInsumos[] = [];
  selectedCategoriaInsumo: categoriasInsumos[] = [];
  selectedSubCategoriaInsumo: SubcategoriasInsumos[] = [];

  public IdModeloInsumoPK: any;
  public FabricanteInsumo: any;
  public CategoriaInsumo: any;
  public SubcategoriaInsumo: any;
  public CodigoModeloInsumo: any;
  public LinkImagen: any;
  public ImagePath: any;

  /*VARIABLE YA NO SE USA */
  // public DescripcionConsola: any;

  constructor(public categoriaService: CategoriasInsumosService,
    public fabricanteinsumoService: FabricanteInsumoService,
    public categoriainsumoService: CategoriaInsumoService,
    public subcategoriainsumoService: SubcategoriaInsumoService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public idCategory: any
  ) { }

  ngOnInit(): void {
    console.log("codigo/categoria/insumo",this.idCategory.value);

    this.categoriaService.find(this.idCategory.value).subscribe((data) => {

      
      this.categoria = data[0];
      this.IdModeloInsumoPK = this.idCategory.value;
      this.FabricanteInsumo = this.categoria.FabricanteInsumos;
      this.CategoriaInsumo = this.categoria.CategoriaInsumos;
      this.SubcategoriaInsumo = this.categoria.SubcategoriaInsumos;
      this.CodigoModeloInsumo = this.categoria.CodigoModeloInsumos;
      this.LinkImagen = this.categoria.LinkImagen;
      this.ImagePath = this.getimagePath(this.categoria.LinkImagen);

      this.fabricanteinsumoService.getAll().subscribe((data: FabricanteInsumos[]) => {
        this.selectedFabricante = data;
      })

      this.categoriainsumoService.find(String(this.FabricanteInsumo)).subscribe((data: categoriasInsumos[]) => {
        this.selectedCategoriaInsumo = data;
      })

      this.subcategoriainsumoService.find(String(this.CategoriaInsumo)).subscribe((data: SubcategoriasInsumos[]) => {
        this.selectedSubCategoriaInsumo = data;
      })

      //Initialize the form with the product data
      this.categoriaForm = this.fb.group({
        IdModeloInsumoPK: [this.IdModeloInsumoPK],
        FabricanteInsumo: [this.FabricanteInsumo],
        CategoriaInsumo: [this.CategoriaInsumo],
        SubCategoriaInsumo: [this.SubcategoriaInsumo],
        CodigoModeloInsumo: [this.CodigoModeloInsumo],
        LinkImagen: [this.LinkImagen]
      });

      /*PARA REVISAR SI HAY CAMBIOS EN EL FORM, PARA MANDAR A LLAMAR NUEVAMENTE LA LISTA DE LAS CATEGORIAS ACORDE AL FABRICANTE*/
      this.categoriaForm.get('FabricanteInsumo')?.valueChanges.subscribe(selectedId => {
        // console.log("cambio");
        this.categoriainsumoService.find(selectedId).subscribe((data: categoriasInsumos[]) => {
          this.selectedCategoriaInsumo = data;
        })

        this.categoriaForm.get('SubcategoriaInsumo')?.reset();
      });

      this.categoriaForm.get('CategoriaInsumo')?.valueChanges.subscribe(selectedId => {
        this.subcategoriainsumoService.find(selectedId).subscribe((data: SubcategoriasInsumos[]) => {
          console.log(data);
          this.selectedSubCategoriaInsumo = data;
        })
      });

    });

    this.categoriaForm = new FormGroup({
      IdModeloInsumoPK: new FormControl(''),
      FabricanteInsumo: new FormControl('', Validators.required),
      CategoriaInsumo: new FormControl('', Validators.required),
      SubCategoriaInsumo: new FormControl('', Validators.required),
      CodigoModeloInsumo: new FormControl('', Validators.required),
      LinkImagen: new FormControl('', Validators.required)
    });
  }

  getimagePath(l: string | null) {
    const baseUrl = 'http://localhost:3000'; // Updated to match the Express server port

    if (l == null || l === '') {
      return `${baseUrl}/img-insumos/kingston-32gb-clase10.jpg`;
    } else {
      return `${baseUrl}/img-insumos/${l}`;
    }
  }


  onSubmit() {    // TODO: Use EventEmitter with form value 
    console.log(this.categoriaForm.value);
    // this.categoriaForm.value.CodigoConsola = this.idCategory.value;
    // console.log(this.categoriaForm.value);
    this.categoriaService.update(this.categoriaForm.value).subscribe((res: any) => {
      this.Editado.emit();
      this.router.navigateByUrl('home/listado-categorias-insumos');
    })

  }

}
