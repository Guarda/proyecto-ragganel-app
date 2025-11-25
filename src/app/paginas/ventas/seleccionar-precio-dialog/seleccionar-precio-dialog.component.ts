// src/app/paginas/ventas/seleccionar-precio-dialog/seleccionar-precio-dialog.component.ts

import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
// 1. IMPORTAR TU PIPE
import { CurrencyConverterPipe } from '../../pipes/currency-converter.pipe';
import { ArticuloVenta } from '../../interfaces/articuloventa';
import { MargenesVentas } from '../../interfaces/margenes-ventas';
import { PrecioOpcion } from '../../interfaces/precioopcion';

@Component({
  selector: 'app-seleccionar-precio-dialog',
  standalone: true,
  // 2. AGREGAR EL PIPE A LOS IMPORTS
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatListModule, MatIconModule, CurrencyConverterPipe],
  templateUrl: './seleccionar-precio-dialog.component.html',
  styleUrls: ['./seleccionar-precio-dialog.component.css']
})
export class SeleccionarPrecioDialogComponent implements OnInit {
  opcionesDePrecio: PrecioOpcion[] = [];

  constructor(
    public dialogRef: MatDialogRef<SeleccionarPrecioDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { 
      articulo: ArticuloVenta, 
      margenes: MargenesVentas[],
      // 3. RECIBIR DATOS DE MONEDA
      currency: 'USD' | 'NIO',
      exchangeRate: number
    }
  ) {}

  ngOnInit(): void {
    const precioBaseCosto = this.data.articulo.PrecioBase ?? 0; // Siempre USD

    this.opcionesDePrecio = this.data.margenes.map(margen => {
      // Calculamos el precio final en Dólares
      let precioFinalUSD = 0; 
      if (margen.Porcentaje !== -1) { // Si no es personalizado
        precioFinalUSD = precioBaseCosto * (1 + (margen.Porcentaje / 100));
      }

      return {
        idMargen: margen.IdMargenPK,
        nombreMargen: margen.NombreMargen,
        precioFinal: precioFinalUSD, // Guardamos USD
        porcentaje: margen.Porcentaje
      };
    });
  }

  seleccionar(opcion: PrecioOpcion): void {
    this.dialogRef.close(opcion);
  }
}