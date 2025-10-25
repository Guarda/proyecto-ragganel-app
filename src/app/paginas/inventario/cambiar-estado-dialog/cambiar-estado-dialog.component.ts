import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Estado } from '../../interfaces/estado';
import { CambiarEstadoData } from '../../interfaces/cambiarestadodata';

@Component({
    selector: 'app-cambiar-estado-dialog',
    imports: [CommonModule, FormsModule, MatDialogModule, MatFormFieldModule, MatSelectModule, MatButtonModule],
    templateUrl: './cambiar-estado-dialog.component.html',
    styleUrls: ['./cambiar-estado-dialog.component.css']
})
export class CambiarEstadoDialogComponent implements OnInit {

  public estadosPermitidos: Estado[] = [
    { id: 1, descripcion: 'Nuevo' },
    { id: 2, descripcion: 'Usado' },
    { id: 3, descripcion: 'Para piezas' },
    { id: 4, descripcion: 'Personalizado' },
    { id: 5, descripcion: 'Reparado' },
    { id: 6, descripcion: 'A reparar' }
  ];
  public estadoSeleccionadoId: number | null = null;

  constructor(
    public dialogRef: MatDialogRef<CambiarEstadoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CambiarEstadoData,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.estadosPermitidos = this.estadosPermitidos.filter(estado => estado.id !== this.data.estadoActualId);
  }

  onConfirmar(): void {
    if (this.estadoSeleccionadoId) {
      this.dialogRef.close(this.estadoSeleccionadoId);
    } else {
      this.snackBar.open('Debes seleccionar un nuevo estado.', 'Cerrar', { duration: 3000 });
    }
  }

  onCancelar(): void {
    this.dialogRef.close();
  }
}