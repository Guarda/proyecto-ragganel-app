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
import { MatTabsModule } from '@angular/material/tabs';

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
export class ListarPedidosComponent implements OnInit{

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

  // eliminarPedidos(): void {
  //   this.getOrdersList();
  // }

  // avanzarPedidos(): void {
  //   this.getOrdersList();
  // }

  public openDialogAgregar() {
    const dialogRef = this.dialog.open(AgregarPedidoComponent, {
      disableClose: true,
      height: '100%',
      width: '50%',
    });
    // dialogRef.componentInstance.Agregado.subscribe(() => {
    //   this.getProductList();
    //   this.dataSource.paginator = this.paginator;
    //   this.dataSource.sort = this.sort;
    // });
    // dialogRef.afterClosed().subscribe(() => {
    //   this.getProductList();
    //   this.dataSource.paginator = this.paginator;
    //   this.dataSource.sort = this.sort;
    // });
  }

  onAdd(a: any) {
    this.ngOnInit();
  }

  getOrdersList() {
    this.pedidoService.getAll().subscribe((data: Pedido[]) => {
      // console.log(data)
      // Guardamos todos los pedidos en una variable temporal
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
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  
}
