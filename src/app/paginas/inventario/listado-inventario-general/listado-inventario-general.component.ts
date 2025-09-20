import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

import { InventarioGeneralService } from '../../../services/inventario-general.service';
import { ArticuloInventario } from '../../interfaces/articuloinventario';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HistorialArticuloDialogComponent } from '../historial-articulo-dialog/historial-articulo-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-listado-inventario-general',
    imports: [
        CommonModule, MatTableModule, MatPaginatorModule, MatSortModule,
        MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule,
        MatProgressSpinnerModule, MatTooltipModule
    ],
    templateUrl: './listado-inventario-general.component.html',
    styleUrls: ['./listado-inventario-general.component.css']
})
export class ListadoInventarioGeneralComponent implements OnInit, AfterViewInit {
  // Define las columnas que se mostrarán en la tabla
   displayedColumns: string[] = ['LinkImagen', 'Codigo', 'NombreArticulo', 'Tipo', 'Estado', 'Cantidad', 'PrecioBase', 'FechaIngreso', 'Action'];
  dataSource = new MatTableDataSource<ArticuloInventario>();

  isLoading = true;
  errorMessage: string | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private inventarioService: InventarioGeneralService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.cargarInventario();
  }

  ngAfterViewInit(): void {
    // Comprobamos que el paginador exista antes de asignarlo
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
    // Hacemos lo mismo para el ordenamiento
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
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
  }

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