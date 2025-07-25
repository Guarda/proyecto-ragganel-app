import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

import { InsumosBase } from '../../interfaces/insumosbase';
import { InsumosBaseService } from '../../../services/insumos-base.service';
import { IngresarAgregarInsumoDialogComponent } from '../ingresar-agregar-insumo-dialog/ingresar-agregar-insumo-dialog.component';
import { EliminarInsumosComponent } from '../eliminar-insumos/eliminar-insumos.component';
import { HistorialInsumoComponent } from '../historial-insumo/historial-insumo.component';

@Component({
  selector: 'app-listar-insumos',
  standalone: true,
  imports: [
    CommonModule, RouterModule, MatTableModule, MatFormFieldModule,
    MatInputModule, MatSortModule, MatPaginatorModule, MatIconModule,
    MatButtonModule, MatProgressSpinnerModule, MatTooltipModule
  ],
  templateUrl: './listar-insumos.component.html',
  styleUrls: ['./listar-insumos.component.css']
})
export class ListarInsumosComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['CodigoInsumo', 'DescripcionInsumo', 'Estado', 'Cantidad', 'StockMinimo', 'Fecha_Ingreso', 'PrecioBase', 'Action'];
  dataSource = new MatTableDataSource<InsumosBase>();

  isLoading = true;
  errorMessage: string | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    public insumosService: InsumosBaseService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getSupplyList();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getSupplyList() {
    this.isLoading = true;
    this.errorMessage = null;

    this.insumosService.getAll().subscribe({
      next: (data: InsumosBase[]) => {
        const datosProcesados = data.map(insumo => ({
          ...insumo,
          Fecha_Ingreso: this.parsearFecha(insumo.FechaIngreso)
        }));
        this.dataSource.data = datosProcesados;
        this.isLoading = false;
      },
      error: (err) => {
        console.error("Error al cargar insumos:", err);
        this.errorMessage = "No se pudieron cargar los insumos.";
        this.isLoading = false;
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  private parsearFecha(fechaStr: string | Date): Date {
    if (fechaStr instanceof Date) return fechaStr;
    if (!fechaStr) return new Date();
    const partes = fechaStr.split('/');
    if (partes.length === 3) {
      const dia = parseInt(partes[0], 10);
      const mes = parseInt(partes[1], 10) - 1;
      const anio = parseInt(partes[2], 10);
      return new Date(anio, mes, dia);
    }
    return new Date(fechaStr);
  }

  getEstadoClass(status: string): string {
    if (!status) return 'status-default';
    const statusNormalized = status.toLowerCase().replace(/\s+/g, '-');
    switch (statusNormalized) {
      case 'nuevo': return 'status-nuevo';
      case 'usado': return 'status-usado';
      case 'en-garantia': return 'status-garantia';
      case 'a-reparar': return 'status-reparar';
      case 'para-piezas': return 'status-piezas';
      default: return 'status-default';
    }
  }

  public openDialogAgregar() {
    const dialogRef = this.dialog.open(IngresarAgregarInsumoDialogComponent, {
      width: '500px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getSupplyList();
      }
    });
  }

  public openDialogEliminar(codigoInsumo: string) {
    const dialogRef = this.dialog.open(EliminarInsumosComponent, {
      width: '400px',
      disableClose: true,
      data: { value: codigoInsumo }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getSupplyList();
      }
    });
  }

  public openDialogHistorial(codigoInsumo: string) {
    this.dialog.open(HistorialInsumoComponent, {
      width: '600px',
      data: { value: codigoInsumo }
    });
  }
}