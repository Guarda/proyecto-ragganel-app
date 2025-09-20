import { Component, Inject, Input, OnInit } from '@angular/core';
import { ProductosService } from '../productos.service';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent } from '@angular/material/dialog';

@Component({
    selector: 'app-historial-producto',
    imports: [CommonModule, MatDialogContent, MatDialogClose],
    templateUrl: './historial-producto.component.html',
    styleUrl: './historial-producto.component.css'
})
export class HistorialProductoComponent implements OnInit{
  @Input() codigoProducto!: string;
  historialProudctos: any[] = [];
  public ProductId: any

  constructor(private productoService: ProductosService,
    @Inject(MAT_DIALOG_DATA) public idProducto: any
  ) {}

  ngOnInit(): void {
    this.ProductId = this.idProducto.value;
    if (this.idProducto) {
      console.log(this.idProducto)
      this.obtenerHistorial();
    }
  }

  obtenerHistorial(): void {
    this.productoService.getProductStateLog(this.idProducto.value).subscribe(
      (data) => {
        this.historialProudctos = data;
      },
      (error) => {
        console.error('Error al obtener historial', error);
      }
    );
  }

}
