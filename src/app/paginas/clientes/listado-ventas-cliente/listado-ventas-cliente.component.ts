import { Component, Input, OnChanges, SimpleChanges, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

// Imports de Angular Material
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import * as XLSX from 'xlsx';

import { ClientesService } from '../../../services/clientes.service';

import { VentaCliente } from '../../interfaces/ventacliente';

@Component({
    selector: 'app-listado-ventas-cliente',
    standalone: true,
    imports: [
        CommonModule,
        MatTableModule,
        MatSortModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        MatIconModule,
        MatButtonModule,
        DatePipe,
        MatSnackBarModule
    ],
    providers: [DatePipe],
    templateUrl: './listado-ventas-cliente.component.html',
    styleUrls: ['./listado-ventas-cliente.component.css']
})
export class ListadoVentasClienteComponent implements OnChanges, AfterViewInit {
  
  // 1. Recibe el ID del cliente desde el componente padre
  @Input() clienteId: number = 0;

  displayedColumns: string[] = ['NumeroDocumento', 'FechaCreacion', 'TotalVenta', 'EstadoVenta', 'MotivoAnulacion'];
  dataSource = new MatTableDataSource<VentaCliente>();
  
  isLoading = true;
  errorMessage: string | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private clientesService: ClientesService,
    private snackBar: MatSnackBar,
    private datePipe: DatePipe
  ) {}

  // 2. Detecta cambios en el Input (cuando el padre le pasa el ID)
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['clienteId'] && changes['clienteId'].currentValue > 0) {
      this.cargarVentas();
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  cargarVentas(): void {
    if (!this.clienteId) return;

    this.isLoading = true;
    this.errorMessage = null;
    this.clientesService.getVentasPorCliente(this.clienteId).subscribe({
      next: (ventas) => {
        this.dataSource.data = ventas;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = "No se pudieron cargar las ventas del cliente.";
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  getEstadoClass(estado: string): string {
    switch (estado.toLowerCase()) {
      case 'pagado': return 'status-pagado';
      case 'anulado': return 'status-anulado';
      default: return 'status-pendiente';
    }
  }

  /**
   * Exporta los datos actualmente mostrados (y ordenados) a un archivo Excel.
   */
  public descargarExcel(): void {
    this.snackBar.open('Generando reporte Excel...', undefined, { duration: 2000 });

    // Usamos .filteredData para respetar el orden aplicado por MatSort
    // (Aunque no hay filtro, MatSort usa esta propiedad)
    const data = this.dataSource.filteredData;

    if (data.length === 0) {
      this.snackBar.open('No hay datos para exportar.', 'Cerrar', { duration: 3000 });
      return;
    }

    // Mapeamos los datos a un formato legible
    const excelData = data.map(venta => ({
      'N° Factura': venta.NumeroDocumento,
      'Fecha': this.datePipe.transform(venta.FechaCreacion, 'dd/MM/yyyy h:mm a'),
      'Total': venta.TotalVenta,
      'Estado': venta.EstadoVenta,
      'Motivo Anulación': venta.MotivoAnulacion
    }));

    // Creamos la hoja de cálculo
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(excelData);

    // Creamos el libro de trabajo
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Historial_Ventas');

    // Generamos el archivo y lo descargamos
    // Usamos el ID del cliente para un nombre de archivo único
    const nombreArchivo = `Reporte_Ventas_Cliente_${this.clienteId}.xlsx`;
    XLSX.writeFile(wb, nombreArchivo);
  }
}