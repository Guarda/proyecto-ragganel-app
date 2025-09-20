import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, inject, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { CategoriasConsolas } from '../../interfaces/categorias';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgFor } from '@angular/common';
import { TipoProducto } from '../../interfaces/tipoproducto';

import { CategoriasConsolasService } from '../../../services/categorias-consolas.service';
import { TiposProductosService } from '../../../services/tipos-productos.service';
import { FabricanteService } from '../../../services/fabricante.service';
import { MatOptionModule } from '@angular/material/core';

import { FabricanteProducto } from '../../interfaces/fabricantesproductos';
import { categoriasProductos } from '../../interfaces/categoriasproductos';
import { SubcategoriasProductos } from '../../interfaces/subcategoriasproductos';
import { CategoriaProductoService } from '../../../services/categoria-producto.service';
import { SubcategoriaProductoService } from '../../../services/subcategoria-producto.service';

import { ImageUploadComponent } from '../../../utiles/images/image-upload/image-upload.component';
import { SharedService } from '../../../services/shared.service';

@Component({
    selector: 'app-agregar-categorias',
    imports: [MatFormField, MatLabel, FormsModule, MatDialogModule, ReactiveFormsModule, MatInputModule, MatOptionModule,
        NgFor, MatSelectModule, MatButtonModule, MatIcon, MatFormFieldModule,
        ImageUploadComponent],
    templateUrl: './agregar-categorias.component.html',
    styleUrl: './agregar-categorias.component.css'
})
export class AgregarCategoriasComponent {

  Agregado = new EventEmitter();

  CategoriaForm!: FormGroup;
  categoriasconsolas: CategoriasConsolas[] = [];

  TextoFabricante!: string;
  recievedFileName!: string;

  selectedTipoProducto: TipoProducto[] = [];
  selectedFabricante: FabricanteProducto[] = [];
  selectedCategoriaProducto: categoriasProductos[] = [];
  selectedSubCategoriaProducto: SubcategoriasProductos[] = [];


  constructor(
    public categoriaService: CategoriasConsolasService,
    public TiposProductosService: TiposProductosService,
    public fabricanteService: FabricanteService,
    public categoriaproductoService: CategoriaProductoService,
    public subcategoriaproductoService: SubcategoriaProductoService,
    private cdr: ChangeDetectorRef,
    private sharedService: SharedService,
    private router: Router) {

    this.CategoriaForm = new FormGroup({
      Fabricante: new FormControl('', Validators.required),
      Cate: new FormControl('', Validators.required),
      SubCategoria: new FormControl('', Validators.required),
      CodigoModeloConsola: new FormControl('', Validators.required),
      LinkImagen: new FormControl('', Validators.required),
      TipoProducto: new FormControl('', Validators.required)
    });

    this.TiposProductosService.getAll().subscribe((data: TipoProducto[]) => {

      this.selectedTipoProducto = data;
    })

    this.fabricanteService.getAll().subscribe((data: FabricanteProducto[]) => {
      this.selectedFabricante = data;
    })

    /*PARA REVISAR SI HAY CAMBIOS EN EL FORM, PARA MANDAR A LLAMAR NUEVAMENTE LA LISTA DE LAS CATEGORIAS ACORDE AL FABRICANTE*/
    this.CategoriaForm.get('Fabricante')?.valueChanges.subscribe(selectedId => {
      this.categoriaproductoService.find(selectedId).subscribe((data: categoriasProductos[]) => {
        this.selectedCategoriaProducto = data;
      })
      this.CategoriaForm.get('SubCategoria')?.reset();
    });

    this.CategoriaForm.get('Cate')?.valueChanges.subscribe(selectedId => {
      this.subcategoriaproductoService.find(selectedId).subscribe((data: SubcategoriasProductos[]) => {
        console.log(data);
        this.selectedSubCategoriaProducto = data;
      })
    });
    // Subscribe to value changes to update the first letter
    //const inputValue = this.CategoriaForm.controls['Fabricante'].value;
    //this.CategoriaForm.controls['IdModeloConsolaPK'].setValue('N11');
  }

  ngOnInit(): void {
    // Subscribe once to updates for the uploaded image name
    this.sharedService.dataNombreArchivo$.subscribe(data => {
      this.recievedFileName = data;
      this.CategoriaForm.get('LinkImagen')?.setValue(this.recievedFileName);
    });

  }

  ngAfterView() {

  }

  onSubmit() { 
    console.log("enviado");
    // TODO: Use EventEmitter with form value
    // console.log(this.CategoriaForm.value); 
    // console.log("enviado");
    this.categoriaService.create(this.CategoriaForm.value).subscribe((res: any) => {
      this.Agregado.emit();
      this.router.navigateByUrl('listado-categorias');
    })

  }
}
