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


import { PedidoService } from '../../../services/pedido.service';

import { Pedido } from '../../interfaces/pedido';
@Component({
  selector: 'app-tabla-pedidos',
  standalone: true,
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

  ngOnInit(): void { }

  private applyFilter(): void {
    if (this.tableDataSource) {
      this.tableDataSource.filter = this._filterValue.trim().toLowerCase();
    }
  }
}