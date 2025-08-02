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

import { Cliente } from '../../interfaces/clientes';
import { ClientesService } from '../../../services/clientes.service';
import { CrearClienteComponent } from '../crear-cliente/crear-cliente.component';
import { EliminarClienteComponent } from '../eliminar-cliente/eliminar-cliente.component';

@Component({
  selector: 'app-listado-clientes',
  standalone: true,
  imports: [
    CommonModule, RouterModule, MatTableModule, MatFormFieldModule,
    MatInputModule, MatSortModule, MatPaginatorModule, MatIconModule,
    MatButtonModule, MatProgressSpinnerModule, MatTooltipModule
  ],
  templateUrl: './listado-clientes.component.html',
  styleUrls: ['./listado-clientes.component.css']
})
export class ListadoClientesComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['NombreCliente', 'DNI', 'RUC', 'Telefono', 'CorreoElectronico', 'FechaRegistro', 'Estado', 'acciones'];
  dataSource = new MatTableDataSource<Cliente>();

  isLoading = true;
  errorMessage: string | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    public clienteService: ClientesService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getClientList();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getClientList() {
    this.isLoading = true;
    this.errorMessage = null;

    this.clienteService.getAll().subscribe({
      next: (data: Cliente[]) => {
        const datosProcesados = data.map(cliente => ({
          ...cliente,
          FechaRegistro: this.parsearFecha(cliente.fechaRegistro)
        }));
        this.dataSource.data = datosProcesados;
        this.isLoading = false;
      },
      error: (err) => {
        console.error("Error al cargar clientes:", err);
        this.errorMessage = "No se pudieron cargar los clientes.";
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

   // ===== REEMPLAZA ESTA FUNCIÓN COMPLETA =====
  private parsearFecha(fechaStr: string | Date | undefined): Date {
    // Si no hay fecha o ya es un objeto Date, no hacemos nada o lo retornamos.
    if (!fechaStr) return new Date('Invalid Date');
    if (fechaStr instanceof Date) return fechaStr;

    // Esta lógica es robusta para el formato "dd/MM/yyyy".
    const partesSlash = fechaStr.split('/');
    if (partesSlash.length === 3) {
      const dia = parseInt(partesSlash[0], 10);
      const mes = parseInt(partesSlash[1], 10) - 1; // Meses en JS son de 0 a 11
      const anio = parseInt(partesSlash[2], 10);
      if (!isNaN(dia) && !isNaN(mes) && !isNaN(anio)) {
        return new Date(anio, mes, dia);
      }
    }

    // Si el formato no es dd/MM/yyyy, intentamos una conversión directa
    // que funciona bien para formatos como YYYY-MM-DD o ISO.
    const fecha = new Date(fechaStr);
    if (!isNaN(fecha.getTime())) {
      return fecha;
    }

    // Si todo falla, devolvemos una fecha inválida para que sea evidente.
    return new Date('Invalid Date');
  }

  getEstadoClass(status: boolean | number): string {
    if (status === true || status === 1) {
      return 'status-activo';
    } else {
      return 'status-inactivo';
    }
  }

  public openDialogAgregar() {
    const dialogRef = this.dialog.open(CrearClienteComponent, {
      width: '600px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getClientList();
      }
    });
  }

  public openDialogEliminar(idCliente: number) {
    const dialogRef = this.dialog.open(EliminarClienteComponent, {
      width: '400px',
      disableClose: true,
      data: { value: idCliente }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getClientList();
      }
    });
  }
}