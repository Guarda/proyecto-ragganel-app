import { Component, ViewChild } from '@angular/core';
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
import { map, startWith, Subscription } from 'rxjs';
import { MatFormField } from '@angular/material/form-field';
import { MatOption } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MargenesVentas } from '../../interfaces/margenes-ventas';
import { VentasBaseService } from '../../../services/ventas-base.service';
import { MatSelect } from '@angular/material/select';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // <-- CAMBIO IMPORTANTE AQUÍ
import { MetodosPago } from '../../interfaces/metodos-pago';


@Component({
  selector: 'app-punto-venta',
  standalone: true,
  imports: [FormsModule, MatInputModule, MatIconButton, ReactiveFormsModule, TablaArticulosVentasComponent,
    CommonModule, MatIcon, MatButton, CrearClienteComponent, MatFormField, MatOption, MatAutocompleteModule,
    MatSelect],
  templateUrl: './punto-venta.component.html',
  styleUrl: './punto-venta.component.css'
})
export class PuntoVentaComponent {
  carrito: ArticuloVenta[] = [];

  clienteControl = new FormControl<string | Cliente>('');
  listaClientes: Cliente[] = [];
  clientesFiltrados: Cliente[] = [];
  ClienteSeleccionado!: Cliente;

  margenesVenta: MargenesVentas[] = [];
  margenSeleccionado!: number; // O un FormControl si estás usando formulario reactivo

  metodosPago: MetodosPago[] = []; // Lista de métodos de pago
  metodoPagoSeleccionado!: number;

  numeroReferenciaTransferencia: string = '';
  observacionesOtros: string = '';


  // Referencia al componente hijo TablaArticulosVentasComponent
  @ViewChild(TablaArticulosVentasComponent) tablaArticulos!: TablaArticulosVentasComponent;

  private subs = new Subscription(); // Crear instancia de Subscription
  constructor(
    private carritoService: CarritoService,
    private clientesService: ClientesService,
    private ventasBaseService: VentasBaseService,
    private dialog: MatDialog
  ) {
    // Gestionar esta suscripción también
    this.subs.add(this.carritoService.carrito$.subscribe(data => {
      this.carrito = data;
    }));
  }



  ngOnInit(): void {
    this.getClientList();

    this.ventasBaseService.ListarTodosLosMargenesVenta().subscribe((margenes: MargenesVentas[]) => {
      this.margenesVenta = margenes;
      const margenPorDefecto = this.margenesVenta.find(m => m.Porcentaje === 35);
      if (margenPorDefecto) {
        this.margenSeleccionado = margenPorDefecto.Porcentaje;
      } else if (this.margenesVenta.length > 0) {
        this.margenSeleccionado = this.margenesVenta[0].Porcentaje; // Fallback
      }
      // Disparar la actualización de precios del carrito si ya hay artículos (si se implementa esa lógica)
      // this.recalcularPreciosCarritoConMargenActual();
    });

    this.ventasBaseService.ListarTodosLosMetodosDePago().subscribe((metodos: MetodosPago[]) => {
      this.metodosPago = metodos;
      const metodoPorDefecto = this.metodosPago.find(m => m.IdMetodoPagoPK === 1);
      if (metodoPorDefecto) {
        this.metodoPagoSeleccionado = metodoPorDefecto.IdMetodoPagoPK;
      } else if (this.metodosPago.length > 0) {
        this.metodoPagoSeleccionado = this.metodosPago[0].IdMetodoPagoPK;
      }
      this.onMetodoPagoChange(); // Para limpiar campos si el default no los requiere
    });


    // Gestionar esta suscripción
    this.subs.add(this.clienteControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        let searchValue = '';
        if (value != null) {
          searchValue = typeof value === 'string' ? value.toLowerCase() : value.nombre.toLowerCase();
        }
        return this.listaClientes.filter(cliente =>
          cliente.nombre.toLowerCase().includes(searchValue)
        );
      })
    ).subscribe(filtrados => {
      this.clientesFiltrados = filtrados;
    }));
  }

  ngOnDestroy(): void { // Implementar ngOnDestroy
    this.subs.unsubscribe(); // Desuscribirse de todas las suscripciones agregadas
  }

  getClientList(): void {
    // Considera también gestionar esta suscripción si el componente puede destruirse mientras la petición está en curso.
    // Sin embargo, las suscripciones a HTTP suelen completarse o dar error, auto-desuscribiéndose.
    // Para observables de larga duración o que pueden emitir múltiples veces, la gestión es crucial.
    this.clientesService.getAll().subscribe((clientes: Cliente[]) => {
      this.listaClientes = clientes;
      this.clientesFiltrados = clientes;
      console.log('Lista de clientes obtenida:', this.listaClientes);
    });
  }

  seleccionarCliente(cliente: Cliente): void {
    this.ClienteSeleccionado = cliente;
    this.clienteControl.setValue(cliente.nombre, { emitEvent: false }); // emitEvent: false para evitar re-trigger del valueChanges si no es necesario
    console.log('Cliente seleccionado:', cliente);
  }

  // --- MARGEN DE VENTA ---
  onMargenVentaChange(): void {
    console.log('Nuevo margen seleccionado:', this.margenSeleccionado);
    // Si deseas que los artículos YA EN EL CARRITO actualicen su precio con el nuevo margen:
    this.carritoService.actualizarPreciosDelCarritoConNuevoMargen(this.margenSeleccionado);
  }

  openDialogAgregar(): void {
    const dialogRef = this.dialog.open(CrearClienteComponent, {
      width: '500px'
    });

    // Gestionar esta suscripción si es necesario (afterClosed suele emitir una vez y completarse)
    this.subs.add(dialogRef.afterClosed().subscribe(() => {
      this.getClientList(); // Recargar lista de clientes

      // Retraso para asegurar que la lista esté actualizada antes de seleccionar
      // Considera una lógica más robusta si este timeout es propenso a fallos de timing
      setTimeout(() => {
        if (this.listaClientes.length > 0) {
          const ultimo = this.listaClientes[this.listaClientes.length - 1];
          this.ClienteSeleccionado = ultimo;
          this.clienteControl.setValue(ultimo.nombre); // Esto podría re-trigger valueChanges si no se maneja con cuidado
        }
      }, 300);
    }));
  }

  eliminarLineaArticulo(codigo: string, tipo?: string | null) {
    if (codigo) {
      this.carritoService.eliminarLineaCompletaArticulo(codigo, tipo);
    } else {
      console.warn('Intento de eliminar artículo sin código.');
    }
  }

  incrementarCantidad(codigo: string) {
    this.carritoService.solicitarIncrementoCantidad(codigo);
  }

  decrementarCantidad(codigo: string) {
    this.carritoService.decrementarCantidadEnCarrito(codigo);
  }

  limpiarCarrito() {
    this.carritoService.limpiarCarrito();
  }

  // --- LÓGICA PARA AGREGAR ARTÍCULO ---
  // Este método ahora pasa el margen seleccionado al componente de tabla de artículos
  agregarArticuloPorCodigoDesdeInput(codigo: string): void {
    const codigoLimpio = codigo.trim();
    if (!codigoLimpio) {
      console.warn('El código del artículo no puede estar vacío.');
      // Considera usar MatSnackBar para feedback
      return;
    }

    if (this.tablaArticulos) {
      // Pasar el margenSeleccionado al método que busca y añade el artículo.
      // Este método en `tablaArticulos` deberá usarlo para calcular el PrecioBase.
      const resultado = this.tablaArticulos.agregarArticuloPorCodigo(codigoLimpio, this.margenSeleccionado);
      switch (resultado) {
        case 'AGREGADO':
          console.log(`Artículo ${codigoLimpio} agregado al carrito con margen aplicado.`);
          break;
        case 'NO_ENCONTRADO':
          alert(`Artículo con código "${codigoLimpio}" no encontrado.`);
          break;
        case 'SIN_STOCK':
          alert(`Artículo con código "${codigoLimpio}" sin stock.`);
          break;
        case 'ERROR_CARGA':
          alert('Error: La lista de artículos no está disponible. Intente más tarde.');
          break;
      }
    } else {
      alert('Error: No se puede acceder al listado de artículos. Intente de nuevo.');
      console.error('Referencia a TablaArticulosVentasComponent no disponible.');
    }
  }

  // --- MÉTODOS DE PAGO ---
  onMetodoPagoChange(): void {
    if (this.metodoPagoSeleccionado !== 2) {
      this.numeroReferenciaTransferencia = '';
    }
    if (this.metodoPagoSeleccionado !== 4) {
      this.observacionesOtros = '';
    }
  }

  // --- Métodos para descuento ---
  actualizarDescuento(articulo: ArticuloVenta, nuevoDescuentoEvent: any): void {
    let nuevoDescuento = parseFloat(nuevoDescuentoEvent);
    if (isNaN(nuevoDescuento) || nuevoDescuento < 0) nuevoDescuento = 0;
    else if (nuevoDescuento > 100) nuevoDescuento = 100;
    this.carritoService.actualizarDescuentoArticulo(articulo.Codigo!, articulo.Tipo, nuevoDescuento);
  }

  formatearDescuento(articulo: ArticuloVenta): void {
    if (articulo.DescuentoPorcentaje == null || isNaN(articulo.DescuentoPorcentaje)) {
      this.carritoService.actualizarDescuentoArticulo(articulo.Codigo!, articulo.Tipo, 0);
    }
  }

  // --- Cálculos de artículos ---
  // Estos cálculos ahora asumen que art.PrecioBase YA incluye el margen.
  calcularPrecioConDescuento(art: ArticuloVenta): number {
    const precioBaseConMargen = art.PrecioBase ?? 0; // Este ya debería tener el margen
    const descuento = art.DescuentoPorcentaje ?? 0;
    return precioBaseConMargen * (1 - descuento / 100);
  }

  calcularIVASobreArticulo(art: ArticuloVenta): number {
    const precioConDescuento = this.calcularPrecioConDescuento(art);
    return precioConDescuento * 0.15; // Asumiendo IVA del 15%
  }

  calcularTotalArticulo(art: ArticuloVenta): number {
    const precioConDescuento = this.calcularPrecioConDescuento(art);
    const ivaArticulo = this.calcularIVASobreArticulo(art);
    const cantidad = art.Cantidad ?? 1;
    return (precioConDescuento + ivaArticulo) * cantidad;
  }

  // --- Cálculos generales ---
  // Estos getters también asumen que PrecioBase en el carrito ya tiene el margen.
  get subtotal(): number { // Subtotal ANTES de descuentos, pero CON margen aplicado a cada artículo.
    return this.carrito.reduce((acc, art) => {
      return acc + (art.PrecioBase ?? 0) * (art.Cantidad ?? 1); // PrecioBase ya tiene margen
    }, 0);
  }

  get totalDescuentos(): number {
    return this.carrito.reduce((acc, art) => {
      const precioBaseConMargen = art.PrecioBase ?? 0; // PrecioBase ya tiene margen
      const descuentoPorcentaje = art.DescuentoPorcentaje ?? 0;
      const cantidad = art.Cantidad ?? 1;
      const descuentoValor = (precioBaseConMargen * (descuentoPorcentaje / 100)) * cantidad;
      return acc + descuentoValor;
    }, 0);
  }

  get subtotalNeto(): number { // Subtotal después de descuentos, antes de IVA. Con margen aplicado.
    return this.carrito.reduce((acc, art) => {
      const precioConDescuento = this.calcularPrecioConDescuento(art); // Este precio ya parte de un base con margen
      return acc + (precioConDescuento * (art.Cantidad ?? 1));
    }, 0);
  }

  // El IVA se calcula sobre el subtotalNeto (que ya tiene descuentos y margen)
  get iva(): number {
    // Corrección: El IVA generalmente se calcula sobre el subtotal después de descuentos.
    return this.subtotalNeto * 0.15;
  }

  get total(): number {
    // Total es subtotalNeto (con margen y descuentos) + IVA calculado sobre subtotalNeto
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

    const doc = new jsPDF();
    const fecha = new Date().toLocaleDateString('es-NI');

    doc.setFontSize(18);
    doc.text('PROFORMA DE VENTA', 105, 20, { align: 'center' });
    doc.setFontSize(10);
    doc.text('Ragganel Tech S.A.', 20, 30);
    doc.text('Colonia 14 de septiembre, Managua', 20, 35);
    doc.text('Tu RUC: J0000000000000', 20, 40);
    doc.text('Teléfono: +505 8643 9865', 20, 45);
    doc.text(`Fecha: ${fecha}`, 150, 30);
    doc.text(`Proforma #: P-${Date.now().toString().slice(-6)}`, 150, 35);

    doc.setFontSize(12);
    doc.text('Cliente:', 20, 60);
    doc.setFontSize(10);
    doc.text(`Nombre: ${this.ClienteSeleccionado.nombre || 'N/A'}`, 20, 67);
    doc.text(`Identificación: ${this.ClienteSeleccionado.ruc || 'N/A'}`, 20, 72);

    // Actualizamos el encabezado para reflejar que el Precio Unitario ya tiene el margen.
    // Si deseas mostrar el precio original y el margen por separado, necesitarías más columnas y datos.
    const head = [['Cant.', 'Artículo', 'P. Unit.', 'Desc. %', 'P. Desc.', 'Subtotal (sin IVA)']];
    const body = this.carrito.map(art => {
      // art.PrecioBase ya debería incluir el margen.
      const precioUnitarioConMargen = art.PrecioBase ?? 0;
      const cantidad = art.Cantidad ?? 1;
      const descuentoPorcentaje = art.DescuentoPorcentaje ?? 0;
      // calcularPrecioConDescuento toma el precioUnitarioConMargen y aplica el descuento.
      const precioConDescuento = this.calcularPrecioConDescuento(art);
      // El subtotal del artículo es el precio con descuento por la cantidad (esto es ANTES de IVA general).
      const subtotalArticuloSinIVA = precioConDescuento * cantidad;

      return [
        cantidad.toString(),
        art.NombreArticulo || 'N/A',
        precioUnitarioConMargen.toFixed(2), // P. Unit. (con margen aplicado)
        descuentoPorcentaje.toFixed(2),
        precioConDescuento.toFixed(2),    // Precio ya con descuento (calculado sobre base con margen)
        subtotalArticuloSinIVA.toFixed(2) // Subtotal del artículo (Precio con desc * Cantidad)
      ];
    });

    (doc as any).autoTable({
      startY: 85,
      head: head,
      body: body,
      theme: 'striped',
      headStyles: { fillColor: [22, 160, 133] }, // Verde azulado
      didDrawPage: (data: any) => {
        data.doc.setFontSize(8);
        const pageText = 'Página ' + data.pageNumber;
        const pageHeight = data.doc.internal.pageSize.getHeight();
        data.doc.text(pageText, data.settings.margin.left, pageHeight - 10);
      }
    });

    let finalY = (doc as any).lastAutoTable.finalY || 150;
    if (finalY > 260) { doc.addPage(); finalY = 20; }
    else { finalY += 10; }

    doc.setFontSize(10);
    const xAlignRight = 190;

    // Subtotal (Suma de todos los (PrecioBase con margen * Cantidad) ANTES de descuentos de línea)
    // Esto es lo que tu getter `subtotal` calcula.
    doc.text('Subtotal Bruto (s/desc):', 140, finalY, { align: 'right' });
    doc.text(`${this.subtotal.toFixed(2)} USD`, xAlignRight, finalY, { align: 'right' });
    finalY += 7;

    doc.text('Total Descuentos:', 140, finalY, { align: 'right' });
    doc.text(`-${this.totalDescuentos.toFixed(2)} USD`, xAlignRight, finalY, { align: 'right' });
    finalY += 7;

    // Subtotal Neto (con margen y descuentos, sin IVA)
    // Esto es lo que tu getter `subtotalNeto` calcula.
    doc.text('Subtotal Neto (s/IVA):', 140, finalY, { align: 'right' });
    doc.text(`${this.subtotalNeto.toFixed(2)} USD`, xAlignRight, finalY, { align: 'right' });
    finalY += 7;

    // IVA (calculado sobre el subtotalNeto)
    doc.text('IVA (15%):', 140, finalY, { align: 'right' });
    doc.text(`${this.iva.toFixed(2)} USD`, xAlignRight, finalY, { align: 'right' });
    finalY += 7;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    // Total (Subtotal Neto + IVA)
    doc.text('TOTAL A PAGAR:', 140, finalY, { align: 'right' });
    doc.text(`${this.total.toFixed(2)} USD`, xAlignRight, finalY, { align: 'right' });
    doc.setFont('helvetica', 'normal');

    finalY += 15;
    if (finalY > 270) { doc.addPage(); finalY = 20; }
    doc.setFontSize(8);
    doc.text('Esta proforma es válida por 15 días a partir de la fecha de emisión.', 20, finalY);
    doc.text('Precios sujetos a cambio sin previo aviso después de la fecha de validez.', 20, finalY + 4);
    doc.text('No incluye costos de envío si aplicasen.', 20, finalY + 8);

    doc.save(`Proforma-${this.ClienteSeleccionado.nombre?.replace(/\s/g, '_') || 'Cliente'}-${Date.now()}.pdf`);
  }
}


