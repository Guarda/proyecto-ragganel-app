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

import { Router, ActivatedRoute } from '@angular/router'; // <-- MODIFICAR ESTA LÍNEA
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs'; // <- Añadido

import * as XLSX from 'xlsx';

import { InventarioGeneralService } from '../../../services/inventario-general.service';
import { ArticuloInventario } from '../../interfaces/articuloinventario';
import { HistorialArticuloDialogComponent } from '../historial-articulo-dialog/historial-articulo-dialog.component';

// --- CAMBIO 2: Importar el servicio de estado y la interfaz ---
import { TableStatePersistenceService } from '../../../services/table-state-persistence.service';
import { TableState } from '../../interfaces/table-state';

@Component({
  selector: 'app-listado-inventario-general',
  standalone: true, // Se asume standalone
  imports: [
    CommonModule, MatTableModule, MatPaginatorModule, MatSortModule,
    MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule,
    MatProgressSpinnerModule, MatTooltipModule,
    DatePipe
  ],
  providers: [DatePipe],
  templateUrl: './listado-inventario-general.component.html',
  styleUrls: ['./listado-inventario-general.component.css']
})
export class ListadoInventarioGeneralComponent implements OnInit, AfterViewInit, OnDestroy {
  // Define las columnas que se mostrarán en la tabla
  displayedColumns: string[] = ['LinkImagen', 'Codigo', 'NombreArticulo', 'Tipo', 'Estado', 'Cantidad', 'PrecioBase', 'FechaIngreso', 'Action'];
  dataSource = new MatTableDataSource<ArticuloInventario>();

  isLoading = true;
  errorMessage: string | null = null;

  // --- CAMBIO 4: Añadir propiedades para la gestión del estado ---
  private readonly tableStateKey = 'inventarioGeneralTableState'; // ¡Clave única!
  private subscriptions = new Subscription();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('input') inputElement!: ElementRef<HTMLInputElement>;


  constructor(
    private inventarioService: InventarioGeneralService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    // --- CAMBIO 5: Inyectar el servicio de estado ---
    private stateService: TableStatePersistenceService,
    private route: ActivatedRoute, // <--- AÑADIR ESTA LÍNEA
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.cargarInventario();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.dataSource.filterPredicate = (data: ArticuloInventario, filter: string) => {
      // Función helper para normalizar los strings de forma segura
      const safeTrim = (val: string | null) => (val || '').trim().toLowerCase();
      
      // 1. Lógica para FILTRO DE COLUMNA ESPECÍFICA (desde Dashboard)
      if (filter.startsWith('estado:')) {
        const searchTerm = safeTrim(filter.substring(7)); // 'estado:'.length = 7
        // Coincidencia exacta para el Estado
        return safeTrim(data.Estado) === searchTerm;
      
      } else if (filter.startsWith('nombre:')) {
        const searchTerm = safeTrim(filter.substring(7)); // 'nombre:'.length = 7
        // ⭐️ ESTA ES LA SOLUCIÓN: Usamos .includes() en lugar de ===
        // Esto encontrará "Mica 2DS" dentro de "Mica Protectora para Nintendo 2DS"
        return safeTrim(data.NombreArticulo).includes(searchTerm);
      }

      // 2. Lógica para el FILTRO GENÉRICO (de la barra de búsqueda)
      const lowerCaseFilter = safeTrim(filter);
      if (lowerCaseFilter === '') return true; // Mostrar todo si el filtro está vacío

      const dataStr = safeTrim(data.Codigo) + safeTrim(data.NombreArticulo) + safeTrim(data.Tipo) + safeTrim(data.Estado);
      return dataStr.includes(lowerCaseFilter);
    };
    setTimeout(() => this.loadAndApplyState());

    this.subscriptions.add(this.sort.sortChange.subscribe(() => this.saveState()));
    this.subscriptions.add(this.paginator.page.subscribe(() => this.saveState()));
  }

  // --- CAMBIO 7: Añadir ngOnDestroy para limpiar y guardar el estado final ---
  ngOnDestroy(): void {
    this.saveState();
    this.subscriptions.unsubscribe();
  }

  public editarArticulo(articulo: ArticuloInventario): void {
    let rutaBase = '';

    // Determinamos la ruta base según el tipo de artículo
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
        // Opcional: manejar un tipo desconocido o mostrar un error
        console.error(`Tipo de artículo desconocido: ${articulo.Tipo}`);
        return; // Salimos de la función si el tipo no es válido
    }

    // Navegamos a la ruta construida
    this.router.navigate([rutaBase, articulo.Codigo, 'view']);
  }

  /**
   * Llama al servicio para obtener los datos del inventario y los carga en la tabla.
   */
  cargarInventario(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.inventarioService.getInventarioGeneral().subscribe({
      next: (data) => {
        // Procesamos los datos para construir la ruta completa de la imagen
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
    const baseUrl = 'http://localhost:3000'; // La dirección de tu backend

    let folder = 'img-defaults'; // Carpeta por defecto
    switch (tipo?.toLowerCase()) {
      case 'producto':
        folder = 'img-consolas';
        break;
      case 'accesorio':
        folder = 'img-accesorios';
        break;
      case 'insumo':
        folder = 'img-insumos'; // Asumiendo que tienes esta carpeta en el backend
        break;
    }

    if (linkImagen) {
      return `${baseUrl}/${folder}/${linkImagen}`;
    } else {
      // Si no hay imagen, devuelve una por defecto desde el backend
      return `${baseUrl}/img-consolas/2ds.jpg`; // Asegúrate de que esta imagen exista
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

  /**
   * Aplica un filtro de texto a la tabla.
   * @param event El evento del input del filtro.
   */
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    // --- CAMBIO 8: Guardar el estado al filtrar ---
    this.saveState();
  }

  /**
   * Limpia el filtro de texto, resetea la paginación y guarda el estado.
   */
  public resetearFiltros(): void {
    // 1. Limpiar el valor del input
    if (this.inputElement) {
      this.inputElement.nativeElement.value = '';
    }

    // 2. Limpiar el filtro del dataSource
    this.dataSource.filter = '';

    // 3. Resetear el paginador
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

    // 4. Guardar el estado limpio
    this.saveState();
  }

  /**
   * Exporta los datos actualmente filtrados y ordenados en la tabla a un archivo Excel.
   */
  public descargarExcel(): void {
    this.snackBar.open('Generando reporte Excel...', undefined, { duration: 2000 });

    // Usamos .filteredData para obtener solo lo que el usuario está viendo
    // (esto ya respeta el filtro y el orden del MatSort)
    const data = this.dataSource.filteredData;

    if (data.length === 0) {
      this.snackBar.open('No hay datos para exportar.', 'Cerrar', { duration: 3000 });
      return;
    }

    // Mapeamos los datos a un formato legible para el Excel
    const excelData = data.map(item => ({
      'Código': item.Codigo,
      'Nombre del Artículo': item.NombreArticulo,
      'Tipo': item.Tipo,
      'Estado': item.Estado,
      'Cantidad': item.Cantidad,
      'Costo': item.PrecioBase, // Excel lo manejará como número
      'Fecha Ingreso': this.datePipe.transform(item.FechaIngreso, 'dd/MM/yyyy')
    }));

    // Creamos la hoja de cálculo
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(excelData);

    // (Opcional) Ajustar el ancho de las columnas
    ws['!cols'] = [
      { wch: 15 }, // Código
      { wch: 40 }, // Nombre del Artículo
      { wch: 12 }, // Tipo
      { wch: 15 }, // Estado
      { wch: 10 }, // Cantidad
      { wch: 12 }, // Costo
      { wch: 15 }  // Fecha Ingreso
    ];

    // Creamos el libro de trabajo
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Inventario_General');

    // Generamos el archivo y lo descargamos
    XLSX.writeFile(wb, 'Reporte_Inventario_General.xlsx');
  }

  // --- CAMBIO 9: Copiar los métodos 'saveState' y 'loadAndApplyState' ---
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
    // 1. Revisamos si un filtro viene de la URL (ej. ?filtro=exact:Nintendo...)
    const filtroQuery = this.route.snapshot.queryParamMap.get('filtro');

    if (filtroQuery) {

      // 2. Si existe, lo pasamos TAL CUAL (con el prefijo)
      //    al 'filterPredicate' que definimos arriba.
      this.dataSource.filter = filtroQuery;

      // 3. Mostramos el valor "limpio" en la barra de búsqueda
      if (this.inputElement) {
        if (filtroQuery.startsWith('estado:')) {
          this.inputElement.nativeElement.value = filtroQuery.substring(7);
        } else if (filtroQuery.startsWith('nombre:')) {
          this.inputElement.nativeElement.value = filtroQuery.substring(7);
        } else {
          // Comportamiento normal para filtros guardados (genéricos)
          this.inputElement.nativeElement.value = filtroQuery;
        }
      }


      // 4. Limpiamos el query param de la URL (esto está bien)
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { filtro: null },
        queryParamsHandling: 'merge',
        replaceUrl: true
      });

      // 5. Cargamos el resto del estado (sort, paginación) pero OMITIMOS el filtro guardado
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
      return; // ¡Importante! Salimos para no cargar el filtro del 'state'
    }

    // --- LÓGICA ORIGINAL ---
    // (Esta parte no cambia)
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

  // ... (resto de tu componente) ...

  /**
   * Devuelve una clase CSS basada en el tipo de artículo para darle un estilo visual.
   * @param tipo El tipo de artículo ('Producto', 'Accesorio', 'Insumo').
   */
  public getTipoClass(tipo: string): string {
    // --- LÍNEA AÑADIDA (LA SOLUCIÓN) ---
    // Si 'tipo' no tiene un valor (es undefined o null), devuelve una clase por defecto inmediatamente.
    if (!tipo) {
      return 'tipo-default';
    }

    // El resto del código solo se ejecuta si 'tipo' tiene un valor.
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
    // Si una imagen falla, la reemplaza con una imagen por defecto DEL BACKEND
    (event.target as HTMLImageElement).src = 'http://localhost:3000/img-consolas/2ds.jpg';
  }
}