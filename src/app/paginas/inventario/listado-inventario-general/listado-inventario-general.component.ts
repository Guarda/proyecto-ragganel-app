import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import * as XLSX from 'xlsx';

import { InventarioGeneralService } from '../../../services/inventario-general.service';
import { ArticuloInventario } from '../../interfaces/articuloinventario';
import { HistorialArticuloDialogComponent } from '../historial-articulo-dialog/historial-articulo-dialog.component';

import { TableStatePersistenceService } from '../../../services/table-state-persistence.service';
import { TableState } from '../../interfaces/table-state';
import { environment } from '../../../../enviroments/enviroments';
import { AgregarProdutosComponent } from '../../productos/agregar-produtos/agregar-produtos.component';
import { AgregarAccesoriosComponent } from '../../accesorios/agregar-accesorios/agregar-accesorios.component';
import { AgregarInsumosComponent } from '../../insumos/agregar-insumos/agregar-insumos.component';
import { SelectorTipoArticuloComponent } from '../selector-tipo-articulo/selector-tipo-articulo.component';

@Component({
  selector: 'app-listado-inventario-general',
  standalone: true,
  imports: [
    CommonModule, MatTableModule, MatPaginatorModule, MatSortModule,
    MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule,
    MatProgressSpinnerModule, MatTooltipModule,
    DatePipe,
    SelectorTipoArticuloComponent
  ],
  providers: [DatePipe],
  templateUrl: './listado-inventario-general.component.html',
  styleUrls: ['./listado-inventario-general.component.css']
})
export class ListadoInventarioGeneralComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns: string[] = ['LinkImagen', 'Codigo', 'NombreArticulo', 'Tipo', 'Estado', 'Cantidad', 'PrecioBase', 'FechaIngreso', 'Action'];
  dataSource = new MatTableDataSource<ArticuloInventario>();

  isLoading = true;
  errorMessage: string | null = null;

  private readonly tableStateKey = 'inventarioGeneralTableState';
  private subscriptions = new Subscription();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('input') inputElement!: ElementRef<HTMLInputElement>;


  constructor(
    private inventarioService: InventarioGeneralService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private stateService: TableStatePersistenceService,
    private route: ActivatedRoute,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.cargarInventario();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.dataSource.filterPredicate = (data: ArticuloInventario, filter: string) => {
      const safeTrim = (val: string | null) => (val || '').trim().toLowerCase();
      
      if (filter.startsWith('estado:')) {
        const searchTerm = safeTrim(filter.substring(7));
        return safeTrim(data.Estado) === searchTerm;
      
      } else if (filter.startsWith('nombre:')) {
        const searchTerm = safeTrim(filter.substring(7));
        return safeTrim(data.NombreArticulo).includes(searchTerm);
      }

      const lowerCaseFilter = safeTrim(filter);
      if (lowerCaseFilter === '') return true;

      const dataStr = safeTrim(data.Codigo) + safeTrim(data.NombreArticulo) + safeTrim(data.Tipo) + safeTrim(data.Estado);
      return dataStr.includes(lowerCaseFilter);
    };
    setTimeout(() => this.loadAndApplyState());

    this.subscriptions.add(this.sort.sortChange.subscribe(() => this.saveState()));
    this.subscriptions.add(this.paginator.page.subscribe(() => this.saveState()));
  }

  ngOnDestroy(): void {
    this.saveState();
    this.subscriptions.unsubscribe();
  }

  public editarArticulo(articulo: ArticuloInventario): void {
    let rutaBase = '';

    switch (articulo.Tipo?.toLowerCase()) {
      case 'producto':
        rutaBase = '/home/listado-productos/ver-producto';
        break;
      case 'accesorio':
        rutaBase = '/home/listado-accesorios/ver-accesorio';
        break;
      case 'insumo':
        rutaBase = '/home/listado-insumos/ver-insumo';
        break;
      default:
        console.error(`Tipo de artículo desconocido: ${articulo.Tipo}`);
        return;
    }

    this.router.navigate([rutaBase, articulo.Codigo, 'view']);
  }

  cargarInventario(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.inventarioService.getInventarioGeneral().subscribe({
      next: (data) => {
        const datosProcesados = data.map(item => ({
          ...item,
          ImagePath_full: this.getImagePath(item.Tipo, item.LinkImagen)
        }));

        this.dataSource.data = datosProcesados;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar el inventario:', err);
        this.errorMessage = 'No se pudo cargar el inventario. Por favor, intente de nuevo más tarde.';
        this.isLoading = false;
      }
    });
  }

  private getImagePath(tipo: string, linkImagen: string | null): string {
    const baseUrl = environment.apiUrl;

    let folder = 'img-defaults';
    switch (tipo?.toLowerCase()) {
      case 'producto':
        folder = 'img-consolas';
        break;
      case 'accesorio':
        folder = 'img-accesorios';
        break;
      case 'insumo':
        folder = 'img-insumos';
        break;
    }

    if (linkImagen) {
      return `${baseUrl}/${folder}/${linkImagen}`;
    } else {
      return `${baseUrl}/img-consolas/2ds.jpg`;
    }
  }

  public getEstadoClass(estado: string): string {
    if (!estado) {
      return 'estado-default';
    }
    const estadoNormalizado = estado.toLowerCase().replace(/\s+/g, '-');
    switch (estadoNormalizado) {
      case 'nuevo':
        return 'estado-nuevo';
      case 'usado':
        return 'estado-usado';
      case 'en-garantia':
        return 'estado-garantia';
      case 'a-reparar':
        return 'estado-reparar';
      case 'para-piezas':
        return 'estado-piezas';
      default:
        return 'estado-default';
    }
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    this.saveState();
  }

  public resetearFiltros(): void {
    if (this.inputElement) {
      this.inputElement.nativeElement.value = '';
    }

    this.dataSource.filter = '';

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

    this.saveState();
  }

  public descargarExcel(): void {
    this.snackBar.open('Generando reporte Excel...', undefined, { duration: 2000 });

    const data = this.dataSource.filteredData;

    if (data.length === 0) {
      this.snackBar.open('No hay datos para exportar.', 'Cerrar', { duration: 3000 });
      return;
    }

    const excelData = data.map(item => ({
      'Código': item.Codigo,
      'Nombre del Artículo': item.NombreArticulo,
      'Tipo': item.Tipo,
      'Estado': item.Estado,
      'Cantidad': item.Cantidad,
      'Costo': item.PrecioBase,
      'Fecha Ingreso': this.datePipe.transform(item.FechaIngreso, 'dd/MM/yyyy')
    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(excelData);

    ws['!cols'] = [
      { wch: 15 },
      { wch: 40 },
      { wch: 12 },
      { wch: 15 },
      { wch: 10 },
      { wch: 12 },
      { wch: 15 }
    ];

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Inventario_General');

    XLSX.writeFile(wb, 'Reporte_Inventario_General.xlsx');
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
    const filtroQuery = this.route.snapshot.queryParamMap.get('filtro');

    if (filtroQuery) {

      this.dataSource.filter = filtroQuery;

      if (this.inputElement) {
        if (filtroQuery.startsWith('estado:')) {
          this.inputElement.nativeElement.value = filtroQuery.substring(7);
        } else if (filtroQuery.startsWith('nombre:')) {
          this.inputElement.nativeElement.value = filtroQuery.substring(7);
        } else {
          this.inputElement.nativeElement.value = filtroQuery;
        }
      }


      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { filtro: null },
        queryParamsHandling: 'merge',
        replaceUrl: true
      });

      const state = this.stateService.loadState(this.tableStateKey);
      if (state) {
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
      return;
    }

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

  public getTipoClass(tipo: string): string {
    if (!tipo) {
      return 'tipo-default';
    }

    switch (tipo.toLowerCase()) {
      case 'producto': return 'tipo-producto';
      case 'accesorio': return 'tipo-accesorio';
      case 'insumo': return 'tipo-insumo';
      default: return 'tipo-default';
    }
  }

  abrirDialogoHistorial(articulo: ArticuloInventario): void {
    this.snackBar.open(`Cargando historial para ${articulo.Codigo}...`, undefined, { duration: 2000 });

    this.inventarioService.getHistorialArticulo(articulo.Tipo, articulo.Codigo).subscribe({
      next: (historialData) => {
        this.dialog.open(HistorialArticuloDialogComponent, {
          width: '600px',
          data: {
            codigo: articulo.Codigo,
            tipo: articulo.Tipo,
            historial: historialData
          }
        });
      },
      error: (err) => {
        console.error("Error al cargar historial:", err);
        this.snackBar.open('No se pudo cargar el historial del artículo.', 'Cerrar', { duration: 4000 });
      }
    });
  }

  public onImageError(event: Event): void {
    (event.target as HTMLImageElement).src = `${environment.apiUrl}/img-consolas/2ds.jpg`;
  }

  /**
   * Abre el selector intermedio para elegir el tipo de artículo
   */
  public abrirSelectorNuevo(): void {
    const dialogRef = this.dialog.open(SelectorTipoArticuloComponent, {
      width: '350px'
    });

    dialogRef.afterClosed().subscribe(tipo => {
      if (tipo) {
        this.abrirDialogoNuevo(tipo);
      }
    });
  }

  /**
   * Abre el diálogo correspondiente según el tipo seleccionado
   */
  private abrirDialogoNuevo(tipo: 'producto' | 'accesorio' | 'insumo'): void {
    let component: any;
    const config = {
      width: '70%',
      height: '85%',
      disableClose: true
    };

    switch (tipo) {
      case 'producto':
        component = AgregarProdutosComponent;
        break;
      case 'accesorio':
        component = AgregarAccesoriosComponent;
        break;
      case 'insumo':
        component = AgregarInsumosComponent;
        break;
    }

    if (component) {
      const dialogRef = this.dialog.open(component, config);

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.cargarInventario();
          this.snackBar.open('Artículo registrado correctamente', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }
}