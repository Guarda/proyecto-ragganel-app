import { Component, Input, OnChanges, SimpleChanges, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// Imports de Angular Material
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

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
    MatButtonModule
  ],
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

  constructor(private clientesService: ClientesService) {}

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
}