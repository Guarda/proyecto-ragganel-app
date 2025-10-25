import { AfterViewInit, Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subscription } from 'rxjs';

import { Producto } from '../../interfaces/producto';
import { TableState } from '../../interfaces/table-state';
import { ProductosService } from '../productos.service';
import { TableStatePersistenceService } from '../../../services/table-state-persistence.service';

import { AgregarProdutosComponent } from '../agregar-produtos/agregar-produtos.component';
import { EliminarProductosComponent } from '../eliminar-productos/eliminar-productos.component';
import { HistorialProductoComponent } from '../historial-producto/historial-producto.component';

@Component({
  selector: 'app-listar-productos',
  standalone: true, // Se asume standalone por los imports directos en @Component
  imports: [
    CommonModule, RouterModule, MatTableModule, MatFormFieldModule,
    MatInputModule, MatSortModule, MatPaginatorModule, MatIconModule,
    MatButtonModule, MatProgressSpinnerModule, MatTooltipModule
  ],
  templateUrl: './listar-productos.component.html',
  styleUrls: ['./listar-productos.component.css']
})
// --- CAMBIO: Se implementan OnInit y OnDestroy para un manejo completo del ciclo de vida ---
export class ListarProductosComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns: string[] = ['CodigoConsola', 'DescripcionConsola', 'Estado', 'Hack', 'Fecha_Ingreso', 'PrecioBase', 'Action'];
  dataSource = new MatTableDataSource<Producto>();

  isLoading = true;
  errorMessage: string | null = null;

  private readonly tableStateKey = 'productosTableState';
  private subscriptions = new Subscription();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('input') inputElement!: ElementRef<HTMLInputElement>;

  constructor(
    public productoService: ProductosService,
    private dialog: MatDialog,
    private stateService: TableStatePersistenceService
  ) { }

  ngOnInit(): void {
    // ✅ CORRECCIÓN: Se carga el estado aquí para establecer los valores iniciales antes de que la vista se renderice.
    this.loadAndApplyState();
    this.getProductList();
  }

  ngAfterViewInit() {
  this.dataSource.paginator = this.paginator; // Se mantiene la asignación de paginador y sort aquí.
  this.dataSource.sort = this.sort;
  this.subscriptions.add(this.sort.sortChange.subscribe(() => this.saveState()));
  this.subscriptions.add(this.paginator.page.subscribe(() => this.saveState()));
}

  ngOnDestroy(): void {
    this.saveState();
    this.subscriptions.unsubscribe();
  }

  getProductList(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.productoService.getAll().subscribe({
      next: (data: Producto[]) => {
        // Se procesan las fechas para que el ordenador de la tabla funcione correctamente
        const datosProcesados = data.map(producto => ({
          ...producto,
          Fecha_Ingreso: this.parsearFecha(producto.Fecha_Ingreso)
        }));

        // ✅ CORRECCIÓN: Si hay un filtro guardado, se aplica después de cargar los datos.
        const state = this.stateService.loadState(this.tableStateKey);
        if (state && state.filter) {
          this.dataSource.filter = state.filter;
        }

        this.dataSource.data = datosProcesados;
        this.isLoading = false;
      },
      error: (err) => {
        console.error("Error al cargar productos:", err);
        this.errorMessage = "No se pudieron cargar los productos. Intente de nuevo más tarde.";
        this.isLoading = false;
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    // --- CAMBIO CLAVE: Guardar el estado cada vez que el filtro cambia ---
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

    // Aplicar filtro al input. El filtro del dataSource se aplica en getProductList.
    if (state.filter) {
      if (this.inputElement) {
        this.inputElement.nativeElement.value = state.filter;
      }
    }

    // Aplicar ordenamiento y paginación después de que la vista esté inicializada.
    setTimeout(() => {
      if (this.sort) {
        this.sort.active = state.sortColumn;
        this.sort.direction = state.sortDirection;
      }
      if (this.paginator) {
        this.paginator.pageIndex = state.pageIndex;
        this.paginator.pageSize = state.pageSize;
      }
    });
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
    return new Date(fechaStr); // Fallback por si el formato es diferente
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

  // --- Métodos de Diálogos ---
  public openDialogAgregar(): void {
    const dialogRef = this.dialog.open(AgregarProdutosComponent, {
      width: '50%',
      height: '85%',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.getProductList();
    });
  }

  public openDialogEliminar(codigoConsola: string): void {
    const dialogRef = this.dialog.open(EliminarProductosComponent, {
      width: '400px',
      disableClose: true,
      data: { value: codigoConsola }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.getProductList();
    });
  }

  public openDialogHistorial(codigoConsola: string): void {
    this.dialog.open(HistorialProductoComponent, {
      width: '600px',
      data: { codigo: codigoConsola, tipo: 'Producto' }
    });
  }
}