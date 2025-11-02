import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necesario para *ngIf
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; // Para el spinner
import { MatSlideToggleModule } from '@angular/material/slide-toggle'; // Para el estado "Activo"
import { TipoAccesorio } from '../../../interfaces/tipoaccesorio';
// 1. Importar el servicio y la interfaz
import { TiposAccesoriosService } from '../../../../services/tipos-accesorios.service';

@Component({
  selector: 'app-editar-tipo-accesorio',
  standalone: true,
  imports: [
    CommonModule, // <-- Añadido
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatLabel,
    MatIconModule,
    MatProgressSpinnerModule, // <-- Añadido
    MatSlideToggleModule    // <-- Añadido
  ],
  templateUrl: './editar-tipo-accesorio.component.html',
  styleUrl: './editar-tipo-accesorio.component.css' // Usaremos un CSS similar al de 'agregar'
})
export class EditarTipoAccesorioComponent implements OnInit {

  tipoAccesorioForm: FormGroup;
  isLoading = true; // Estado de carga
  currentId: number;

  constructor(
    private fb: FormBuilder,
    private tiposAccesoriosService: TiposAccesoriosService,
    private dialogRef: MatDialogRef<EditarTipoAccesorioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number } // 2. Recibir el ID
  ) {
    this.currentId = data.id;

    // 3. Inicializar el formulario (incluyendo 'Activo')
    this.tipoAccesorioForm = this.fb.group({
      CodigoAccesorio: ['', [Validators.required, Validators.maxLength(25)]],
      DescripcionAccesorio: ['', [Validators.required, Validators.maxLength(100)]],
      Activo: [true] // El servicio 'update' requiere el estado
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  /**
   * Carga los datos del tipo de accesorio desde el servicio.
   */
  loadData(): void {
    this.isLoading = true;
    this.tiposAccesoriosService.find(this.currentId).subscribe({
      next: (data) => {
        // 4. Rellenar el formulario con los datos existentes
        this.tipoAccesorioForm.setValue({
          CodigoAccesorio: data.CodigoAccesorio,
          DescripcionAccesorio: data.DescripcionAccesorio,
          Activo: data.Activo
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar tipo de accesorio:', error);
        this.isLoading = false;
        // Opcional: Mostrar error y cerrar
        this.dialogRef.close(false);
      }
    });
  }

  /**
   * Maneja el envío del formulario.
   */
  onSubmit(): void {
    if (this.tipoAccesorioForm.invalid) {
      return; // Detener si el formulario es inválido
    }

    this.isLoading = true; // Mostrar spinner al guardar

    // 5. Construir el objeto TipoAccesorio completo
    const updatedData: TipoAccesorio = {
      IdTipoAccesorioPK: this.currentId, // <-- Incluir el ID
      ...this.tipoAccesorioForm.value // { CodigoAccesorio, DescripcionAccesorio, Activo }
    };

    // 6. Llamar al método 'update' del servicio
    this.tiposAccesoriosService.update(updatedData).subscribe({
      next: (response) => {
        console.log('Tipo de accesorio actualizado:', response);
        this.isLoading = false;
        this.dialogRef.close(true); // Cerrar diálogo indicando éxito
      },
      error: (error) => {
        console.error('Error al actualizar tipo de accesorio:', error);
        this.isLoading = false;
        // Opcional: Mostrar un mensaje de error al usuario
      }
    });
  }

  /**
   * Cierra el diálogo sin guardar.
   */
  onCancel(): void {
    this.dialogRef.close(false); // Cerrar diálogo indicando cancelación
  }
}