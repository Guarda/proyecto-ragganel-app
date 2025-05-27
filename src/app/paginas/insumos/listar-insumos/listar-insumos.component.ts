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
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { InsumosBaseService } from '../../../services/insumos-base.service';
import { InsumosBase } from '../../interfaces/insumosbase';

import { IngresarAgregarInsumoDialogComponent } from '../ingresar-agregar-insumo-dialog/ingresar-agregar-insumo-dialog.component';
import { EliminarInsumosComponent } from '../eliminar-insumos/eliminar-insumos.component';
import { HistorialInsumoComponent } from '../historial-insumo/historial-insumo.component';

@Component({
  selector: 'app-listar-insumos',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatLabel,
    MatFormField,
    MatInputModule,
    MatInputModule,
    MatSortModule,
    MatPaginatorModule,
    MatIcon,
    MatButtonModule
  ],
  templateUrl: './listar-insumos.component.html',
  styleUrl: './listar-insumos.component.css'
})
export class ListarInsumosComponent implements AfterViewInit {

  insumos: any[] = []; // Cambia el tipo a 'any' o define una interfaz adecuada
  myArray: any[] = [];
  displayedColumns: string[] = ['CodigoInsumo', 'DescripcionInsumo', 'Estado', 'Fecha_Ingreso', 'PrecioBase', 'Comentario', 'NumeroSerie', 'Cantidad', 'StockMinimo', 'Action'];
  dataSource = new MatTableDataSource<any>(); // Cambia el tipo a 'any' o define una interfaz adecuada


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @Output() select = new EventEmitter<string>();


  constructor(
    public insumosService: InsumosBaseService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private dialog: MatDialog,
  ) {
  }

  ngAfterViewInit() {

  }


  ngOnInit(): void {
    this.getSupplyList();
  }

  getSupplyList() {
    this.insumosService.getAll().subscribe((data: InsumosBase[]) => {
      this.dataSource = new MatTableDataSource<InsumosBase>(data);
      console.log(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  public openDialogAgregar() {
    const dialogRef = this.dialog.open(IngresarAgregarInsumoDialogComponent, {
      disableClose: true,
      height: '30%',
      width: '27%',
    });
    dialogRef.componentInstance.Agregado.subscribe(() => {
      this.getSupplyList();
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
    dialogRef.afterClosed().subscribe(() => {
      this.getSupplyList();
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  public openDialogEliminar(cons: string) {
    const dialogRef = this.dialog.open(EliminarInsumosComponent, {
      disableClose: true,
      data: { value: cons }
    });
    dialogRef.componentInstance.Borrado.subscribe(() => {
      this.getSupplyList();
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
    dialogRef.afterClosed().subscribe(() => {
      this.getSupplyList();
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }


  public openDialogHistorial(cons: string) {
    const dialogRef = this.dialog.open(HistorialInsumoComponent, {
      disableClose: true,
      data: { value: cons }
    });
    dialogRef.afterClosed().subscribe(() => {
      this.getSupplyList();
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
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
