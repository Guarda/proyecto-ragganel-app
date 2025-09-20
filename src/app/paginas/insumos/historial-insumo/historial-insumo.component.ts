import { Component, Inject, Input, OnInit } from '@angular/core';
import { InsumosBaseService } from '../../../services/insumos-base.service';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent } from '@angular/material/dialog';

@Component({
    selector: 'app-historial-insumo',
    imports: [CommonModule, MatDialogContent, MatDialogClose],
    templateUrl: './historial-insumo.component.html',
    styleUrl: './historial-insumo.component.css'
})
export class HistorialInsumoComponent implements OnInit{
  @Input() codigoInsumo!: string;
  historialInsumos: any[] = [];
  public SupplyId: any

  constructor(private insumoService: InsumosBaseService,
    @Inject(MAT_DIALOG_DATA) public idInsumo: any
  ) {}

  ngOnInit(): void {
    this.SupplyId = this.idInsumo.value;
    if (this.idInsumo) {
      console.log(this.idInsumo)
      this.obtenerHistorial();
    }
  }

  obtenerHistorial(): void {
    this.insumoService.getInsumosStateLog(this.idInsumo.value).subscribe(
      (data) => {
        this.historialInsumos = data;
      },
      (error) => {
        console.error('Error al obtener historial', error);
      }
    );
  }
}
