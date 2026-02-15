import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-selector-tipo-articulo',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <h2 mat-dialog-title>Seleccionar tipo de artículo</h2>
    <mat-dialog-content>
      <div style="display: flex; flex-direction: column; gap: 12px; padding: 10px 0;">
        <button mat-flat-button color="primary" (click)="seleccionar('producto')">
          <mat-icon>sports_esports</mat-icon> Producto / Consola
        </button>
        <button mat-flat-button color="accent" (click)="seleccionar('accesorio')">
          <mat-icon>headphones</mat-icon> Accesorio
        </button>
        <button mat-flat-button style="background-color: #ff9800; color: white;" (click)="seleccionar('insumo')">
          <mat-icon>inventory_2</mat-icon> Insumo
        </button>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
    </mat-dialog-actions>
  `
})
export class SelectorTipoArticuloComponent {
  constructor(private dialogRef: MatDialogRef<SelectorTipoArticuloComponent>) {}

  seleccionar(tipo: string) {
    this.dialogRef.close(tipo);
  }
}
