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

import { AccesoriosBase } from '../../interfaces/accesoriosbase';
import { AccesorioBaseService } from '../../../services/accesorio-base.service';
import { AgregarAccesoriosComponent } from '../agregar-accesorios/agregar-accesorios.component';
import { EliminarAccesoriosComponent } from '../eliminar-accesorios/eliminar-accesorios.component';
import { HistorialAccesorioComponent } from '../historial-accesorio/historial-accesorio.component';

@Component({
    selector: 'app-listar-accesorios',
    imports: [
        CommonModule, RouterModule, MatTableModule, MatFormFieldModule,
        MatInputModule, MatSortModule, MatPaginatorModule, MatIconModule,
        MatButtonModule, MatProgressSpinnerModule, MatTooltipModule
    ],
    templateUrl: './listar-accesorios.component.html',
    styleUrls: ['./listar-accesorios.component.css']
})
export class ListarAccesoriosComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['CodigoAccesorio', 'DescripcionAccesorio', 'ColorAccesorio', 'EstadoAccesorio', 'FechaIngreso', 'PrecioBase', 'Action'];
  dataSource = new MatTableDataSource<AccesoriosBase>();

  isLoading = true;
  errorMessage: string | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    public accesorioService: AccesorioBaseService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getAccesorioList();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getAccesorioList() {
    this.isLoading = true;
    this.errorMessage = null;

    this.accesorioService.getAll().subscribe({
      next: (data: AccesoriosBase[]) => {
        const datosProcesados = data.map(accesorio => ({
          ...accesorio,
          FechaIngreso: this.parsearFecha(accesorio.FechaIngreso)
        }));
        this.dataSource.data = datosProcesados;
        this.isLoading = false;
      },
      error: (err) => {
        console.error("Error al cargar accesorios:", err);
        this.errorMessage = "No se pudieron cargar los accesorios.";
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
    if (fechaStr instanceof Date) {
      return fechaStr;
    }
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
      case 'en-proceso-de-venta': return 'status-proceso-venta';
      case 'descargado': return 'status-descargado';
      default: return 'status-default';
    }
  }

  public openDialogAgregar() {
    const dialogRef = this.dialog.open(AgregarAccesoriosComponent, {
      width: '50%',
      height: '85%',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getAccesorioList();
      }
    });
  }

  public openDialogEliminar(codigoAccesorio: string) {
    const dialogRef = this.dialog.open(EliminarAccesoriosComponent, {
      width: '400px',
      disableClose: true,
      data: { value: codigoAccesorio }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getAccesorioList();
      }
    });
  }

  public openDialogHistorial(codigoAccesorio: string) {
    this.dialog.open(HistorialAccesorioComponent, {
      width: '600px',
      data: { value: codigoAccesorio }
    });
  }
}