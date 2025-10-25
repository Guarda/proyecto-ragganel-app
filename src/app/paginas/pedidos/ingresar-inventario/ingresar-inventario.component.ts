import { CommonModule, NgFor } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router'; // Importar ActivatedRoute y Router
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatStep, MatStepper, MatStepperNext, MatStepperPrevious } from '@angular/material/stepper';

import { IngresarAccesoriosPedidoComponent } from '../controles-ingresar-inventario/ingresar-accesorios-pedido/ingresar-accesorios-pedido.component';
import { IngresarInsumosPedidoComponent } from '../controles-ingresar-inventario/ingresar-insumos-pedido/ingresar-insumos-pedido.component';
import { IngresarProductosPedidoComponent } from '../controles-ingresar-inventario/ingresar-productos-pedido/ingresar-productos-pedido.component';
import { MatDialog } from '@angular/material/dialog';
import { DescargarExcelDialogComponent } from '../../../utiles/reportes/descargar-excel-dialog/descargar-excel-dialog.component';

import { PedidoService } from '../../../services/pedido.service';
import { Articulo } from '../../interfaces/articulo-pedido';
import { ExcelService } from '../../../services/excel.service';
import { MatButtonModule } from '@angular/material/button';

import { CostoDistribucionService, CostosPedido } from '../../../services/costo-distribucion.service';
import { debounceTime, distinctUntilChanged, switchMap, take } from 'rxjs/operators';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBar } from '@angular/material/progress-bar';
import { PreIngresoService } from '../../../services/pre-ingreso.service';
import { AuthService } from '../../../UI/session/auth.service';
import { PreIngresoProducto } from '../../interfaces/pre-ingreso-producto';
import { PreIngresoAccesorio } from '../../interfaces/pre-ingreso-accesorio';
import { PreIngresoInsumo } from '../../interfaces/pre-ingreso-insumo';
import { forkJoin } from 'rxjs';
import { DistributionChoiceDialogComponent } from '../dialogs-pedido/preferencia-distribucion/distribution-choice-dialog.component';
import { CostDistributionDialogComponent } from '../dialogs-pedido/distribucion-costo/cost-distribution-dialog.component';

@Component({
    selector: 'app-ingresar-inventario',
    imports: [MatStepper, MatButtonModule, MatFormField, MatLabel, NgFor, MatStep, ReactiveFormsModule, CommonModule, MatInput, MatCardModule,
        IngresarProductosPedidoComponent, IngresarInsumosPedidoComponent, IngresarAccesoriosPedidoComponent, MatStepperNext, MatProgressBar, MatStepperPrevious, CommonModule],
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
  usuarioId!: number; // Para guardar el ID del usuario logueado
  @ViewChild(MatStepper) stepper!: MatStepper;

  constructor(
    private fb: FormBuilder,
    private pedidoService: PedidoService,
    private cdr: ChangeDetectorRef,
    private excelService: ExcelService,
    private dialog: MatDialog,
    public costoService: CostoDistribucionService,
    private route: ActivatedRoute,
    private router: Router,
    private preIngresoService: PreIngresoService, // <-- INYECTAR NUEVO SERVICIO
    private authService: AuthService // <-- INYECTAR SERVICIO DE AUTH
  ) { }

  ngOnInit(): void {
    // Obtenemos el ID del pedido desde los parámetros de la URL
    const idFromRoute = this.route.snapshot.paramMap.get('CodigoPedido');
    if (!idFromRoute) {
      console.error("No se encontró el código del pedido en la URL.");
      this.router.navigate(['/home/listado-pedidos']); // Redirigir si no hay ID
      return;
    }
    this.OrderId = idFromRoute;

    // Obtenemos el ID del usuario logueado primero
    this.authService.getUser().pipe(take(1)).subscribe(user => {
      if (!user) {
        console.error("No se pudo obtener el usuario. Redirigiendo al login.");
        this.router.navigate(['/login']);
        return;
      }
      this.usuarioId = user.id;

      // Una vez que tenemos OrderId y usuarioId, cargamos todos los datos iniciales.
      this.cargarDatosIniciales();
    });
  }

  cargarDatosIniciales(): void {
    // Cargar detalles del pedido para el servicio de costos
    this.pedidoService.find(this.OrderId).subscribe((respuesta: any) => {
      if (respuesta && respuesta.length > 0) {
        const pedido = respuesta[0];
        // ✅ CORREGIDO: Se convierten los costos a número para evitar errores de concatenación.
        const impuestos = parseFloat(pedido.Impuestos || '0');
        const shippingUSA = parseFloat(pedido.ShippingUSA || '0');
        const shippingNIC = parseFloat(pedido.ShippingNIC || '0');
        this.costoService.setCostosIniciales(impuestos, shippingUSA, shippingNIC);
        // Una vez cargados los costos, preguntamos al usuario cómo distribuirlos
        this.abrirDialogoDeEleccion();
      } else {
        console.error("Error: No se encontraron datos para el pedido.");
        this.costoService.setCostosIniciales(0, 0, 0);
      }
    });

    // Cargar el progreso guardado y luego los artículos del pedido
    this.preIngresoService.loadAllPreIngresoData(this.OrderId, this.usuarioId).subscribe(([productosRes, accesoriosRes, insumosRes]) => {
      const preIngresadosProductos: PreIngresoProducto[] = productosRes.data || [];
      const preIngresadosAccesorios: PreIngresoAccesorio[] = accesoriosRes.data || [];
      const preIngresadosInsumos: PreIngresoInsumo[] = insumosRes.data || [];

      this.pedidoService.getArticlesbyOrderId(this.OrderId).subscribe((data: Articulo[]) => {
        this.productos = data.filter(a => a.TipoArticuloFK === 1);
        this.accesorios = data.filter(a => a.TipoArticuloFK === 2);
        this.insumos = data.filter(a => a.TipoArticuloFK === 3);

        // Limpiar arrays de formularios antes de regenerarlos
        this.formulariosProductos = [];
        this.formulariosAccesorios = [];
        this.formulariosInsumos = [];

        // Generar formularios pasando los datos de pre-ingreso correspondientes
        this.generarFormularioProductos(this.productos, this.formulariosProductos, preIngresadosProductos);
        this.generarFormularioAccesorios(this.accesorios, this.formulariosAccesorios, preIngresadosAccesorios);
        this.generarFormularioInsumos(this.insumos, this.formulariosInsumos, preIngresadosInsumos);

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
    });
  }

  ngOnDestroy(): void {
    this.costoService.reset();
  }

  abrirDialogoDeEleccion(): void {
    const costosAdicionales = this.costoService.getCostosAdicionalesTotales();
    // Si no hay costos adicionales, no mostramos el diálogo.
    if (costosAdicionales <= 0) {
      return;
    }

    const dialogRef = this.dialog.open(DistributionChoiceDialogComponent, {
      width: '400px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(choice => {
      if (choice === 'inteligente') {
        this.abrirDialogoDistribucionInteligente(costosAdicionales);
      }
      // Si es 'manual', no hacemos nada y el usuario lo hará a mano.
    });
  }

  abrirDialogoDistribucionInteligente(costosAdicionales: number): void {
    const dialogRef = this.dialog.open(CostDistributionDialogComponent, {
      width: '600px',
      disableClose: true,
      data: {
        idPedido: this.OrderId,
        costosTotales: costosAdicionales
      }
    });

    dialogRef.afterClosed().subscribe(distribuciones => {
      if (distribuciones) {
        this.aplicarCostosDistribuidos(distribuciones, costosAdicionales);
      }
    });
  }

  aplicarCostosDistribuidos(distribuciones: any[], costosTotales: number): void {
    const todosLosFormularios = [...this.formulariosProductos, ...this.formulariosAccesorios, ...this.formulariosInsumos];
  
    distribuciones.forEach(dist => {
      const costoPorModelo = costosTotales * (dist.PorcentajeAsignado / 100);
      
      const formulariosCoincidentes = todosLosFormularios
        .filter(form => 
            form.get('articuloId')?.value === dist.IdModeloFK &&
            form.get('tipoId')?.value === dist.TipoArticuloFK);

      if (formulariosCoincidentes.length > 0) {
        // Si es un Insumo (Tipo 3), se aplica el costo total del modelo al único formulario.
        if (dist.TipoArticuloFK === 3) {
          formulariosCoincidentes[0].get('CostoDistribuido')?.patchValue(costoPorModelo.toFixed(2));
        } else {
          // Para Productos y Accesorios, se calcula el costo por unidad y se aplica a cada formulario.
          const costoPorUnidad = costoPorModelo / dist.CantidadEnPedido;
          formulariosCoincidentes.forEach(form => {
            form.get('CostoDistribuido')?.patchValue(costoPorUnidad.toFixed(2));
          });
        }
      }
    });
  }

  // ✅ 5. Añade el campo 'CostoDistribuido' a cada método que genera formularios
  private generarFormularioProductos(productos: Articulo[], formularioArray: FormGroup[], preIngresados: PreIngresoProducto[]) {
    productos.forEach(producto => {
      for (let i = 0; i < producto.Cantidad; i++) {
        const formIndex = formularioArray.length;
        const form = this.fb.group({
          articuloId: [producto.IdModeloPK],
          nombre: [producto.NombreCategoria],
          tipoId: [producto.TipoArticuloFK], // ✅ AÑADIDO: Campo para el ID numérico del tipo.
          tipo: [producto.TipoArticulo],
          cantidad: [1, [Validators.required, Validators.min(1)]],
          NumeroSerie: [''],
          ColorConsola: [''],
          EstadoConsola: [null as number | null, Validators.required],
          PrecioBase: [null as number | null, Validators.required],
          CostoDistribuido: [0, [Validators.required, Validators.min(0)]], // <-- AÑADIDO
          HackConsola: ['0', Validators.required], // Valor por defecto
          Accesorios: this.fb.control<string[] | null>(null),
          ComentarioConsola: [''],
          TodoList: this.fb.control<string[] | null>(null),
          Fabricante: [null, Validators.required],
          Cate: [null, Validators.required],
          SubCategoria: [null, Validators.required],
          ProductosCompatibles: this.fb.control<string[] | null>(null),
          IdPedido: [this.OrderId]
        });

        // Cargar datos pre-guardados si existen para este índice
        const dataGuardada: PreIngresoProducto | undefined = preIngresados.find(p => p.FormIndex === formIndex); // <-- TIPADO FUERTE
        console.log('Datos guardados encontrados para el formulario', formIndex, ':', dataGuardada);
        if (dataGuardada && dataGuardada.IdPreIngresoProductoPK) {
          // Convertimos los strings de vuelta a arrays para los chips.
          // Si el string está vacío o es nulo, creamos un array vacío.
          const accesoriosArray = dataGuardada.Accesorios ? dataGuardada.Accesorios.split(',') : [];
          const todoListArray = dataGuardada.TareasPendientes ? dataGuardada.TareasPendientes.split(',') : [];
          // Si hay un borrador guardado, lo cargamos.
          // Si hay un borrador guardado, lo cargamos.
          form.patchValue({
            ColorConsola: dataGuardada.Color, // <-- CORRECCIÓN
            EstadoConsola: dataGuardada.Estado, // El valor del mat-option es numérico
            HackConsola: dataGuardada.Hackeado.toString(), // <-- CORRECCIÓN
            PrecioBase: dataGuardada.PrecioBase, // El input es de tipo 'number'
            ComentarioConsola: dataGuardada.Comentario, // <-- CORRECCIÓN
            NumeroSerie: dataGuardada.NumeroSerie || '',
            Accesorios: accesoriosArray,
            TodoList: todoListArray, // <-- CORRECCIÓN
            CostoDistribuido: dataGuardada.CostoDistribuido
          }, { emitEvent: false }); // No disparar valueChanges al cargar datos
        } else {
          // Si no hay borrador, establecemos valores por defecto del artículo original del pedido.
          form.patchValue({
            PrecioBase: producto.Precio || 0, // Precio original del pedido, asegurando que no sea nulo.
            HackConsola: '0' // Valor por defecto
          }, { emitEvent: false }); // No disparar valueChanges para valores por defecto
        }

        // Lógica de autoguardado
        form.valueChanges.pipe(
          debounceTime(1500), // Espera 1.5s después de que el usuario deja de escribir
          distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
          switchMap(formValue => {
            const payload = { ...formValue, idPedido: this.OrderId, usuarioId: this.usuarioId, formIndex };
            return this.preIngresoService.saveProduct(payload);
          })
        ).subscribe({
          next: () => console.log(`Formulario ${formIndex} guardado.`),
          error: (err) => console.error(`Error al guardar formulario ${formIndex}:`, err)
        });

        formularioArray.push(form);
      }
    });
  }

  private generarFormularioAccesorios(accesorios: Articulo[], formularioArray: FormGroup[], preIngresados: PreIngresoAccesorio[]) {
    accesorios.forEach(accesorio => {
      for (let i = 0; i < accesorio.Cantidad; i++) {
        const formIndex = formularioArray.length;
        const form = this.fb.group({
          articuloId: [accesorio.IdModeloPK],
          nombre: [accesorio.NombreCategoria],
          tipoId: [accesorio.TipoArticuloFK], // ✅ AÑADIDO: Campo para el ID numérico del tipo.
          tipo: [accesorio.TipoArticulo],
          cantidad: [1, [Validators.required, Validators.min(1)]],
          NumeroSerie: [''],
          ColorAccesorio: [''],
          EstadoAccesorio: [null as number | null, Validators.required],
          PrecioBase: [accesorio.Precio || null, Validators.required],
          CostoDistribuido: [0, [Validators.required, Validators.min(0)]], // <-- AÑADIDO
          FabricanteAccesorio: [null, Validators.required],
          CateAccesorio: [null, Validators.required],
          SubCategoriaAccesorio: [null, Validators.required],
          TodoList: this.fb.control<string[] | null>(null),
          ComentarioAccesorio: [''],
          ProductosCompatibles: this.fb.control<string[] | null>(null),
          IdPedido: [this.OrderId]
        });

        const dataGuardada: PreIngresoAccesorio | undefined = preIngresados.find(p => p.FormIndex === formIndex);
        if (dataGuardada && dataGuardada.IdPreIngresoAccesorioPK) {
          console.log('Datos guardados encontrados para el formulario de accesorio', formIndex, ':', dataGuardada);
          const compatiblesArray = dataGuardada.ProductosCompatibles ? dataGuardada.ProductosCompatibles.split(',') : [];
          const todoListArray = dataGuardada.TareasPendientes ? dataGuardada.TareasPendientes.split(',') : [];

          form.patchValue({
            ColorAccesorio: dataGuardada.ColorAccesorio,
            EstadoAccesorio: dataGuardada.EstadoAccesorio,
            PrecioBase: dataGuardada.PrecioBase,
            CostoDistribuido: dataGuardada.CostoDistribuido,
            ComentarioAccesorio: dataGuardada.Comentario,
            NumeroSerie: dataGuardada.NumeroSerie,
            ProductosCompatibles: compatiblesArray,
            TodoList: todoListArray
          }, { emitEvent: false });
        }

        form.valueChanges.pipe(
          debounceTime(1500),
          distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
          switchMap(formValue => {
            const payload = { ...formValue, idPedido: this.OrderId, usuarioId: this.usuarioId, formIndex };
            return this.preIngresoService.saveAccessory(payload);
          })
        ).subscribe({
          next: () => console.log(`Formulario de accesorio ${formIndex} guardado.`),
          error: (err) => console.error(`Error al guardar formulario de accesorio ${formIndex}:`, err)
        });

        formularioArray.push(form);
      }
    });
  }

  private generarFormularioInsumos(insumos: Articulo[], formularioArray: FormGroup[], preIngresados: PreIngresoInsumo[]) {
    insumos.forEach(insumo => {
      // Para insumos, no iteramos por cantidad, es un solo formulario por tipo de insumo.
      const formIndex = formularioArray.length;
      const form = this.fb.group({
        articuloId: [insumo.IdModeloPK],
        nombre: [insumo.NombreCategoria],
        tipoId: [insumo.TipoArticuloFK], // ✅ AÑADIDO: Campo para el ID numérico del tipo.
        NumeroSerie: [''], // ✅ CORREGIDO: Se añade el validador requerido.
        tipo: [insumo.TipoArticulo],
        Cantidad: [insumo.Cantidad, [Validators.required, Validators.min(1)]],
        EstadoInsumo: [null as number | null, Validators.required],
        StockMinimo: [null as number | null, Validators.required],
        PrecioBase: [insumo.Precio || null, Validators.required],
        CostoDistribuido: [0, [Validators.required, Validators.min(0)]], // <-- AÑADIDO
        FabricanteInsumo: [null, Validators.required],
        CateInsumo: [null, Validators.required],
        SubCategoriaInsumo: [null, Validators.required],
        ComentarioInsumo: [''],
        IdPedido: [this.OrderId]
      });

      const dataGuardada: PreIngresoInsumo | undefined = preIngresados.find(p => p.FormIndex === formIndex);
      if (dataGuardada && dataGuardada.IdPreIngresoInsumoPK) {
        form.patchValue({
          EstadoInsumo: dataGuardada.EstadoInsumo,
          StockMinimo: dataGuardada.StockMinimo,
          PrecioBase: dataGuardada.PrecioBase,
          CostoDistribuido: dataGuardada.CostoDistribuido,
          ComentarioInsumo: dataGuardada.Comentario,
          NumeroSerie: dataGuardada.NumeroSerie,
          Cantidad: dataGuardada.Cantidad
        }, { emitEvent: false });
      }

      form.valueChanges.pipe(
        debounceTime(1500),
        distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
        switchMap(formValue => {
          const payload = { ...formValue, idPedido: this.OrderId, usuarioId: this.usuarioId, formIndex };
          return this.preIngresoService.saveSupply(payload);
        })
      ).subscribe({
        next: () => console.log(`Formulario de insumo ${formIndex} guardado.`),
        error: (err) => console.error(`Error al guardar formulario de insumo ${formIndex}:`, err)
      });

      formularioArray.push(form);
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
      IdUsuario: this.usuarioId, // ✅ CORRECCIÓN: Se añade el ID del usuario.

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
            // Limpiar datos temporales después de finalizar
            this.preIngresoService.deletePreIngresoData(this.OrderId, this.usuarioId).subscribe({
              next: () => console.log('Datos de pre-ingreso eliminados.'),
              error: (err) => console.error('Error al eliminar datos de pre-ingreso:', err)
            });
            excelDialogRef.afterClosed().subscribe(() => {
              this.router.navigate(['/home/listado-pedidos']); // Navegar de vuelta
            });
          } else {
            console.log("No se encontraron códigos generados. Cerrando.");
            this.router.navigate(['/home/listado-pedidos']); // Navegar de vuelta
          }
        } else {
          console.log("La respuesta del servidor no tiene el formato esperado. Cerrando.");
          this.router.navigate(['/home/listado-pedidos']); // Navegar de vuelta
        }
      },
      error => {
        console.error("Error al enviar el inventario", error);
        this.router.navigate(['/home/listado-pedidos']); // Navegar de vuelta incluso con error
      }
    );
  }

  goBack() {
    this.stepper.previous();
    this.cdr.detectChanges();
  }

  cancelar() {
    // Navega de vuelta a la lista de pedidos
    this.router.navigate(['/home/listado-pedidos']);
  }
}