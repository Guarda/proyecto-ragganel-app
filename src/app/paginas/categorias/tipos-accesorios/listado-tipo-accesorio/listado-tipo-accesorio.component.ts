import { AfterViewInit, Component, ViewChild, ChangeDetectorRef, NO_ERRORS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // RouterModule es opcional aquí si no hay links
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

// 1. Importar el servicio y la interfaz correctos
import { TiposAccesoriosService } from '../../../../services/tipos-accesorios.service';
import { TipoAccesorio } from '../../../interfaces/tipoaccesorio';
import { AgregarTipoAccesorioComponent } from '../agregar-tipo-accesorio/agregar-tipo-accesorio.component';

// 2. Asumir los nombres de los diálogos (reemplaza cuando los crees)
// import { AgregarTipoAccesorioComponent } from '../agregar-tipo-accesorio/agregar-tipo-accesorio.component';
// import { EditarTipoAccesorioComponent } from '../editar-tipo-accesorio/editar-tipo-accesorio.component';
// import { EliminarTipoAccesorioComponent } from '../eliminar-tipo-accesorio/eliminar-tipo-accesorio.component';

@Component({
  selector: 'app-listado-tipo-accesorio',
  standalone: true, // Lo hacemos standalone
  // 3. Añadir TODOS los imports necesarios
  imports: [
    CommonModule, RouterModule, MatTableModule, MatLabel, MatFormField,
    MatInputModule, MatSortModule, MatPaginatorModule, MatIconModule,
    MatButtonModule, MatProgressSpinnerModule, MatTooltipModule
  ],
  templateUrl: './listado-tipo-accesorio.component.html',
  styleUrl: './listado-tipo-accesorio.component.css',
  schemas: [NO_ERRORS_SCHEMA] // Añadido para compatibilidad como en la guía
})
export class ListadoTipoAccesorioComponent implements OnInit, AfterViewInit {

  // 4. Definir las columnas para "Tipos de Accesorios"
  displayedColumns: string[] = ['IdTipoAccesorioPK', 'CodigoAccesorio', 'DescripcionAccesorio', 'Activo', 'Action'];
  dataSource = new MatTableDataSource<TipoAccesorio>();

  // Propiedades para manejar estados de UI
  isLoading = true;
  errorMessage: string | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    // 5. Inyectar el servicio correcto y MatDialog
    private tiposAccesoriosService: TiposAccesoriosService,
    private cdr: ChangeDetectorRef, // Necesario si usas OnPush
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getListadoTiposAccesorios();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    // Configuración para ordenar la columna 'Activo' como booleano
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'Activo': return item.Activo;
        // Accede a las propiedades usando el nombre exacto que viene del servicio/interfaz
        default: return (item as any)[property];
      }
    };
  }

  /**
   * Obtiene la lista COMPLETA (activos e inactivos) de tipos de accesorios.
   */
  getListadoTiposAccesorios() {
    this.isLoading = true;
    this.errorMessage = null;

    // Llamamos a getAll() del nuevo servicio
    this.tiposAccesoriosService.getAll().subscribe({
      next: (data: TipoAccesorio[]) => {
        this.dataSource.data = data;
        this.isLoading = false;
        // this.cdr.markForCheck(); // Descomenta si usas OnPush
      },
      error: (err) => {
        console.error("Error al cargar tipos de accesorios:", err);
        this.errorMessage = "No se pudieron cargar los tipos de accesorios.";
        this.isLoading = false;
        // this.cdr.markForCheck(); // Descomenta si usas OnPush
      }
    });
  }

  /**
   * Aplica el filtro de búsqueda a la tabla.
   */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    // Filtro personalizado para buscar también en 'Activo'
    this.dataSource.filterPredicate = (data: TipoAccesorio, filter: string) => {
      const textoActivo = data.Activo ? 'activo' : 'inactivo';
      const dataStr = `${data.IdTipoAccesorioPK} ${data.CodigoAccesorio} ${data.DescripcionAccesorio} ${textoActivo}`.toLowerCase();
      return dataStr.includes(filter);
    };


    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  public openDialogAgregar() {
    const dialogRef = this.dialog.open(AgregarTipoAccesorioComponent, {
      width: '500px', // Ajusta el tamaño
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) { // Si el diálogo se cerró guardando (true)
        this.getListadoTiposAccesorios(); // Recarga la lista
      }
    });
  }
  

  /*
  public openDialogEditar(id: number) { // El ID es numérico
    const dialogRef = this.dialog.open(EditarTipoAccesorioComponent, {
      width: '500px', // Ajusta el tamaño
      disableClose: true,
      data: { id: id } // Pasamos el ID al diálogo
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getListadoTiposAccesorios();
      }
    });
  }
  */

  /*
  public openDialogEliminar(id: number) { // El ID es numérico
    const dialogRef = this.dialog.open(EliminarTipoAccesorioComponent, {
      width: '400px', // Ajusta el tamaño
      disableClose: true,
      data: { id: id } // Pasamos el ID al diálogo
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getListadoTiposAccesorios();
      }
    });
  }
  */

  // --- Métodos Provisionales (para que los botones no den error) ---
  // BORRA ESTO cuando descomentes los métodos de diálogo de arriba
  public openDialogEditar(id: number) { console.log('Abrir diálogo editar para ID:', id); }
  public openDialogEliminar(id: number) { console.log('Abrir diálogo eliminar/desactivar para ID:', id); }

}