import { AfterViewInit, Component, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatTabGroup, MatTabsModule } from '@angular/material/tabs';

import { TablaPedidosComponent } from '../tabla-pedidos/tabla-pedidos.component';

import { AgregarPedidoComponent } from '../agregar-pedido/agregar-pedido.component';
import { PedidoService } from '../../../services/pedido.service';

import { Pedido } from '../../interfaces/pedido';
@Component({
  selector: 'app-listar-pedidos',
  standalone: true,
  imports: [CommonModule, RouterModule, MatTableModule, MatLabel, MatFormField, MatInputModule,
    MatInputModule, MatSortModule, MatPaginatorModule, MatIcon, MatButtonModule, MatTableModule, MatTabsModule, TablaPedidosComponent],
  templateUrl: './listar-pedidos.component.html',
  styleUrl: './listar-pedidos.component.css'
})
export class ListarPedidosComponent implements OnInit {
   
  @ViewChild(MatTabGroup) tabGroup!: MatTabGroup;
  productos: Pedido[] = [];
  myArray: any[] = [];
  displayedColumns: string[] = ['CodigoPedido', 'FechaCreacionPedido', 'FechaArriboEstadosUnidos', 'FechaIngreso', 'DescripcionEstadoPedido', 'NumeroTracking1', 'SubtotalArticulos', 'TotalPedido', 'Action'];
  dataSource!: MatTableDataSource<Pedido>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  pedidosEnEspera: Pedido[] = [];
  pedidosEnTransito: Pedido[] = [];
  pedidosRecibidosUSA: Pedido[] = [];
  pedidosEnAduana: Pedido[] = [];
  pedidosRecibidos: Pedido[] = [];
  pedidosCancelados: Pedido[] = [];
  pedidosEliminados: Pedido[] = [];

  filterValue: string = ''; // Agrega esta propiedad para almacenar el filtro

  constructor(
    private pedidoService: PedidoService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private dialog: MatDialog) {

  }

  ngOnInit(): void {
    this.getOrdersList();
  }

  cargarPedidos(): void {
    this.getOrdersList();
  }

  public openDialogAgregar() {
    const dialogRef = this.dialog.open(AgregarPedidoComponent, {
      disableClose: true,
      height: '100%',
      width: '50%',
    });
  }

  onAdd(a: any) {
    this.ngOnInit();
  }

  getOrdersList() {
    this.pedidoService.getAll().subscribe((data: Pedido[]) => {
      this.dataSource = new MatTableDataSource<Pedido>(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      // Filtramos los pedidos por estado
      this.pedidosEnEspera = data.filter(pedido => pedido.Estado === 'En espera');
      this.pedidosEnTransito = data.filter(pedido => pedido.Estado === 'En tránsito');
      this.pedidosRecibidosUSA = data.filter(pedido => pedido.Estado === 'Recibido en Estados Unidos');
      this.pedidosEnAduana = data.filter(pedido => pedido.Estado === 'En aduana/agencia');
      this.pedidosRecibidos = data.filter(pedido => pedido.Estado === 'Recibido');
      this.pedidosCancelados = data.filter(pedido => pedido.Estado === 'Cancelado');
      this.pedidosEliminados = data.filter(pedido => pedido.Estado === 'Eliminado');
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.filterValue = filterValue;
    this.dataSource.filter = filterValue;
   // console.log("Filtro aplicado:", this.filterValue);  // Para verificar que el filtro 

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

    // Filtrar y luego cambiar la pestaña si el filtro encuentra algún dato
    this.selectTabForFilter(filterValue);
  }

  selectTabForFilter(filterValue: string) {
    //console.log("aaa")
    // Verifica en qué estado se encuentra el pedido que coincide con el filtro
    if (this.pedidosEnEspera.some(pedido => pedido.CodigoPedido.toLowerCase().includes(filterValue))) {
      this.tabGroup.selectedIndex = 0; // En espera
    } else if (this.pedidosEnTransito.some(pedido => pedido.CodigoPedido.toLowerCase().includes(filterValue))) {
      this.tabGroup.selectedIndex = 1; // En tránsito
    } else if (this.pedidosRecibidosUSA.some(pedido => pedido.CodigoPedido.toLowerCase().includes(filterValue))) {
      this.tabGroup.selectedIndex = 2; // En Estados Unidos
    } else if (this.pedidosEnAduana.some(pedido => pedido.CodigoPedido.toLowerCase().includes(filterValue))) {
      this.tabGroup.selectedIndex = 3; // En aduana/agencia
    } else if (this.pedidosRecibidos.some(pedido => pedido.CodigoPedido.toLowerCase().includes(filterValue))) {
      this.tabGroup.selectedIndex = 4; // Recibidos
    } else if (this.pedidosCancelados.some(pedido => pedido.CodigoPedido.toLowerCase().includes(filterValue))) {
      this.tabGroup.selectedIndex = 5; // Cancelados
    } else {
      // Si no se encuentra ningún pedido en los filtros
      this.tabGroup.selectedIndex = -1; // Sin selección
    }
    console.log(this.tabGroup.selectedIndex);
  }
}