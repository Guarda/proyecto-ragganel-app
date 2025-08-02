import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-dialog-ingresar-precio-articulo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './dialog-ingresar-precio-articulo.component.html',
  styleUrls: ['./dialog-ingresar-precio-articulo.component.css']
})
export class DialogIngresarPrecioArticuloComponent {
  precioIngresado: number | null = null;
  precioCosto: number;
  nombreArticulo: string;
  errorMessage: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<DialogIngresarPrecioArticuloComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { costo: number, nombre: string }
  ) {
    this.precioCosto = data.costo;
    this.nombreArticulo = data.nombre;
  }

  confirmar(): void {
    // Validación
    if (this.precioIngresado === null || this.precioIngresado < this.precioCosto) {
      this.errorMessage = `El precio no puede ser menor al costo de $${this.precioCosto.toFixed(2)}`;
      return;
    }
    // Si es válido, cierra el diálogo y devuelve el precio
    this.dialogRef.close(this.precioIngresado);
  }

  cancelar(): void {
    this.dialogRef.close();
  }
}