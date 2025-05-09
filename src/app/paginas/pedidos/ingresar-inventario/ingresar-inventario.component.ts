import { CommonModule, NgFor } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatStep, MatStepper, MatStepperNext, MatStepperPrevious } from '@angular/material/stepper';

import { IngresarAccesoriosPedidoComponent } from '../controles-ingresar-inventario/ingresar-accesorios-pedido/ingresar-accesorios-pedido.component';
import { IngresarInsumosPedidoComponent } from '../controles-ingresar-inventario/ingresar-insumos-pedido/ingresar-insumos-pedido.component';
import { IngresarProductosPedidoComponent } from '../controles-ingresar-inventario/ingresar-productos-pedido/ingresar-productos-pedido.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { DescargarExcelDialogComponent } from '../../../utiles/reportes/descargar-excel-dialog/descargar-excel-dialog.component';

import { PedidoService } from '../../../services/pedido.service';
import { Articulo } from '../../interfaces/articulo-pedido';
import { ExcelService } from '../../../services/excel.service';
import { MatButton } from '@angular/material/button';


@Component({
  selector: 'app-ingresar-inventario',
  standalone: true,
  imports: [MatStepper, MatButton, MatFormField, MatLabel, NgFor, MatStep, ReactiveFormsModule, CommonModule, MatInput,
    IngresarProductosPedidoComponent, IngresarInsumosPedidoComponent, IngresarAccesoriosPedidoComponent, MatDialogContent, MatDialogClose, MatStepperNext, MatStepperPrevious],
  templateUrl: './ingresar-inventario.component.html',
  styleUrl: './ingresar-inventario.component.css'
})
export class IngresarInventarioComponent implements OnInit {
  // articulos: Articulo[] = [];
  // formularios: FormGroup[] = [];

  productos: Articulo[] = [];
  accesorios: Articulo[] = [];
  insumos: Articulo[] = [];

  formulariosProductos: FormGroup[] = [];
  formulariosAccesorios: FormGroup[] = [];
  formulariosInsumos: FormGroup[] = [];

  OrderId: any;
  @ViewChild(MatStepper) stepper!: MatStepper;

  constructor(
    private fb: FormBuilder,
    private pedidoService: PedidoService,
    private cdr: ChangeDetectorRef,
    private excelService: ExcelService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<IngresarInventarioComponent>, // Agregar esto
    @Inject(MAT_DIALOG_DATA) public data: { idPedido: string }
  ) { }

  ngOnInit(): void {
    this.OrderId = this.data.idPedido;

    this.pedidoService.getArticlesbyOrderId(this.OrderId).subscribe((data: Articulo[]) => {
      // Filtrar por tipo de artículo
      this.productos = data.filter(articulo => articulo.TipoArticuloFK === 1);
      this.accesorios = data.filter(articulo => articulo.TipoArticuloFK === 2);
      this.insumos = data.filter(articulo => articulo.TipoArticuloFK === 3);

      // Inicializar formularios
      this.formulariosProductos = [];
      this.formulariosAccesorios = [];
       this.formulariosInsumos = [];

      // Generar formularios específicos
      this.generarFormularioProductos(this.productos, this.formulariosProductos);
      this.generarFormularioAccesorios(this.accesorios, this.formulariosAccesorios);
      this.generarFormularioInsumos(this.insumos, this.formulariosInsumos);


      this.cdr.detectChanges();
    });
  }

  private generarFormularioProductos(productos: Articulo[], formularioArray: FormGroup[]) {
    productos.forEach(producto => {
      for (let i = 0; i < producto.Cantidad; i++) {
        formularioArray.push(this.fb.group({
          articuloId: [producto.IdModeloPK],
          nombre: [producto.NombreCategoria],
          tipo: [producto.TipoArticulo],
          cantidad: [1, [Validators.required, Validators.min(1)]],
          NumeroSerie: [''],
          ColorConsola: [''],
          EstadoConsola: ['', Validators.required],
          PrecioBase: ['', Validators.required],
          HackConsola: ['', Validators.required],
          Accesorios: [''],
          ComentarioConsola: [''],
          TodoList: [''],
          Fabricante: ['', Validators.required],
          Cate: ['', Validators.required],
          SubCategoria: ['', Validators.required],
          ProductosCompatibles: [''],
          IdPedido: [this.OrderId]
        }));
      }
    });
  }

  private generarFormularioAccesorios(accesorios: Articulo[], formularioArray: FormGroup[]) {
    accesorios.forEach(accesorio => {
      for (let i = 0; i < accesorio.Cantidad; i++) {
        formularioArray.push(this.fb.group({
          articuloId: [accesorio.IdModeloPK],
          nombre: [accesorio.NombreCategoria],
          tipo: [accesorio.TipoArticulo],
          cantidad: [1, [Validators.required, Validators.min(1)]],
          NumeroSerie: [''],
          ColorAccesorio: [''],
          EstadoAccesorio: ['', Validators.required],
          PrecioBase: [accesorio.Precio, Validators.required],
          FabricanteAccesorio: ['', Validators.required],
          CateAccesorio: ['', Validators.required],
          SubCategoriaAccesorio: ['', Validators.required],
          TodoList: [''],
          ComentarioAccesorio: [''],
          ProductosCompatibles: [''],
          IdPedido: [this.OrderId]
        }));

      }
    });
  }

  private generarFormularioInsumos(insumos: Articulo[], formularioArray: FormGroup[]) {
    insumos.forEach(insumo => {
      formularioArray.push(this.fb.group({
        articuloId: [insumo.IdModeloPK],
        nombre: [insumo.NombreCategoria],
        NumeroSerie: [''],
        tipo: [insumo.TipoArticulo],
        Cantidad: [insumo.Cantidad, [Validators.required, Validators.min(1)]],
        EstadoInsumo: ['', Validators.required],
        StockMinimo: ['', Validators.required],
        PrecioBase: [insumo.Precio, Validators.required],
        FabricanteInsumo: ['', Validators.required],
        CateInsumo: ['', Validators.required],
        SubCategoriaInsumo: ['', Validators.required],
        ComentarioInsumo: [''],
        IdPedido: [this.OrderId]
      }));
    });
  }
  


  getArticuloIndex(i: number, tipo: 'producto' | 'accesorio'): number {
    let count = 0;
    const lista = tipo === 'producto' ? this.productos : this.accesorios;

    for (let j = 0; j < lista.length; j++) {
      count += lista[j].Cantidad;
      if (i < count) {
        return j;
      }
    }
    return 0;
  }


  recibirFormulario(form: FormGroup) {
    if (form.valid) {
      console.log("Formulario válido.");
      //this.stepper.next();
    } else {
      console.log("El formulario no es válido:", form);
    }
  }

  finalizar(form: FormGroup) {
    console.log(form);
    this.recibirFormulario(form);

    if (form.valid) {
      this.enviarInventario();
      this.dialogRef.close(true); // Cierra la ventana y envía 'true' al padre
    }
  }

  enviarInventario() {
    // Recopilar datos de todos los formularios
    const productosData = this.formulariosProductos.map(f => f.value);
    const accesoriosData = this.formulariosAccesorios.map(f => f.value);
    const insumosData = this.formulariosInsumos.map(f => f.value);

    const inventarioCompleto = {
      idPedido: this.OrderId,
      productos: productosData,
      accesorios: accesoriosData,
      insumos: insumosData
    };

    console.log("Enviando inventario:", inventarioCompleto);




    this.pedidoService.ingresarInventario(inventarioCompleto).subscribe(
      response => {
        console.log("Inventario enviado correctamente", response);

        if (response.codigosGenerados) {
          // Abre el diálogo para confirmar la descarga del Excel
          this.dialog.open(DescargarExcelDialogComponent, {
            width: '400px',
            data: { codigosGenerados: response.codigosGenerados, orderId: this.OrderId }
          });
        }

        this.dialogRef.close(true); // Cierra el diálogo de ingreso de inventario
      },
      error => {
        console.error("Error al enviar el inventario", error);
      }
    );
  }

  goBack() {
    this.stepper.previous();
    this.cdr.detectChanges(); // 🔥 Forzar actualización de la vista
  }
}