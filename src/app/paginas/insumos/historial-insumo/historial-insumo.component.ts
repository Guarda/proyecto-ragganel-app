import { Component, Inject, OnInit } from '@angular/core';
import { InsumosBaseService } from '../../../services/insumos-base.service';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-historial-insumo',
  standalone: true, // ✅ 1. Convertido a componente standalone
  imports: [      // ✅ 2. Módulos de Angular Material importados directamente
    CommonModule,
    MatDialogContent,
    MatDialogClose,
    MatDialogTitle,
    MatIconModule,
    MatButtonModule,
    MatDialogActions
  ],
  templateUrl: './historial-insumo.component.html',
  styleUrls: ['./historial-insumo.component.css'] // ✅ 3. Se usa styleUrls en plural
})
export class HistorialInsumoComponent implements OnInit {
  
  historial: any[] = []; // ✅ 4. Se renombra la variable para que coincida con el HTML

  constructor(
    private insumoService: InsumosBaseService,
    // ✅ 5. Se define la estructura de 'data' para recibir código y tipo, igual que en accesorios
    @Inject(MAT_DIALOG_DATA) public data: { codigo: string, tipo: string }
  ) {}

  ngOnInit(): void {
    console.log('Código recibido:', this.data.codigo);
    if (this.data && this.data.codigo) {
      
      // ✅ 6. Lógica simplificada, se llama al servicio directamente con el código recibido
      this.insumoService.getInsumosStateLog(this.data.codigo).subscribe({
        next: (data) => {
          this.historial = data;
        },
        error: (error) => {
          console.error('Error al obtener historial del insumo', error);
        }
      });
    }
  }
}
