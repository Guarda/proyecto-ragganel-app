import { AfterViewInit, Component, EventEmitter, Inject, Output, ViewChild } from '@angular/core';
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

import { AgregarPedidoComponent } from '../agregar-pedido/agregar-pedido.component';
import { PedidoService } from '../../../services/pedido.service';

import { Pedido } from '../../interfaces/pedido';

@Component({
  selector: 'app-listar-pedidos',
  standalone: true,
  imports: [CommonModule, RouterModule, MatTableModule, MatLabel, MatFormField, MatInputModule,
    MatInputModule, MatSortModule, MatPaginatorModule, MatIcon, MatButtonModule],
  templateUrl: './listar-pedidos.component.html',
  styleUrl: './listar-pedidos.component.css'
})
export class ListarPedidosComponent {

  productos: Pedido[] = [];
  myArray: any[] = [];
  displayedColumns: string[] = ['CodigoPedido', 'FechaCreacionPedido', 'FechaArriboEstadosUnidos', 'FechaIngreso', 'DescripcionEstadoPedido', 'NumeroTracking1', 'SubtotalArticulos', 'TotalPedido', 'Action'];
  dataSource = new MatTableDataSource<Pedido>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private pedidoService: PedidoService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private dialog: MatDialog) {

  }

  ngOnInit(): void {
    this.getOrdersList();
  }

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
      this.dataSource = new MatTableDataSource<Pedido>(data);
      console.log(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


}
