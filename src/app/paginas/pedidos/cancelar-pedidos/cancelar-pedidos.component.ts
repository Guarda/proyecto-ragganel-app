import { Component, EventEmitter, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { PedidoService } from '../../../services/pedido.service';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent } from '@angular/material/dialog';

@Component({
  selector: 'app-cancelar-pedidos',
  standalone: true,
  imports: [MatDialogContent, MatDialogActions, MatDialogClose],
  templateUrl: './cancelar-pedidos.component.html',
  styleUrl: './cancelar-pedidos.component.css'
})
export class CancelarPedidosComponent {

  public OrderId: any;
  Cancelar = new EventEmitter();
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

  onCancelar() {
    this.pedidoService.cancelar(this.idPedido.value).subscribe((res: any) => {
      this.Cancelar.emit();
      this.router.navigateByUrl('listado-pedidos');
    })
  }

}
