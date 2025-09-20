import { Component, EventEmitter, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent } from '@angular/material/dialog';
import { PedidoService } from '../../../services/pedido.service';

@Component({
    selector: 'app-eliminar-pedido',
    imports: [MatDialogContent, MatDialogClose, MatDialogActions],
    templateUrl: './eliminar-pedido.component.html',
    styleUrl: './eliminar-pedido.component.css'
})
export class EliminarPedidoComponent {

  public OrderId: any;
  Eliminar = new EventEmitter();
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

  onEliminar() {
    this.pedidoService.eliminar(this.idPedido.value).subscribe((res: any) => {
      this.Eliminar.emit();
      this.router.navigateByUrl('home/listado-pedidos');
    })
  }
}
