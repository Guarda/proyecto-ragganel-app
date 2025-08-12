import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
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

import { TablaPedidosComponent } from '../tabla-pedidos/tabla-pedidos.component';
import { AgregarPedidoComponent } from '../agregar-pedido/agregar-pedido.component';
import { PedidoService } from '../../../services/pedido.service';
import { Pedido } from '../../interfaces/pedido';

@Component({
  selector: 'app-listar-pedidos',
  standalone: true,
  imports: [
    CommonModule, RouterModule, MatTableModule, MatFormFieldModule, MatInputModule,
    MatSortModule, MatPaginatorModule, MatIconModule, MatButtonModule,
    MatTabsModule, TablaPedidosComponent, MatProgressSpinnerModule, MatTooltipModule
  ],
  templateUrl: './listar-pedidos.component.html',
  styleUrls: ['./listar-pedidos.component.css']
})
export class ListarPedidosComponent implements OnInit {

  @ViewChild(MatTabGroup) tabGroup!: MatTabGroup;

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
    private dialog: MatDialog
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
}