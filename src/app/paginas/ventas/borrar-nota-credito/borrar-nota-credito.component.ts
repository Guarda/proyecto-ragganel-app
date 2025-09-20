import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';

import { NotasCreditoService } from '../../../services/notas-credito.service';
import { AuthService } from '../../../UI/session/auth.service';

@Component({
    selector: 'app-borrar-nota-credito',
    imports: [
        CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule,
        MatInputModule, MatButtonModule
    ],
    templateUrl: './borrar-nota-credito.component.html',
    styleUrls: ['./borrar-nota-credito.component.css']
})
export class BorrarNotaCreditoComponent implements OnInit {
  anulacionForm: FormGroup;
  isLoading = false;
  usuarioId: number;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<BorrarNotaCreditoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { idNota: number },
    private notasCreditoService: NotasCreditoService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.anulacionForm = this.fb.group({
      motivo: ['', [Validators.required, Validators.minLength(10)]]
    });
    this.usuarioId = this.authService.getUserValue()?.id || 0;
  }

  ngOnInit(): void {}

  onAnularClick(): void {
    if (this.anulacionForm.invalid) {
      return;
    }
    
    this.isLoading = true;
    const motivo = this.anulacionForm.get('motivo')?.value;

    this.notasCreditoService.anularNotaCredito(this.data.idNota, motivo, this.usuarioId).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.snackBar.open(response.mensaje, 'Cerrar', { duration: 4000 });
        this.dialogRef.close(true); // Cierra y devuelve 'true' para indicar éxito
      },
      error: (err) => {
        this.isLoading = false;
        const mensajeError = err.error?.mensaje || 'No se pudo anular la nota de crédito.';
        this.snackBar.open(mensajeError, 'Cerrar', { 
            duration: 5000,
            panelClass: ['snackbar-error']
        });
      }
    });
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }
}