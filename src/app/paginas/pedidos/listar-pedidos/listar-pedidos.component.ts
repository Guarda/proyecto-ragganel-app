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

@Component({
  selector: 'app-listar-pedidos',
  standalone: true,
  imports: [CommonModule, RouterModule, MatTableModule, MatLabel, MatFormField, MatInputModule,
    MatInputModule, MatSortModule, MatPaginatorModule, MatIcon, MatButtonModule],
  templateUrl: './listar-pedidos.component.html',
  styleUrl: './listar-pedidos.component.css'
})
export class ListarPedidosComponent {

  constructor(
    private cdr: ChangeDetectorRef, 
    private router: Router, 
    private dialog: MatDialog) {

  }

  ngOnInit(): void {
    // this.getProductList();
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


}
