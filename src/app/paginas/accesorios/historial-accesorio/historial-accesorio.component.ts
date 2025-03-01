import { Component, Inject, Input, OnInit } from '@angular/core';
import { AccesorioBaseService } from '../../../services/accesorio-base.service';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent } from '@angular/material/dialog';

@Component({
  selector: 'app-historial-accesorio',
  standalone: true,
  imports: [CommonModule, MatDialogContent, MatDialogClose],
  templateUrl: './historial-accesorio.component.html',
  styleUrl: './historial-accesorio.component.css'
})
export class HistorialAccesorioComponent implements OnInit{
   @Input() codigoAccesorio!: string;
    historialAccesorios: any[] = [];
    public AccesorioId: any
  
    constructor(private accesorioService: AccesorioBaseService,
      @Inject(MAT_DIALOG_DATA) public idAccesorio: any
    ) {}
  
    ngOnInit(): void {
      this.AccesorioId = this.idAccesorio.value;
      if (this.idAccesorio) {
        console.log(this.idAccesorio)
        this.obtenerHistorial();
      }
    }
  
    obtenerHistorial(): void {
      this.accesorioService.getAccesoriosStateLog(this.idAccesorio.value).subscribe(
        (data) => {
          this.historialAccesorios = data;
        },
        (error) => {
          console.error('Error al obtener historial', error);
        }
      );
    }
  
}
