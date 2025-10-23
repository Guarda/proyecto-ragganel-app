import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; // Import necessary form modules
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field'; // Import MatLabel
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'; // Import MatIconModule for icons

// 1. Import the service
import { TiposAccesoriosService } from '../../../../services/tipos-accesorios.service';

@Component({
  selector: 'app-agregar-tipo-accesorio',
  standalone: true, // Make it standalone
  imports: [
    CommonModule, // Add CommonModule
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatLabel, // Add MatLabel
    MatIconModule // Add MatIconModule
  ],
  templateUrl: './agregar-tipo-accesorio.component.html',
  styleUrl: './agregar-tipo-accesorio.component.css'
})
export class AgregarTipoAccesorioComponent {

  @Output() agregado = new EventEmitter<void>(); // Event emitter to notify parent
  tipoAccesorioForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private tiposAccesoriosService: TiposAccesoriosService,
    private dialogRef: MatDialogRef<AgregarTipoAccesorioComponent>
  ) {
    // 2. Initialize the form
    this.tipoAccesorioForm = this.fb.group({
      // Corresponds to p_CodigoAccesorio in the SP
      CodigoAccesorio: ['', [Validators.required, Validators.maxLength(25)]],
      // Corresponds to p_DescripcionAccesorio in the SP
      DescripcionAccesorio: ['', [Validators.required, Validators.maxLength(100)]]
    });
  }

  /**
   * Handles form submission.
   */
  onSubmit(): void {
    if (this.tipoAccesorioForm.invalid) {
      return; // Stop if the form is invalid
    }

    // 3. Call the service's create method
    this.tiposAccesoriosService.create(this.tipoAccesorioForm.value).subscribe({
      next: (response) => {
        console.log('Tipo de accesorio creado:', response);
        this.agregado.emit(); // Emit event
        this.dialogRef.close(true); // Close dialog indicating success
      },
      error: (error) => {
        console.error('Error al crear tipo de accesorio:', error);
        // Optional: Show an error message to the user (e.g., using MatSnackBar)
      }
    });
  }

  /**
   * Closes the dialog without saving.
   */
  onCancel(): void {
    this.dialogRef.close(false); // Close dialog indicating cancellation
  }
}