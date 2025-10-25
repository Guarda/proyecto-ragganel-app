import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

import { VentasBaseService } from '../../../services/ventas-base.service';
import { NotasCreditoService } from '../../../services/notas-credito.service';
import { AuthService } from '../../../UI/session/auth.service';
import { Ventas } from '../../interfaces/ventas';
import { Usuarios } from '../../interfaces/usuarios';
import { VentaCompleta } from '../../interfaces/ventacompleta';
import { DetalleVentaCompleta } from '../../interfaces/detalleventacompleta';
import { DialogDescargarPdfProformaComponent } from '../dialog-descargar-pdf-proforma/dialog-descargar-pdf-proforma.component';
import { DialogDescargarPdfVentaComponent } from '../dialog-descargar-pdf-venta/dialog-descargar-pdf-venta.component';
import { CrearNotaCreditoComponent } from '../crear-nota-credito/crear-nota-credito.component';
import { Router } from '@angular/router';
import { DialogoConfirmacionComponent } from '../dialogo-confirmacion/dialogo-confirmacion.component';

import { TableStatePersistenceService } from '../../../services/table-state-persistence.service';
import { TableState } from '../../interfaces/table-state';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-listado-ventas',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule, MatTableModule, MatFormFieldModule, MatInputModule,
    MatSortModule, MatPaginatorModule, MatIconModule, MatButtonModule, MatDatepickerModule,
    MatNativeDateModule, MatTooltipModule
  ],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'es-NI' }],
  templateUrl: './listado-ventas.component.html',
  styleUrls: ['./listado-ventas.component.css']
})
export class ListadoVentasComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns: string[] = ['IdVentaPK', 'FechaCreacion', 'TipoDocumento', 'NumeroDocumento', 'Cliente', 'TotalVenta', 'EstadoVenta', 'Action'];
  dataSource = new MatTableDataSource<Ventas>();
  usuario!: Usuarios;

  private readonly tableStateKey = 'ventasTableState';
  private subscriptions = new Subscription();

  isLoading = true;
  errorMessage: string | null = null;

  fechaInicio: Date | null = null;
  fechaFin: Date | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('input') inputElement!: ElementRef<HTMLInputElement>;

  constructor(
    private ventasService: VentasBaseService,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private creditNotesService: NotasCreditoService,
    private router: Router,
    private stateService: TableStatePersistenceService
  ) { }

  ngOnInit(): void {
    this.cargarVentas();
    this.setupFilterPredicate();
  }

  ngOnDestroy(): void {
    this.saveState();
    this.subscriptions.unsubscribe();
  }

  private saveState(): void {
    if (!this.paginator || !this.sort) return;

    const state: TableState = {
      // El filtro en ventas ya es un string JSON, lo cual es perfecto
      filter: this.dataSource.filter,
      sortColumn: this.sort.active,
      sortDirection: this.sort.direction,
      pageIndex: this.paginator.pageIndex,
      pageSize: this.paginator.pageSize
    };
    this.stateService.saveState(this.tableStateKey, state);
  }

  private loadAndApplyState(): void {
    const state = this.stateService.loadState(this.tableStateKey);
    if (!state) return;

    // Restaura el filtro (texto y fechas)
    if (state.filter) {
      this.dataSource.filter = state.filter;
      const filterValues = JSON.parse(state.filter);

      // Timeout para asegurar que el elemento de input esté disponible
      setTimeout(() => {
        if (this.inputElement) {
          this.inputElement.nativeElement.value = filterValues.text || '';
        }
      }); this.fechaInicio = filterValues.start ? new Date(filterValues.start) : null;
      this.fechaFin = filterValues.end ? new Date(filterValues.end) : null;
    }

    // Restaura el paginador
    if (this.paginator) {
      this.paginator.pageIndex = state.pageIndex;
      this.paginator.pageSize = state.pageSize;
    }

    // Restaura el ordenamiento (con un pequeño retardo para asegurar que se aplique)
    setTimeout(() => {
      if (this.sort) {
        this.sort.active = state.sortColumn;
        this.sort.direction = state.sortDirection;
      }
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.loadAndApplyState();

    this.subscriptions.add(this.sort.sortChange.subscribe(() => this.saveState()));
    this.subscriptions.add(this.paginator.page.subscribe(() => this.saveState()));
  }

  cargarVentas(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.authService.getUser().subscribe({
      next: (usuariok: any) => {
        if (usuariok) {
          this.usuario = usuariok;
          this.ventasService.listarVentasPorUsuario(this.usuario).subscribe({
            next: (data: Ventas[]) => {
              // Se asignan los datos directamente, el pipe de Angular se encargará del formato y la zona horaria.
              this.dataSource.data = data;
              this.isLoading = false;
            },
            error: (error) => {
              console.error('Error al cargar las ventas:', error);
              this.errorMessage = 'No se pudieron cargar las ventas. Intente de nuevo más tarde.';
              this.isLoading = false;
            }
          });
        } else {
          this.errorMessage = 'No se pudo obtener el usuario autenticado.';
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.error('Error crítico al obtener el usuario:', err);
        this.errorMessage = 'Error de autenticación. Por favor, inicie sesión de nuevo.';
        this.isLoading = false;
      }
    });
  }

  public esProformaVigente(fechaCreacion: Date | string): boolean {
    const fechaProforma = new Date(fechaCreacion);
    const hoy = new Date();

    // Calcula la diferencia de tiempo en milisegundos
    const diferenciaMilisegundos = hoy.getTime() - fechaProforma.getTime();

    // Convierte la diferencia a días (1000ms * 60s * 60min * 24h)
    const diferenciaDias = diferenciaMilisegundos / (1000 * 60 * 60 * 24);

    // La proforma es vigente si han pasado menos de 15 días completos.
    return diferenciaDias < 15;
  }

  public abrirDialogoEliminar(venta: Ventas): void {
    const numeroDocumento = venta.NumeroDocumento || `ID ${venta.IdVentaPK}`;

    // Abrimos el diálogo personalizado
    const dialogRef = this.dialog.open(DialogoConfirmacionComponent, {
      width: '450px',
      // Pasamos los datos que nuestro diálogo espera
      data: {
        title: 'Confirmar Anulación de Proforma',
        message: `¿Estás seguro de que deseas anular la proforma N° ${numeroDocumento}? Esta acción no se puede deshacer.`
      }
    });

    // Nos suscribimos para saber qué botón presionó el usuario
    dialogRef.afterClosed().subscribe(result => {
      // El 'result' será 'true' si el usuario presionó "Confirmar"
      if (result === true) {
        this.procederConEliminacion(venta.IdVentaPK);
      }
    });
  }

  private procederConEliminacion(idProforma: number): void {
    this.snackBar.open('Eliminando proforma, por favor espera...', undefined, { duration: 2000 });

    this.ventasService.eliminarProforma(idProforma).subscribe({
      next: (response) => {
        // La eliminación fue exitosa
        this.snackBar.open(response.mensaje || 'Proforma eliminada con éxito.', 'OK', {
          duration: 5000,
          panelClass: ['snackbar-success'] // (Opcional) Clase para estilizar el snackbar de éxito
        });
        this.cargarVentas(); // ¡Importante! Recargamos la tabla para que el cambio se vea reflejado.
      },
      error: (err) => {
        // Ocurrió un error
        console.error('Error al eliminar la proforma:', err);
        // El errorHandler del servicio ya formatea el mensaje de error.
        this.snackBar.open(err.message, 'Cerrar', {
          duration: 6000,
          panelClass: ['snackbar-error'] // (Opcional) Clase para estilizar el snackbar de error
        });
      }
    });
  }

  /**
   * Configura un predicado de filtro personalizado para la tabla.
   * Esto permite filtrar por múltiples campos a la vez: texto y rango de fechas.
   */
  setupFilterPredicate(): void {
    this.dataSource.filterPredicate = (data: Ventas, filter: string): boolean => {
      const filterValues = JSON.parse(filter);

      const searchText = filterValues.text.trim().toLowerCase();
      const startDate = filterValues.start ? new Date(filterValues.start) : null;
      const endDate = filterValues.end ? new Date(filterValues.end) : null;

      // 1. Filtrado por texto
      const searchMatch = (
        data.IdVentaPK.toString().includes(searchText) ||
        data.NumeroDocumento?.toLowerCase().includes(searchText) ||
        data.Cliente.toLowerCase().includes(searchText) ||
        data.TipoDocumento.toLowerCase().includes(searchText) ||
        data.EstadoVenta.toLowerCase().includes(searchText)
      );

      // 2. Filtrado por fecha
      let dateMatch = true;
      if (startDate || endDate) {
        const itemDate = new Date(data.FechaCreacion);
        itemDate.setHours(0, 0, 0, 0); // Ignorar la hora para la comparación de fechas

        if (startDate && itemDate < startDate) {
          dateMatch = false;
        }
        if (endDate && itemDate > endDate) {
          dateMatch = false;
        }
      }

      return searchMatch && dateMatch;
    };
  }

  /**
   * Se ejecuta cada vez que cambia un filtro (texto o fecha).
   * Construye el objeto de filtro y lo aplica a la tabla.
   */
  aplicarFiltros(): void {
    const textoFiltro = this.inputElement?.nativeElement.value || ''; const fechaInicioNormalizada = this.fechaInicio ? new Date(this.fechaInicio.setHours(0, 0, 0, 0)) : null;
    const fechaFinNormalizada = this.fechaFin ? new Date(this.fechaFin.setHours(23, 59, 59, 999)) : null;

    const filterValues = {
      text: textoFiltro.trim().toLowerCase(),
      start: fechaInicioNormalizada,
      end: fechaFinNormalizada
    };

    this.dataSource.filter = JSON.stringify(filterValues);

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

    // --- AÑADIR ESTA LÍNEA AL FINAL ---
    this.saveState();
  }

  applyFilter(event: Event) {
    this.aplicarFiltros();
  }

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'pagado': return 'status-pagado';
      case 'anulado': return 'status-anulado';
      case 'pendiente': return 'status-pendiente';
      default: return 'status-default';
    }
  }

  // ... (El resto de tus métodos de descarga no necesitan cambios)
  abrirDialogoDescargar(venta: Ventas): void {
    const dialogRef = this.dialog.open(DialogDescargarPdfProformaComponent, {
      width: '450px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.procederConDescargaPDF(venta.IdVentaPK);
      }
    });
  }

  continuarVentaDesdeProforma(venta: Ventas): void {
    // Navegamos al punto de venta y pasamos el ID de la proforma
    // a través del "state" del router. Es una forma limpia de pasar datos
    // temporales durante la navegación.
    this.router.navigate(['/home/punto-venta'], {
      state: { idProformaACargar: venta.IdVentaPK }
    });
  }

  procederConDescargaPDF(idVenta: number): void {
    this.snackBar.open('Generando PDF, por favor espera...', undefined, { duration: 2000 });

    this.ventasService.getVentaCompleta(idVenta).subscribe({
      next: (response) => {
        if (response.success) {
          this.generarProformaPDF(response.data);
        } else {
          this.snackBar.open('Error: No se pudieron obtener los datos de la proforma.', 'Cerrar', { duration: 4000 });
        }
      },
      error: (err) => {
        console.error('Error al obtener los datos de la venta:', err);
        this.snackBar.open('Error de comunicación al obtener los datos de la proforma.', 'Cerrar', { duration: 4000 });
      }
    });
  }

  generarProformaPDF(data: { venta: VentaCompleta, detalles: DetalleVentaCompleta[] }): void {
    const { venta, detalles } = data;
    const doc = new jsPDF();
    const fecha = new Date(venta.FechaCreacion).toLocaleDateString('es-NI', { timeZone: 'UTC' });

    doc.setFontSize(18);
    doc.text('PROFORMA DE VENTA', 105, 20, { align: 'center' });
    doc.setFontSize(10);
    doc.text('Ragganel Tech S.A.', 20, 30);
    doc.text('Colonia 14 de septiembre, Managua', 20, 35);
    doc.text('RUC: J0000000000000', 20, 40);
    doc.text('Teléfono: +505 8643 9865', 20, 45);
    doc.text(`Fecha: ${fecha}`, 150, 30);
    doc.text(`Proforma #: ${venta.NumeroDocumento}`, 150, 35);

    doc.setFontSize(12);
    doc.text('Cliente:', 20, 60);
    doc.setFontSize(10);
    doc.text(`Nombre: ${venta.NombreCliente || 'N/A'}`, 20, 67);
    doc.text(`Identificación: ${venta.RUC || venta.DNI || 'N/A'}`, 20, 72);
    doc.text(`Tipo de Precio: ${venta.NombreMargen || 'N/A'}`, 20, 77);
    doc.text(`Vendedor: ${venta.NombreUsuario || 'N/A'}`, 20, 82);
    doc.text(`Código vendedor: ${venta.IdUsuario || 'N/A'}`, 20, 87);

    const head = [['Cant.', 'Código', 'Artículo', 'P. Unit.', 'Desc. %', 'P. c/Desc.', 'Subtotal']];
    // ... (alrededor de la línea 412)
    const body = detalles.map(item => {
      // Convertimos los valores (que llegan como string) a números
      const cantidad = +item.Cantidad;
      const subtotalLinea = +item.SubtotalLinea;
      const precioUnitario = +item.PrecioUnitario;
      const descuentoPorcentaje = +item.DescuentoPorcentaje;

      const precioConDescuento = subtotalLinea / cantidad;
      return [
        cantidad.toString(),
        item.CodigoArticulo,
        item.NombreArticulo,
        precioUnitario.toFixed(2), // <-- Corregido
        descuentoPorcentaje.toFixed(2), // <-- Corregido
        precioConDescuento.toFixed(2),
        subtotalLinea.toFixed(2) // <-- Corregido
      ];
    });

    (doc as any).autoTable({
      startY: 90,
      head,
      body,
      theme: 'striped',
      headStyles: { fillColor: [22, 160, 133] },
    });

    let finalY = (doc as any).lastAutoTable.finalY + 10;
    if (finalY > 260) { doc.addPage(); finalY = 20; }

    const totalDescuentos = detalles.reduce((acc, item) => acc + (item.PrecioUnitario * item.Cantidad - item.SubtotalLinea), 0);
    const subtotalVentaNum = +venta.SubtotalVenta;
    const ivaNum = +venta.IVA;
    const totalVentaNum = +venta.TotalVenta;
    const subtotalBruto = subtotalVentaNum + totalDescuentos;

    const xAlignRight = 190;
    doc.setFontSize(10);
    doc.text('Subtotal Bruto:', 140, finalY, { align: 'right' });
    doc.text(`${subtotalBruto.toFixed(2)} USD`, xAlignRight, finalY, { align: 'right' }); // <-- Corregido
    finalY += 7;
    doc.text('Total Descuentos:', 140, finalY, { align: 'right' });
    doc.text(`-${totalDescuentos.toFixed(2)} USD`, xAlignRight, finalY, { align: 'right' });
    finalY += 7;
    doc.text('Subtotal Neto (s/IVA):', 140, finalY, { align: 'right' });
    doc.text(`${subtotalVentaNum.toFixed(2)} USD`, xAlignRight, finalY, { align: 'right' }); // <-- Corregido
    finalY += 7;
    doc.text('IVA (15%):', 140, finalY, { align: 'right' });
    doc.text(`${ivaNum.toFixed(2)} USD`, xAlignRight, finalY, { align: 'right' }); // <-- Corregido
    finalY += 7;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL PAGADO:', 140, finalY, { align: 'right' });
    doc.text(`${totalVentaNum.toFixed(2)} USD`, xAlignRight, finalY, { align: 'right' }); // <-- Corregido

    finalY += 15;
    if (finalY > 270) { doc.addPage(); finalY = 20; }
    doc.setFontSize(8);
    doc.text('Esta proforma es válida por 15 días. Precios y disponibilidad sujetos a cambio.', 20, finalY);

    const nombreArchivo = `Proforma-${venta.NumeroDocumento}-${venta.NombreCliente?.replace(/\s/g, '_') || 'Cliente'}.pdf`;
    doc.save(nombreArchivo);
    this.snackBar.open(`PDF "${nombreArchivo}" generado.`, 'OK', { duration: 3000 });
  }

  abrirDialogoFactura(venta: Ventas): void {
    const dialogRef = this.dialog.open(DialogDescargarPdfVentaComponent, {
      width: '450px'
    });

    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado && resultado.confirmado) {
        this.snackBar.open(`Generando Factura en formato ${resultado.formato}...`, undefined, { duration: 2000 });
        this.procederConDescargaFactura(venta.IdVentaPK, resultado.formato);
      }
    });
  }

  procederConDescargaFactura(idVenta: number, formato: 'completo' | 'voucher'): void {
    this.ventasService.getVentaCompleta(idVenta).subscribe({
      next: (response) => {
        if (response.success) {
          this.generarFacturaPDF(response.data, formato);
        } else {
          this.snackBar.open('Error: No se pudieron obtener los datos de la factura.', 'Cerrar', { duration: 4000 });
        }
      },
      error: (err) => {
        console.error('Error al obtener los datos de la venta:', err);
        this.snackBar.open('Error de comunicación al obtener los datos de la factura.', 'Cerrar', { duration: 4000 });
      }
    });
  }

  generarFacturaPDF(data: { venta: VentaCompleta, detalles: DetalleVentaCompleta[] }, formato: 'completo' | 'voucher'): void {
    if (formato === 'completo') {
      this.generarFacturaFormatoCompleto(data);
    } else {
      this.generarFacturaFormatoVoucher(data);
    }
  }

  generarFacturaFormatoCompleto(data: { venta: VentaCompleta, detalles: DetalleVentaCompleta[] }): void {
    const { venta, detalles } = data;
    const doc = new jsPDF();
    const fecha = new Date(venta.FechaCreacion).toLocaleDateString('es-NI', { timeZone: 'UTC' });

    doc.setFontSize(18);
    doc.text('FACTURA DE VENTA', 105, 20, { align: 'center' });
    doc.setFontSize(10);
    doc.text('Ragganel Tech S.A.', 20, 30);
    doc.text('Colonia 14 de septiembre, Managua', 20, 35);
    doc.text('RUC: J0000000000000', 20, 40);
    doc.text('Teléfono: +505 8643 9865', 20, 45);
    doc.text(`Fecha: ${fecha}`, 150, 30);
    doc.text(`Factura #: ${venta.NumeroDocumento}`, 150, 35);

    doc.setFontSize(12);
    doc.text('Cliente:', 20, 60);
    doc.setFontSize(10);
    doc.text(`Nombre: ${venta.NombreCliente || 'N/A'}`, 20, 67);
    doc.text(`Identificación: ${venta.RUC || venta.DNI || 'N/A'}`, 20, 72);
    doc.text(`Tipo de Precio: ${venta.NombreMargen || 'N/A'}`, 20, 77);
    doc.text(`Vendedor: ${venta.NombreUsuario || 'N/A'}`, 20, 82);
    doc.text(`Código vendedor: ${venta.IdUsuario || 'N/A'}`, 20, 87);

    (doc as any).autoTable({
      startY: 92,
      head: [['Cant.', 'Código', 'Artículo', 'P. Unit.', 'Desc. %', 'P. c/Desc.', 'Subtotal']],
      // ... (alrededor de la línea 536)
      body: detalles.map(item => {
        // Convertimos los valores (que llegan como string) a números
        const cantidad = +item.Cantidad;
        const subtotalLinea = +item.SubtotalLinea;
        const precioUnitario = +item.PrecioUnitario;
        const descuentoPorcentaje = +item.DescuentoPorcentaje;

        const precioConDescuento = subtotalLinea / cantidad;
        return [
          cantidad.toString(),
          item.CodigoArticulo,
          item.NombreArticulo,
          precioUnitario.toFixed(2), // <-- Corregido
          descuentoPorcentaje.toFixed(2), // <-- Corregido
          precioConDescuento.toFixed(2),
          subtotalLinea.toFixed(2) // <-- Corregido
        ];
      }),
      // ...
      theme: 'striped',
      headStyles: { fillColor: [41, 128, 185] },
    });

    let finalY = (doc as any).lastAutoTable.finalY + 10;
    const xAlignRight = 190;

    const totalDescuentos = detalles.reduce((acc, item) => acc + (item.PrecioUnitario * item.Cantidad - item.SubtotalLinea), 0);
    const subtotalVentaNum = +venta.SubtotalVenta;
    const ivaNum = +venta.IVA;
    const totalVentaNum = +venta.TotalVenta;
    const subtotalBruto = subtotalVentaNum + totalDescuentos;

    doc.setFontSize(10);
    doc.text('Subtotal Bruto:', 140, finalY, { align: 'right' });
    doc.text(`${subtotalBruto.toFixed(2)} USD`, xAlignRight, finalY, { align: 'right' }); // <-- Corregido
    finalY += 7;
    doc.text('Total Descuentos:', 140, finalY, { align: 'right' });
    doc.text(`-${totalDescuentos.toFixed(2)} USD`, xAlignRight, finalY, { align: 'right' });
    finalY += 7;
    doc.text('Subtotal Neto (s/IVA):', 140, finalY, { align: 'right' });
    doc.text(`${subtotalVentaNum.toFixed(2)} USD`, xAlignRight, finalY, { align: 'right' }); // <-- Corregido
    finalY += 7;
    doc.text('IVA (15%):', 140, finalY, { align: 'right' });
    doc.text(`${ivaNum.toFixed(2)} USD`, xAlignRight, finalY, { align: 'right' }); // <-- Corregido
    finalY += 7;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL PAGADO:', 140, finalY, { align: 'right' });
    doc.text(`${totalVentaNum.toFixed(2)} USD`, xAlignRight, finalY, { align: 'right' }); // <-- Corregido

    const nombreArchivo = `Factura-${venta.NumeroDocumento}.pdf`;
    doc.save(nombreArchivo);
    this.snackBar.open(`Factura "${nombreArchivo}" generada.`, 'OK', { duration: 3000 });
  }

  generarFacturaFormatoVoucher(data: { venta: VentaCompleta, detalles: DetalleVentaCompleta[] }): void {
    const { venta, detalles } = data;
    const anchoVoucher = 80; // Ancho en mm
    let yPos = 10;
    const margen = 5;
    const centro = anchoVoucher / 2;

    const doc = new jsPDF({ unit: 'mm', format: [anchoVoucher, 200] });

    // --- ENCABEZADO MEJORADO ---
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('Ragganel Tech S.A.', centro, yPos, { align: 'center' }); // 
    yPos += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(`Factura: ${venta.NumeroDocumento}`, centro, yPos, { align: 'center' }); // 
    yPos += 5;
    const fecha = new Date(venta.FechaCreacion).toLocaleString('es-NI', { timeZone: 'UTC' });
    doc.text(`Fecha: ${fecha}`, centro, yPos, { align: 'center' }); // 
    yPos += 5;
    const separador = '-'.repeat(45);
    doc.text(separador, centro, yPos, { align: 'center' });
    yPos += 5;

    // --- CUERPO CON AJUSTE DE TEXTO (WRAP) ---
    // ... (alrededor de la línea 594)
    // ... (dentro de generarFacturaFormatoVoucher)

    // --- CUERPO CON AJUSTE DE TEXTO (WRAP) ---
    detalles.forEach(item => {
      const textoArticulo = `${item.Cantidad} x ${item.NombreArticulo}`;

      // **ESTA ES LA LÍNEA QUE FALTABA:**
      // Divide el texto largo en un array de líneas que caben en el ancho.
      const lineas = doc.splitTextToSize(textoArticulo, anchoVoucher - margen * 2);

      // Se imprime cada línea del artículo.
      doc.text(lineas, margen, yPos);
      yPos += (lineas.length * 4); // Aumenta el espacio vertical según el número de líneas

      // Convertimos los valores (que llegan como string) a números
      const cantidad = +item.Cantidad;
      const subtotalLinea = +item.SubtotalLinea;

      const precioUnitario = subtotalLinea / cantidad;
      const lineaPrecio = `@ ${precioUnitario.toFixed(2)} ...... ${subtotalLinea.toFixed(2)}`;
      doc.text(lineaPrecio, anchoVoucher - margen, yPos, { align: 'right' });
      yPos += 6; // Un poco más de espacio entre artículos
    });

    doc.text(separador, centro, yPos, { align: 'center' });
    yPos += 5;

    // --- TOTALES CON MEJOR ALINEACIÓN ---
    const xEtiqueta = 45;
    const xValor = anchoVoucher - margen;

    const subtotalVentaNum = +venta.SubtotalVenta;
    const ivaNum = +venta.IVA;
    const totalVentaNum = +venta.TotalVenta;

    doc.setFont('helvetica', 'bold');
    doc.text('Subtotal:', xEtiqueta, yPos, { align: 'right' });
    doc.text(subtotalVentaNum.toFixed(2), xValor, yPos, { align: 'right' }); // <-- Corregido
    yPos += 5;

    doc.text('IVA (15%):', xEtiqueta, yPos, { align: 'right' });
    doc.text(ivaNum.toFixed(2), xValor, yPos, { align: 'right' }); // <-- Corregido
    yPos += 5;

    doc.setFontSize(10);
    doc.text('TOTAL:', xEtiqueta, yPos, { align: 'right' });
    doc.text(totalVentaNum.toFixed(2), xValor, yPos, { align: 'right' }); // <-- Corregido
    yPos += 10;

    // --- PIE DE PÁGINA ---
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.text('¡Gracias por su compra!', centro, yPos, { align: 'center' }); // 

    // --- GUARDAR PDF ---
    const nombreArchivo = `Voucher-${venta.NumeroDocumento}.pdf`;
    doc.save(nombreArchivo);
    this.snackBar.open(`Voucher "${nombreArchivo}" generado.`, 'OK', { duration: 3000 });
  }

  abrirDialogoCrearNotaCredito(venta: Ventas): void {
    this.snackBar.open('Cargando detalles de la factura...', undefined, { duration: 2000 });

    this.ventasService.getVentaCompleta(venta.IdVentaPK).subscribe({
      next: (response) => {
        if (response.success) {
          const dialogRef = this.dialog.open(CrearNotaCreditoComponent, {
            width: '800px',
            data: {
              venta: response.data.venta,
              detalles: response.data.detalles,
              usuario: this.usuario // Pasamos el usuario para el emisor
            }
          });

          // --- SECCIÓN MODIFICADA ---
          dialogRef.afterClosed().subscribe(resultadoDialogo => {
            // Si el usuario confirmó y el diálogo devolvió datos...
            if (resultadoDialogo) {

              // Preparamos el objeto final para el endpoint
              const datosParaApi = {
                IdVentaFK: venta.IdVentaPK,
                UsuarioEmisorFK: this.usuario.id, // ID del usuario en sesión
                IdMotivoFK: resultadoDialogo.IdMotivoFK,
                Observaciones: resultadoDialogo.Observaciones,
                TotalCredito: resultadoDialogo.TotalCredito,
                anularFactura: resultadoDialogo.anularFactura,
                Detalles: resultadoDialogo.Detalles
              };

              this.snackBar.open('Registrando Nota de Crédito...', undefined, { duration: 3000 });

              // Llamamos al nuevo servicio dedicado
              this.creditNotesService.crearNotaCredito(datosParaApi).subscribe({
                next: (respuestaApi) => {
                  this.snackBar.open(respuestaApi.mensaje || 'Nota de crédito creada con éxito.', 'OK', { duration: 5000 });
                  this.cargarVentas(); // Recargamos la lista para ver los cambios (ej: factura anulada)
                },
                error: (err) => {
                  console.error("Error al crear la nota de crédito:", err);
                  this.snackBar.open('Error al registrar la nota de crédito. Revise la consola.', 'Cerrar', { duration: 5000 });
                }
              });
            }
          });

        } else {
          this.snackBar.open('Error: No se pudieron obtener los detalles de la factura.', 'Cerrar', { duration: 4000 });
        }
      },
      error: (err) => {
        console.error('Error al obtener los datos de la venta:', err);
        this.snackBar.open('Error de comunicación al obtener los detalles.', 'Cerrar', { duration: 4000 });
      }
    });
  }

}