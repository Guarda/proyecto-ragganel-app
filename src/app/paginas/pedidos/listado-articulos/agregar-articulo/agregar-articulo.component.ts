import { CommonModule, NgFor } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatOption, MatOptionModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent } from '@angular/material/dialog';
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
import { FabricanteInsumoService } from '../../../../services/fabricante-insumo.service';


import { CategoriaProductoService } from '../../../../services/categoria-producto.service';
import { categoriasProductos } from '../../../interfaces/categoriasproductos';


import { CategoriaAccesorioService } from '../../../../services/categoria-accesorio.service';
import { categoriasAccesorios } from '../../../interfaces/categoriasaccesorios';

import { CategoriaInsumoService } from '../../../../services/categoria-insumo.service';
import { categoriasInsumos } from '../../../interfaces/categoriasinsumos';


import { SubcategoriaProductoService } from '../../../../services/subcategoria-producto.service';
import { SubcategoriasProductos } from '../../../interfaces/subcategoriasproductos';

import { SubcategoriaAccesorioService } from '../../../../services/subcategoria-accesorio.service';
import { SubcategoriasAccesorios } from '../../../interfaces/subcategoriasaccesorios';
import { SubcategoriaInsumoService } from '../../../../services/subcategoria-insumo.service';
//AGREGAR LAS SUBCATEGORIAS DE LOS INSUMOS

import { CategoriasConsolasService } from '../../../../services/categorias-consolas.service';
import { CategoriasConsolas } from '../../../interfaces/categorias';

import { CategoriasAccesoriosService } from '../../../../services/categorias-accesorios.service';
import { CategoriasAccesoriosBase } from '../../../interfaces/categoriasaccesoriosbase';

import { CategoriasInsumosService } from '../../../../services/categorias-insumos.service';
import { CategoriasInsumosBase } from '../../../interfaces/categoriasinsumosbase';
import { FabricanteInsumos } from '../../../interfaces/fabricantesinsumos';
import { SubcategoriasInsumos } from '../../../interfaces/subcategoriasinsumos';

import { debounceTime, merge, Subscription } from 'rxjs';
import { MatButtonToggleModule } from '@angular/material/button-toggle'; // <-- AÑADIR ESTE IMPORT
import { Articulo } from '../../../interfaces/articulo-pedido';


@Component({
  selector: 'app-agregar-articulo',
  standalone: true,
  imports: [MatDialogActions, MatDialogClose, FormsModule, ReactiveFormsModule, MatDialogContent, MatFormField, MatLabel, MatOption, MatOptionModule,
    MatSelectModule, CommonModule, MatFormFieldModule, MatInputModule, MatButtonToggleModule],
  templateUrl: './agregar-articulo.component.html',
  styleUrl: './agregar-articulo.component.css'
})
export class AgregarArticuloComponent {
  isEditMode = false; // <-- Nueva propiedad
  Agregado = new EventEmitter();

  articulosForm!: FormGroup;

  public ImagePath: any;
  public idModelo: any;

  selectedTipoArticulo: TipoArticulo[] = [];
  selectedFabricante: any;
  selectedCategoria: any;
  selectedSubCategoria: any;
  private priceCalculationSubscription!: Subscription;
  private subscriptions = new Subscription();
  articuloParaEditar: Articulo | null = null;
  // dialogRef: any;

  constructor(
    private tipoarticulo: TipoArticuloService,
    //
    public categoriasProductos: CategoriasConsolasService,
    public categoriasAccesorios: CategoriasAccesoriosService,
    public categoriasInsumo: CategoriasInsumosService,
    //
    public fabricanteService: FabricanteService,
    public fabricanteaccesorioService: FabricanteAccesorioService,
    public fabricanteinsumoService: FabricanteInsumoService,
    //
    public categoriaproductoService: CategoriaProductoService,
    public categoriaaccesorioService: CategoriaAccesorioService,
    public categoriaInsumoService: CategoriaInsumoService,
    //
    public subcategoriaproductoService: SubcategoriaProductoService,
    public subcategoriaaccesorioService: SubcategoriaAccesorioService,
    public subcategoriaInsumoService: SubcategoriaInsumoService,

    //  
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef, private router: Router,
    private dialogRef: MatDialogRef<AgregarArticuloComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    if (data && data.isEditMode) {
      this.isEditMode = true;
      this.articuloParaEditar = data.articulo; // <-- GUARDA EL ARTÍCULO A EDITAR
    }

  }
  ngOnInit(): void {
    // 1. Crea la estructura del formulario con todos los campos.
    this.initializeForm();

    // 2. Comprueba si el diálogo está en modo "Editar" o "Agregar".
    if (this.isEditMode) {
      // Si es modo "Editar", llena el formulario con los datos existentes.
      this.populateFormForEdit();
    } else {
      // Si es modo "Agregar", carga los datos iniciales y configura los menús desplegables.
      this.loadInitialData();
      this.setupCascadingDropdowns();
    }

    // 3. Activa la lógica para el cálculo automático de precios (funciona en ambos modos).
    this.setupPriceCalculationListeners();
  }

  // MÉTODO 1: INICIALIZA EL FORMULARIO
  initializeForm(): void {
    this.articulosForm = this.fb.group({
      TipoArticulo: new FormControl('', Validators.required),
      Fabricante: new FormControl('', Validators.required),
      Cate: new FormControl('', Validators.required),
      SubCategoria: new FormControl('', Validators.required),
      EnlaceCompra: new FormControl(''),
      IdModeloPK: new FormControl('', Validators.required),
      Activo: new FormControl(1),
      Cantidad: new FormControl('1', [Validators.required, Validators.min(1)]),
      priceMode: new FormControl(this.isEditMode ? 'unit' : 'lot'), // En edición, empieza en 'unit'
      Precio: new FormControl('', Validators.required),
      PrecioLote: new FormControl(''),
    });
  }

  // MÉTODO 2: LLENA EL FORMULARIO PARA EDICIÓN
  populateFormForEdit(): void {
    const articulo = this.data.articulo;
    this.articulosForm.patchValue({
      ...articulo,
      priceMode: 'unit' // En modo edición, siempre mostramos el precio unitario.
    });

    // Carga la imagen del artículo que se está editando
    this.ImagePath = articulo.ImagePath;

    // Deshabilitamos los campos que no deben cambiarse en una edición.
    this.articulosForm.get('TipoArticulo')?.disable();
    this.articulosForm.get('Fabricante')?.disable();
    this.articulosForm.get('Cate')?.disable();
    this.articulosForm.get('SubCategoria')?.disable();
    this.articulosForm.get('priceMode')?.disable(); // El modo de precio tampoco se puede cambiar.
  }

  // MÉTODO 3: CARGA DATOS INICIALES PARA MODO "AGREGAR"
  loadInitialData(): void {
    this.ImagePath = this.getImagePath('', null);
    this.tipoarticulo.getAll().subscribe((data: TipoArticulo[]) => {
      this.selectedTipoArticulo = data;
    });
  }

  // CORRECCIÓN 2: Implementar la lógica de los menús desplegables
  setupCascadingDropdowns(): void {
    const tipoArticuloControl = this.articulosForm.get('TipoArticulo')!;
    const fabricanteControl = this.articulosForm.get('Fabricante')!;
    const categoriaControl = this.articulosForm.get('Cate')!;
    const subCategoriaControl = this.articulosForm.get('SubCategoria')!;

    // 1. Cuando cambia el TIPO DE ARTÍCULO
    this.subscriptions.add(
      tipoArticuloControl.valueChanges.subscribe(tipoId => {
        fabricanteControl.reset();
        this.selectedFabricante = [];
        categoriaControl.reset();
        this.selectedCategoria = [];
        subCategoriaControl.reset();
        this.selectedSubCategoria = [];
        switch (tipoId) {
          case 1: this.updateCategoriesForProducto(); break;
          case 2: this.updateCategoriesForAccesorio(); break;
          case 3: this.updateCategoriesForInsumo(); break;
        }
      })
    );

    // 2. Cuando cambia el FABRICANTE
    this.subscriptions.add(
      fabricanteControl.valueChanges.subscribe(fabricanteId => {
        categoriaControl.reset();
        this.selectedCategoria = [];
        subCategoriaControl.reset();
        this.selectedSubCategoria = [];
        if (fabricanteId) {
          switch (tipoArticuloControl.value) {
            case 1: this.fetchCategoriasForProducto(fabricanteId); break;
            case 2: this.fetchCategoriasForAccesorio(fabricanteId); break;
            case 3: this.fetchCategoriasForInsumo(fabricanteId); break;
          }
        }
      })
    );

    // 3. Cuando cambia la CATEGORÍA
    this.subscriptions.add(
      categoriaControl.valueChanges.subscribe(categoriaId => {
        subCategoriaControl.reset();
        this.selectedSubCategoria = [];
        if (categoriaId) {
          switch (tipoArticuloControl.value) {
            case 1: this.fetchSubCategoriasForProducto(categoriaId); break;
            case 2: this.fetchSubCategoriasForAccesorio(categoriaId); break;
            case 3: this.fetchSubCategoriasForInsumo(categoriaId); break;
          }
        }
      })
    );

    // 4. Cuando cambia la SUBCATEGORÍA (AQUÍ RESTAURAMOS LA LÓGICA ANTIGUA Y FUNCIONAL)
    this.subscriptions.add(
      subCategoriaControl.valueChanges.subscribe(selectedSubCategoriaId => {
        const fabricanteId = fabricanteControl.value;
        const categoriaId = categoriaControl.value;
        const tipoArticulo = tipoArticuloControl.value;

        if (fabricanteId && categoriaId && selectedSubCategoriaId && tipoArticulo) {
          let categoriasService: any; // Servicio para el primer paso
          let findService: any;       // Servicio para el segundo paso (find)
          let idModeloKey = '';       // La llave del ID del modelo (ej: 'IdModeloConsolaPK')

          switch (tipoArticulo) {
            case 1:
              categoriasService = this.categoriasProductos;
              findService = this.categoriasProductos;
              idModeloKey = 'IdModeloConsolaPK';
              break;
            case 2:
              categoriasService = this.categoriasAccesorios;
              findService = this.categoriasAccesorios;
              idModeloKey = 'IdModeloAccesorioPK';
              break;
            case 3:
              categoriasService = this.categoriasInsumo;
              findService = this.categoriasInsumo;
              idModeloKey = 'IdModeloInsumosPK';
              break;
            default: return;
          }

          // PASO 1: Obtener el ID del modelo con getbymanufacturer
          categoriasService.getbymanufacturer(fabricanteId, categoriaId, selectedSubCategoriaId)
            .subscribe((modelData: any[]) => {
              if (modelData && modelData.length > 0) {
                const modelo = modelData[0];
                this.idModelo = modelo[idModeloKey];
                this.articulosForm.get('IdModeloPK')?.setValue(this.idModelo);

                // PASO 2: Usar el idModelo para buscar la imagen con find()
                findService.find(this.idModelo).subscribe((imageData: any) => {
                  if (imageData && imageData.length > 0) {
                    this.ImagePath = this.getImagePath(imageData[0].LinkImagen, tipoArticulo);
                    this.cdr.detectChanges();
                  } else {
                    this.ImagePath = this.getImagePath(null, tipoArticulo);
                  }
                });
              } else {
                this.ImagePath = this.getImagePath(null, tipoArticulo);
              }
            });
        }
      })
    );
  }

  // MÉTODO 5: CONFIGURA LA LÓGICA DE CÁLCULO DE PRECIO
  // ===== MÉTODO CORREGIDO =====
  setupPriceCalculationListeners(): void {
    const priceMode$ = this.articulosForm.get('priceMode')!.valueChanges;
    const cantidad$ = this.articulosForm.get('Cantidad')!.valueChanges;
    const precioLote$ = this.articulosForm.get('PrecioLote')!.valueChanges;

    this.subscriptions.add(
      merge(priceMode$, cantidad$, precioLote$)
        .pipe(debounceTime(300)) // Opcional: añade un pequeño retardo
        .subscribe(() => {
          if (this.articulosForm.get('priceMode')?.value === 'lot') {
            this.calculateUnitPrice();
          }
        })
    );
  }

  calculateUnitPrice(): void {
    const cantidadNum = parseFloat(this.articulosForm.get('Cantidad')?.value);
    const precioLoteNum = parseFloat(this.articulosForm.get('PrecioLote')?.value);

    if (cantidadNum > 0 && precioLoteNum >= 0) {
      const unitPrice = precioLoteNum / cantidadNum;
      this.articulosForm.get('Precio')?.setValue(unitPrice.toFixed(4), { emitEvent: false });
    } else {
      this.articulosForm.get('Precio')?.setValue('', { emitEvent: false });
    }
  }

  // Tu función para validar decimales
  enforceTwoDecimals(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;
    value = value.replace(/[^0-9.]/g, '');
    const parts = value.split('.');
    if (parts.length > 2) {
      value = parts[0] + '.' + parts.slice(1).join('');
    }
    if (parts[1] && parts[1].length > 2) {
      value = parts[0] + '.' + parts[1].substring(0, 2);
    }
    input.value = value;
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
    this.fabricanteinsumoService.getManufacturerWithModel().subscribe((data: FabricanteInsumos[]) => {
      // Transformar los datos para usar claves consistentes
      this.selectedFabricante = data.map(item => ({
        id: item.IdFabricanteInsumosPK,
        nombre: item.NombreFabricanteInsumos
      }));
      // console.log(this.selectedFabricante);
    });
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
    this.categoriaInsumoService.findWithModel(fabricanteId.toString()).subscribe((data: categoriasInsumos[]) => {
      this.selectedCategoria = data.map(item => ({
        id: item.IdCategoriaInsumosPK,
        nombre: item.NombreCategoriaInsumos
      }));
    });
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
    this.subcategoriaInsumoService.findWithModel(categoriaId.toString()).subscribe((data: SubcategoriasInsumos[]) => {
      this.selectedSubCategoria = data.map(item => ({
        id: item.IdSubcategoriaInsumos,
        nombre: item.NombreSubcategoriaInsumos
      }));
    });
  }

  // Función para construir la ruta de la imagen
  getImagePath(link: string | null, tipoArticulo: number | null) {
    console.log(link)
    console.log(tipoArticulo)
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

  // NUEVO: Método auxiliar para el submit
  calculateFinalUnitPrice() {
    const cantidadNum = parseFloat(this.articulosForm.get('Cantidad')?.value);
    const precioLoteNum = parseFloat(this.articulosForm.get('PrecioLote')?.value);

    if (cantidadNum > 0 && precioLoteNum >= 0) {
      const unitPrice = precioLoteNum / cantidadNum;
      this.articulosForm.get('Precio')?.setValue(unitPrice.toFixed(4));
    }
  }

  onSubmit(): void {
    if (this.articulosForm.get('priceMode')?.value === 'lot') {
      const cantidadNum = parseFloat(this.articulosForm.get('Cantidad')?.value);
      const precioLoteNum = parseFloat(this.articulosForm.get('PrecioLote')?.value);
      if (cantidadNum > 0 && precioLoteNum >= 0) {
        const unitPrice = precioLoteNum / cantidadNum;
        this.articulosForm.get('Precio')?.setValue(unitPrice.toFixed(4));
      }
    }

    if (this.articulosForm.valid) {
      this.dialogRef.close(this.articulosForm.getRawValue());
    } else {
      console.log('Formulario no válido');
      this.articulosForm.markAllAsTouched(); // Muestra errores de validación
    }
  }

  ngOnDestroy(): void {
    if (this.priceCalculationSubscription) {
      this.priceCalculationSubscription.unsubscribe();
    }
  }
}
