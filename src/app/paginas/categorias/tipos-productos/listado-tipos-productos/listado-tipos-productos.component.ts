import { AfterViewInit, Component, ViewChild, ChangeDetectorRef, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
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
import { TiposProductosService } from '../../../../services/tipos-productos.service';
import { TipoProducto } from '../../../interfaces/tipoproducto';


import { AgregarTipoProductoComponent } from '../agregar-tipo-producto/agregar-tipo-producto.component';
import { EditarTipoProductoComponent } from '../editar-tipo-producto/editar-tipo-producto.component';
import { EliminarTipoProductoComponent } from '../eliminar-tipo-producto/eliminar-tipo-producto.component';

@Component({
  selector: 'app-listado-tipos-productos',
  // 3. Añadir TODOS los imports necesarios para el componente standalone
  imports: [
    CommonModule, RouterModule, MatTableModule, MatLabel, MatFormField,
    MatInputModule, MatSortModule, MatPaginatorModule, MatIconModule,
    MatButtonModule, MatProgressSpinnerModule, MatTooltipModule
  ],
  templateUrl: './listado-tipos-productos.component.html',
  styleUrl: './listado-tipos-productos.component.css',
  schemas: [NO_ERRORS_SCHEMA] // Añadido para compatibilidad como en la guía
})
export class ListadoTiposProductosComponent implements AfterViewInit {

  // 4. Definir las columnas para "Tipos de Producto"
  // **** CAMBIO AQUÍ: Añadido 'Activo' ****
  displayedColumns: string[] = ['IdTipoProductoPK', 'Descripcion', 'Activo', 'Action'];
  dataSource = new MatTableDataSource<TipoProducto>;

  // Propiedades para manejar estados de UI
  isLoading = true;
  errorMessage: string | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    // 5. Inyectar el servicio correcto
    public tiposProductosService: TiposProductosService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getListadoTiposProductos();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    // **** CAMBIO AQUÍ: Añadido sortingDataAccessor ****
    // Configuración para ordenar la columna 'Activo' como booleano y no como texto
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        // Asegúrate de usar el nombre de propiedad 'Activo' (mayúscula)
        case 'Activo': return item.Activo;
        default: 
          // Reutilizamos la lógica de la columna descripción
          if (property === 'Descripcion') return item.DescripcionTipoProducto;
          return (item as any)[property];
      }
    };
  }

  getListadoTiposProductos() {
    this.isLoading = true;
    this.errorMessage = null;

    this.tiposProductosService.getList().subscribe({
      next: (data: TipoProducto[]) => {
        // Asignamos los datos directamente
        this.dataSource.data = data;
        console.log("Tipos de producto cargados:", data);
        this.isLoading = false;
      },
      error: (err) => {
        console.error("Error al cargar tipos de producto:", err);
        this.errorMessage = "No se pudieron cargar los tipos de producto.";
        this.isLoading = false;
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    
    // **** CAMBIO AQUÍ: Añadido filtro personalizado ****
    // Filtro personalizado para buscar también en 'Activo'
    this.dataSource.filterPredicate = (data: TipoProducto, filter: string) => {
      const textoActivo = data.Activo ? 'activo' : 'inactivo';
      return data.DescripcionTipoProducto.toLowerCase().includes(filter) ||
             data.IdTipoProductoPK.toString().includes(filter) ||
             textoActivo.includes(filter);
    };

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // --- Métodos de Diálogos (adaptados) ---
  // DESCOMENTA ESTO CUANDO TENGAS LOS COMPONENTES DE DIÁLOGO


  public openDialogAgregar() {
    const dialogRef = this.dialog.open(AgregarTipoProductoComponent, {
      width: '500px', // Ajusta el tamaño según necesites
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getListadoTiposProductos();
      }
    });
  }



  public openDialogEditar(id: number) { // El ID es numérico
    const dialogRef = this.dialog.open(EditarTipoProductoComponent, {
      width: '500px', // Ajusta el tamaño
      disableClose: true,
      data: { value: id }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getListadoTiposProductos();
      }
    });
  }



  public openDialogEliminar(id: number) { // El ID es numérico
    const dialogRef = this.dialog.open(EliminarTipoProductoComponent, {
      width: '400px',
      disableClose: true,
      data: { value: id }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getListadoTiposProductos();
      }
    });
  }
}