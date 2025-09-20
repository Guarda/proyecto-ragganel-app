import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { DialogMargenData } from '../../interfaces/dialogmargendata';
import { PrecioOpcion } from '../../interfaces/precioopcion';


// Define una interfaz para las opciones de precio que se mostrarán


@Component({
    selector: 'app-seleccionar-precio-dialog',
    imports: [CommonModule, MatListModule, MatButtonModule, MatIconModule, MatDividerModule, MatDialogContent, MatDialogActions, MatDialogClose],
    templateUrl: './seleccionar-precio-dialog.component.html',
    styleUrls: ['./seleccionar-precio-dialog.component.css']
})
export class SeleccionarPrecioDialogComponent implements OnInit {
  opcionesDePrecio: PrecioOpcion[] = [];

  constructor(
    public dialogRef: MatDialogRef<SeleccionarPrecioDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogMargenData
  ) { }

  ngOnInit(): void {
    const precioCosto = this.data.articulo.PrecioBase;

    this.opcionesDePrecio = this.data.margenes.map(margen => {
      let precioFinalCalculado = 0; // Inicializamos

      // Si el margen NO es el personalizado, calculamos el precio.
      if (margen.IdMargenPK !== 6) { // Usamos el ID para identificarlo
        precioFinalCalculado = precioCosto * (1 + margen.Porcentaje / 100);
      }

      return {
        idMargen: margen.IdMargenPK,
        nombreMargen: margen.NombreMargen,
        porcentaje: margen.Porcentaje,
        // Si es personalizado, precioFinal será 0, pero lo manejaremos en la lógica principal.
        precioFinal: precioFinalCalculado
      };
    });
  }

  seleccionarPrecio(opcion: PrecioOpcion): void {
    // Cierra el diálogo y devuelve la opción de precio seleccionada
    this.dialogRef.close(opcion);
  }

  cancelar(): void {
    this.dialogRef.close();
  }
}