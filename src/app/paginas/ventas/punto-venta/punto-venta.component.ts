import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TablaArticulosVentasComponent } from '../tabla-articulos-ventas/tabla-articulos-ventas.component';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../../../services/carrito.service';
import { ArticuloVenta } from '../../interfaces/articuloventa';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { ClientesService } from '../../../services/clientes.service';
import { Cliente } from '../../interfaces/clientes';
import { CrearClienteComponent } from '../../clientes/crear-cliente/crear-cliente.component';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, Observable, startWith, Subject, Subscription } from 'rxjs';
import { MatFormField } from '@angular/material/form-field';
import { MatOption } from '@angular/material/core';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MargenesVentas } from '../../interfaces/margenes-ventas';
import { VentasBaseService } from '../../../services/ventas-base.service';
import { MatSelect } from '@angular/material/select';
import { AuthService } from '../../../UI/session/auth.service';

import { ConfirmarVentaDialogComponent } from '../confirmar-venta-dialog/confirmar-venta-dialog.component';
import { VentaFinalData } from '../../interfaces/ventafinal';

import jsPDF from 'jspdf';
import 'jspdf-autotable'; // <-- CAMBIO IMPORTANTE AQUÍ
import { MetodosPago } from '../../interfaces/metodos-pago';
import { Usuarios } from '../../interfaces/usuarios';
import { response } from 'express';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSpinner } from '@angular/material/progress-spinner';
import { ConfirmacionReemplazarCarritoDialog } from '../confirmacion-reemplazar-carrito-dialog/confirmacion-reemplazar-carrito-dialog.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
    selector: 'app-punto-venta',
    imports: [FormsModule, MatInputModule, MatIconButton, ReactiveFormsModule, TablaArticulosVentasComponent,
        CommonModule, MatIcon, MatButton, CrearClienteComponent, MatFormField, MatOption, MatAutocompleteModule,
        MatSelect, MatSpinner, MatSlideToggleModule],
    templateUrl: './punto-venta.component.html',
    styleUrl: './punto-venta.component.css'
})
export class PuntoVentaComponent implements OnInit, OnDestroy {
  public aplicarIVA: boolean = true;
  carrito$: Observable<ArticuloVenta[]> = new Observable();
  carrito: ArticuloVenta[] = [];

  // Añade estas dos propiedades a tu componente
  carritoACargar: any | null = null;
  cargandoCarrito = false;

  clienteControl = new FormControl<string | Cliente>('');
  listaClientes: Cliente[] = [];
  clientesFiltrados: Observable<Cliente[]>;

  usuario!: Usuarios;
  ClienteSeleccionado: Cliente | null = null;

  margenesVenta: MargenesVentas[] = [];
  margenSeleccionado: number | null = null;
  idMargenSeleccionado: number | null = null;
  nombreMargenSeleccionado: string = '';

  metodosPago: MetodosPago[] = [];
  metodoPagoSeleccionado: number | null = null;
  numeroReferenciaTransferencia: string = '';
  observacionesOtros: string = '';

  @ViewChild(TablaArticulosVentasComponent) tablaArticulos!: TablaArticulosVentasComponent;

  private subs = new Subscription();

  constructor(
    private carritoService: CarritoService,
    private clientesService: ClientesService,
    private ventasBaseService: VentasBaseService,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.clientesFiltrados = this.clienteControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      map(value => typeof value === 'string' ? value : value?.nombre || ''), // Usar .nombre
      map(nombre => nombre ? this._filterClientes(nombre as string) : this.listaClientes.slice())
    );
  }

  ngOnInit(): void {
    // Suscripciones existentes
    this.subs.add(this.carritoService.carrito$.subscribe(data => this.carrito = data));
    this.subs.add(this.authService.getUser().subscribe(user => this.usuario = user as unknown as Usuarios));

    // Llamadas para cargar datos iniciales
    this.getClientList(); // Esta función ahora será más inteligente
    this.loadMargenesVenta();
    this.loadMetodosPago();

    // Suscripción al "buzón" del servicio
    this.subs.add(
      this.carritoService.solicitarCargaCarrito$.subscribe(carritoInfo => {
        if (carritoInfo) {
          this.procesarCarritoEntrante(carritoInfo);
        }
      })
    );

    const idProforma = history.state.idProformaACargar;
    if (idProforma) {
      this.iniciarCargaDeProforma(idProforma);
    }
  }

  private iniciarCargaDeProforma(idProforma: number): void {
    // Antes de cargar nada, verificamos si el carrito actual tiene items
    if (this.carrito.length > 0) {
      // Si hay items, mostramos el diálogo de confirmación
      const dialogRef = this.dialog.open(ConfirmacionReemplazarCarritoDialog, {
        width: '450px',
        data: { idProforma: idProforma } // Pasamos el ID para mostrarlo en el mensaje
      });

      dialogRef.afterClosed().subscribe(resultado => {
        if (resultado === true) {
          // El usuario confirmó: limpiar y luego cargar
          this.carritoService.limpiarCarrito(this.usuario, this.ClienteSeleccionado!);
          this.cargarDatosDeProformaEnCarrito(idProforma);
        }
        // Si el resultado es falso (cancelar), no hacemos nada.
      });

    } else {
      // Si el carrito está vacío, no hay conflicto. Cargamos directamente.
      this.cargarDatosDeProformaEnCarrito(idProforma);
    }
  }

  // En punto-venta.component.ts

  private cargarDatosDeProformaEnCarrito(idProforma: number): void {
    this.cargandoCarrito = true;
    this.snackBar.open('Cargando datos de la proforma...', undefined, { duration: 2000 });

    this.ventasBaseService.getProformaDetails(idProforma).subscribe({
      next: (response) => {
        if (response.success) {
          const { proforma, detalles, itemsNoDisponibles } = response.data;

          // 1. Advertir sobre items no disponibles
          if (itemsNoDisponibles.length > 0) {
            const nombresItems = itemsNoDisponibles.map(item => item.CodigoArticulo).join(', ');
            this.snackBar.open(`Atención: Artículos no disponibles: ${nombresItems}`, 'Entendido', { duration: 7000 });
          }

          // 2. Establecer el cliente en la UI
          const clienteEncontrado = this.listaClientes.find(c => c.id === proforma.IdClienteFK);
          if (clienteEncontrado) {
            this.ClienteSeleccionado = clienteEncontrado;
            this.clienteControl.setValue(clienteEncontrado);
          }

          // 3. Pre-llenar otros campos
          this.metodoPagoSeleccionado = proforma.IdMetodoDePagoFK;
          this.observacionesOtros = proforma.Observaciones;

          // ==============================================================
          //  4. POBLAR EL CARRITO (LÓGICA CORREGIDA)
          // ==============================================================

          const detallesDisponibles = detalles.filter(detalle =>
            !itemsNoDisponibles.some(noDisp => noDisp.CodigoArticulo === detalle.CodigoArticulo)
          );

          // Se crea un array de Observables para todas las llamadas a la API
          const llamadasApi = detallesDisponibles.map(item => {
            // Preparamos el cuerpo de la solicitud con TODOS los datos requeridos
            const datosArticulo = {
              IdUsuario: this.usuario.id,
              IdCliente: this.ClienteSeleccionado!.id,
              TipoArticulo: item.TipoArticulo,
              CodigoArticulo: item.CodigoArticulo,
              Cantidad: item.Cantidad,
              PrecioVenta: item.PrecioVenta,
              Descuento: item.Descuento,
              PrecioBaseOriginal: item.PrecioBaseOriginal ?? 0, // Garantiza que sea number
              MargenAplicado: item.MargenAplicado ?? 0,         // Garantiza que sea number
              IdMargenFK: item.IdMargenFK
            };
            // Llamamos al servicio correcto que envía todos los datos al backend
            return this.ventasBaseService.agregarArticuloAlCarrito(datosArticulo);
          });

          // Si hay artículos para agregar, los ejecutamos y luego refrescamos el carrito
          if (llamadasApi.length > 0) {
            // forkJoin(llamadasApi).subscribe({...}) // (Una forma más avanzada)
            // Por simplicidad, ejecutaremos una por una y al final refrescaremos.
            // Para este caso, como `agregarArticuloAlCarrito` ya debe manejar la cantidad, no hace falta un bucle.
            Promise.all(llamadasApi.map(obs => obs.toPromise())).then(() => {
              this.snackBar.open(`Proforma N° ${proforma.NumeroDocumento} cargada.`, 'OK', { duration: 3000 });
              // Al final de todas las operaciones, refrescamos el carrito para sincronizar la UI
              this.carritoService.refrescarCarrito(this.usuario, this.ClienteSeleccionado!).subscribe();
              this.cargandoCarrito = false;
            }).catch(error => {
              console.error("Error al agregar artículos de la proforma", error);
              this.snackBar.open('Uno o más artículos no se pudieron agregar.', 'Cerrar', { duration: 4000 });
              this.cargandoCarrito = false;
            });
          } else {
            this.snackBar.open('No hay artículos disponibles para cargar de esta proforma.', 'OK', { duration: 4000 });
            this.cargandoCarrito = false;
          }

        } else {
          this.snackBar.open(response.error || 'Error al cargar los datos.', 'Cerrar', { duration: 4000 });
          this.cargandoCarrito = false;
        }
      },
      error: (err) => {
        console.error('Error al obtener detalles de la proforma:', err);
        this.snackBar.open(err.error?.error || 'Error de comunicación al cargar la proforma.', 'Cerrar', { duration: 5000 });
        this.cargandoCarrito = false;
      }
    });
  }

  procesarCarritoEntrante(carritoInfo: any): void {
    this.cargandoCarrito = true;
    this.carritoACargar = carritoInfo; // Guardamos el carrito que necesita ser procesado

    // Si la lista de clientes ya se cargó, lo procesamos.
    // Si no, la función getClientList() se encargará cuando termine.
    if (this.listaClientes.length > 0) {
      this.procesarCarritoConClientes();
    }
  }
  private procesarCarritoConClientes(): void {
    if (!this.carritoACargar) {
      this.cargandoCarrito = false;
      return;
    }

    const clienteDelCarrito = this.listaClientes.find(c => c.id === this.carritoACargar.IdClienteFK);

    if (clienteDelCarrito) {
      this.ClienteSeleccionado = clienteDelCarrito;
      this.clienteControl.setValue(clienteDelCarrito);
      this.loadCartForSelectedClient(); // Este método ya refresca el carrito
      this.snackBar.open(`Carrito #${this.carritoACargar.IdCarritoPK} cargado.`, 'OK', { duration: 3000 });
    } else {
      this.snackBar.open('Error: Cliente del carrito no encontrado.', 'Cerrar', { duration: 4000 });
    }

    // Limpiamos las variables de estado
    this.carritoService.solicitarCargaDeCarrito(null);
    this.carritoACargar = null;
    this.cargandoCarrito = false;
  }

  ngOnDestroy(): void {
    this.carritoService.refrescarCarrito(null!, null!).subscribe();
    this.subs.unsubscribe();
  }

  // CORRECCIÓN 1: Ajusta el método que filtra la lista para el autocompletado.
  private _filterClientes(value: string): Cliente[] {
    const filterValue = value.toLowerCase();
    return this.listaClientes.filter(cliente => cliente.nombre.toLowerCase().includes(filterValue)); // Usar .nombre
  }

  displayClienteFn(cliente: Cliente | string): string {
    if (typeof cliente === 'string') {
      return cliente;
    }
    return cliente?.nombre || ''; // Usar .nombre
  }

  getClientList(): void {
    this.subs.add(this.clientesService.getAll().subscribe({
      next: (clientes: Cliente[]) => {

        this.listaClientes = clientes.filter(cliente => cliente.estado);
        if (this.carritoACargar) {
          this.procesarCarritoConClientes();
        }
      },
      error: (err) => {
        console.error('Error al obtener lista de clientes:', err);
        this.snackBar.open('Error al cargar clientes.', 'Cerrar', { duration: 3000 });
      }
    }));
  }

  loadMargenesVenta(): void {
    this.subs.add(this.ventasBaseService.ListarTodosLosMargenesVenta().subscribe({
      next: (margenes: MargenesVentas[]) => {
        this.margenesVenta = margenes;
        const margenPorDefecto = this.margenesVenta.find(m => m.Porcentaje === 35);
        if (margenPorDefecto) {
          this.margenSeleccionado = margenPorDefecto.Porcentaje;
          this.nombreMargenSeleccionado = margenPorDefecto.NombreMargen;
          this.idMargenSeleccionado = margenPorDefecto.IdMargenPK;
        } else if (this.margenesVenta.length > 0) {
          this.margenSeleccionado = this.margenesVenta[0].Porcentaje;
          this.nombreMargenSeleccionado = this.margenesVenta[0].NombreMargen;
          this.idMargenSeleccionado = this.margenesVenta[0].IdMargenPK;
        }
      },
      error: (err) => {
        console.error('Error al obtener márgenes de venta:', err);
      }
    }));
  }

  loadMetodosPago(): void {
    this.subs.add(this.ventasBaseService.ListarTodosLosMetodosDePago().subscribe({
      next: (metodos: MetodosPago[]) => {
        this.metodosPago = metodos;
        const metodoPorDefecto = this.metodosPago.find(m => m.IdMetodoPagoPK === 1);
        if (metodoPorDefecto) {
          this.metodoPagoSeleccionado = metodoPorDefecto.IdMetodoPagoPK;
        } else if (this.metodosPago.length > 0) {
          this.metodoPagoSeleccionado = this.metodosPago[0].IdMetodoPagoPK;
        }
      },
      error: (err) => {
        console.error('Error al obtener métodos de pago:', err);
      }
    }));
  }

  onClienteSelected(event: MatAutocompleteSelectedEvent): void {
    this.ClienteSeleccionado = event.option.value as Cliente;
    this.loadCartForSelectedClient();
  }

  loadCartForSelectedClient(): void {
    if (this.usuario && this.ClienteSeleccionado) {
      // Simplemente refrescamos. La data que viene es la que se muestra.
      this.subs.add(this.carritoService.refrescarCarrito(this.usuario, this.ClienteSeleccionado).subscribe(() => {
        console.log('Carrito cargado y refrescado para el cliente.');
      }));
    } else {
      this.carritoService.refrescarCarrito(null!, null!).subscribe();
    }
  }

  onMargenVentaChange(): void {
    const margen = this.margenesVenta.find(m => m.Porcentaje === this.margenSeleccionado);
    if (margen) {
      this.nombreMargenSeleccionado = margen.NombreMargen;
      this.idMargenSeleccionado = margen.IdMargenPK;
    }
    // ¡Activamos la lógica!
    if (this.margenSeleccionado !== null) {
      this.carritoService.actualizarPreciosDelCarritoConNuevoMargen(this.margenSeleccionado);
    }
  }

  onMetodoPagoChange(): void {
    // Lógica para limpiar campos de referencia según el método de pago
  }

  openDialogAgregar(): void {
    const dialogRef = this.dialog.open(CrearClienteComponent, { width: '500px' });

    this.subs.add(
      dialogRef.afterClosed().subscribe((nuevoClienteCreado: Cliente) => {
        if (nuevoClienteCreado) {
          this.snackBar.open('Refrescando lista de clientes...', undefined, { duration: 2000 });

          this.clientesService.getAll().subscribe({
            next: (clientesActualizados: Cliente[]) => {
              this.listaClientes = clientesActualizados.filter(c => c.estado);

              // Usa 'id' para encontrar al cliente
              const clienteParaSeleccionar = this.listaClientes.find(c => c.id === nuevoClienteCreado.IdClientePK);
              console.log("id cliente creado ", nuevoClienteCreado)

              if (clienteParaSeleccionar) {
                this.ClienteSeleccionado = clienteParaSeleccionar;
                this.clienteControl.setValue(clienteParaSeleccionar);
                this.loadCartForSelectedClient();
                // Usa 'nombre' para el mensaje
                this.snackBar.open(`Cliente "${clienteParaSeleccionar.nombre}" seleccionado.`, 'OK', { duration: 3000 });
              } else {
                this.snackBar.open('Error: No se pudo preseleccionar el cliente recién creado.', 'Cerrar', { duration: 4000 });
              }
            },
            error: (err) => {
              this.snackBar.open('Error al refrescar la lista de clientes.', 'Cerrar', { duration: 3000 });
            }
          });
        }
      })
    );
  }

  seleccionarCliente(cliente: any) {
    this.ClienteSeleccionado = cliente;
    this.loadCartForSelectedClient(); // Opcional: cargar el carrito del cliente seleccionado
  }

  abrirDialogoConfirmarVenta(): void {
    // Validaciones previas
    if (!this.ClienteSeleccionado || !this.usuario || this.carrito.length === 0) {
      this.snackBar.open('Debe seleccionar un cliente y tener artículos en el carrito.', 'Cerrar', { duration: 3000 });
      return;
    }

    // Abre el diálogo y le pasa los datos que necesita para mostrar el resumen
    const dialogRef = this.dialog.open(ConfirmarVentaDialogComponent, {
      width: '450px',
      data: {
        clienteNombre: this.ClienteSeleccionado.nombre,
        total: this.total
      }
    });

    // 3. Se suscribe a la respuesta del diálogo
    this.subs.add(dialogRef.afterClosed().subscribe(result => {
      // Si el resultado es 'true', significa que el usuario hizo clic en "Sí, Confirmar"
      if (result === true) {
        this.procesarVentaFinal();
      }
    }));
  }

  procesarVentaFinal(): void {
    // 1. --- Validación de Requisitos Mínimos ---
    // Se asegura de que haya un método de pago y un margen seleccionados antes de continuar.
    if (!this.metodoPagoSeleccionado || !this.idMargenSeleccionado) {
      this.snackBar.open('Error: Método de pago o margen no seleccionado.', 'Cerrar', { duration: 3000 });
      return;
    }

    // 2. --- Construcción del Payload para el Backend ---
    // Se crea el objeto 'ventaData' que se enviará al endpoint '/finalizar'.
    const ventaData: VentaFinalData = {
      // Cabecera de la venta: Estos datos vienen de los getters (subtotal, iva, total).
      TipoDocumento: 3, // 3 = Factura
      SubtotalVenta: this.subtotalNeto,
      IVA: this.iva,
      TotalVenta: this.total,
      EstadoVenta: 2, // 2 = Pagado
      MetodoPago: this.metodoPagoSeleccionado,
      Usuario: this.usuario.id,
      Cliente: this.ClienteSeleccionado?.id!,
      Observaciones: `Ref. Transferencia: ${this.numeroReferenciaTransferencia || 'N/A'}. Otros: ${this.observacionesOtros || 'N/A'}`,

      // Detalle de la venta: Se mapea el carrito para generar los detalles.
      // Esta es la parte más crítica que hemos corregido.
      Detalles: this.carrito.map(art => {
        // Se toman los datos base para asegurar la integridad de los cálculos.
        const costoOriginal = art.PrecioOriginalSinMargen ?? 0;
        const margenAplicado = art.MargenAplicado ?? 0;
        const descuentoPorcentaje = art.DescuentoPorcentaje ?? 0;
        const cantidad = art.Cantidad ?? 1;

        // Se calcula el precio de venta unitario justo antes de enviar,
        // basándose en el costo original y el margen, para evitar errores.
        const precioVentaUnitario = costoOriginal * (1 + margenAplicado / 100);

        // Se retorna el objeto con los NOMBRES DE CLAVE CORRECTOS que el SP espera.
        return {
          TipoArticulo: art.Tipo!,
          CodigoArticulo: art.Codigo!,
          PrecioVenta: precioVentaUnitario,
          Descuento: descuentoPorcentaje,
          Cantidad: cantidad,
          PrecioBaseOriginal: costoOriginal,
          MargenAplicado: margenAplicado,
          IdMargenFK: art.IdMargenFK ?? this.idMargenSeleccionado
        };
      })
    };

    // 3. --- Llamada al Servicio y Manejo de Respuesta ---
    this.subs.add(this.ventasBaseService.finalizarVenta(ventaData).subscribe({
      next: (respuesta) => {
        // Si la venta en el backend fue exitosa...
        if (respuesta.success && respuesta.numeroDocumento) {
          this.snackBar.open(`Venta ${respuesta.numeroDocumento} registrada con éxito.`, 'OK', { duration: 4000 });
          this.imprimirFacturaPDF(respuesta.numeroDocumento);

          // Se refresca el carrito. El SP ya lo marcó como 'Completado',
          // por lo que el servicio traerá un carrito vacío y limpiará la UI.
          this.carritoService.refrescarCarrito(this.usuario!, this.ClienteSeleccionado!).subscribe();

          // Se limpia el resto de la UI para una nueva venta.
          this.ClienteSeleccionado = null;
          this.clienteControl.setValue('');
        } else {
          // Manejo de errores controlados desde el backend.
          this.snackBar.open(`Error al procesar la venta: ${respuesta.error || 'No se recibió el número de documento.'}`, 'Cerrar', { duration: 5000 });
        }
      },
      error: (err) => {
        // Manejo de errores de comunicación o excepciones no controladas.
        console.error('Error en la transacción de venta:', err);
        this.snackBar.open('Error de comunicación con el servidor al finalizar la venta.', 'Cerrar', { duration: 5000 });
      }
    }));
  }


  // --- ACCIONES DEL CARRITO (CON CORRECCIONES) ---

  incrementarCantidad(articulo: ArticuloVenta): void {
    if (!this.usuario || !this.ClienteSeleccionado) return;
    this.carritoService.solicitarIncrementoCantidad(articulo, this.usuario, this.ClienteSeleccionado);
  }

  decrementarCantidad(articulo: ArticuloVenta): void {
    if (!this.usuario || !this.ClienteSeleccionado) return;
    this.carritoService.decrementarCantidadEnCarrito(articulo, this.usuario, this.ClienteSeleccionado);
  }

  // CORREGIDO: Ahora acepta el objeto completo, como espera el servicio.
  eliminarLineaArticulo(articulo: ArticuloVenta): void {
    if (!this.usuario || !this.ClienteSeleccionado) {
      this.snackBar.open('Seleccione un usuario y cliente para eliminar artículos.', 'Cerrar', { duration: 3000 });
      return;
    }

    // ¡UNA SOLA LLAMADA, UNA SOLA FUENTE DE VERDAD!
    this.carritoService.eliminarLineaCompletaArticulo(articulo, this.usuario, this.ClienteSeleccionado);
  }

  // CORREGIDO: Ahora recibe directamente el valor numérico.
  actualizarDescuento(articulo: ArticuloVenta, nuevoDescuento: number): void {
    if (this.usuario && this.ClienteSeleccionado) {
      this.carritoService.actualizarDescuentoArticulo(articulo, nuevoDescuento, this.usuario, this.ClienteSeleccionado);
    } else {
      this.snackBar.open('Seleccione un usuario y cliente.', 'Cerrar', { duration: 3000 });
    }
  }

  limpiarCarrito(): void {
    if (!this.usuario || !this.ClienteSeleccionado) return;
    this.ventasBaseService.limpiarCarritoDeVentas(this.usuario.id, this.ClienteSeleccionado.id).subscribe({
      next: (res) => {
        console.log('Carrito limpiado correctamente', res);
        // Aquí puedes refrescar el carrito o hacer alguna acción
      },
      error: (error) => {
        console.error('Error al limpiar el carrito', error);
      }
    });
    // AHORA LLAMA AL SERVICIO CORRECTO
    this.carritoService.limpiarCarrito(this.usuario, this.ClienteSeleccionado);
  }

  // CORREGIDO: Ahora acepta el código como un string, que es lo que pasa la plantilla.
  agregarArticuloPorCodigoDesdeInput(codigo: string): void {
    const codigoLimpio = codigo.trim();
    if (!codigoLimpio) return;

    if (!this.usuario || !this.ClienteSeleccionado || this.margenSeleccionado === null) {
      this.snackBar.open('Seleccione usuario, cliente y margen de venta.', 'Cerrar', { duration: 4000 });
      return;
    }

    if (this.tablaArticulos) {
      this.tablaArticulos.agregarArticuloPorCodigo(codigoLimpio);
    }
  }

  // --- CÁLCULOS Y TOTALES ---

  /**
   * MÉTODO RESTAURADO: Calcula el precio de un artículo después de aplicar el descuento.
   * @param art El artículo de venta.
   * @returns El precio final con descuento.
   */
  calcularPrecioConDescuento(art: ArticuloVenta): number {
    const precioBaseConMargen = art.PrecioBase ?? 0;
    const descuento = art.DescuentoPorcentaje ?? 0;
    return precioBaseConMargen * (1 - descuento / 100);
  }

  // MÉTODO AÑADIDO: Para que la plantilla lo encuentre
  calcularIVASobreArticulo(art: ArticuloVenta): number {
    const precioConDescuento = this.calcularPrecioConDescuento(art);
    return precioConDescuento * 0.15;
  }

  // MÉTODO AÑADIDO: Para que la plantilla lo encuentre
  calcularTotalArticulo(art: ArticuloVenta): number {
    const precioConDescuento = this.calcularPrecioConDescuento(art);
    const ivaArticulo = this.calcularIVASobreArticulo(art);
    const cantidad = art.Cantidad ?? 1;
    return (precioConDescuento + ivaArticulo) * cantidad;
  }

  // MÉTODO AÑADIDO: Para que la plantilla lo encuentre
  formatearDescuento(articulo: ArticuloVenta): void {
    if (articulo.DescuentoPorcentaje === null || articulo.DescuentoPorcentaje === undefined || isNaN(articulo.DescuentoPorcentaje)) {
      // Si el valor es inválido o vacío, lo reseteamos a 0.
      this.actualizarDescuento(articulo, 0);
    }
  }

  get subtotal(): number {
    // Subtotal bruto: Suma del precio de lista (con margen) por la cantidad.
    return this.carrito.reduce((acc, art) => acc + (art.PrecioBase ?? 0) * (art.Cantidad ?? 1), 0);
  }

  get totalDescuentos(): number {
    // Calcula el valor monetario total de todos los descuentos aplicados.
    return this.carrito.reduce((acc, art) => {
      const descuentoValor = (art.PrecioBase ?? 0) * ((art.DescuentoPorcentaje ?? 0) / 100) * (art.Cantidad ?? 1);
      return acc + descuentoValor;
    }, 0);
  }

  get subtotalNeto(): number {
    // El subtotal neto es el bruto menos los descuentos.
    return this.subtotal - this.totalDescuentos;
  }

  get iva(): number {
    return this.aplicarIVA ? this.subtotalNeto * 0.15 : 0;
  }

  get total(): number {
    return this.subtotalNeto + this.iva;
  }

  public onDescuentoChange(articulo: ArticuloVenta, event: Event): void {
    // 1. Aseguramos a TypeScript que 'event.target' es un input de HTML.
    const target = event.target as HTMLInputElement;

    // 2. Verificamos que el target exista para evitar errores.
    if (target) {
      // 3. Obtenemos el valor como número y llamamos a la función que ya teníamos.
      this.actualizarDescuento(articulo, target.valueAsNumber);
    }
  }

  onPrecioManualChange(articulo: ArticuloVenta, event: any): void {
    // 1. Obtenemos y convertimos el nuevo precio a número.
    const nuevoPrecio = parseFloat(event.target.value);

    // 2. Obtenemos el costo original del artículo (precio sin margen).
    const precioCosto = articulo.PrecioOriginalSinMargen ?? 0;

    // 3. Validación: Si el nuevo precio es inválido o menor que el costo...
    if (isNaN(nuevoPrecio) || nuevoPrecio < precioCosto) {
      // Mostramos una alerta al usuario.
      this.snackBar.open(`El precio no puede ser menor al costo base de $${precioCosto.toFixed(2)}`, 'Cerrar', {
        duration: 4000,
        panelClass: ['snackbar-error'] // (Opcional) Clase para un estilo de error
      });
      // Revertimos el valor en la UI al precio que tenía antes de la edición.
      event.target.value = articulo.PrecioBase;
      return; // Detenemos la ejecución.
    }

    // 4. Si el precio es válido, lo actualizamos en el objeto del carrito.
    // Como `PrecioBase` es usado por los getters, toda la UI se actualizará automáticamente.
    articulo.PrecioBase = nuevoPrecio;

    // Opcional: Podrías llamar aquí a un servicio para persistir este cambio en el backend
    // si necesitas que el carrito se guarde en tiempo real.
  }

  public getNombreMargen(idMargen: number | null): string {
    if (idMargen === null || !this.margenesVenta) {
      return 'N/A';
    }
    const margenEncontrado = this.margenesVenta.find(m => m.IdMargenPK === idMargen);
    return margenEncontrado ? margenEncontrado.NombreMargen : 'Desconocido';
  }

  generarProformaPDF(): void {
    if (!this.ClienteSeleccionado) {
      this.snackBar.open('Por favor, seleccione un cliente para generar la proforma.', 'Cerrar', { duration: 3000 });
      return;
    }

    if (this.carrito.length === 0) {
      this.snackBar.open('El carrito está vacío. Agregue artículos para generar una proforma.', 'Cerrar', { duration: 3000 });
      return;
    }

    // Armar los datos de la proforma para enviar al backend
    const venta = {
      TipoDocumento: 2, // 2 = Proforma
      SubtotalVenta: this.subtotalNeto,
      IVA: this.iva,
      TotalVenta: this.total,
      EstadoVenta: 1, // Pendiente
      MetodoPago: this.metodoPagoSeleccionado,
      // SE ELIMINA EL CAMPO 'Margen' DEL OBJETO PRINCIPAL
      Usuario: this.usuario?.id,
      Cliente: this.ClienteSeleccionado?.id,
      Observaciones: this.observacionesOtros || '',
      NumeroReferenciaTransferencia: this.numeroReferenciaTransferencia || '',

      // --- INICIO DE LA CORRECCIÓN CLAVE EN LOS DETALLES ---
      Detalles: this.carrito.map(art => {
        // Obtenemos el ID del margen del artículo en el carrito.
        // Si no existe (caso improbable), usamos el margen seleccionado como fallback.
        const idMargenDelArticulo = art.IdMargenFK ?? this.idMargenSeleccionado;

        return {
          Tipo: art.Tipo,
          Codigo: art.Codigo,
          Precio: this.calcularPrecioConDescuento(art),
          Descuento: art.DescuentoPorcentaje ?? 0,
          Subtotal: this.calcularPrecioConDescuento(art) * (art.Cantidad ?? 1),
          Cantidad: art.Cantidad ?? 1,
          // CAMPOS AHORA OBLIGATORIOS
          PrecioBaseOriginal: art.PrecioOriginalSinMargen ?? 0,
          MargenAplicado: art.MargenAplicado ?? this.margenSeleccionado ?? 0,
          IdMargenFK: idMargenDelArticulo
        };
      })
      // --- FIN DE LA CORRECCIÓN CLAVE ---
    };
    this.ventasBaseService.IngresarVenta(venta).subscribe({
      next: (resp: any) => {
        if (resp.success && resp.codigo) {
          const codigoProforma = resp.codigo;
          this.snackBar.open(`Proforma ${codigoProforma} registrada.`, 'OK', { duration: 3000 });
          this.imprimirProformaPDF(codigoProforma);
        } else {
          this.snackBar.open('Error: No se pudo obtener el código de la proforma.', 'Cerrar', { duration: 4000 });
        }
      },
      error: err => {
        console.error('Error al registrar proforma:', err);
        this.snackBar.open('Ocurrió un error al registrar la proforma.', 'Cerrar', { duration: 4000 });
      }
    });
  }

  imprimirProformaPDF(codigoProforma: string): void {
    const doc = new jsPDF();
    const fecha = new Date().toLocaleDateString('es-NI');

    let nombreMargenParaImprimir = 'N/A';
    if (this.carrito.length > 0) {
      const conteoMargenes = this.carrito.reduce((acc, art) => {
        const id = art.IdMargenFK ?? -1;
        acc[id] = (acc[id] || 0) + 1;
        return acc;
      }, {} as { [key: number]: number });

      // --- CORRECCIÓN 1: Se añade una validación para evitar el error de 'reduce' ---
      const llavesDeMargenes = Object.keys(conteoMargenes);
      if (llavesDeMargenes.length > 0) {
        const idMasFrecuente = parseInt(llavesDeMargenes.reduce((a, b) => conteoMargenes[a as any] > conteoMargenes[b as any] ? a : b));
        const margenEncontrado = this.margenesVenta.find(m => m.IdMargenPK === idMasFrecuente);
        if (margenEncontrado) {
          nombreMargenParaImprimir = margenEncontrado.NombreMargen;
        }
      }
    }

    // --- ENCABEZADO DEL DOCUMENTO (Sin cambios) ---
    doc.setFontSize(18);
    doc.text('PROFORMA DE VENTA', 105, 20, { align: 'center' });
    doc.setFontSize(10);
    doc.text('Ragganel Tech S.A.', 20, 30);
    doc.text('Colonia 14 de septiembre, Managua', 20, 35);
    doc.text('RUC: J0000000000000', 20, 40);
    doc.text('Teléfono: +505 8643 9865', 20, 45);
    doc.text(`Fecha: ${fecha}`, 150, 30);
    doc.text(`Proforma #: ${codigoProforma}`, 150, 35);

    // --- INFORMACIÓN DEL CLIENTE Y VENDEDOR (Etiquetas actualizadas) ---
    doc.setFontSize(12);
    doc.text('Cliente:', 20, 60);
    doc.setFontSize(10);
    doc.text(`Nombre: ${this.ClienteSeleccionado?.nombre || 'N/A'}`, 20, 67);
    doc.text(`Identificación: ${this.ClienteSeleccionado?.ruc || this.ClienteSeleccionado?.dni || 'N/A'}`, 20, 72);
    // CAMBIO: Etiqueta "Precio" a "Tipo de Precio" para consistencia.
    doc.text(`Tipo de Precio: ${this.nombreMargenSeleccionado || 'N/A'}`, 20, 77);
    // CAMBIO: Etiqueta "Nombre del vendedor" a "Vendedor".
    doc.text(`Vendedor: ${this.usuario?.name || 'N/A'}`, 20, 82);
    doc.text(`Código vendedor: ${this.usuario?.id || 'N/A'}`, 20, 87);

    // --- TABLA DE ARTÍCULOS (Encabezados actualizados) ---
    // CAMBIO: Encabezados de la tabla para coincidir con el otro PDF.
    const head = [['Cant.', 'Código', 'Artículo', 'P. Unit.', 'Desc. %', 'P. c/Desc.', 'Subtotal']];
    const body = this.carrito.map(art => {
      const precioUnitario = art.PrecioBase ?? 0;
      const cantidad = art.Cantidad ?? 1;
      const precioConDescuento = this.calcularPrecioConDescuento(art);
      const subtotal = precioConDescuento * cantidad;

      return [
        cantidad.toString(),
        art.Codigo || 'N/A',
        art.NombreArticulo || 'N/A',
        precioUnitario.toFixed(2),
        (art.DescuentoPorcentaje ?? 0).toFixed(2),
        precioConDescuento.toFixed(2),
        subtotal.toFixed(2)
      ];
    });

    (doc as any).autoTable({
      startY: 90, // CAMBIO: Ajuste de posición inicial para alinear con la info del vendedor.
      head,
      body,
      theme: 'striped',
      headStyles: { fillColor: [22, 160, 133] }, // Verde para proformas
      didDrawPage: (data: any) => {
        const pageHeight = data.doc.internal.pageSize.getHeight();
        data.doc.setFontSize(8);
        data.doc.text('Página ' + data.pageNumber, data.settings.margin.left, pageHeight - 10);
      }
    });

    // --- SECCIÓN DE TOTALES (Etiquetas actualizadas) ---
    let finalY = (doc as any).lastAutoTable.finalY + 10;
    if (finalY > 260) { doc.addPage(); finalY = 20; }

    const xAlignRight = 190;
    doc.setFontSize(10);
    // CAMBIO: Etiqueta "Subtotal Bruto (s/desc):" a "Subtotal Bruto:".
    doc.text('Subtotal Bruto:', 140, finalY, { align: 'right' });
    doc.text(`${this.subtotal.toFixed(2)} USD`, xAlignRight, finalY, { align: 'right' });
    finalY += 7;

    doc.text('Total Descuentos:', 140, finalY, { align: 'right' });
    doc.text(`-${this.totalDescuentos.toFixed(2)} USD`, xAlignRight, finalY, { align: 'right' });
    finalY += 7;

    doc.text('Subtotal Neto (s/IVA):', 140, finalY, { align: 'right' });
    doc.text(`${this.subtotalNeto.toFixed(2)} USD`, xAlignRight, finalY, { align: 'right' });
    finalY += 7;

    doc.text('IVA (15%):', 140, finalY, { align: 'right' });
    doc.text(`${this.iva.toFixed(2)} USD`, xAlignRight, finalY, { align: 'right' });
    finalY += 7;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL A PAGAR:', 140, finalY, { align: 'right' });
    doc.text(`${this.total.toFixed(2)} USD`, xAlignRight, finalY, { align: 'right' });
    doc.setFont('helvetica', 'normal');

    // --- PIE DE PÁGINA (Texto actualizado) ---
    finalY += 15;
    if (finalY > 270) { doc.addPage(); finalY = 20; }
    doc.setFontSize(8);
    // CAMBIO: Se usa un único texto de pie de página más conciso.
    doc.text('Esta proforma es válida por 15 días. Precios y disponibilidad sujetos a cambio.', 20, finalY);

    // --- GUARDAR EL DOCUMENTO (Sin cambios) ---
    const nombreClienteSanitizado = this.ClienteSeleccionado?.nombre?.replace(/[\s\/\\?%*:|"<>]/g, '_') || 'Cliente';
    const codigoProformaSanitizado = codigoProforma.replace(/[\s\/\\?%*:|"<>]/g, '-');
    const nombreArchivo = `Proforma-${codigoProformaSanitizado}-${nombreClienteSanitizado}.pdf`;
    doc.save(nombreArchivo);
  }

  imprimirFacturaPDF(numeroFactura: string): void {
    const doc = new jsPDF();
    const fecha = new Date().toLocaleDateString('es-NI');

    let nombreMargenParaImprimir = 'N/A';
    if (this.carrito.length > 0) {
      const conteoMargenes = this.carrito.reduce((acc, art) => {
        const id = art.IdMargenFK ?? -1;
        acc[id] = (acc[id] || 0) + 1;
        return acc;
      }, {} as { [key: number]: number });

      // --- CORRECCIÓN 1: Se añade la misma validación aquí ---
      const llavesDeMargenes = Object.keys(conteoMargenes);
      if (llavesDeMargenes.length > 0) {
        const idMasFrecuente = parseInt(llavesDeMargenes.reduce((a, b) => conteoMargenes[a as any] > conteoMargenes[b as any] ? a : b));
        const margenEncontrado = this.margenesVenta.find(m => m.IdMargenPK === idMasFrecuente);
        if (margenEncontrado) {
          nombreMargenParaImprimir = margenEncontrado.NombreMargen;
        }
      }
    }

    // --- Cambios clave: Título y Número de Documento ---
    doc.setFontSize(18);
    doc.text('FACTURA DE VENTA', 105, 20, { align: 'center' }); // Título cambiado
    doc.setFontSize(10);
    // ... (resto de los datos de la empresa son iguales)
    doc.text('Ragganel Tech S.A.', 20, 30);
    doc.text('Colonia 14 de septiembre, Managua', 20, 35);
    doc.text('Tu RUC: J0000000000000', 20, 40);
    doc.text('Teléfono: +505 8643 9865', 20, 45);

    doc.text(`Fecha: ${fecha}`, 150, 30);
    doc.text(`Factura #: ${numeroFactura}`, 150, 35);

    // --- El resto del documento es prácticamente idéntico ---
    doc.setFontSize(12);
    doc.text('Cliente:', 20, 60);
    doc.setFontSize(10);
    doc.text(`Nombre: ${this.ClienteSeleccionado?.nombre || 'N/A'}`, 20, 67);
    doc.text(`Identificación: ${this.ClienteSeleccionado?.ruc || 'N/A'}`, 20, 72);
    doc.text(`Precio: ${this.nombreMargenSeleccionado || 'N/A'}`, 20, 77);
    doc.text(`Nombre del vendedor: ${this.usuario?.name || 'N/A'}`, 20, 82);
    doc.text(`Código vendedor: ${this.usuario?.id || 'N/A'}`, 20, 87);

    const head = [['Cant.', 'Código', 'Artículo', 'P. Unit.', 'Desc. %', 'P. Desc.', 'Subtotal (sin IVA)']];
    const body = this.carrito.map(art => {
      const precioUnitario = art.PrecioBase ?? 0;
      const cantidad = art.Cantidad ?? 1;
      const precioConDescuento = this.calcularPrecioConDescuento(art);
      const subtotal = precioConDescuento * cantidad;
      return [
        cantidad.toString(),
        art.Codigo || 'N/A',
        art.NombreArticulo || 'N/A',
        precioUnitario.toFixed(2),
        (art.DescuentoPorcentaje ?? 0).toFixed(2),
        precioConDescuento.toFixed(2),
        subtotal.toFixed(2)
      ];
    });

    (doc as any).autoTable({
      startY: 90,
      head,
      body,
      theme: 'striped',
      headStyles: { fillColor: [41, 128, 185] }, // Un color azul para diferenciar de la proforma
      didDrawPage: (data: any) => {
        // ... (paginación igual)
      }
    });

    let finalY = (doc as any).lastAutoTable.finalY || 150;
    if (finalY > 260) { doc.addPage(); finalY = 20; }
    else { finalY += 10; }

    // ... (cálculo de totales igual)
    const xAlignRight = 190;
    doc.setFontSize(10);
    doc.text('Subtotal Bruto (s/desc):', 140, finalY, { align: 'right' });
    doc.text(`${this.subtotal.toFixed(2)} USD`, xAlignRight, finalY, { align: 'right' });
    finalY += 7;
    doc.text('Total Descuentos:', 140, finalY, { align: 'right' });
    doc.text(`-${this.totalDescuentos.toFixed(2)} USD`, xAlignRight, finalY, { align: 'right' });
    finalY += 7;
    doc.text('Subtotal Neto (s/IVA):', 140, finalY, { align: 'right' });
    doc.text(`${this.subtotalNeto.toFixed(2)} USD`, xAlignRight, finalY, { align: 'right' });
    finalY += 7;
    doc.text('IVA (15%):', 140, finalY, { align: 'right' });
    doc.text(`${this.iva.toFixed(2)} USD`, xAlignRight, finalY, { align: 'right' });
    finalY += 7;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL PAGADO:', 140, finalY, { align: 'right' }); // Cambiado a PAGADO
    doc.text(`${this.total.toFixed(2)} USD`, xAlignRight, finalY, { align: 'right' });
    doc.setFont('helvetica', 'normal');

    const nombreClienteSanitizado = this.ClienteSeleccionado?.nombre?.replace(/[\s\/\\?%*:|"<>]/g, '_') || 'Cliente';
    const numeroFacturaSanitizado = numeroFactura.replace(/[\s\/\\?%*:|"<>]/g, '-');
    doc.save(`Factura-${nombreClienteSanitizado}-${numeroFacturaSanitizado}.pdf`);
  }
}


