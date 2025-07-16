import { Component } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms'; // Importante para [(ngModel)]

@Component({
  selector: 'app-dialog-descargar-pdf-venta',
  standalone: true,
  // Asegúrate de que los módulos necesarios estén aquí
  imports: [
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatRadioModule
  ],
  templateUrl: './dialog-descargar-pdf-venta.component.html',
  styleUrl: './dialog-descargar-pdf-venta.component.css'
})
export class DialogDescargarPdfVentaComponent {

  // Por defecto, el formato completo estará seleccionado
  public formatoSeleccionado: 'completo' | 'voucher' = 'completo';

  constructor(
    public dialogRef: MatDialogRef<DialogDescargarPdfVentaComponent>
  ) {}

  // Función para el botón "Cancelar"
  cancelar(): void {
    this.dialogRef.close(); // Simplemente cierra el diálogo
  }

  // Función para el botón "Descargar"
  confirmar(): void {
    // Cierra el diálogo y envía el resultado (el formato elegido)
    this.dialogRef.close({ 
      confirmado: true, 
      formato: this.formatoSeleccionado 
    });
  }
}