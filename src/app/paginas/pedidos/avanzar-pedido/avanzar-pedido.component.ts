import { Component, EventEmitter, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { PedidoService } from '../../../services/pedido.service';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent } from '@angular/material/dialog';

@Component({
  selector: 'app-avanzar-pedido',
  standalone: true,
  imports: [MatDialogActions, MatDialogClose, MatDialogContent
  ],
  templateUrl: './avanzar-pedido.component.html',
  styleUrl: './avanzar-pedido.component.css'
})
export class AvanzarPedidoComponent {

  public OrderId: any;
    Avanzar = new EventEmitter();
    pedidoForm!: FormGroup;
  
  
    constructor(
      private router: Router,
      public pedidoService: PedidoService,
      private fb: FormBuilder,
      @Inject(MAT_DIALOG_DATA) public idPedido: any
    ) {
  
    }

  ngOnInit(): void {
    this.OrderId = this.idPedido.value;
    // this.pedidoForm = this.fb.group({
    //   CodigoPedido: [this.idPedido.value]
    // });
  }

  onAvanzar() {
    this.pedidoService.avanzar(this.idPedido.value).subscribe((res: any) => {
      this.Avanzar.emit();
      this.router.navigateByUrl('listado-pedidos');
    })
  }

}
