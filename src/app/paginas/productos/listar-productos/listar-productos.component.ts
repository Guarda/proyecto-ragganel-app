import { AfterViewInit, Component, ViewChild } from '@angular/core';
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

import { Producto } from '../../interfaces/producto';
import { ProductosService } from '../productos.service';
import { AgregarProdutosComponent } from '../agregar-produtos/agregar-produtos.component';
import { EditarProductosComponent } from '../editar-productos/editar-productos.component';
import { EliminarProductosComponent } from '../eliminar-productos/eliminar-productos.component';
import { HistorialProductoComponent } from '../historial-producto/historial-producto.component';

@Component({
  selector: 'app-listar-productos',
  standalone: true,
  imports: [
    CommonModule, RouterModule, MatTableModule, MatFormFieldModule,
    MatInputModule, MatSortModule, MatPaginatorModule, MatIconModule,
    MatButtonModule, MatProgressSpinnerModule, MatTooltipModule
  ],
  templateUrl: './listar-productos.component.html',
  styleUrls: ['./listar-productos.component.css']
})
export class ListarProductosComponent implements AfterViewInit {
  displayedColumns: string[] = ['CodigoConsola', 'DescripcionConsola', 'Estado', 'Hack', 'Fecha_Ingreso', 'PrecioBase', 'Action'];
  dataSource = new MatTableDataSource<Producto>();

  // Propiedades para manejar estados de UI
  isLoading = true;
  errorMessage: string | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    public productoService: ProductosService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getProductList();
  }

  ngAfterViewInit() {
    // La asignación del paginador y el sort se hace una sola vez aquí.
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // --- PASO 1: REEMPLAZA TU MÉTODO getProductList CON ESTE ---
  getProductList() {
    this.isLoading = true;
    this.errorMessage = null;

    this.productoService.getAll().subscribe({
      next: (data: Producto[]) => {
        // Transformamos los datos ANTES de pasarlos a la tabla
        const datosProcesados = data.map(producto => ({
          ...producto,
          // Convertimos el string "dd/mm/aaaa" a un objeto Date válido
          Fecha_Ingreso: this.parsearFecha(producto.Fecha_Ingreso) 
        }));

        this.dataSource.data = datosProcesados; // Usamos los datos ya procesados
        this.isLoading = false;
      },
      error: (err) => {
        console.error("Error al cargar productos:", err);
        this.errorMessage = "No se pudieron cargar los productos.";
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
  }

  private parsearFecha(fechaStr: string | Date): Date {
    // Si por alguna razón ya es un objeto Date, lo devolvemos
    if (fechaStr instanceof Date) {
      return fechaStr;
    }

    // Dividimos el string "dd/mm/aaaa" en sus partes
    const partes = fechaStr.split('/');
    if (partes.length === 3) {
      const dia = parseInt(partes[0], 10);
      const mes = parseInt(partes[1], 10) - 1; // Meses en JS son de 0 a 11
      const anio = parseInt(partes[2], 10);
      return new Date(anio, mes, dia);
    }
    
    // Si el formato es inesperado, intentamos una conversión directa
    return new Date(fechaStr);
  }
  
  // Lógica para los badges de estado
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

  // --- Métodos de Diálogos (simplificados) ---

  public openDialogAgregar() {
    const dialogRef = this.dialog.open(AgregarProdutosComponent, {
      width: '50%',
      height: '85%',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
      // Si el diálogo devuelve 'true' (o cualquier valor afirmativo), recargamos la lista.
      if (result) {
        this.getProductList();
      }
    });
  }

  public openDialogEliminar(codigoConsola: string) {
    const dialogRef = this.dialog.open(EliminarProductosComponent, {
      width: '400px',
      disableClose: true,
      data: { value: codigoConsola }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getProductList();
      }
    });
  }

  public openDialogHistorial(codigoConsola: string) {
    this.dialog.open(HistorialProductoComponent, {
      width: '600px',
      data: { value: codigoConsola }
    });
  }
}