import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { AgregarInsumosComponent } from '../agregar-insumos/agregar-insumos.component';
import { IngresarStockInsumosComponent } from '../ingresar-stock-insumos/ingresar-stock-insumos.component';

@Component({
    selector: 'app-ingresar-agregar-insumo-dialog',
    imports: [MatDialogClose, MatDialogActions, MatDialogModule, MatDialogContent],
    templateUrl: './ingresar-agregar-insumo-dialog.component.html',
    styleUrls: ['./ingresar-agregar-insumo-dialog.component.css']
})
export class IngresarAgregarInsumoDialogComponent {
  @Output() Agregado = new EventEmitter<void>();

  constructor(
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<IngresarAgregarInsumoDialogComponent>
  ) {}

  onIngresarExistente(): void {
    this.dialogRef.close();
    this.dialog.open(IngresarStockInsumosComponent, {
      width: '600px'
    });
  }

 onIngresarNuevo(): void {
    this.dialogRef.close();
    const dialogRefNuevo = this.dialog.open(AgregarInsumosComponent, {
      width: '1000px'
    });

    dialogRefNuevo.componentInstance.Agregado.subscribe(() => {
      this.Agregado.emit(); // Propaga el evento hacia arriba
    });
  }

}
