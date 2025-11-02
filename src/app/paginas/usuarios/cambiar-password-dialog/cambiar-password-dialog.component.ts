// cambiar-contraseña-dialog.component.ts
import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
// 1. IMPORTAR VALIDATORS AVANZADOS Y SNACKBAR
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'; // Importar MatSnackBar
import { UsuariosService } from '../../../services/usuarios.service';
import { MatError, MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-cambiar-password-dialog',
    // 2. AÑADIR MatSnackBarModule a los imports
    imports: [CommonModule, MatFormField, MatInput, MatLabel, MatError, MatDialogContent, MatDialogActions, MatDialogModule, MatFormFieldModule, ReactiveFormsModule, MatButtonModule, MatSnackBarModule],
    templateUrl: './cambiar-password-dialog.component.html',
    styleUrls: ['./cambiar-password-dialog.component.css']
})
export class CambiarPasswordDialogComponent {
  changePasswordForm: FormGroup;
  @Input() idUsuario!: string;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CambiarPasswordDialogComponent>,
    private usuariosService: UsuariosService,
    // 3. INYECTAR MatSnackBar
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any // Recibir el ID de usuario
  ) {
    this.idUsuario = this.data.userId;

    // 4. CREAR FORMULARIO CON VALIDACIÓN AVANZADA
    this.changePasswordForm = this.fb.group({
      IdUsuario: [ this.idUsuario, Validators.required],
      currentPassword: ['', Validators.required],
      newPassword: ['', [
        Validators.required,
        Validators.minLength(8), // Aumentamos a 8
        // Requerir al menos 1 mayúscula, 1 minúscula y 1 número
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$') 
      ]],
      confirmNewPassword: ['', [Validators.required, Validators.minLength(8)]]
    }, {
      // 5. AÑADIR VALIDACIONES CRUZADAS AL GRUPO
      validators: [
        this.passwordsMatchValidator, // ¿Coinciden?
        this.notOldPasswordValidator // ¿Es diferente a la antigua?
      ]
    });
  }

  // --- NUEVO: Validador para "No usar contraseña antigua" ---
  private notOldPasswordValidator(control: AbstractControl): ValidationErrors | null {
    const currentPassword = control.get('currentPassword')?.value;
    const newPassword = control.get('newPassword')?.value;

    if (currentPassword && newPassword && currentPassword === newPassword) {
      // Devolvemos el error en el control 'newPassword'
      control.get('newPassword')?.setErrors({ notOldPassword: true });
      return { notOldPassword: true };
    }
    
    // Si el error estaba presente pero ya no, lo limpiamos
    if (control.get('newPassword')?.hasError('notOldPassword')) {
        // Comprobación cuidadosa para no borrar otros errores
        const errors = control.get('newPassword')?.errors;
        if (errors) {
            delete errors['notOldPassword'];
            if (Object.keys(errors).length > 0) {
                control.get('newPassword')?.setErrors(errors);
            } else {
                control.get('newPassword')?.setErrors(null);
            }
        }
    }
    
    return null;
  }

  // --- NUEVO: Validador para "Contraseñas coinciden" ---
  private passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
    const newPassword = control.get('newPassword')?.value;
    const confirmNewPassword = control.get('confirmNewPassword')?.value;

    if (newPassword && confirmNewPassword && newPassword !== confirmNewPassword) {
      // Devolvemos el error en el control 'confirmNewPassword'
      control.get('confirmNewPassword')?.setErrors({ passwordsMatch: true });
      return { passwordsMatch: true };
    }

    // Si el error estaba presente pero ya no, lo limpiamos
    if (control.get('confirmNewPassword')?.hasError('passwordsMatch')) {
        const errors = control.get('confirmNewPassword')?.errors;
        if (errors) {
            delete errors['passwordsMatch'];
            if (Object.keys(errors).length > 0) {
                control.get('confirmNewPassword')?.setErrors(errors);
            } else {
                control.get('confirmNewPassword')?.setErrors(null);
            }
        }
    }

    return null;
  }

  // 6. ACTUALIZAR onSubmit (Quitar 'alert' y la validación manual)
  onSubmit() {
    if (this.changePasswordForm.valid) {
      
      // La validación de 'passwordsMatch' ya se hizo automáticamente
      // if (newPassword !== confirmNewPassword) { ... } // <-- ESTA LÍNEA YA NO ES NECESARIA

      // Llamada al servicio para cambiar la contraseña
      this.usuariosService.changePassword(this.changePasswordForm.value).subscribe({
        next: (response) => {
          console.log('Contraseña cambiada con éxito');
          this._snackBar.open('Contraseña actualizada exitosamente', 'Cerrar', { duration: 3000 });
          this.dialogRef.close(true); // Cerrar el diálogo con éxito
        }, 
        error: (error) => {
          console.error('Error al cambiar la contraseña', error);
          // Reemplazar alert() con MatSnackBar
          this._snackBar.open('Error: La contraseña actual es incorrecta o falló la conexión.', 'Cerrar', { 
            duration: 5000,
            panelClass: ['error-snackbar'] // (Opcional: para CSS personalizado)
          });
        }
      });
    }
  }

  onClose() {
    this.dialogRef.close();
  }
}
