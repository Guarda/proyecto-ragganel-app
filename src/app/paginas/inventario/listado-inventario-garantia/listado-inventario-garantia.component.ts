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
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

import { InventarioGeneralService } from '../../../services/inventario-general.service';
import { ArticuloGarantia } from '../../interfaces/articulogarantia';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CambiarEstadoDialogComponent } from '../cambiar-estado-dialog/cambiar-estado-dialog.component';
import { Observable } from 'rxjs';

import { ProductosService } from '../../productos/productos.service';
import { AccesorioBaseService } from '../../../services/accesorio-base.service';
import { ArticuloInventario } from '../../interfaces/articuloinventario';

@Component({
  selector: 'app-listado-inventario-garantia',
  standalone: true,
  imports: [
    CommonModule, RouterModule, MatTableModule, MatPaginatorModule, MatSortModule,
    MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule,
    MatProgressSpinnerModule, MatTooltipModule
  ],
  templateUrl: './listado-inventario-garantia.component.html',
  styleUrls: ['./listado-inventario-garantia.component.css'] // Asegúrate que el nombre del archivo CSS sea correcto
})
export class ListadoInventarioGarantiaComponent implements OnInit, AfterViewInit {
  // Define las columnas que se mostrarán en la tabla de garantía
  displayedColumns: string[] = ['TipoArticulo', 'CodigoArticulo', 'Descripcion', 'Estado', 'FechaIngreso', 'PrecioBase', 'NumeroSerie', 'Action'];
  dataSource = new MatTableDataSource<ArticuloGarantia>();

  isLoading = true;
  errorMessage: string | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private inventarioService: InventarioGeneralService,
    private dialog: MatDialog, // <-- AÑADIR
    private snackBar: MatSnackBar, // <-- AÑADIR
    private productoService: ProductosService,
    private accesorioService: AccesorioBaseService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cargarGarantias();
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  /**
   * Llama al servicio para obtener los artículos en garantía.
   */
  cargarGarantias(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.inventarioService.getArticulosEnGarantia().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar los artículos en garantía:', err);
        this.errorMessage = 'No se pudo cargar la lista. Por favor, intente de nuevo más tarde.';
        this.isLoading = false;
      }
    });
  }

  /**
   * Aplica un filtro de texto a la tabla.
   */
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  public editarArticulo(articulo: ArticuloGarantia): void { // <-- CORRECCIÓN 1: El tipo de dato es ArticuloGarantia
    let rutaBase = '';

    // Determinamos la ruta base según el tipo de artículo
    switch (articulo.TipoArticulo?.toLowerCase()) { // <-- CORRECCIÓN 2: Usar TipoArticulo
      case 'producto':
        rutaBase = '/home/listado-productos/ver-producto';
        break;
      case 'accesorio':
        rutaBase = '/home/listado-accesorios/ver-accesorio';
        break;
      // El tipo 'insumo' no debería aparecer en garantía, pero lo dejamos por si acaso
      case 'insumo':
        rutaBase = '/home/listado-insumos/ver-insumo';
        break;
      default:
        console.error(`Tipo de artículo desconocido: ${articulo.TipoArticulo}`);
        return; 
    }

    // Navegamos a la ruta construida
    this.router.navigate([rutaBase, articulo.CodigoArticulo, 'view']); // <-- CORRECCIÓN 3: Usar CodigoArticulo
  }
  
  abrirDialogoCambiarEstado(articulo: ArticuloGarantia): void {
    const dialogRef = this.dialog.open(CambiarEstadoDialogComponent, {
      width: '450px',
      data: {
        codigoArticulo: articulo.CodigoArticulo,
        tipoArticulo: articulo.TipoArticulo,
        estadoActualId: articulo.IdEstado
      }
    });

    dialogRef.afterClosed().subscribe(nuevoEstadoId => {
      if (nuevoEstadoId) {
        this.snackBar.open(`Actualizando estado para ${articulo.CodigoArticulo}...`, undefined, { duration: 2000 });

        let servicioObservable: Observable<any>;

        // Decide qué servicio llamar basado en el tipo de artículo
        if (articulo.TipoArticulo === 'Producto') {
          servicioObservable = this.productoService.actualizarEstado(articulo.CodigoArticulo, nuevoEstadoId);
        } else {
          servicioObservable = this.accesorioService.actualizarEstado(articulo.CodigoArticulo, nuevoEstadoId);
        }

        // Llama al servicio correspondiente
        servicioObservable.subscribe({
          next: (response) => {
            this.snackBar.open(response.mensaje || '¡Estado actualizado con éxito!', 'OK', {
              duration: 3000,
              panelClass: ['snackbar-success']
            });
            this.cargarGarantias(); // Recargar la lista para que el artículo desaparezca
          },
          error: (err) => {
            console.error('Error al actualizar estado:', err);
            this.snackBar.open('Error al actualizar el estado.', 'Cerrar', {
              duration: 4000,
              panelClass: ['snackbar-error']
            });
          }
        });
      }
    });
  }

  /**
   * Devuelve una clase CSS basada en el tipo de artículo.
   */
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
}