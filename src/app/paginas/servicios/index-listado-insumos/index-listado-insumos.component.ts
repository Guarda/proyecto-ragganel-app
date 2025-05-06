import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
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
  selector: 'app-index-listado-insumos',
  standalone: true,
  imports: [NgFor, ReactiveFormsModule, MatSelectModule, MatDialogModule, MatButtonModule, MatIcon,
    MatFormField, MatLabel, FormsModule, MatInputModule, MatFormFieldModule, TarjetaInsumoComponent],
  templateUrl: './index-listado-insumos.component.html',
  styleUrl: './index-listado-insumos.component.css'
})
export class IndexListadoInsumosComponent {

  insumoForm!: FormGroup;

  categoria!: CategoriasInsumosBase;
  insumo!: InsumosBase;

  displayedColumns: string[] = [
    'Fabricante', 'Cate', 'SubCategoria',
    'Cantidad', 'Precio', 'Acciones'
  ];

  @Input() dataToDisplay: InsumosBase[] = [];

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
          console.log("Precio base",data[0]);

          this.cateinsumoService.find(this.idModeloInsumoPK).subscribe((data) => {
            this.categoria = data[0];
            console.log(this.categoria);

            this.insumosService.find(this.idCodigoInsumo).subscribe((data) => {
              console.log(data[0]);
              this.insumo = data[0];
              this.insumoForm.get('PrecioBase')?.setValue(this.insumo.PrecioBase);
              this.insumoForm.get('Cantidad')?.setValue(1); // Valor inicial de cantidad
            })

            console.log('la imagen es',this.categoria.LinkImagen);
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

  getimagePath(l: string | null) {
    const baseUrl = 'http://localhost:3000'; // Updated to match the Express server port

    if (l == null || l === '') {
      return `${baseUrl}/img-insumos/kingston-32gb-clase10.jpg`;
    } else {
      return `${baseUrl}/img-insumos/${l}`;
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
    return this.dataToDisplay.filter(insumo => insumo.Activo === true);
  }

  actualizarCantidadInsumo(nuevaCantidad: number, insumo: InsumosBase) {
    const index = this.dataToDisplay.findIndex(item => item === insumo);
    if (index !== -1) {
      this.dataToDisplay[index].Cantidad = nuevaCantidad;
      console.log('Cantidad actualizada:', this.dataToDisplay[index]);
      this.dataToDisplay = [...this.dataToDisplay]; // Refrescar vista si es necesario
    }
  }

  get isAddDisabled(): boolean {
    const { Fabricante, Categoria, Subcategoria } = this.insumoForm.value;
    return !(Fabricante && Categoria && Subcategoria);
  }





  onSubmit() {

    console.log(this.insumoForm.value);
    if (this.insumoForm.valid && this.categoria) {
      const formValues = this.insumoForm.value;

      const newInsumo: InsumosBase = {
        IdModeloInsumosPK: this.idModeloInsumoPK,
        NombreFabricanteInsumos: this.getNombreById(this.selectedFabricante, formValues.Fabricante, 'IdFabricanteInsumosPK', 'NombreFabricanteInsumos'),
        NombreCategoriaInsumos: this.getNombreById(this.selectedCategoria, formValues.Categoria, 'IdCategoriaInsumosPK', 'NombreCategoriaInsumos'),
        NombreSubcategoriaInsumos: this.getNombreById(this.selectedSubcategoria, formValues.Subcategoria, 'IdSubcategoriaInsumos', 'NombreSubcategoriaInsumos'),
        PrecioBase: +formValues.PrecioBase,
        Cantidad: +formValues.Cantidad,
        LinkImagen: this.categoria.LinkImagen,

        CodigoInsumo: 0,
        EstadoInsumo: 0,
        FechaIngreso: new Date(),
        StockMinimo: 1, // podrías poner un valor por defecto más útil
        Comentario: '',
        ModeloInsumo: this.idModeloInsumoPK,
        NumeroSerie: '',
        CodigoModeloInsumos: this.categoria.CodigoModeloInsumos || '',
        CategoriaInsumos: this.categoria.CategoriaInsumos || '',
        SubcategoriaInsumos: this.categoria.SubcategoriaInsumos || '',
        FabricanteInsumos: this.categoria.FabricanteInsumos || '',
        Activo: true, // Mostrar tarjeta activa
        IdFabricanteInsumosPK: formValues.Fabricante,
        IdCategoriaInsumosPK: formValues.Categoria,
        IdSubcategoriaInsumos: formValues.Subcategoria,
        IdFabricanteInsumosFK: formValues.Fabricante,
        IdCategoriaInsumosFK: formValues.Categoria,
        CodigoEstado: 0,
        DescripcionEstado: ''
      };

      console.log('Nuevo insumo:', newInsumo);

      this.dataToDisplay.push(newInsumo);
      this.dataToDisplay = [...this.dataToDisplay]; // Forzar detección de cambios

      this.insumoForm.reset();
    }
  }




}
