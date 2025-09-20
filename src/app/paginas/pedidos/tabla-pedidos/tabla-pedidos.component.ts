import { AfterViewInit, Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
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

import { CancelarPedidosComponent } from '../cancelar-pedidos/cancelar-pedidos.component';
import { EliminarPedidoComponent } from '../eliminar-pedido/eliminar-pedido.component';
import { AvanzarPedidoComponent } from '../avanzar-pedido/avanzar-pedido.component';
import { HistorialPedidoComponent } from '../historial-pedido/historial-pedido.component';


import { PedidoService } from '../../../services/pedido.service';

import { Pedido } from '../../interfaces/pedido';
@Component({
    selector: 'app-tabla-pedidos',
    imports: [CommonModule, RouterModule, MatTableModule, MatLabel, MatFormField, MatInputModule,
        MatInputModule, MatSortModule, MatPaginatorModule, MatIcon, MatButtonModule, MatTableModule, MatTabsModule],
    templateUrl: './tabla-pedidos.component.html',
    styleUrl: './tabla-pedidos.component.css'
})

export class TablaPedidosComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @Input() displayedColumns: string[] = [];
  @Input() set filterValue(value: string) {
    this._filterValue = value;
    this.applyFilter(); // Aplica el filtro cuando el valor cambie
  }
  get filterValue(): string {
    return this._filterValue;
  }

  @Output() actualizarPedidos = new EventEmitter<void>(); // Evento para actualizar el padre

  // Cambiar el tipo de dataSource a MatTableDataSource<Pedido> en lugar de any[]
  @Input() set dataSource(data: Pedido[]) {
    // Aseguramos que estamos usando MatTableDataSource con el tipo Pedido
    this.tableDataSource = new MatTableDataSource(data);
    this.tableDataSource.paginator = this.paginator;
    this.tableDataSource.sort = this.sort;

    // Configura cómo debe filtrar la tabla
    this.tableDataSource.filterPredicate = (data: Pedido, filter: string) => {
      // Convierte la fecha a una cadena legible
      const lowerCaseFilter = filter.trim().toLowerCase();
      return (
        data.CodigoPedido.toLowerCase().includes(lowerCaseFilter) ||
        data.Estado.toLowerCase().includes(lowerCaseFilter) ||
        data.NumeroTracking1.toLowerCase().includes(lowerCaseFilter)
        // fechaCreacion.toLowerCase().includes(lowerCaseFilter) ||  // Filtro por fecha ||
        // data.PrecioEstimadoDelPedido.toString().toLowerCase().includes(lowerCaseFilter)
      );
    };

    // Si ya hay un valor de filtro, aplícalo
    if (this._filterValue) {
      this.applyFilter();
    }
  }

  tableDataSource!: MatTableDataSource<Pedido>;  // Asegúrate de que sea MatTableDataSource<Pedido>
  private _filterValue: string = '';

  constructor(
    public dialog: MatDialog,
    private router: Router // Inyectamos el Router
  ) {
  }

  ngOnInit(): void { }

  public openDialogEliminar(cons: string) {
    const dialogRef = this.dialog.open(EliminarPedidoComponent, {
      disableClose: true,
      data: { value: cons }
    });
    dialogRef.componentInstance.Eliminar.subscribe(() => {
      this.actualizarPedidos.emit(); // Notifica al padre para recargar la información
      this.tableDataSource.paginator = this.paginator;
      this.tableDataSource.sort = this.sort;
    });
    dialogRef.afterClosed().subscribe(() => {
      this.actualizarPedidos.emit(); // Notifica al padre para recargar la información
      this.tableDataSource.paginator = this.paginator;
      this.tableDataSource.sort = this.sort;
    });
  }


  public openDialogCancelar(cons: string) {
    const dialogRef = this.dialog.open(CancelarPedidosComponent, {
      disableClose: true,
      data: { value: cons }
    });
    dialogRef.componentInstance.Cancelar.subscribe(() => {
      this.actualizarPedidos.emit(); // Notifica al padre para recargar la información
      this.tableDataSource.paginator = this.paginator;
      this.tableDataSource.sort = this.sort;
    });
    dialogRef.afterClosed().subscribe(() => {
      this.actualizarPedidos.emit(); // Notifica al padre para recargar la información
      this.tableDataSource.paginator = this.paginator;
      this.tableDataSource.sort = this.sort;
    });
  }

  public openDialogAvanzar(cons: string, est: number) {
    // Si el estado es 4, significa que el siguiente paso es 5 (Recibido), 
    // que es cuando se ingresa el inventario.
    if (est === 4) {
      // Navegamos a la nueva pantalla en lugar de abrir un diálogo.
      this.router.navigate(['/home/ingresar-inventario', cons]);
      return; // Salimos de la función para no abrir el diálogo.
    }

    const dialogRef = this.dialog.open(AvanzarPedidoComponent, {
      disableClose: true,
      data: { value: cons, codigoEstado: est }
    });
    dialogRef.componentInstance.Avanzar.subscribe(() => {
      this.actualizarPedidos.emit(); // Notifica al padre para recargar la información
      this.tableDataSource.paginator = this.paginator;
      this.tableDataSource.sort = this.sort;
    });
    dialogRef.afterClosed().subscribe(() => {
      this.actualizarPedidos.emit(); // Notifica al padre para recargar la información
      this.tableDataSource.paginator = this.paginator;
      this.tableDataSource.sort = this.sort;
    });
  }

  public openDialogHistorial(cons: string) {
    const dialogRef = this.dialog.open(HistorialPedidoComponent, {
      disableClose: true,
      data: { value: cons }
    });   
    dialogRef.afterClosed().subscribe(() => {
      this.actualizarPedidos.emit(); // Notifica al padre para recargar la información
      this.tableDataSource.paginator = this.paginator;
      this.tableDataSource.sort = this.sort;
    });
  }

  private applyFilter(): void {
    if (this.tableDataSource) {
      this.tableDataSource.filter = this._filterValue.trim().toLowerCase();
    }
  }
}