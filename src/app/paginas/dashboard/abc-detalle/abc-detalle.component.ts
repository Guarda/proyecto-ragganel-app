import { Component, Inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common'; // Importa CurrencyPipe
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
// ⭐️ 1. IMPORTA EL SPINNER, EL SERVICIO Y LA INTERFAZ
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DashboardService } from '../../../services/dashboard.service';
import { Top10Articulo } from '../../interfaces/top10articulo';


@Component({
  selector: 'app-abc-detalle',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe, // Añade CurrencyPipe aquí
    MatDialogModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule // ⭐️ 3. AÑADE EL MÓDULO DEL SPINNER
  ],
  templateUrl: './abc-detalle.component.html',
  styleUrls: ['./abc-detalle.component.css']
})
export class AbcDetalleComponent {

  // El título (ej. 'A (Productos) (85 arts.)')
  public title: string;
  // La lista de artículos (Top 10)
  public items: Top10Articulo[];

  // Las columnas que mostraremos en la tabla
  public displayedColumns: string[] = ['NombreArticulo', 'Cantidad', 'PrecioBase', 'ValorTotal'];

  // ⭐️ 4. AÑADE UN ESTADO DE CARGA
  public isLoading = false;

  constructor(
    // Referencia al modal en sí
    public dialogRef: MatDialogRef<AbcDetalleComponent>,
    // Aquí es donde Angular Material inyecta los datos que le pasamos
    @Inject(MAT_DIALOG_DATA) public data: { title: string, items: Top10Articulo[] },
    // ⭐️ 5. INYECTA EL DASHBOARD SERVICE
    private dashboardService: DashboardService
  ) {
    this.title = data.title;
    this.items = data.items;
  }

  public cerrar(): void {
    this.dialogRef.close();
  }

  // ⭐️ 6. AÑADE LA FUNCIÓN DE DESCARGA
  public descargarListaCompleta(): void {
    this.isLoading = true;

    // 1. Obtenemos la clave de la categoría (ej. "A (Productos)")
    const categoriaKey = this.data.title.split(' (')[0];
    
    // 2. Llama al NUEVO método del servicio
    this.dashboardService.getDescargaInventarioABC(categoriaKey).subscribe({
      next: (fullData) => {
        // 3. Genera el nombre del archivo
        const filename = `Inventario_${categoriaKey.replace(/ /g, '_')}.csv`;
        // 4. Llama a la utilidad de exportación
        this.exportToCsv(fullData, filename);
        this.isLoading = false;
      },
      error: (err) => {
        console.error("Error al descargar la lista completa:", err);
        this.isLoading = false;
        // Aquí podrías mostrar un snackbar de error
      }
    });
  }

  // ⭐️ 7. AÑADE LA UTILIDAD PARA EXPORTAR A CSV
  private exportToCsv(data: Top10Articulo[], filename: string): void {
    const header = ["Codigo", "NombreArticulo", "PrecioBase", "Cantidad", "ValorTotal"];
    
    const csvRows = data.map(row => 
      [
        `"${row.Codigo}"`,
        `"${row.NombreArticulo.replace(/"/g, '""')}"`, // Escapa comillas dobles
        row.PrecioBase,
        row.Cantidad,
        row.ValorTotal
      ].join(',')
    );

    // Une la cabecera y las filas
    const csvContent = [header.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}