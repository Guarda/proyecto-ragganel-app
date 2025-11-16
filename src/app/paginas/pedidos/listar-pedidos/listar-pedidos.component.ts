import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatTabGroup, MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import * as XLSX from 'xlsx';

import { TablaPedidosComponent } from '../tabla-pedidos/tabla-pedidos.component';
import { AgregarPedidoComponent } from '../agregar-pedido/agregar-pedido.component';
import { PedidoService } from '../../../services/pedido.service';
import { Pedido } from '../../interfaces/pedido';

@Component({
    selector: 'app-listar-pedidos',
    standalone: true,
    imports: [
        CommonModule, RouterModule, MatTableModule, MatFormFieldModule, MatInputModule,
        MatSortModule, MatPaginatorModule, MatIconModule, MatButtonModule, MatTabsModule,
        TablaPedidosComponent, MatProgressSpinnerModule, MatTooltipModule,
        DatePipe,
        MatSnackBarModule
    ],
    providers: [DatePipe],
    templateUrl: './listar-pedidos.component.html',
    styleUrls: ['./listar-pedidos.component.css']
})
export class ListarPedidosComponent implements OnInit {

  @ViewChild(MatTabGroup) tabGroup!: MatTabGroup;
  @ViewChild('input') inputElement!: ElementRef<HTMLInputElement>;

  displayedColumns: string[] = ['CodigoPedido', 'FechaCreacionPedido', 'FechaArriboEstadosUnidos', 'FechaIngreso', 'DescripcionEstadoPedido', 'NumeroTracking1', 'SubtotalArticulos', 'TotalPedido', 'Action'];

  // Propiedades para manejar estados de UI
  isLoading = true;
  errorMessage: string | null = null;

  // Arrays para cada pestaña
  pedidosEnEspera: Pedido[] = [];
  pedidosEnTransito: Pedido[] = [];
  pedidosRecibidosUSA: Pedido[] = [];
  pedidosEnAduana: Pedido[] = [];
  pedidosRecibidos: Pedido[] = [];
  pedidosCancelados: Pedido[] = [];
  
  filterValue: string = '';

  constructor(
    private pedidoService: PedidoService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.cargarPedidos();
  }

  cargarPedidos(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.pedidoService.getAll().subscribe({
      next: (data: Pedido[]) => {
        // Procesamos las fechas en todos los pedidos
        const datosProcesados = data.map(pedido => ({
          ...pedido,
          FechaCreacionPedido: this.parsearFecha(pedido.FechaCreacionPedido),
          FechaArriboEstadosUnidos: this.parsearFecha(pedido.FechaArriboUSA),
          FechaIngreso: this.parsearFecha(pedido.FechaEstimadaRecepcion),
        }));

        // Filtramos los pedidos por estado en sus respectivos arrays
        this.pedidosEnEspera = datosProcesados.filter(p => p.Estado === 'En espera');
        this.pedidosEnTransito = datosProcesados.filter(p => p.Estado === 'En tránsito');
        this.pedidosRecibidosUSA = datosProcesados.filter(p => p.Estado === 'Recibido en Estados Unidos');
        this.pedidosEnAduana = datosProcesados.filter(p => p.Estado === 'En aduana/agencia');
        this.pedidosRecibidos = datosProcesados.filter(p => p.Estado === 'Recibido');
        this.pedidosCancelados = datosProcesados.filter(p => p.Estado === 'Cancelado');

        this.isLoading = false;
      },
      error: (err) => {
        console.error("Error al cargar pedidos:", err);
        this.errorMessage = "No se pudieron cargar los pedidos. Intente de nuevo más tarde.";
        this.isLoading = false;
      }
    });
  }

  private parsearFecha(fechaStr: string | Date | undefined | null): Date | null {
  // 1. Si la entrada es nula, indefinida o ya es una fecha, se maneja igual.
  if (!fechaStr) return null;
  if (fechaStr instanceof Date) return fechaStr;

  // 2. Primero, intentamos parsear el formato "dd/MM/yyyy" manualmente.
  const partes = fechaStr.split('/');
  if (partes.length === 3) {
    const dia = parseInt(partes[0], 10);
    const mes = parseInt(partes[1], 10) - 1; // Meses en JS son de 0 a 11
    const anio = parseInt(partes[2], 10);
    // Se valida que las partes sean números válidos.
    if (!isNaN(dia) && !isNaN(mes) && !isNaN(anio)) {
      return new Date(anio, mes, dia);
    }
  }

  // 3. Si no es "dd/MM/yyyy", intentamos la conversión directa (para YYYY-MM-DD, etc.).
  const fecha = new Date(fechaStr);
  if (!isNaN(fecha.getTime())) {
    return fecha;
  }

  // 4. Si todo lo demás falla, devolvemos null.
  return null;
}

  public openDialogAgregar() {
    const dialogRef = this.dialog.open(AgregarPedidoComponent, {
      width: '95%',
      height: '90%',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargarPedidos();
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.filterValue = filterValue;
    this.selectTabForFilter(filterValue);
  }

  selectTabForFilter(filterValue: string) {
    if (!filterValue) return;

    if (this.pedidosEnEspera.some(p => p.CodigoPedido.toLowerCase().includes(filterValue))) {
      this.tabGroup.selectedIndex = 0;
    } else if (this.pedidosEnTransito.some(p => p.CodigoPedido.toLowerCase().includes(filterValue))) {
      this.tabGroup.selectedIndex = 1;
    } else if (this.pedidosRecibidosUSA.some(p => p.CodigoPedido.toLowerCase().includes(filterValue))) {
      this.tabGroup.selectedIndex = 2;
    } else if (this.pedidosEnAduana.some(p => p.CodigoPedido.toLowerCase().includes(filterValue))) {
      this.tabGroup.selectedIndex = 3;
    } else if (this.pedidosRecibidos.some(p => p.CodigoPedido.toLowerCase().includes(filterValue))) {
      this.tabGroup.selectedIndex = 4;
    } else if (this.pedidosCancelados.some(p => p.CodigoPedido.toLowerCase().includes(filterValue))) {
      this.tabGroup.selectedIndex = 5;
    }
  }

  /**
   * Limpia el filtro de texto y lo propaga a las tablas hijas.
   */
  public resetearFiltros(): void {
    if (this.inputElement) {
      this.inputElement.nativeElement.value = '';
    }
    this.filterValue = '';
    // La propiedad filterValue se pasa automáticamente a las tablas hijas,
    // por lo que se actualizarán.
  }

  /**
   * Exporta los datos de todas las pestañas (excepto "borrados", si los hubiera)
   * aplicando el filtro de texto actual.
   */
  public descargarExcel(): void {
    this.snackBar.open('Generando reporte Excel...', undefined, { duration: 2000 });

    // 1. Combinar todos los pedidos. Como dijiste, "cancelados pueden ir".
    // No hay un estado "borrado", así que incluimos todos los arrays.
    const todosLosPedidos = [
      ...this.pedidosEnEspera,
      ...this.pedidosEnTransito,
      ...this.pedidosRecibidosUSA,
      ...this.pedidosEnAduana,
      ...this.pedidosRecibidos,
      ...this.pedidosCancelados
    ];

    // 2. Aplicar el filtro de texto actual (que se usa para Código de Pedido)
    const filtro = this.filterValue.trim().toLowerCase();
    
    const datosFiltrados = filtro
      ? todosLosPedidos.filter(p => p.CodigoPedido.toLowerCase().includes(filtro))
      : todosLosPedidos; // Si no hay filtro, exporta todo

    if (datosFiltrados.length === 0) {
      this.snackBar.open('No hay datos para exportar con el filtro actual.', 'Cerrar', { duration: 3000 });
      return;
    }

    // 3. Mapear a formato Excel
    // Usamos los campos que ya procesaste
    const excelData = datosFiltrados.map(p => ({
      'Código': p.CodigoPedido,
      'Estado': p.Estado, // El campo real que usas para filtrar
      'Fecha Creación': this.datePipe.transform(p.FechaCreacionPedido, 'dd/MM/yyyy'),
      'Fecha Arribo USA': this.datePipe.transform(p.FechaArriboEstadosUnidos, 'dd/MM/yyyy'),
      'Fecha Ingreso Taller': this.datePipe.transform(p.FechaIngreso, 'dd/MM/yyyy'),
      'Tracking': p.NumeroTracking1,
      'Subtotal': p.SubtotalArticulos,
      'Total': p.TotalPedido
    }));

    // 4. Crear y descargar el archivo
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(excelData);
    ws['!cols'] = [
      { wch: 20 }, // Código
      { wch: 25 }, // Estado
      { wch: 15 }, // Fecha Creación
      { wch: 18 }, // Fecha Arribo USA
      { wch: 20 }, // Fecha Ingreso Taller
      { wch: 25 }, // Tracking
      { wch: 12 }, // Subtotal
      { wch: 12 }  // Total
    ];

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Pedidos');
    XLSX.writeFile(wb, 'Reporte_Pedidos_General.xlsx');
  }
}