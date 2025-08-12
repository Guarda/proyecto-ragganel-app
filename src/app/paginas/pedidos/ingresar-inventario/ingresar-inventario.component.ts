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
import { Pedido } from '../../interfaces/pedido';

import { CostoDistribucionService, CostosPedido } from '../../../services/costo-distribucion.service';
import { map } from 'rxjs/operators'; // Necesitarás 'map'
import { MatCardModule } from '@angular/material/card';
import { MatProgressBar } from '@angular/material/progress-bar';


@Component({
  selector: 'app-ingresar-inventario',
  standalone: true,
  imports: [MatStepper, MatButton, MatFormField, MatLabel, NgFor, MatStep, ReactiveFormsModule, CommonModule, MatInput, MatCardModule,
    IngresarProductosPedidoComponent, IngresarInsumosPedidoComponent, IngresarAccesoriosPedidoComponent, MatDialogContent, MatDialogClose, MatStepperNext, MatProgressBar, MatStepperPrevious, MatDialogActions],
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
    public costoService: CostoDistribucionService,
    private dialogRef: MatDialogRef<IngresarInventarioComponent>, // Agregar esto
    @Inject(MAT_DIALOG_DATA) public data: { idPedido: string }
  ) { }

  ngOnInit(): void {
    this.OrderId = this.data.idPedido;

    // Archivo: ingresar-inventario.component.ts

    this.pedidoService.find(this.OrderId).subscribe((respuesta: any) => {
      // 1. Verifica que la respuesta sea un array y que no esté vacío
      if (respuesta && respuesta.length > 0) {

        // 2. Extrae el primer objeto (el pedido) del array
        const pedido = respuesta[0];

        console.log('Objeto del Pedido a usar:', pedido); // Log para confirmar

        // 3. Pasa los valores al servicio usando el objeto 'pedido' y los nombres correctos
        this.costoService.setCostosIniciales(
          pedido.Impuestos || 0,
          pedido.ShippingUSA || 0, // Corregido de EnvioUSA a ShippingUSA
          pedido.ShippingNIC || 0  // Corregido de EnvioNIC a ShippingNIC
        );

      } else {
        console.error("Error: No se encontraron datos para el pedido o la respuesta está vacía.");
        // Opcional: inicializar costos en 0 si no hay datos
        this.costoService.setCostosIniciales(0, 0, 0);
      }
    });

    // Tu lógica existente para obtener los artículos
    this.pedidoService.getArticlesbyOrderId(this.OrderId).subscribe((data: Articulo[]) => {
      this.productos = data.filter(articulo => articulo.TipoArticuloFK === 1);
      this.accesorios = data.filter(articulo => articulo.TipoArticuloFK === 2);
      this.insumos = data.filter(articulo => articulo.TipoArticuloFK === 3);

      this.formulariosProductos = [];
      this.formulariosAccesorios = [];
      this.formulariosInsumos = [];

      // Generar formularios (ahora con el campo CostoDistribuido)
      this.generarFormularioProductos(this.productos, this.formulariosProductos);
      this.generarFormularioAccesorios(this.accesorios, this.formulariosAccesorios);
      this.generarFormularioInsumos(this.insumos, this.formulariosInsumos);

      // ✅ 4. Suscribirse a los cambios de cada formulario para actualizar el total distribuido
      const todosLosFormularios = [
        ...this.formulariosProductos,
        ...this.formulariosAccesorios,
        ...this.formulariosInsumos
      ];

      todosLosFormularios.forEach(form => {
        form.get('CostoDistribuido')?.valueChanges.subscribe(() => {
          this.costoService.actualizarDistribucion(todosLosFormularios);
        });
      });

      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.costoService.reset();
  }

  // ✅ 5. Añade el campo 'CostoDistribuido' a cada método que genera formularios
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
          CostoDistribuido: [0, [Validators.required, Validators.min(0)]], // <-- AÑADIDO
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
          CostoDistribuido: [0, [Validators.required, Validators.min(0)]], // <-- AÑADIDO
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
        CostoDistribuido: [0, [Validators.required, Validators.min(0)]], // <-- AÑADIDO
        FabricanteInsumo: ['', Validators.required],
        CateInsumo: ['', Validators.required],
        SubCategoriaInsumo: ['', Validators.required],
        ComentarioInsumo: [''],
        IdPedido: [this.OrderId]
      }));
    });
  }

  get totalFormularios(): number {
    return this.formulariosProductos.length + this.formulariosAccesorios.length + this.formulariosInsumos.length;
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
    if (!form.valid) {
      console.log("El formulario no es válido:", form);
    }
  }

  get currentArticle(): Articulo | null {
    if (!this.stepper || !this.stepper.selected) {
      return null;
    }

    const currentIndex = this.stepper.selectedIndex;
    const totalProductos = this.formulariosProductos.length;
    const totalAccesorios = this.formulariosAccesorios.length;

    if (currentIndex < totalProductos) {
      // Es un producto
      const productoIndex = this.getArticuloIndex(currentIndex, 'producto');
      return this.productos[productoIndex];
    } else if (currentIndex < totalProductos + totalAccesorios) {
      // Es un accesorio
      const accesorioFormIndex = currentIndex - totalProductos;
      const accesorioIndex = this.getArticuloIndex(accesorioFormIndex, 'accesorio');
      return this.accesorios[accesorioIndex];
    } else {
      // Es un insumo
      const insumoIndex = currentIndex - totalProductos - totalAccesorios;
      return this.insumos[insumoIndex];
    }
  }

  finalizar(form: FormGroup) {
    if (form.valid) {
      this.enviarInventario();
    } else {
      console.log("El último formulario no es válido:", form);
      // Opcional: mostrar una alerta al usuario
    }
  }

  enviarInventario() {
    const inventarioCompleto = {
      idPedido: this.OrderId,

      // ✅ 1. PROCESAMIENTO PARA PRODUCTOS
      productos: this.formulariosProductos.map(f => {
        const formValue = f.value;
        // Se calcula el precio final sumando el costo distribuido
        const precioFinal = (parseFloat(formValue.PrecioBase) || 0) + (parseFloat(formValue.CostoDistribuido) || 0);

        // Se devuelve un nuevo objeto con el PrecioBase actualizado
        return {
          ...formValue,
          PrecioBase: precioFinal.toFixed(2)
        };
      }),

      // ✅ 2. PROCESAMIENTO PARA ACCESORIOS (misma lógica que productos)
      accesorios: this.formulariosAccesorios.map(f => {
        const formValue = f.value;
        const precioFinal = (parseFloat(formValue.PrecioBase) || 0) + (parseFloat(formValue.CostoDistribuido) || 0);

        return {
          ...formValue,
          PrecioBase: precioFinal.toFixed(2)
        };
      }),

      // ✅ 3. PROCESAMIENTO PARA INSUMOS (lógica especial por cantidad)
      insumos: this.formulariosInsumos.map(f => {
        const formValue = f.value;
        const cantidad = parseInt(formValue.Cantidad, 10) || 1; // Asegurar que la cantidad sea un número

        // Se divide el costo distribuido entre la cantidad de insumos
        const costoAdicionalPorUnidad = (parseFloat(formValue.CostoDistribuido) || 0) / cantidad;

        // Se suma ese costo adicional al precio base de cada unidad
        const precioFinalPorUnidad = (parseFloat(formValue.PrecioBase) || 0) + costoAdicionalPorUnidad;

        return {
          ...formValue,
          PrecioBase: precioFinalPorUnidad.toFixed(2)
        };
      })
    };

    console.log("Enviando inventario con costos finales:", inventarioCompleto);

    // Lógica para manejar la respuesta del servidor y el diálogo de Excel
    this.pedidoService.ingresarInventario(inventarioCompleto).subscribe(
      response => {
        console.log("RESPUESTA COMPLETA DEL SERVIDOR:", response);
        if (response && response.length > 0 && response[0].Resultado) {
          let resultadoData;
          try {
            resultadoData = JSON.parse(response[0].Resultado);
          } catch (e) {
            resultadoData = response[0].Resultado;
          }
          console.log("DATOS PROCESADOS:", resultadoData);
          if (resultadoData && resultadoData.codigosIngresados) {
            const excelDialogRef = this.dialog.open(DescargarExcelDialogComponent, {
              width: '450px',
              data: {
                codigosGenerados: resultadoData.codigosIngresados,
                cantidades: resultadoData.cantidades,
                orderId: this.OrderId
              }
            });
            excelDialogRef.afterClosed().subscribe(() => {
              this.dialogRef.close(true);
            });
          } else {
            console.log("No se encontraron códigos generados. Cerrando.");
            this.dialogRef.close(true);
          }
        } else {
          console.log("La respuesta del servidor no tiene el formato esperado. Cerrando.");
          this.dialogRef.close(true);
        }
      },
      error => {
        console.error("Error al enviar el inventario", error);
        this.dialogRef.close(false);
      }
    );
  }

  goBack() {
    this.stepper.previous();
    this.cdr.detectChanges();
  }
}