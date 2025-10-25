import { Component, Inject, OnInit } from '@angular/core';
import { ProductosService } from '../productos.service';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-historial-producto',
    imports: [CommonModule, MatDialogContent, MatDialogClose, MatDialogTitle, MatIconModule, MatButtonModule, MatDialogActions],
    templateUrl: './historial-producto.component.html',
    styleUrl: './historial-producto.component.css'
})
export class HistorialProductoComponent implements OnInit{
  historial: any[] = [];

  constructor(private productoService: ProductosService,
    @Inject(MAT_DIALOG_DATA) public data: { codigo: string, tipo: string }
  ) {}

  ngOnInit(): void {
    this.productoService.getProductStateLog(this.data.codigo).subscribe(
      (data) => {
        console.log(data);
        this.historial = data;
      },
      (error) => {
        console.error('Error al obtener historial', error);
      }
    );
  }

}
