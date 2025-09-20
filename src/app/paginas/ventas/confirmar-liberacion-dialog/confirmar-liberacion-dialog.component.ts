import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-confirmar-liberacion-dialog',
    imports: [
        CommonModule,
        MatDialogModule,
        MatButtonModule,
        MatIconModule
    ],
    templateUrl: './confirmar-liberacion-dialog.component.html',
    styleUrls: ['./confirmar-liberacion-dialog.component.css']
})
export class ConfirmarLiberacionDialogComponent {

  constructor(
    // MatDialogRef nos permite controlar el diálogo (ej. cerrarlo)
    public dialogRef: MatDialogRef<ConfirmarLiberacionDialogComponent>,
    // MAT_DIALOG_DATA nos permite recibir datos del componente que abrió el diálogo
    @Inject(MAT_DIALOG_DATA) public data: { idCarrito: number }
  ) { }

  /**
   * Cierra el diálogo sin realizar ninguna acción.
   */
  onNoClick(): void {
    this.dialogRef.close(false);
  }

  /**
   * Cierra el diálogo y confirma la acción.
   */
  onYesClick(): void {
    this.dialogRef.close(true);
  }
}