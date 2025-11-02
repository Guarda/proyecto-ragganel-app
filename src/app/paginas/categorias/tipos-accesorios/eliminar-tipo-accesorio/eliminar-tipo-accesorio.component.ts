import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Para *ngIf
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// 1. Importar el servicio
import { TiposAccesoriosService } from '../../../../services/tipos-accesorios.service';

@Component({
  selector: 'app-eliminar-tipo-accesorio',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './eliminar-tipo-accesorio.component.html',
  styleUrl: './eliminar-tipo-accesorio.component.css'
})
export class EliminarTipoAccesorioComponent implements OnInit {

  isLoading = false; // Para el spinner del botón
  isLoadingDetails = true; // Para el spinner de carga inicial
  nombreAccesorio: string | null = null;
  currentId: number;

  constructor(
    private dialogRef: MatDialogRef<EliminarTipoAccesorioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number }, // 2. Recibir el ID
    private tiposAccesoriosService: TiposAccesoriosService
  ) {
    this.currentId = data.id;
  }

  ngOnInit(): void {
    // 3. Cargar los datos del accesorio para mostrar su nombre
    this.tiposAccesoriosService.find(this.currentId).subscribe({
      next: (data) => {
        this.nombreAccesorio = data.DescripcionAccesorio;
        this.isLoadingDetails = false;
      },
      error: (err) => {
        console.error('Error al cargar datos para eliminar:', err);
        this.nombreAccesorio = 'Elemento no encontrado';
        this.isLoadingDetails = false;
      }
    });
  }

  /**
   * Cierra el diálogo sin hacer nada.
   */
  onCancel(): void {
    this.dialogRef.close(false);
  }

  /**
   * Confirma la desactivación y llama al servicio.
   */
  onConfirmDeactivate(): void {
    this.isLoading = true; // Mostrar spinner en el botón

    // 4. Llamar al método 'deactivate' del servicio
    this.tiposAccesoriosService.deactivate(this.currentId).subscribe({
      next: (response) => {
        console.log('Tipo de accesorio desactivado:', response);
        this.isLoading = false;
        this.dialogRef.close(true); // 5. Cerrar indicando éxito
      },
      error: (error) => {
        console.error('Error al desactivar tipo de accesorio:', error);
        this.isLoading = false;
        // Opcional: Mostrar un mensaje de error dentro del diálogo
      }
    });
  }
}