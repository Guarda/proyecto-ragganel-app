import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
// ⭐️ IMPORTANTE: Importa tu Pipe
import { CurrencyConverterPipe } from '../../pipes/currency-converter.pipe';

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
        MatIconModule,
        CurrencyConverterPipe // ⭐️ Agregar al imports
    ],
    templateUrl: './dialog-ingresar-precio-articulo.component.html',
    styleUrls: ['./dialog-ingresar-precio-articulo.component.css']
})
export class DialogIngresarPrecioArticuloComponent {
  precioIngresadoVisual: number | null = null; // El valor que escribe el usuario
  precioCostoBase: number; // Siempre en USD
  nombreArticulo: string;
  errorMessage: string | null = null;
  
  // Datos de moneda
  currency: 'USD' | 'NIO';
  exchangeRate: number;

  constructor(
    public dialogRef: MatDialogRef<DialogIngresarPrecioArticuloComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { 
        costo: number, 
        nombre: string,
        currency: 'USD' | 'NIO', // ⭐️ Recibimos la moneda
        exchangeRate: number     // ⭐️ Recibimos la tasa
    }
  ) {
    this.precioCostoBase = data.costo;
    this.nombreArticulo = data.nombre;
    // Valores por defecto si no vienen
    this.currency = data.currency || 'USD';
    this.exchangeRate = data.exchangeRate || 1;
  }

  confirmar(): void {
    if (this.precioIngresadoVisual === null) return;

    // 1. Convertir lo que el usuario escribió a Dólares para validar
    let precioFinalUSD: number;

    if (this.currency === 'NIO') {
        // Si escribió en Córdobas, lo dividimos por la tasa
        precioFinalUSD = this.precioIngresadoVisual / this.exchangeRate;
    } else {
        precioFinalUSD = this.precioIngresadoVisual;
    }

    // 2. Validar (Comparando Dólar contra Dólar)
    // Usamos un margen de error pequeño (0.01) para decimales
    if (precioFinalUSD < (this.precioCostoBase - 0.01)) {
      
      // Calcular el costo visual para mostrar en el mensaje de error
      let costoVisual = this.precioCostoBase;
      if (this.currency === 'NIO') {
          costoVisual = this.precioCostoBase * this.exchangeRate;
      }

      const simbolo = this.currency === 'USD' ? '$' : 'C$';
      this.errorMessage = `El precio no puede ser menor al costo de ${simbolo} ${costoVisual.toFixed(2)}`;
      return;
    }

    // 3. Devolver SIEMPRE Dólares al sistema
    this.dialogRef.close(precioFinalUSD);
  }

  cancelar(): void {
    this.dialogRef.close();
  }
}