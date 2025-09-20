import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

/**
 * Interfaz para los datos que se pasarán al diálogo.
 * Esto asegura que siempre se reciba el idProforma.
 */
export interface DialogData {
  idProforma: number;
}

@Component({
    selector: 'app-confirmacion-reemplazar-carrito-dialog',
    imports: [
        CommonModule,
        MatDialogModule,
        MatButtonModule,
        MatIconModule
    ],
    templateUrl: './confirmacion-reemplazar-carrito-dialog.component.html',
    styleUrls: ['./confirmacion-reemplazar-carrito-dialog.component.css']
})
export class ConfirmacionReemplazarCarritoDialog {

  constructor(
    // MatDialogRef nos permite controlar el diálogo (ej. cerrarlo).
    public dialogRef: MatDialogRef<ConfirmacionReemplazarCarritoDialog>,
    // @Inject(MAT_DIALOG_DATA) nos permite recibir datos desde el componente que abrió el diálogo.
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  /**
   * Se ejecuta cuando el usuario hace clic en el botón de cancelar.
   * Cierra el diálogo y no devuelve ningún valor (o `false` implícitamente).
   */
  onCancel(): void {
    this.dialogRef.close(false);
  }

  /**
   * Se ejecuta cuando el usuario confirma la acción.
   * Cierra el diálogo y devuelve `true` para que el componente padre
   * sepa que debe proceder con el reemplazo.
   */
  onConfirm(): void {
    this.dialogRef.close(true);
  }
}