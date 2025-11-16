// Archivo: src/app/paginas/administracion/backup/backup.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BackupService } from '../../services/backup.service';
import { BackupResponse } from '../../services/backup.service';

@Component({
  selector: 'app-backup',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './backup.component.html',
  styleUrls: ['./backup.component.css']
})
export class BackupComponent {
  
  isLoading = false;
  ultimoBackup: { filename: string, path: string } | null = null;

  constructor(
    private backupService: BackupService,
    private snackBar: MatSnackBar
  ) { }

  crearBackup(): void {
    this.isLoading = true;
    this.ultimoBackup = null;
    this.snackBar.open('Generando backup... Esto puede tardar unos segundos.', 'Cerrar');

    this.backupService.createBackup().subscribe({
      next: (response: BackupResponse) => {
        this.isLoading = false;
        
        if (response.success) {
          this.snackBar.open(response.message, 'OK', { duration: 5000 });
          this.ultimoBackup = {
            filename: response.filename,
            path: response.path
          };
        } else {
          this.snackBar.open(response.message, 'Cerrar', { duration: 5000 });
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error al crear el backup:', err);
        
        // El error 403 ahora debería mostrar el mensaje del guard
        let errorMsg = 'Error al crear el backup. Revise la consola.';
        if (err.status === 403) {
          errorMsg = 'Acceso denegado. No tienes permisos de Administrador.';
        }
        
        this.snackBar.open(errorMsg, 'Cerrar', { duration: 5000 });
      }
    });
  }
}