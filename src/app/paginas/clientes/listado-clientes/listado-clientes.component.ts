import { AfterViewInit, Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
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
import { Subscription } from 'rxjs';

import { Cliente } from '../../interfaces/clientes';
import { ClientesService } from '../../../services/clientes.service';
import { CrearClienteComponent } from '../crear-cliente/crear-cliente.component';
import { EliminarClienteComponent } from '../eliminar-cliente/eliminar-cliente.component';
import { TableStatePersistenceService } from '../../../services/table-state-persistence.service';
import { TableState } from '../../interfaces/table-state';

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
export class ListadoClientesComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns: string[] = ['nombre', 'dni', 'ruc', 'telefono', 'correo', 'fechaRegistro', 'estado', 'acciones'];
  dataSource = new MatTableDataSource<Cliente>();

  isLoading = true;
  errorMessage: string | null = null;

  private readonly tableStateKey = 'clientesTableState';
  private subscriptions = new Subscription();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('input') inputElement!: ElementRef<HTMLInputElement>;

  constructor(
    public clienteService: ClientesService,
    private dialog: MatDialog,
    private stateService: TableStatePersistenceService
  ) { }

  ngOnInit(): void {
    this.getClientList();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.loadAndApplyState();
    this.subscriptions.add(this.sort.sortChange.subscribe(() => this.saveState()));
    this.subscriptions.add(this.paginator.page.subscribe(() => this.saveState()));
  }

  ngOnDestroy(): void {
    this.saveState();
    this.subscriptions.unsubscribe();
  }

  getClientList() {
    this.isLoading = true;
    this.errorMessage = null;

    this.clienteService.getAll().subscribe({
      next: (data: Cliente[]) => {
        console.log("Clientes cargados:", data);
        const datosProcesados = data.map(cliente => ({
          ...cliente,
          fechaRegistro: this.parsearFecha(cliente.fechaRegistro)
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
    this.saveState();
  }

  private saveState(): void {
    if (!this.paginator || !this.sort) return;

    const state: TableState = {
      filter: this.dataSource.filter,
      sortColumn: this.sort.active,
      sortDirection: this.sort.direction,
      pageIndex: this.paginator.pageIndex,
      pageSize: this.paginator.pageSize
    };
    this.stateService.saveState(this.tableStateKey, state);
  }

  private loadAndApplyState(): void {
    const state = this.stateService.loadState(this.tableStateKey);
    if (!state) return;

    if (state.filter) {
      this.dataSource.filter = state.filter;
      if (this.inputElement) {
        this.inputElement.nativeElement.value = state.filter;
      }
    }

    if (this.paginator) {
      this.paginator.pageIndex = state.pageIndex;
      this.paginator.pageSize = state.pageSize;
    }

    setTimeout(() => {
      if (this.sort) {
        this.sort.active = state.sortColumn;
        this.sort.direction = state.sortDirection;
      }
    });
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