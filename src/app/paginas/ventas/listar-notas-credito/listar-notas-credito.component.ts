import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { NotasCreditoService } from '../../../services/notas-credito.service';
import { BorrarNotaCreditoComponent } from '../borrar-nota-credito/borrar-nota-credito.component';
import { NotaCredito } from '../../interfaces/notacredito';
import { TableStatePersistenceService } from '../../../services/table-state-persistence.service';
import { TableState } from '../../interfaces/table-state';

@Component({
    selector: 'app-listar-notas-credito',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        RouterModule,
        MatProgressSpinnerModule,
        MatTooltipModule
    ],
    templateUrl: './listar-notas-credito.component.html',
    styleUrls: ['./listar-notas-credito.component.css']
})
export class ListarNotasCreditoComponent implements OnInit, AfterViewInit, OnDestroy {

  displayedColumns: string[] = ['IdNotaCreditoPK', 'FechaEmision', 'NumeroVentaOriginal', 'NombreCliente', 'Motivo', 'TotalCredito', 'UsuarioEmisor', 'EstadoNota', 'Acciones'];
  dataSource = new MatTableDataSource<NotaCredito>();
  isLoading = true;

  private readonly tableStateKey = 'notasCreditoTableState';
  private subscriptions = new Subscription();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('input') inputBusqueda!: ElementRef<HTMLInputElement>;

  constructor(
    private notasCreditoService: NotasCreditoService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private stateService: TableStatePersistenceService
  ) {}

  ngOnInit(): void {
    this.cargarNotasDeCredito();
  }

  ngAfterViewInit(): void {
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
      if (this.inputBusqueda) {
        this.inputBusqueda.nativeElement.value = state.filter;
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

  cargarNotasDeCredito(): void {
    this.isLoading = true;
    this.notasCreditoService.getNotasCredito().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar las notas de crédito:', err);
        this.isLoading = false;
        this.snackBar.open('Error al cargar los datos. Por favor, intente de nuevo.', 'Cerrar', { duration: 5000 });
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    this.saveState();
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'activa':
        return 'status-activa';
      case 'anulada':
        return 'status-anulada';
      default:
        return '';
    }
  }

  eliminarNota(id: number): void {
    const dialogRef = this.dialog.open(BorrarNotaCreditoComponent, {
      width: '500px',
      data: { idNota: id },
      disableClose: true // Evita que el diálogo se cierre al hacer clic fuera
    });

    // Nos suscribimos a la respuesta del diálogo
    dialogRef.afterClosed().subscribe(result => {
      // Si el diálogo devuelve 'true', significa que la anulación fue exitosa
      if (result === true) {
        // Recargamos la lista para reflejar el cambio de estado
        this.cargarNotasDeCredito();
      }
    });
  }
}