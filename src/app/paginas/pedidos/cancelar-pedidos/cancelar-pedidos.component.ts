import { Component, EventEmitter, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { PedidoService } from '../../../services/pedido.service';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../../../UI/session/auth.service';
import { Usuarios } from '../../interfaces/usuarios';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-cancelar-pedidos',
    imports: [MatDialogContent, MatDialogActions, MatDialogClose],
    templateUrl: './cancelar-pedidos.component.html',
    styleUrl: './cancelar-pedidos.component.css'
})
export class CancelarPedidosComponent implements OnInit, OnDestroy {

  public OrderId: any;
  Cancelar = new EventEmitter();
  pedidoForm!: FormGroup;
  usuario!: Usuarios;
  private subs = new Subscription();


  constructor(
    private router: Router,
    public pedidoService: PedidoService,
    private fb: FormBuilder,
    private authService: AuthService,
    private dialogRef: MatDialogRef<CancelarPedidosComponent>,
    @Inject(MAT_DIALOG_DATA) public idPedido: any
  ) {

  }

  ngOnInit(): void {
    this.OrderId = this.idPedido.value;
    this.subs.add(this.authService.getUser().subscribe(user => this.usuario = user as unknown as Usuarios));
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  onCancelar() {
    if (!this.usuario) {
      console.error('Error: El usuario no ha sido cargado todavía.');
      return;
    }
    // Se pasa el ID del pedido y el ID del usuario, como lo requiere el servicio.
    this.pedidoService.cancelar(this.idPedido.value, this.usuario.id).subscribe((res: any) => {
      this.Cancelar.emit();
      this.dialogRef.close(true); // Cierra el diálogo y emite un resultado positivo
    })
  }

}
