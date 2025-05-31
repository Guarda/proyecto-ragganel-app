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
      console.log('Margenes de venta obtenidos:', margenes);
      // Asignar el valor por defecto de 35%
      const margenPorDefecto = this.margenesVenta.find(m => m.Porcentaje === 35);
      if (margenPorDefecto) {
        this.margenSeleccionado = margenPorDefecto.Porcentaje;
      }
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

   // --- Métodos para descuento ---
  actualizarDescuento(articulo: ArticuloVenta, nuevoDescuentoEvent: any): void {
    let nuevoDescuento = parseFloat(nuevoDescuentoEvent); // ngModel pasa el valor directamente
    if (isNaN(nuevoDescuento) || nuevoDescuento < 0) {
      nuevoDescuento = 0;
    } else if (nuevoDescuento > 100) {
      nuevoDescuento = 100;
    }
    // Actualizamos directamente en el objeto del carrito, lo que dispara la detección de cambios de Angular
    // y los getters se recalcularán.
    // Para forzar la actualización si es necesario, o si tienes ChangeDetectionStrategy.OnPush,
    // puedes llamar al servicio para actualizarlo y que emita un nuevo array.
    this.carritoService.actualizarDescuentoArticulo(articulo.Codigo!, articulo.Tipo, nuevoDescuento);
  }

  formatearDescuento(articulo: ArticuloVenta): void {
    // Opcional: si el input queda vacío, ponerlo a 0 o al valor anterior.
    if (articulo.DescuentoPorcentaje == null || isNaN(articulo.DescuentoPorcentaje)) {
      // Llama al servicio para asegurar que el valor se normalice si es inválido
       this.carritoService.actualizarDescuentoArticulo(articulo.Codigo!, articulo.Tipo, 0);
    }
  }


  // --- Cálculos de artículos individuales con descuento ---
  calcularPrecioConDescuento(art: ArticuloVenta): number {
    const precioBase = art.PrecioBase ?? 0;
    const descuento = art.DescuentoPorcentaje ?? 0;
    return precioBase * (1 - descuento / 100);
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


  // --- Cálculos generales (Getters actualizados) ---
  get subtotal(): number { // Subtotal original (suma de PrecioBase * Cantidad)
    return this.carrito.reduce((acc, art) => {
      return acc + (art.PrecioBase ?? 0) * (art.Cantidad ?? 1);
    }, 0);
  }

  get totalDescuentos(): number { // Suma total de los descuentos aplicados
    return this.carrito.reduce((acc, art) => {
      const precioBase = art.PrecioBase ?? 0;
      const descuentoPorcentaje = art.DescuentoPorcentaje ?? 0;
      const cantidad = art.Cantidad ?? 1;
      const descuentoValor = (precioBase * (descuentoPorcentaje / 100)) * cantidad;
      return acc + descuentoValor;
    }, 0);
  }

  get subtotalNeto(): number { // Subtotal después de descuentos, antes de IVA
    return this.carrito.reduce((acc, art) => {
      const precioConDescuento = this.calcularPrecioConDescuento(art);
      return acc + (precioConDescuento * (art.Cantidad ?? 1));
    }, 0);
  }

  get iva(): number {
    return this.subtotal * 0.15;
  }

  get total(): number {
    return this.subtotal + this.iva;
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

  agregarArticuloPorCodigoDesdeInput(codigo: string): void {
    const codigoLimpio = codigo.trim();
    if (!codigoLimpio) {
      console.warn('El código del artículo no puede estar vacío.');
      // Podrías usar MatSnackBar aquí para feedback al usuario
      return;
    }

    if (this.tablaArticulos) {
      const resultado = this.tablaArticulos.agregarArticuloPorCodigo(codigoLimpio);
      switch (resultado) {
        case 'AGREGADO':
          console.log(`Artículo ${codigoLimpio} agregado al carrito.`);
          // MatSnackBar para éxito
          break;
        case 'NO_ENCONTRADO':
          alert(`Artículo con código "${codigoLimpio}" no encontrado.`);
          console.warn(`Artículo con código "${codigoLimpio}" no encontrado.`);
          break;
        case 'SIN_STOCK':
          alert(`Artículo con código "${codigoLimpio}" sin stock.`);
          console.warn(`Artículo con código "${codigoLimpio}" sin stock.`);
          break;
        case 'ERROR_CARGA':
          alert('Error: La lista de artículos no está disponible. Intente más tarde.');
          console.error('Error: Lista de artículos originales no cargada en TablaArticulosVentasComponent.');
          break;
      }
    } else {
      alert('Error: No se puede acceder al listado de artículos. Intente de nuevo.');
      console.error('Referencia a TablaArticulosVentasComponent no disponible.');
    }
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

    const doc = new jsPDF(); // Ya no necesitas el cast "(as jsPDFWithAutoTable)"
    const fecha = new Date().toLocaleDateString('es-NI');

    // --- Título y Datos de la Empresa (Ejemplo) ---
    doc.setFontSize(18);
    doc.text('PROFORMA DE VENTA', 105, 20, { align: 'center' });
    doc.setFontSize(10);
    doc.text('Tu Nombre de Empresa S.A.', 20, 30);
    doc.text('Tu Dirección, Ciudad', 20, 35);
    doc.text('Tu RUC: J0000000000000', 20, 40);
    doc.text('Teléfono: +505 8888 8888', 20, 45);
    doc.text(`Fecha: ${fecha}`, 150, 30);
    doc.text(`Proforma #: P-${Date.now().toString().slice(-6)}`, 150, 35); // Un ID simple

    // --- Datos del Cliente ---
    doc.setFontSize(12);
    doc.text('Cliente:', 20, 60);
    doc.setFontSize(10);
    doc.text(`Nombre: ${this.ClienteSeleccionado.nombre || 'N/A'}`, 20, 67);
    doc.text(`Identificación: ${this.ClienteSeleccionado.ruc || 'N/A'}`, 20, 72);
    // Añade más datos del cliente si los tienes y son relevantes (teléfono, dirección, etc.)
    // doc.text(`Teléfono: ${this.ClienteSeleccionado.telefono || 'N/A'}`, 20, 77);
    // doc.text(`Dirección: ${this.ClienteSeleccionado.direccion || 'N/A'}`, 20, 82);

    // --- Tabla de Artículos ---
    const head = [['Cant.', 'Artículo', 'P. Unit.', 'Desc. %', 'P. Desc.', 'Subtotal (sin IVA)']];
    const body = this.carrito.map(art => {
      const precioBase = art.PrecioBase ?? 0;
      const cantidad = art.Cantidad ?? 1;
      const descuentoPorcentaje = art.DescuentoPorcentaje ?? 0;
      const precioConDescuento = this.calcularPrecioConDescuento(art); // Ya calcula precioBase * (1 - desc/100)
      const subtotalArticuloSinIVA = precioConDescuento * cantidad;

      return [
        cantidad.toString(),
        art.NombreArticulo || 'N/A',
        precioBase.toFixed(2),
        descuentoPorcentaje.toFixed(2),
        precioConDescuento.toFixed(2),
        subtotalArticuloSinIVA.toFixed(2)
      ];
    });

    // Así llamas a autoTable ahora
    (doc as any).autoTable({
      startY: 85,
      head: head,
      body: body,
      theme: 'striped',
      headStyles: { fillColor: [22, 160, 133] },
      didDrawPage: (data: any) => { // data es el objeto que pasa autoTable
        data.doc.setFontSize(8);
        const pageText = 'Página ' + data.pageNumber;
        // Para obtener el alto de la página de forma segura:
        const pageHeight = data.doc.internal.pageSize.getHeight();
        data.doc.text(pageText, data.settings.margin.left, pageHeight - 10);
      }
    });

    // --- Totales ---
    let finalY = (doc as any).lastAutoTable.finalY || 150; // Obtener la posición Y después de la tabla
    if (finalY > 260) { // Si la tabla es muy larga y empuja los totales fuera, nueva página
        doc.addPage();
        finalY = 20; // Resetear Y para la nueva página
    } else {
        finalY += 10; // Espacio después de la tabla
    }

    doc.setFontSize(10);
    const xAlignRight = 190; // Para alinear texto a la derecha

    doc.text('Subtotal (sin IVA):', 140, finalY, { align: 'right' });
    doc.text(`${this.subtotal.toFixed(2)} USD`, xAlignRight, finalY, { align: 'right' });
    finalY += 7;

    doc.text('Total Descuentos:', 140, finalY, { align: 'right' });
    doc.text(`-${this.totalDescuentos.toFixed(2)} USD`, xAlignRight, finalY, { align: 'right' });
    finalY += 7;

    doc.text('Subtotal Neto (con desc, sin IVA):', 140, finalY, { align: 'right' });
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


    // --- Pie de página o Condiciones (Ejemplo) ---
    finalY += 15;
    if (finalY > 270) {
        doc.addPage();
        finalY = 20;
    }
    doc.setFontSize(8);
    doc.text('Esta proforma es válida por 15 días a partir de la fecha de emisión.', 20, finalY);
    doc.text('Precios sujetos a cambio sin previo aviso después de la fecha de validez.', 20, finalY + 4);
    doc.text('No incluye costos de envío si aplicasen.', 20, finalY + 8);


    // --- Guardar o Abrir PDF ---
    doc.save(`Proforma-${this.ClienteSeleccionado.nombre?.replace(/\s/g, '_') || 'Cliente'}-${Date.now()}.pdf`);
    // Para abrir en una nueva pestaña en lugar de descargar (puede ser bloqueado por pop-up blockers):
    // window.open(doc.output('bloburl'), '_blank');
  }
}


