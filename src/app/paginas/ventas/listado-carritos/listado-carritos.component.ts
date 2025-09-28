import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { finalize, Subscription } from 'rxjs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { AuthService } from '../../../UI/session/auth.service';
import { CarritoService } from '../../../services/carrito.service';
import { TableStatePersistenceService } from '../../../services/table-state-persistence.service';
import { Usuarios } from '../../interfaces/usuarios';
import { ConfirmarLiberacionDialogComponent } from '../confirmar-liberacion-dialog/confirmar-liberacion-dialog.component';
import { TableState } from '../../interfaces/table-state';

@Component({
  selector: 'app-listado-carritos',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatListModule, MatIconModule, MatProgressSpinnerModule,
    MatSnackBarModule, MatTableModule, MatButtonModule, MatTooltipModule, MatDialogModule,
    MatPaginatorModule, MatSortModule, MatFormFieldModule, MatInputModule
  ],
  templateUrl: './listado-carritos.component.html',
  styleUrls: ['./listado-carritos.component.css']
})
export class ListadoCarritosComponent implements OnInit, AfterViewInit, OnDestroy {

  public isLoading = true;
  private usuario?: Usuarios;

  displayedColumns: string[] = ['IdCarritoPK', 'NombreCliente', 'UsuarioCreador', 'FechaCreacion', 'acciones'];
  dataSource = new MatTableDataSource<any>();

  private readonly tableStateKey = 'carritosTableState';
  private subscriptions = new Subscription();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('input') inputElement!: ElementRef<HTMLInputElement>;

  constructor(
    private carritoService: CarritoService,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private router: Router,
    public dialog: MatDialog,
    private stateService: TableStatePersistenceService
  ) { }

  ngOnInit(): void {
    this.obtenerUsuarioYcargarCarritos();
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
      // FIX 1: Usar setTimeout para asegurar que el input esté listo para recibir el valor.
      setTimeout(() => {
        if (this.inputElement) {
          this.inputElement.nativeElement.value = state.filter;
        }
      });
    }

    if (this.paginator) {
      this.paginator.pageIndex = state.pageIndex;
      this.paginator.pageSize = state.pageSize;
    }

    // FIX 2: Emitir el evento sortChange para forzar al dataSource a re-ordenar.
    setTimeout(() => {
      if (this.sort && state.sortColumn) {
        this.sort.active = state.sortColumn;
        this.sort.direction = state.sortDirection;
        // Creamos un objeto Sort y lo emitimos para que el dataSource reaccione.
        const sortState: Sort = { active: state.sortColumn, direction: state.sortDirection };
        this.sort.sortChange.emit(sortState);
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

  obtenerUsuarioYcargarCarritos(): void {
    this.isLoading = true;
    this.authService.getUser().subscribe({
      next: (user) => {
        if (user && user.id) {
          this.usuario = user as unknown as Usuarios;
          this.cargarCarritos(this.usuario.id);
        } else {
          this.snackBar.open('No se pudo verificar el usuario.', 'Cerrar', { duration: 4000 });
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.error('Error al obtener el usuario autenticado:', err);
        this.snackBar.open('Error crítico al verificar la sesión.', 'Cerrar', { duration: 4000 });
        this.isLoading = false;
      }
    });
  }

  cargarCarritos(idUsuario: number): void {
    this.isLoading = true;
    this.carritoService.listarCarritosActivosPorUsuario(idUsuario)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (datosRecibidos) => {
          this.dataSource.data = datosRecibidos;
        },
        error: (err) => {
          console.error('SUSCRIPCIÓN MANUAL FALLÓ. Error:', err);
          this.dataSource.data = [];
          this.snackBar.open('No se pudieron cargar los carritos activos.', 'Cerrar', { duration: 4000 });
        }
      });
  }

  verCarrito(carrito: any): void {
    this.carritoService.solicitarCargaDeCarrito(carrito);
    this.router.navigate(['home/punto-venta']);
  }

  liberarCarrito(idCarrito: number, event: MouseEvent): void {
    event.stopPropagation();

    const dialogRef = this.dialog.open(ConfirmarLiberacionDialogComponent, {
      width: '400px',
      data: { idCarrito: idCarrito }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.isLoading = true;
        this.carritoService.liberarCarrito(idCarrito).subscribe({
          next: (response) => {
            if (response.success) {
              this.snackBar.open('Carrito liberado con éxito.', 'Cerrar', { duration: 2000 });
              // FIX 3: En lugar de filtrar, recargamos la lista para mantener la consistencia.
              if (this.usuario?.id) {
                this.cargarCarritos(this.usuario.id);
              }
            } else {
              this.snackBar.open(`Error al liberar: ${response.error}`, 'Cerrar', { duration: 4000 });
              this.isLoading = false;
            }
          },
          error: (err) => {
            this.snackBar.open('Error de conexión al liberar el carrito.', 'Cerrar', { duration: 4000 });
            this.isLoading = false;
          }
        });
      }
    });
  }
}