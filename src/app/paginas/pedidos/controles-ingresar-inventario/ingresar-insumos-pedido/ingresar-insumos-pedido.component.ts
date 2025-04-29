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
import { NgFor } from '@angular/common';

import { EstadosConsolas } from '../../../interfaces/estados';
import { EstadoConsolasService } from '../../../../services/estado-consolas.service';
// import { CategoriasInsumosservice}
import { InsumosBaseService } from '../../../../services/insumos-base.service';
import { FabricanteInsumos } from '../../../interfaces/fabricantesinsumos';
import { categoriasInsumos } from '../../../interfaces/categoriasinsumos';
import { SubcategoriasInsumos } from '../../../interfaces/subcategoriasinsumos';

import { FabricanteInsumoService } from '../../../../services/fabricante-insumo.service';
import { CategoriaInsumoService } from '../../../../services/categoria-insumo.service';
import { SubcategoriaInsumoService } from '../../../../services/subcategoria-insumo.service';
import { CategoriasInsumosService } from '../../../../services/categorias-insumos.service';
import { CategoriasInsumosBase } from '../../../interfaces/categoriasinsumosbase';
import { MatChipsModule } from '@angular/material/chips';
import { InsumosBase } from '../../../interfaces/insumosbase';

@Component({
  selector: 'app-ingresar-insumos-pedido',
  standalone: true,
  imports: [NgFor, ReactiveFormsModule, MatSelectModule, MatDialogModule, MatButtonModule, MatIcon,
    MatFormField, MatLabel, FormsModule, MatInputModule, MatFormFieldModule, MatChipsModule],
  templateUrl: './ingresar-insumos-pedido.component.html',
  styleUrls: ['./ingresar-insumos-pedido.component.css']
})
export class IngresarInsumosPedidoComponent {

  @Input() form!: FormGroup; // 👈 Asegurar que el componente recibe 'form'
  @Input() articulo!: any; // Recibe el artículo desde el padre

  @Output() insumoAgregado = new EventEmitter<any>();


  Agregado = new EventEmitter();

  insumoForm!: FormGroup;
  insumo!: InsumosBase;

  categoriasconsolas: CategoriasInsumosBase[] = [];
  categoria!: CategoriasInsumosBase;
  categoria2!: CategoriasInsumosBase;


  selectedCategoria: any[] = [];

  selectedFabricanteInsumos: FabricanteInsumos[] = [];
  selectedCategoriaInsumos: categoriasInsumos[] = [];
  selectedSubcategoriaInsumos: SubcategoriasInsumos[] = [];

  selectedEstado: EstadosConsolas[] = [];

  idModeloInsumoPK: any;
  FabricanteInsumo: any;
  CategoriaInsumo: any;
  SubcategoriaInsumo: any;

  public supplyId: any;
  public supplyCode: any;
  public supplyState: any;
  public supplyPrice: any;
  public supplyStock: any;
  public supplyMinimumStock: any;
  public supplyComment: any;
  public supplyManufacturer: any;
  public supplyCate: any
  public supplySubCate: any;
  public supplySerialCode: any;

  public ImagePath: any;

  constructor(
    public insumosService: InsumosBaseService,
    public categorias: CategoriasInsumosService,
    public fabricanteService: FabricanteInsumoService,
    public categoriasInsumosService: CategoriaInsumoService,
    public subcategoriasInsumosService: SubcategoriaInsumoService,
    public estados: EstadoConsolasService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) { }

  ngOnInit(): void {

    if (!this.articulo) {
      console.warn('⚠️ No se recibió un artículo válido.');
      return;
    }

    //console.log("Formulario recibido:", this.form);
    console.log("imagen", this.articulo.ImagePath);


    // Asegurarse de que `form` no sea undefined antes de asignar el listener
    if (this.form) {
      console.log('aaaaa')
      this.form.valueChanges.subscribe(() => {
        if (this.form.valid) {
          this.insumoAgregado.emit(this.form.value);
        }
      });
    } else {
      console.warn("El formulario no fue recibido correctamente");
    }



    this.supplyCode = this.articulo.IdModeloPK;
    // this.consoleColor = this.producto.Color;
    // this.consoleState = this.producto.Estado;
    // this.consoleHack = this.producto.Hack;
    this.supplyStock = this.articulo.Cantidad;
    this.supplyPrice = this.articulo.Precio;
    console.log(" el precio es:", this.articulo);
    this.supplyManufacturer = this.articulo.FabricanteArticulo;
    this.supplyCate = this.articulo.CategoriaArticulo;
    this.supplySubCate = this.articulo.SubcategoriaArticulo;

    this.categorias.find(this.supplyCode).subscribe((data: CategoriasInsumosBase[]) => {
      this.categoria = data[0];
      this.ImagePath = this.getimagePath(this.categoria.LinkImagen);
    });

    this.insumoForm = this.form;

    //initialization of the form
    if (this.articulo) {
      this.insumoForm.patchValue({
        FabricanteInsumo: this.supplyManufacturer,
        CateInsumo: this.supplyCate,
        SubCategoriaInsumo: this.supplySubCate,
        EstadoInsumo: this.supplyState,
        PrecioBase: this.supplyPrice,
        Cantidad: this.supplyStock,
        StockMinimo: this.supplyMinimumStock,
        ComentarioInsumo: this.supplyComment,
        NumeroSerie: this.supplySerialCode,
        IdModeloInsumosPK: this.supplyCode,
        IdPedido: this.articulo.IdCodigoPedidoFK
      });
    }

    // this.insumoForm = new FormGroup({
    //   FabricanteInsumo: new FormControl('', Validators.required),
    //   CateInsumo: new FormControl('', Validators.required),
    //   SubCategoriaInsumo: new FormControl('', Validators.required),
    //   IdModeloInsumosPK: new FormControl('', Validators.required),
    //   PrecioBase: new FormControl('', Validators.required),
    //   Cantidad: new FormControl('', Validators.required),
    //   StockMinimo: new FormControl('', Validators.required),
    //   EstadoInsumo: new FormControl(1, Validators.required),
    //   ComentarioInsumo: new FormControl(''),
    //   NumeroSerie: new FormControl(''),
    //   IdPedido: new FormControl('')
    // });

    this.estados.getAll().subscribe((data: EstadosConsolas[]) => {
      //console.log(data);
      this.selectedEstado = data;
    });

    this.fabricanteService.getManufacturerWithModel().subscribe((data: FabricanteInsumos[]) => {
      this.selectedFabricanteInsumos = data;
    });

    this.estados.getAll().subscribe((data: EstadosConsolas[]) => {
      this.selectedEstado = data;

    });

    this.fabricanteService.getAllBase().subscribe((data: FabricanteInsumos[]) => {
      this.selectedFabricanteInsumos = data;
    });

    this.categoriasInsumosService.getAllBase().subscribe((data: categoriasInsumos[]) => {
      this.selectedCategoriaInsumos = data;
    });

    this.subcategoriasInsumosService.getAll().subscribe((data: SubcategoriasInsumos[]) => {
      this.selectedSubcategoriaInsumos = data;
    });

    


    this.cdr.detectChanges();

  }

  getimagePath(l: string | null) {
    const baseUrl = 'http://localhost:3000'; // Updated to match the Express server port

    if (l == null || l === '') {
      return `${baseUrl}/img-insumos/kingston-32gb-clase10.jpg`;
    } else {
      return `${baseUrl}/img-insumos/${l}`;
    }
  }

  get f() {

    return this.insumoForm.controls;

  }


}


