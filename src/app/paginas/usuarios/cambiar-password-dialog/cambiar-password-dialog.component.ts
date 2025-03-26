// cambiar-contraseña-dialog.component.ts
import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuariosService } from '../../../services/usuarios.service';
import { MatError, MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cambiar-password-dialog',
  standalone: true,
  imports: [CommonModule, MatFormField, MatInput, MatLabel, MatError, MatDialogContent, MatDialogActions, MatDialogModule, MatFormFieldModule, ReactiveFormsModule, MatButtonModule ] ,
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
    @Inject(MAT_DIALOG_DATA) public data: any // Recibir el ID de usuario
  ) {
    this.idUsuario = this.data.userId;

    this.changePasswordForm = this.fb.group({
      IdUsuario: [ this.idUsuario, Validators.required],
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmNewPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // Método para cambiar la contraseña
  onSubmit() {
    if (this.changePasswordForm.valid) {
      const { currentPassword, newPassword, confirmNewPassword } = this.changePasswordForm.value;
      
      if (newPassword !== confirmNewPassword) {
        alert('Las contraseñas no coinciden');
        return;
      }

      // Llamada al servicio para cambiar la contraseña
      this.usuariosService.changePassword(this.changePasswordForm.value).subscribe(response => {
        console.log('Contraseña cambiada con éxito');
        this.dialogRef.close(true); // Cerrar el diálogo con éxito
      }, error => {
        console.error('Error al cambiar la contraseña', error);
        alert('Error al cambiar la contraseña');
      });
    }
  }

  // Método para cerrar el diálogo sin realizar cambios
  onClose() {
    this.dialogRef.close();
  }
}
