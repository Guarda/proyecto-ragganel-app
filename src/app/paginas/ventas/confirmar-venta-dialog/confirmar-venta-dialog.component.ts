import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogData } from '../../interfaces/dialogdata';
@Component({
  selector: 'app-confirmar-venta-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule],
  templateUrl: './confirmar-venta-dialog.component.html',
  styleUrl: './confirmar-venta-dialog.component.css'
})
export class ConfirmarVentaDialogComponent {

  constructor(
    // Referencia al propio diálogo para poder cerrarlo
    public dialogRef: MatDialogRef<ConfirmarVentaDialogComponent>,
    // Inyecta los datos que le pasamos desde PuntoVentaComponent
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onCancelarClick(): void {
    // Cierra el diálogo sin devolver nada (o 'false')
    this.dialogRef.close(false);
  }

  onConfirmarClick(): void {
    // Cierra el diálogo y devuelve 'true' para indicar la confirmación
    this.dialogRef.close(true);
  }

}
