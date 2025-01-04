import { CommonModule, NgFor } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatOption, MatOptionModule } from '@angular/material/core';
import { MatDialogActions, MatDialogClose, MatDialogContent } from '@angular/material/dialog';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogRef } from '@angular/material/dialog';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { TipoArticulo } from '../../../interfaces/tipoarticulos';
import { TipoArticuloService } from '../../../../services/tipo-articulo.service';

import { FabricanteService } from '../../../../services/fabricante.service';
import { FabricanteProducto } from '../../../interfaces/fabricantesproductos';

import { FabricanteAccesorioService } from '../../../../services/fabricante-accesorio.service';
import { FabricanteAccesorio } from '../../../interfaces/fabricantesaccesorios';

//AGREGAR LOS FABRICANTES DE LOS INSUMOS

import { CategoriaProductoService } from '../../../../services/categoria-producto.service';
import { categoriasProductos } from '../../../interfaces/categoriasproductos';

import { CategoriaAccesorioService } from '../../../../services/categoria-accesorio.service';
import { categoriasAccesorios } from '../../../interfaces/categoriasaccesorios';

//AGREGAR LAS CATEGORIAS DE LOS INSUMOS

import { SubcategoriaProductoService } from '../../../../services/subcategoria-producto.service';
import { SubcategoriasProductos } from '../../../interfaces/subcategoriasproductos';

import { SubcategoriaAccesorioService } from '../../../../services/subcategoria-accesorio.service';
import { SubcategoriasAccesorios } from '../../../interfaces/subcategoriasaccesorios';

//AGREGAR LAS SUBCATEGORIAS DE LOS INSUMOS

import { CategoriasConsolasService } from '../../../../services/categorias-consolas.service';
import { CategoriasConsolas } from '../../../interfaces/categorias';

import { CategoriasAccesoriosService } from '../../../../services/categorias-accesorios.service';
import { CategoriasAccesoriosBase } from '../../../interfaces/categoriasaccesoriosbase';



@Component({
  selector: 'app-agregar-articulo',
  standalone: true,
  imports: [MatDialogActions, MatDialogClose, FormsModule, ReactiveFormsModule, MatDialogContent, MatFormField, MatLabel, MatOption, MatOptionModule,
    MatSelectModule, CommonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './agregar-articulo.component.html',
  styleUrl: './agregar-articulo.component.css'
})
export class AgregarArticuloComponent {

  Agregado = new EventEmitter();

  articulosForm!: FormGroup;

  public ImagePath: any;
  public idModelo: any;

  selectedTipoArticulo: TipoArticulo[] = [];
  selectedFabricante: any;
  selectedCategoria: any;
  selectedSubCategoria: any;
  // dialogRef: any;

  constructor(
    private tipoarticulo: TipoArticuloService,
    public categoriasProductos: CategoriasConsolasService,
    public categoriasAccesorios: CategoriasAccesoriosService,
    public fabricanteService: FabricanteService,
    public fabricanteaccesorioService: FabricanteAccesorioService,
    public categoriaproductoService: CategoriaProductoService,
    public categoriaaccesorioService: CategoriaAccesorioService,
    public subcategoriaproductoService: SubcategoriaProductoService,
    public subcategoriaaccesorioService: SubcategoriaAccesorioService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef, private router: Router,
    private dialogRef: MatDialogRef<AgregarArticuloComponent>) {

  }

  ngOnInit(): void {

    this.ImagePath = this.getImagePath('', 1);
    this.articulosForm = this.fb.group({
      TipoArticulo: new FormControl('', Validators.required),
      Fabricante: new FormControl('', Validators.required),
      Cate: new FormControl('', Validators.required),
      SubCategoria: new FormControl('', Validators.required),
      EnlaceCompra: new FormControl(''),
      Cantidad: new FormControl('', Validators.required),
      Precio: new FormControl('', Validators.required),
      IdModeloPK: new FormControl('', Validators.required)
    });

    this.tipoarticulo.getAll().subscribe((data: TipoArticulo[]) => {
      //console.log(data);
      this.selectedTipoArticulo = data;
    });

    /* PARA REVISAR SI HAY CAMBIOS EN EL FORM, PARA MANDAR A LLAMAR NUEVAMENTE LA LISTA DE LAS CATEGORIAS ACORDE AL FABRICANTE */
    this.articulosForm.get('TipoArticulo')?.valueChanges.subscribe(selectedId => {
      switch (selectedId) {
        case 1: // Producto
          // console.log("Producto selected");
          this.updateCategoriesForProducto();
          break;
        case 2: // Accesorio
          // console.log("Accesorio selected");
          this.updateCategoriesForAccesorio();
          break;
        case 3: // Insumo
          // console.log("Insumo selected");
          this.updateCategoriesForInsumo();
          break;
        default:
          console.error("Unknown TipoArticulo selected");
      }

      // Resetear el campo de fabricante
      this.articulosForm.get('Fabricante')?.reset();
      this.articulosForm.get('SubCategoria')?.reset();
    });

    this.articulosForm.get('Fabricante')?.valueChanges.subscribe(fabricanteId => {
      const tipoArticulo = this.articulosForm.get('TipoArticulo')?.value;

      if (!fabricanteId || !tipoArticulo) {
        this.selectedCategoria = [];
        return;
      }

      switch (tipoArticulo) {
        case 1: // Producto
          this.fetchCategoriasForProducto(fabricanteId);
          break;
        case 2: // Accesorio
          this.fetchCategoriasForAccesorio(fabricanteId);
          break;
        case 3: // Insumo
          this.fetchCategoriasForInsumo(fabricanteId);
          break;
        default:
          console.error('Tipo de artículo desconocido');
          this.selectedCategoria = [];
      }
      this.articulosForm.get('Cate')?.reset();
    });

    this.articulosForm.get('Cate')?.valueChanges.subscribe(categoriaId => {
      const tipoArticulo = this.articulosForm.get('TipoArticulo')?.value;

      if (!categoriaId || !tipoArticulo) {
        this.selectedSubCategoria = [];
        return;
      }

      switch (tipoArticulo) {
        case 1: // Producto
          this.fetchSubCategoriasForProducto(categoriaId);
          break;
        case 2: // Accesorio
          this.fetchSubCategoriasForAccesorio(categoriaId);
          break;
        case 3: // Insumo
          this.fetchSubCategoriasForInsumo(categoriaId);
          break;
        default:
          console.error('Tipo de artículo desconocido');
          this.selectedSubCategoria = [];
      }
      this.articulosForm.get('SubCategoria')?.reset();
    });


    this.articulosForm.get('SubCategoria')?.valueChanges.subscribe(selectedSubCategoriaId => {
      const fabricanteId = this.articulosForm.get('Fabricante')?.value;
      const categoriaId = this.articulosForm.get('Cate')?.value;
      const tipoArticulo = this.articulosForm.get('TipoArticulo')?.value;

      if (fabricanteId && categoriaId && selectedSubCategoriaId && tipoArticulo) {
        // Llama al servicio adecuado según el tipo de artículo
        let categoriasService;

        switch (tipoArticulo) {
          case 1: // Producto
            categoriasService = this.categoriasProductos;
            break;
          case 2: // Accesorio
            categoriasService = this.categoriasAccesorios;
            break;
          case 3: // Insumo
            // categoriasService = this.insumoCategoriasService;
            break;
          default:
            console.error("Tipo de artículo desconocido");
            return;
        }

        // Llama al servicio con los tres valores
        categoriasService?.getbymanufacturer(fabricanteId, categoriaId, selectedSubCategoriaId)
          .subscribe((data: any[]) => {
            // console.log(fabricanteId, categoriaId, selectedSubCategoriaId);

            switch (tipoArticulo) {
              case 1: // Producto
                if (data.length > 0) {
                  const modelo = data[0]; // Asumimos que el backend devuelve el modelo correcto
                  this.idModelo = modelo.IdModeloConsolaPK; // ID del modelo
                  // console.log(this.idModelo)
                  this.categoriasProductos.find(this.idModelo).subscribe((data) => {
                    // console.log(data)
                    this.ImagePath = this.getImagePath(data[0].LinkImagen, tipoArticulo);
                    this.cdr.detectChanges();
                  });

                  // Opcional: Actualiza un control del formulario
                   this.articulosForm.get('IdModeloPK')?.setValue(this.idModelo);
                } else {
                  // Si no hay datos, muestra una imagen por defecto
                  this.ImagePath = this.getImagePath(null, tipoArticulo);
                }
                break;
              case 2: // Accesorio
                if (data.length > 0) {
                  const modelo = data[0]; // Asumimos que el backend devuelve el modelo correcto
                  this.idModelo = modelo.IdModeloAccesorioPK; // ID del modelo
                  // console.log(this.idModelo)
                  this.categoriasAccesorios.find(this.idModelo).subscribe((data) => {
                    // console.log(data)
                    this.ImagePath = this.getImagePath(data[0].LinkImagen, tipoArticulo);
                    this.cdr.detectChanges();
                  });

                  // Opcional: Actualiza un control del formulario
                  this.articulosForm.get('IdModeloPK')?.setValue(this.idModelo);
                } else {
                  // Si no hay datos, muestra una imagen por defecto
                  this.ImagePath = this.getImagePath(null, tipoArticulo);
                }
                break;
              case 3: // Insumo
                // categoriasService = this.insumoCategoriasService;
                break;
              default:
                console.error("Tipo de artículo desconocido");
                return;
            }
          });
      } else {
        // Si faltan datos, muestra una imagen por defecto
        this.ImagePath = this.getImagePath(null, tipoArticulo);
      }
    });

  }


  enforceTwoDecimals(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;
  
    // Remove leading zeros and limit to 2 decimal places
    const sanitizedValue = value.replace(/^0+(?!\.)/, '').match(/^\d*(\.\d{0,2})?/);
    input.value = sanitizedValue ? sanitizedValue[0] : '';
  }
  //metodos para fabricantes
  updateCategoriesForProducto() {
    this.fabricanteService.getManufacturerWithModel().subscribe((data: FabricanteProducto[]) => {
      // Transformar los datos para usar claves consistentes
      this.selectedFabricante = data.map(item => ({
        id: item.IdFabricantePK,
        nombre: item.NombreFabricante
      }));
    });
  }

  updateCategoriesForAccesorio() {
    this.fabricanteaccesorioService.getManufacturerWithModel().subscribe((data: FabricanteAccesorio[]) => {
      // Transformar los datos para usar claves consistentes
      this.selectedFabricante = data.map(item => ({
        id: item.IdFabricanteAccesorioPK,
        nombre: item.NombreFabricanteAccesorio
      }));
      // console.log(this.selectedFabricante);
    });
  }


  updateCategoriesForInsumo() {
    // Logic for updating categories based on Insumo
  }

  //metodos para categorias
  fetchCategoriasForProducto(fabricanteId: number) {
    this.categoriaproductoService.findWithModel(fabricanteId.toString()).subscribe((data: categoriasProductos[]) => {
      this.selectedCategoria = data.map(item => ({
        id: item.IdCategoriaPK,
        nombre: item.NombreCategoria
      }));
    });
  }

  fetchCategoriasForAccesorio(fabricanteId: number) {
    this.categoriaaccesorioService.findWithModel(fabricanteId.toString()).subscribe((data: categoriasAccesorios[]) => {
      this.selectedCategoria = data.map(item => ({
        id: item.IdCategoriaAccesorioPK,
        nombre: item.NombreCategoriaAccesorio
      }));
    });
  }

  fetchCategoriasForInsumo(fabricanteId: number) {
    // this.categoriaInsumoService.getByFabricante(fabricanteId).subscribe((data: CategoriaInsumo[]) => {
    //   this.selectedCategoria = data.map(item => ({
    //     id: item.IdCategoriaInsumosPK,
    //     nombre: item.NombreCategoriaInsumos
    //   }));
    // });
  }

  //metodos para las subcategorias

  // Métodos para obtener las subcategorías
  fetchSubCategoriasForProducto(categoriaId: number) {
    this.subcategoriaproductoService.findWithModel(categoriaId.toString()).subscribe((data: SubcategoriasProductos[]) => {
      this.selectedSubCategoria = data.map(item => ({
        id: item.IdSubcategoria,
        nombre: item.NombreSubCategoria
      }));
    });
  }

  fetchSubCategoriasForAccesorio(categoriaId: number) {
    this.subcategoriaaccesorioService.findWithModel(categoriaId.toString()).subscribe((data: SubcategoriasAccesorios[]) => {
      this.selectedSubCategoria = data.map(item => ({
        id: item.IdSubcategoriaAccesorio,
        nombre: item.NombreSubcategoriaAccesorio
      }));
    });
  }

  fetchSubCategoriasForInsumo(categoriaId: number) {
    // this.subcategoriaInsumoService.getByCategoria(categoriaId).subscribe((data: SubCategoriaInsumo[]) => {
    //   this.selectedSubCategoria = data.map(item => ({
    //     id: item.IdSubcategoriaInsumosPK,
    //     nombre: item.NombreSubCategoriaInsumos
    //   }));
    // });
  }

  // Función para construir la ruta de la imagen
  getImagePath(link: string | null, tipoArticulo: number | null) {
    // console.log(link)
    // console.log(tipoArticulo)
    const baseUrl = 'http://localhost:3000';
    let folder = '';

    switch (tipoArticulo) {
      case 1: // Producto
        folder = 'img-consolas';
        break;
      case 2: // Accesorio
        folder = 'img-accesorios';
        break;
      case 3: // Insumo
        folder = 'img-insumos';
        break;
      default:
        folder = 'img-consolas'; // Carpeta por defecto
    }

    return link ? `${baseUrl}/${folder}/${link}` : `${baseUrl}/${folder}/2ds.jpg`;
  }

  onSubmit() {    // TODO: Use EventEmitter with form value 
    if (this.articulosForm.valid) {
      // console.log(this.articulosForm.value);
      this.Agregado.emit(this.articulosForm.value); // Emitir datos
      this.dialogRef.close(this.articulosForm.value); // Cerrar el diálogo con los datos
    } else {
      console.log('Formulario no válido');
    }
  }

}
