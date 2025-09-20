import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
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
import { NotasCreditoService } from '../../../services/notas-credito.service'; // Asegúrate que la ruta sea correcta
import { BorrarNotaCreditoComponent } from '../borrar-nota-credito/borrar-nota-credito.component';

import { NotaCredito } from '../../interfaces/notacredito';
import { RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
@Component({
    selector: 'app-listar-notas-credito',
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
        RouterModule
    ],
    templateUrl: './listar-notas-credito.component.html',
    styleUrls: ['./listar-notas-credito.component.css'] // No olvides crear este archivo
})
export class ListarNotasCreditoComponent implements OnInit, AfterViewInit {

  // 2. Columnas que se mostrarán en la tabla
  displayedColumns: string[] = ['IdNotaCreditoPK', 'FechaEmision', 'NumeroVentaOriginal', 'NombreCliente', 'Motivo', 'TotalCredito', 'UsuarioEmisor', 'EstadoNota', 'Acciones'];
  dataSource = new MatTableDataSource<NotaCredito>();
  isLoading = true;

  // 3. Referencias a los elementos de Angular Material
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('input') inputBusqueda!: ElementRef<HTMLInputElement>;

  constructor(
    private notasCreditoService: NotasCreditoService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.cargarNotasDeCredito();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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
  }

  // 4. Función para obtener la clase CSS según el estado
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

  // 5. Métodos para las acciones (por ahora con un console.log)
  verNota(id: number): void {
    console.log(`Ver detalles de la nota de crédito: ${id}`);
    // Aquí navegarías a una nueva ruta o abrirías un modal
    this.snackBar.open(`FUNCIONALIDAD PENDIENTE: Ver nota ${id}`, 'OK', { duration: 3000 });
  }

  eliminarNota(id: number): void {
    const dialogRef = this.dialog.open(BorrarNotaCreditoComponent, {
      width: '500px',
      // Le pasamos el ID de la nota al diálogo para que sepa cuál anular
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