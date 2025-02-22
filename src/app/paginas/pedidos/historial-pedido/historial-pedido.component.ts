import { Component, Inject, Input, OnInit } from '@angular/core';
import { PedidoService } from '../../../services/pedido.service';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent } from '@angular/material/dialog';

@Component({
  selector: 'app-historial-pedido',
  standalone: true,
  imports: [CommonModule, MatDialogContent, MatDialogClose
  ],
  templateUrl: './historial-pedido.component.html',
  styleUrl: './historial-pedido.component.css'
})
export class HistorialPedidoComponent implements OnInit {
  @Input() codigoPedido!: string; // Código del pedido que se recibe como input
  historialPedidos: any[] = [];
  public OrderId: any

  constructor(private pedidoService: PedidoService,
    @Inject(MAT_DIALOG_DATA) public idPedido: any
  ) {}

  ngOnInit(): void {
    this.OrderId = this.idPedido.value;
    if (this.idPedido) {
      console.log(this.idPedido)
      this.obtenerHistorial();
    }
  }

  obtenerHistorial(): void {
    this.pedidoService.getOrderStateLog(this.idPedido.value).subscribe(
      (data) => {
        this.historialPedidos = data;
      },
      (error) => {
        console.error('Error al obtener historial', error);
      }
    );
  }
}

