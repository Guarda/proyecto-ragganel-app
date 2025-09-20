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

import { ServiciosBase } from '../../interfaces/servicios';
import { ServiciosService } from '../../../services/servicios.service';
import { AgregarServicioComponent } from '../agregar-servicio/agregar-servicio.component';
import { EliminarServicioComponent } from '../eliminar-servicio/eliminar-servicio.component';
import { ServicioListado } from '../../interfaces/serviciolistado';

@Component({
    selector: 'app-listado-servicios',
    imports: [
        CommonModule, RouterModule, MatTableModule, MatFormFieldModule,
        MatInputModule, MatSortModule, MatPaginatorModule, MatIconModule,
        MatButtonModule, MatProgressSpinnerModule, MatTooltipModule
    ],
    templateUrl: './listado-servicios.component.html',
    styleUrls: ['./listado-servicios.component.css']
})
export class ListadoServiciosComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['IdServicioPK', 'DescripcionServicio', 'FechaIngreso', 'PrecioBase', 'Action'];
  dataSource = new MatTableDataSource<ServicioListado>();

  isLoading = true;
  errorMessage: string | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dialog: MatDialog,
    private serviciosService: ServiciosService
  ) { }

  ngOnInit() {
    this.getServiceList();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getServiceList() {
    this.isLoading = true;
    this.errorMessage = null;

    this.serviciosService.getAll().subscribe({
      next: (data: ServicioListado[]) => { // <-- Usa la nueva interfaz
        const datosProcesados = data.map(servicio => ({
          ...servicio,
          // La propiedad ahora existe y el código es válido
          FechaIngreso: this.parsearFecha(servicio.FechaIngreso)
        }));
        this.dataSource.data = datosProcesados;
        this.isLoading = false;
      },
      error: (err) => {
        console.error("Error al cargar servicios:", err);
        this.errorMessage = "No se pudieron cargar los servicios.";
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

  private parsearFecha(fechaStr: string | Date | undefined): Date {
    if (!fechaStr) return new Date();
    if (fechaStr instanceof Date) return fechaStr;

    const partes = fechaStr.split('/');
    if (partes.length === 3) {
      const dia = parseInt(partes[0], 10);
      const mes = parseInt(partes[1], 10) - 1;
      const anio = parseInt(partes[2], 10);
      return new Date(anio, mes, dia);
    }
    return new Date(fechaStr);
  }

  public openDialogAgregar() {
    const dialogRef = this.dialog.open(AgregarServicioComponent, {
      width: '50%',
      height: '80%',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getServiceList();
      }
    });
  }

  openDialogEliminar(idServicio: number) {
    const dialogRef = this.dialog.open(EliminarServicioComponent, {
      width: '400px',
      disableClose: true,
      data: { value: idServicio }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getServiceList();
      }
    });
  }
}