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


@Component({
  selector: 'app-punto-venta',
  standalone: true,
  imports: [FormsModule, MatInputModule, MatIconButton, ReactiveFormsModule, TablaArticulosVentasComponent,
    CommonModule, MatIcon, MatButton, CrearClienteComponent, MatFormField, MatOption, MatAutocompleteModule,
    MatSelect],
  templateUrl: './punto-venta.component.html',
  styleUrl: './punto-venta.component.css'
})
export class PuntoVentaComponent implements OnInit, OnDestroy {
  carrito$: Observable<ArticuloVenta[]> = new Observable();
  carrito: ArticuloVenta[] = [];

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
      map(value => typeof value === 'string' ? value : value?.nombre || ''),
      map(nombre => nombre ? this._filterClientes(nombre as string) : this.listaClientes.slice())
    );
  }

  ngOnInit(): void {
    this.subs.add(this.carritoService.carrito$.subscribe(data => {
      this.carrito = data;
    }));

    this.subs.add(this.authService.getUser().subscribe(
      (user) => {
        if (user) {
          this.usuario = user as unknown as Usuarios;
          console.log('Usuario autenticado:', this.usuario);
        } else {
          console.warn('Usuario no autenticado.');
          this.snackBar.open('No se pudo cargar el usuario autenticado.', 'Cerrar', { duration: 3000 });
        }
      },
      (err) => {
        console.error('Error al obtener usuario autenticado:', err);
        this.snackBar.open('Error al cargar información del usuario.', 'Cerrar', { duration: 3000 });
      }
    ));

    this.getClientList();
    this.loadMargenesVenta();
    this.loadMetodosPago();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  private _filterClientes(value: string): Cliente[] {
    const filterValue = value.toLowerCase();
    return this.listaClientes.filter(cliente => cliente.nombre.toLowerCase().includes(filterValue));
  }

  displayClienteFn(cliente: Cliente | string): string {
    return typeof cliente === 'string' ? cliente : cliente?.nombre || '';
  }

  getClientList(): void {
    this.subs.add(this.clientesService.getAll().subscribe({
      next: (clientes: Cliente[]) => {
        this.listaClientes = clientes;
      },
      error: (err) => {
        console.error('Error al obtener lista de clientes:', err);
        this.snackBar.open('Error al cargar la lista de clientes.', 'Cerrar', { duration: 3000 });
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
        if (this.margenSeleccionado !== null) {
          this.carritoService.actualizarPreciosDelCarritoConNuevoMargen(this.margenSeleccionado);
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
      this.subs.add(this.carritoService.refrescarCarrito(this.usuario, this.ClienteSeleccionado).subscribe(() => {
        if (this.margenSeleccionado !== null) {
          this.carritoService.actualizarPreciosDelCarritoConNuevoMargen(this.margenSeleccionado);
        }
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
    if (this.margenSeleccionado !== null) {
      this.carritoService.actualizarPreciosDelCarritoConNuevoMargen(this.margenSeleccionado);
    }
  }

  onMetodoPagoChange(): void {
    // Lógica para limpiar campos de referencia según el método de pago
  }

  openDialogAgregar(): void {
    const dialogRef = this.dialog.open(CrearClienteComponent, { width: '500px' });
    this.subs.add(dialogRef.afterClosed().subscribe((nuevoCliente: Cliente) => {
      if (nuevoCliente) {
        this.getClientList();
        this.ClienteSeleccionado = nuevoCliente;
        this.clienteControl.setValue(nuevoCliente);
        this.loadCartForSelectedClient();
      }
    }));
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
    if (!this.metodoPagoSeleccionado || !this.idMargenSeleccionado) {
      this.snackBar.open('Error: Método de pago o margen no seleccionado.', 'Cerrar', { duration: 3000 });
      return;
    }

    const ventaData: VentaFinalData = {
      fecha: new Date().toISOString().split('T')[0],
      idTipoDocumento: 3,
      // numeroDocumento: '', // <-- YA NO SE ENVÍA ESTA LÍNEA
      subtotal: this.subtotalNeto,
      iva: this.iva,
      total: this.total,
      idEstadoVenta: 2,
      idMetodoPago: this.metodoPagoSeleccionado,
      idMargen: this.idMargenSeleccionado,
      idUsuario: this.usuario.id,
      idCliente: this.ClienteSeleccionado!.id,
      observaciones: `Ref. Transferencia: ${this.numeroReferenciaTransferencia || 'N/A'}. Otros: ${this.observacionesOtros || 'N/A'}`
    };

    this.subs.add(this.ventasBaseService.finalizarVenta(ventaData).subscribe({
      next: (respuesta) => {
        if (respuesta.success && respuesta.numeroDocumento) {
          this.snackBar.open(`Venta ${respuesta.numeroDocumento} registrada con éxito.`, 'OK', { duration: 4000 });
          this.imprimirFacturaPDF(respuesta.numeroDocumento);

          // --- INICIO DE LA CORRECCIÓN ---

          // ANTES (INCORRECTO):
          // this.carritoService.limpiarCarrito(this.usuario!, this.ClienteSeleccionado!);

          // AHORA (CORRECTO):
          // Simplemente refrescamos la vista del carrito. Como el SP ya lo marcó como 'Completado',
          // este método recibirá un carrito vacío del backend y limpiará la UI.
          this.carritoService.refrescarCarrito(this.usuario!, this.ClienteSeleccionado!).subscribe();

          // --- FIN DE LA CORRECCIÓN ---

          // El resto de la limpieza de la UI está bien
          this.ClienteSeleccionado = null;
          this.clienteControl.setValue('');
        } else {
          this.snackBar.open(`Error al procesar la venta: ${respuesta.error || 'No se recibió el número de documento.'}`, 'Cerrar', { duration: 5000 });
        }
      },
      error: (err) => {
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
    return this.carrito.reduce((acc, art) => acc + (art.PrecioBase ?? 0) * (art.Cantidad ?? 1), 0);
  }

  get totalDescuentos(): number {
    return this.carrito.reduce((acc, art) => {
      const descuentoValor = (art.PrecioBase ?? 0) * ((art.DescuentoPorcentaje ?? 0) / 100) * (art.Cantidad ?? 1);
      return acc + descuentoValor;
    }, 0);
  }

  get subtotalNeto(): number {
    return this.subtotal - this.totalDescuentos;
  }

  get iva(): number {
    return this.subtotalNeto * 0.15;
  }

  get total(): number {
    return this.subtotalNeto + this.iva;
  }

  generarProformaPDF(): void {
    if (!this.ClienteSeleccionado) {
      alert('Por favor, seleccione un cliente para generar la proforma.');
      return;
    }

    if (this.carrito.length === 0) {
      alert('El carrito está vacío. Agregue artículos para generar una proforma.');
      return;
    }

    // Armar los datos de la proforma para enviar al backend
    const venta = {
      FechaCreacion: new Date().toISOString().split('T')[0],
      TipoDocumento: 2, // 2 = Proforma
      SubtotalVenta: this.subtotal,
      IVA: this.iva,
      TotalVenta: this.total,
      EstadoVenta: 1, // Pendiente
      MetodoPago: this.metodoPagoSeleccionado,
      Margen: this.idMargenSeleccionado,
      Usuario: this.usuario?.id,
      Cliente: this.ClienteSeleccionado?.id,
      Observaciones: this.observacionesOtros || '',
      NumeroReferenciaTransferencia: this.numeroReferenciaTransferencia || '',
      Detalles: this.carrito.map(art => ({
        Tipo: art.Tipo,
        Codigo: art.Codigo,
        Precio: this.calcularPrecioConDescuento(art),
        Descuento: art.DescuentoPorcentaje ?? 0,
        Subtotal: this.calcularPrecioConDescuento(art) * (art.Cantidad ?? 1),
        Cantidad: art.Cantidad ?? 1
      }))
    };

    this.ventasBaseService.IngresarVenta(venta).subscribe({
      next: (resp: any) => {
        if (resp.success && resp.codigo) {
          const codigoProforma = resp.codigo; // este es el valor real de la proforma
          this.imprimirProformaPDF(codigoProforma);
        } else {
          alert('No se pudo obtener el código de proforma. La generación del PDF fue cancelada.');
        }
      },
      error: err => {
        console.error('Error al registrar proforma:', err);
        alert('Ocurrió un error al registrar la proforma en la base de datos.');
      }
    });
  }
  imprimirProformaPDF(codigoProforma: string): void {
    const doc = new jsPDF();
    const fecha = new Date().toLocaleDateString('es-NI');

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
    const nombreArchivo = `Proforma-${codigoProforma}-${this.ClienteSeleccionado?.nombre?.replace(/\s/g, '_') || 'Cliente'}.pdf`;
    doc.save(nombreArchivo);
  }

  imprimirFacturaPDF(numeroFactura: string): void {
    const doc = new jsPDF();
    const fecha = new Date().toLocaleDateString('es-NI');

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

    doc.save(`Factura-${this.ClienteSeleccionado?.nombre?.replace(/\s/g, '_') || 'Cliente'}-${numeroFactura}.pdf`);
  }
}


