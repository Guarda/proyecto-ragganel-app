import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, inject, Input, Output, signal, SimpleChanges } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgFor } from '@angular/common';

import { FabricanteInsumoService } from '../../../services/fabricante-insumo.service';
import { CategoriaInsumoService } from '../../../services/categoria-insumo.service';
import { SubcategoriaInsumoService } from '../../../services/subcategoria-insumo.service';
import { CategoriasInsumosService } from '../../../services/categorias-insumos.service';

import { InsumosBase } from '../../interfaces/insumosbase';
import { InsumosBaseService } from '../../../services/insumos-base.service';
import { FabricanteInsumos } from '../../interfaces/fabricantesinsumos';
import { categoriasInsumos } from '../../interfaces/categoriasinsumos';
import { SubcategoriasInsumos } from '../../interfaces/subcategoriasinsumos';
import { FormGroup } from '@angular/forms';
import { CategoriasInsumosBase } from '../../interfaces/categoriasinsumosbase';
import { TarjetaInsumoComponent } from '../tarjeta-insumo/tarjeta-insumo.component';

@Component({
  selector: 'app-index-listado-insumos-editar',
  standalone: true,
  imports: [NgFor, ReactiveFormsModule, MatSelectModule, MatDialogModule, MatButtonModule, MatIcon,
    MatFormField, MatLabel, FormsModule, MatInputModule, MatFormFieldModule, TarjetaInsumoComponent],
  templateUrl: './index-listado-insumos-editar.component.html',
  styleUrl: './index-listado-insumos-editar.component.css'
})
export class IndexListadoInsumosEditarComponent {

  insumoForm!: FormGroup;

  categoria!: CategoriasInsumosBase;
  insumo!: InsumosBase;

  displayedColumns: string[] = [
    'Fabricante', 'Cate', 'SubCategoria',
    'Cantidad', 'Precio', 'Acciones'
  ];

  @Input() dataToDisplay: InsumosBase[] = [];
  @Output() insumoAgregado = new EventEmitter<{ Codigo: string, Nombre: string, Cantidad: number }>();
  @Output() insumoEliminado = new EventEmitter<InsumosBase>();
  @Output() cantidadActualizada = new EventEmitter<{ Codigo: string; Cantidad: number }>();

  selectedFabricante: any;
  selectedCategoria: any;
  selectedSubcategoria: any;

  supplyPrice!: any;
  supplyQuantity!: any;

  idModeloInsumoPK: any;
  idCodigoInsumo: any;

  public ImagePath: any;

  constructor(
    private fabricanteinsumoService: FabricanteInsumoService,
    private categoriainsumoService: CategoriaInsumoService,
    private subcategoriainsumoService: SubcategoriaInsumoService,
    private cateinsumoService: CategoriasInsumosService,
    private insumosService: InsumosBaseService,
    private cdr: ChangeDetectorRef) {

  }

  ngOnInit(): void {


    this.supplyQuantity = 1; // Valor inicial de cantidad

    this.insumoForm = new FormGroup({
      Fabricante: new FormControl('', Validators.required),
      Categoria: new FormControl('', Validators.required),
      Subcategoria: new FormControl('', Validators.required),
      IdModeloInsumosPK: new FormControl('', Validators.required),
      PrecioBase: new FormControl('', Validators.required),
      Cantidad: new FormControl('', Validators.required)
    });



    this.fabricanteinsumoService.getManufacturerWithModel().subscribe((data: FabricanteInsumos[]) => {
      this.selectedFabricante = data;
    });

    /*PARA REVISAR SI HAY CAMBIOS EN EL FORM, PARA MANDAR A LLAMAR NUEVAMENTE LA LISTA DE LAS CATEGORIAS ACORDE AL FABRICANTE*/
    this.insumoForm.get('Fabricante')?.valueChanges.subscribe(selectedId => {
      // this.insumoForm.get('Cate')?.reset();
      // this.insumoForm.get('SubCategoria')?.reset();
      this.categoriainsumoService.findWithModel(selectedId).subscribe((data: categoriasInsumos[]) => {
        this.selectedCategoria = data;
      })
      this.insumoForm.get('Subcategoria')?.reset();
    });

    this.insumoForm.get('Categoria')?.valueChanges.subscribe(selectedId => {
      this.subcategoriainsumoService.findWithModel(selectedId).subscribe((data: SubcategoriasInsumos[]) => {
        this.selectedSubcategoria = data;
        console.log(data);
      })
    });

    this.insumoForm.get('Subcategoria')?.valueChanges.subscribe(selectedId => {
      // console.log(this.insumoForm.value.Fabricante, this.insumoForm.value.Categoria, this.insumoForm.get('SubCategoria')?.value);
      if (this.insumoForm.value.Fabricante != undefined && this.insumoForm.value.Categoria != undefined && this.insumoForm.get('Subcategoria')?.value != undefined) {
        this.cateinsumoService.getbymanufacturerb(this.insumoForm.value.Fabricante, this.insumoForm.value.Categoria, this.insumoForm.get('Subcategoria')?.value).subscribe((data) => {
          this.idModeloInsumoPK = data[0].IdModeloInsumosPK;
          this.idCodigoInsumo = data[0].CodigoInsumo;
          console.log("Precio base", data[0]);

          this.cateinsumoService.find(this.idModeloInsumoPK).subscribe((data) => {
            this.categoria = data[0];
            console.log(this.categoria);

            this.insumosService.find(this.idCodigoInsumo).subscribe((data) => {
              console.log(data[0]);
              this.insumo = data[0];
              this.insumoForm.get('PrecioBase')?.setValue(this.insumo.PrecioBase);
              this.insumoForm.get('Cantidad')?.setValue(1); // Valor inicial de cantidad
            })

            console.log('la imagen es', this.categoria.LinkImagen);
            this.ImagePath = this.getimagePath(this.categoria.LinkImagen);
            this.cdr.detectChanges();
            this.insumoForm.get('IdModeloInsumosPK')?.setValue(this.idModeloInsumoPK);
            // this.insumoForm.get('PrecioBase')?.setValue(this.categoria.PrecioBase);
            //  this.insumoForm.get('Cantidad')?.setValue(this.categoria.Cantidad);
          });
        })
      }
    });


  }

  // Método para manejar el evento (borrar) de la tarjeta
  manejarBorradoDesdeTarjeta(insumoABorrar: any) {
    console.log('IndexListado: Intentando borrar insumo ->', insumoABorrar);

    if (!insumoABorrar || insumoABorrar.CodigoInsumo === undefined) {
      console.error('IndexListado: Insumo a borrar no válido o sin CodigoInsumo.');
      return;
    }

    const index = this.dataToDisplay.findIndex(
      i => i.CodigoInsumo === insumoABorrar.CodigoInsumo
      // Si CodigoInsumo no es único y necesitas una comparación más estricta,
      // podrías necesitar un ID único por instancia si el mismo insumo puede estar varias veces.
      // Pero usualmente CodigoInsumo debería ser suficiente si representa el producto.
    );

    if (index !== -1) {
      // --- ESTA ES LA LÓGICA DE ELIMINACIÓN ---
      this.dataToDisplay.splice(index, 1);

      // Forzar la detección de cambios de Angular creando una nueva referencia del array
      this.dataToDisplay = [...this.dataToDisplay];

      // Notificar a Angular para que actualice la vista.
      this.cdr.detectChanges();

      console.log('IndexListado: Insumo eliminado de dataToDisplay local. Nueva dataToDisplay ->', this.dataToDisplay);

      // Emitir el evento hacia el componente padre (VerServicioComponent) para que actualice sus listas maestras
      this.insumoEliminado.emit(insumoABorrar);
      console.log('IndexListado: Evento insumoEliminado emitido al padre ->', insumoABorrar);

    } else {
      console.warn('IndexListado: No se encontró el insumo a borrar en dataToDisplay. Buscado por CodigoInsumo ->', insumoABorrar.CodigoInsumo);
      console.warn('IndexListado: dataToDisplay actual ->', this.dataToDisplay);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['insumo'] && this.insumo) {
      this.cargarInsumoExistente(this.insumo);
    }
  }

  cargarInsumoExistente(insumo: InsumosBase) {
    console.log("insumo existente", insumo);
    this.insumo = insumo;
    this.insumoForm.patchValue({
      Fabricante: insumo.IdFabricanteInsumosPK,
      Categoria: insumo.IdCategoriaInsumosPK,
      Subcategoria: insumo.IdSubcategoriaInsumos,
      PrecioBase: insumo.PrecioBase,
      Cantidad: insumo.Cantidad,
      IdModeloInsumosPK: insumo.IdModeloInsumosPK
    });

    // Simula los valueChanges manualmente para que cargue las opciones dependientes
    this.categoriainsumoService.findWithModel(insumo.IdFabricanteInsumosPK.toString()).subscribe((data: categoriasInsumos[]) => {
      this.selectedCategoria = data;

      this.subcategoriainsumoService.findWithModel(insumo.IdCategoriaInsumosPK.toString()).subscribe((subdata: SubcategoriasInsumos[]) => {
        this.selectedSubcategoria = subdata;

        // Ahora puedes cargar los datos completos del modelo y la imagen
        this.cateinsumoService.find(insumo.IdModeloInsumosPK.toString()).subscribe((catData) => {
          this.categoria = catData[0];
          this.ImagePath = this.getimagePath(this.categoria.LinkImagen);
          this.cdr.detectChanges();
        });
      });
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

  agregarInsumoAlPadre() {
    if (this.insumoForm.valid && this.insumo) {
      const nuevoInsumo = {
        Codigo: String(this.insumo.CodigoInsumo),
        Nombre: this.insumo.NombreSubcategoriaInsumos,
        Cantidad: this.insumoForm.get('Cantidad')?.value
      };
      this.insumoAgregado.emit(nuevoInsumo);
    }
  }


  getNombreById(array: any[], id: any, idKey: string, nameKey: string): string {
    const found = array.find(item => item[idKey] === id);
    return found ? found[nameKey] : '';
  }

  removeInsumo(insumo: InsumosBase) {
    const index = this.dataToDisplay.findIndex(item => item === insumo);
    if (index !== -1) {
      this.dataToDisplay[index].Activo = false; // Marcar como inactivo
      console.log('Insumo marcado como inactivo:', this.dataToDisplay[index]);
    }

    // Si usas dataSource, deberías actualizarlo también, si no, basta con forzar el render
    this.dataToDisplay = [...this.dataToDisplay]; // Forzar detección de cambios
  }

  get activeInsumos(): InsumosBase[] {
    return this.dataToDisplay; // ignora el filtro de Activo para probar

  }

   actualizarCantidadInsumo(nuevaCantidad: number, insumo: InsumosBase) {
    const index = this.dataToDisplay.findIndex(item => item === insumo);
    if (index !== -1) {
      this.dataToDisplay[index].Cantidad = nuevaCantidad;
      this.dataToDisplay = [...this.dataToDisplay]; // Refrescar vista si es necesario

      // Emitir al padre
      this.cantidadActualizada.emit({
        Codigo: String(insumo.CodigoInsumo),
        Cantidad: nuevaCantidad
      });
    }
  }

  get isAddDisabled(): boolean {
    const { Fabricante, Categoria, Subcategoria } = this.insumoForm.value;
    return !(Fabricante && Categoria && Subcategoria);
  }





  onSubmit() {

    console.log(this.insumoForm.value);
    console.log("este insumo", this.insumo);
    if (this.insumoForm.valid && this.categoria) {
      const formValues = this.insumoForm.value;

      const localNewInsumo: InsumosBase = {
        CodigoInsumoFK: this.insumo.CodigoInsumoFK, // Viene de la lógica de carga
        IdModeloInsumosPK: this.idModeloInsumoPK, // Viene de la lógica de carga
        CodigoInsumo: this.insumo.CodigoInsumo, // Propiedad de this.insumo
        NombreFabricanteInsumos: this.getNombreById(this.selectedFabricante, formValues.Fabricante, 'IdFabricanteInsumosPK', 'NombreFabricanteInsumos'),
        NombreCategoriaInsumos: this.getNombreById(this.selectedCategoria, formValues.Categoria, 'IdCategoriaInsumosPK', 'NombreCategoriaInsumos'),
        NombreSubcategoriaInsumos: this.getNombreById(this.selectedSubcategoria, formValues.Subcategoria, 'IdSubcategoriaInsumos', 'NombreSubcategoriaInsumos'), // Como lo tenías
        PrecioBase: +formValues.PrecioBase, // Propiedad de this.insumo (ya se setea en el form)
        Cantidad: +formValues.Cantidad, // Del formulario
        LinkImagen: this.categoria ? this.categoria.LinkImagen : (this.insumo.LinkImagen || ''), // Prioriza this.categoria si existe, sino this.insumo, sino vacío

        // --- Propiedades faltantes que causan el error TS2740 ---
        // Debes llenarlas según tu lógica y lo que contenga this.insumo y this.categoria
        // o con valores por defecto si es un insumo "temporal" para la lista local.

        EstadoInsumo: this.insumo.EstadoInsumo !== undefined ? this.insumo.EstadoInsumo : 0, // Ejemplo, toma de this.insumo o default
        FechaIngreso: this.insumo.FechaIngreso ? new Date(this.insumo.FechaIngreso) : new Date(), // Ejemplo
        StockMinimo: this.insumo.StockMinimo !== undefined ? this.insumo.StockMinimo : 1, // Ejemplo
        Comentario: this.insumo.Comentario || '', // Ejemplo
        ModeloInsumo: this.idModeloInsumoPK, // Como lo tenías, o this.insumo.ModeloInsumo
        NumeroSerie: this.insumo.NumeroSerie || '', // Ejemplo

        // Propiedades que probablemente vienen de this.categoria o this.insumo si tiene campos denormalizados
        CodigoModeloInsumos: (this.categoria ? this.categoria.CodigoModeloInsumos : this.insumo.CodigoModeloInsumos) || '',
        CategoriaInsumos: (this.categoria ? this.categoria.CategoriaInsumos : this.insumo.CategoriaInsumos) || '', // Asumo que es el ID o código
        SubcategoriaInsumos: (this.categoria ? this.categoria.SubcategoriaInsumos : this.insumo.SubcategoriaInsumos) || '', // Asumo que es el ID o código
        FabricanteInsumos: (this.categoria ? this.categoria.FabricanteInsumos : this.insumo.FabricanteInsumos) || '', // Asumo que es el ID o código

        Activo: true, // Para la visualización en la lista local

        // IDs de las selecciones del formulario, como las tenías
        IdFabricanteInsumosPK: formValues.Fabricante,
        IdCategoriaInsumosPK: formValues.Categoria,
        IdSubcategoriaInsumos: formValues.Subcategoria, // Si es parte de InsumosBase
        IdFabricanteInsumosFK: formValues.Fabricante, // Si es parte de InsumosBase
        IdCategoriaInsumosFK: formValues.Categoria, // Si es parte de InsumosBase

        // Otras propiedades que puedan faltar según tu interfaz InsumosBase
        // Revisa tu interfaz InsumosBase y añade todas las propiedades necesarias
        // con valores de this.insumo, this.categoria, formValues o defaults.
        // Ejemplo de propiedades genéricas que podrían faltar:
        CodigoEstado: this.insumo.CodigoEstado !== undefined ? this.insumo.CodigoEstado : 0,
        DescripcionEstado: this.insumo.DescripcionEstado || 'Activo', // O lo que corresponda

        // Si tienes más propiedades en InsumosBase, añádelas aquí.
        // Ejemplo:
        // OtraPropiedadNumerica: this.insumo.OtraPropiedadNumerica || 0,
        // OtraPropiedadTexto: this.insumo.OtraPropiedadTexto || '',
      };


      console.log('Nuevo insumo local (hijo):', localNewInsumo);
      this.dataToDisplay.push(localNewInsumo);
      this.dataToDisplay = [...this.dataToDisplay];

      // EMITIR AL PADRE (esto no cambia)
      const insumoParaPadre = {
        Codigo: String(this.insumo.CodigoInsumo),
        Nombre: localNewInsumo.NombreSubcategoriaInsumos, // Usar el nombre construido para consistencia si se muestra en el padre
        Cantidad: +formValues.Cantidad
      };
      this.insumoAgregado.emit(insumoParaPadre);
      console.log('Insumo emitido al padre:', insumoParaPadre);
    }
  }

}
