import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

// Interfaz para definir la estructura de los datos que recibirá el diálogo
export interface DialogData {
  title: string;
  message: string;
}

@Component({
    selector: 'app-dialogo-confirmacion',
    imports: [
        CommonModule,
        MatDialogModule, // Necesario para las directivas mat-dialog-*
        MatButtonModule
    ],
    templateUrl: './dialogo-confirmacion.component.html',
    styleUrls: ['./dialogo-confirmacion.component.css']
})
export class DialogoConfirmacionComponent {
  // Inyectamos los datos pasados al diálogo usando el token MAT_DIALOG_DATA
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}
}