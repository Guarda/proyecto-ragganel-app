import { Component, Inject, OnInit } from '@angular/core';
import { AccesorioBaseService } from '../../../services/accesorio-base.service';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-historial-accesorio',
    standalone: true, // Se define como standalone
    imports: [
      CommonModule,
      MatDialogContent,
      MatDialogClose,
      MatDialogTitle,
      MatIconModule,
      MatButtonModule,
      MatDialogActions
    ],
    templateUrl: './historial-accesorio.component.html',
    styleUrl: './historial-accesorio.component.css'
})
export class HistorialAccesorioComponent implements OnInit{
   
    // ✅ CORRECCIÓN: Se renombra la variable para que coincida con el HTML
    historial: any[] = [];
  
    constructor(private accesorioService: AccesorioBaseService,
      // ✅ CORRECCIÓN: Se define la estructura de 'data' para recibir el código y el tipo
      @Inject(MAT_DIALOG_DATA) public data: { codigo: string, tipo: string }
    ) {}
  
    ngOnInit(): void {
      // ✅ CORRECCIÓN: Se llama al servicio usando 'this.data.codigo'
      this.accesorioService.getAccesoriosStateLog(this.data.codigo).subscribe({
        next: (data) => {
          this.historial = data;
        },
        error: (error) => {
          console.error('Error al obtener historial del accesorio', error);
        }
      });
    }
  
}
