import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-resultado-pedido-dialog',
  standalone: true,
  imports: [MatDialogActions, MatDialogContent],
  templateUrl: './resultado-pedido-dialog.component.html',
  styleUrl: './resultado-pedido-dialog.component.css'
})
export class ResultadoPedidoDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ResultadoPedidoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { success: boolean, message: string },
    private router: Router
  ) {}

  // Cerrar el diálogo y redirigir según el estado de éxito
  onAceptar(): void {
    this.dialogRef.close();
    if (this.data.success) {
      this.router.navigateByUrl('listado-pedidos'); // Cambia la ruta según lo que necesites
    }
  }
}
