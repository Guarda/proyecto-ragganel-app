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
import { CommonModule, NgFor } from '@angular/common';

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
import { MatCardActions, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle } from '@angular/material/card';

@Component({
    selector: 'app-ingresar-insumos-pedido',
    imports: [NgFor, ReactiveFormsModule, MatSelectModule, MatDialogModule, MatButtonModule, MatIcon,
        MatFormField, MatLabel, FormsModule, MatInputModule, MatFormFieldModule, MatChipsModule, CommonModule, MatCardContent, MatCardActions, MatCardTitle, MatCardSubtitle, MatCardHeader],
    templateUrl: './ingresar-insumos-pedido.component.html',
    styleUrls: ['./ingresar-insumos-pedido.component.css']
})
export class IngresarInsumosPedidoComponent {
  @Input() stepperIndex: number = 0;
  @Input() form!: FormGroup; // 👈 Asegurar que el componente recibe 'form'
  @Input() articulo!: any; // Recibe el artículo desde el padre

  @Output() insumoAgregado = new EventEmitter<any>();


  Agregado = new EventEmitter();
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
    if (!this.form || !this.articulo) {
      console.error('⚠️ Componente "IngresarInsumosPedido" no recibió un formulario o artículo válido.');
      return;
    }

    // Solución para ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(() => {
      this.cargarDatosParaSelects();
      this.establecerValoresIniciales();
      this.cargarDatosDinamicosDelArticulo();
    });
  }

  private cargarDatosParaSelects(): void {
    this.estados.getAll().subscribe(data => this.selectedEstado = data);
    this.fabricanteService.getAllBase().subscribe(data => this.selectedFabricanteInsumos = data);
    this.categoriasInsumosService.getAllBase().subscribe(data => this.selectedCategoriaInsumos = data);
    this.subcategoriasInsumosService.getAll().subscribe(data => this.selectedSubcategoriaInsumos = data);
  }

  private establecerValoresIniciales(): void {
    // Se establecen solo los valores que vienen del pedido original (categorías).
    // Los datos del formulario (Estado, Precio, etc.) ya fueron cargados por el componente padre
    // desde el borrador guardado o con valores por defecto.
    this.form.patchValue({
      FabricanteInsumo: this.articulo.FabricanteArticulo,
      CateInsumo: this.articulo.CategoriaArticulo,
      SubCategoriaInsumo: this.articulo.SubcategoriaArticulo,
      IdPedido: this.articulo.IdCodigoPedidoFK
    }, { emitEvent: false }); // Se usa emitEvent: false para no disparar el autoguardado al inicializar.

    this.cdr.detectChanges();
  }

  private cargarDatosDinamicosDelArticulo(): void {
    this.categorias.find(this.articulo.IdModeloPK).subscribe((data: CategoriasInsumosBase[]) => {
      if (data && data.length > 0) {
        this.ImagePath = this.getImagePath(data[0].LinkImagen);
        this.cdr.markForCheck();
      }
    });
  }


  // ✅ CORREGIDO: Función robusta para manejar strings y nulos
  private formatNumber(value: number | string | null): string {
    if (value === null || value === '') {
      return '0.00';
    }
    const num = parseFloat(String(value));
    if (isNaN(num)) {
      return '0.00';
    }
    return num.toFixed(2);
  }

  private getImagePath(imageName: string | null): string {
    const baseUrl = 'http://localhost:3000/img-insumos';
    return imageName ? `${baseUrl}/${imageName}` : `${baseUrl}/kingston-32gb-clase10.jpg`;
  }

  get costoFinalIngreso(): number {
    const precioBase = parseFloat(this.form?.value?.PrecioBase || '0');
    const cantidad = parseFloat(this.form?.value?.Cantidad || '1');
    const costoDistribuido = parseFloat(this.form?.value?.CostoDistribuido || '0');
    return (precioBase * cantidad) + costoDistribuido;
  }

  get f() {

    return this.form.controls;

  }


}
