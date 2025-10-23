import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HistorialData } from '../../interfaces/historialdata';

@Component({
    selector: 'app-historial-articulo-dialog',
    imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
    templateUrl: './historial-articulo-dialog.component.html',
    styleUrls: ['./historial-articulo-dialog.component.css']
})
export class HistorialArticuloDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: HistorialData) {}
}