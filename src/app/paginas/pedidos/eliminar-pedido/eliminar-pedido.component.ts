import { Component, EventEmitter, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { PedidoService } from '../../../services/pedido.service';
import { AuthService } from '../../../UI/session/auth.service';
import { Usuarios } from '../../interfaces/usuarios';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-eliminar-pedido',
    imports: [MatDialogContent, MatDialogClose, MatDialogActions],
    templateUrl: './eliminar-pedido.component.html',
    styleUrl: './eliminar-pedido.component.css'
})
export class EliminarPedidoComponent implements OnInit, OnDestroy {

  public OrderId: any;
  Eliminar = new EventEmitter();
  pedidoForm!: FormGroup;
  usuario!: Usuarios;
  private subs = new Subscription();

  constructor(
    private router: Router,
    public pedidoService: PedidoService,
    private fb: FormBuilder,
    private authService: AuthService,
    private dialogRef: MatDialogRef<EliminarPedidoComponent>,
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

  onEliminar() {
    if (!this.usuario) {
      console.error('Error: El usuario no ha sido cargado todavía.');
      return;
    }
    this.pedidoService.eliminar(this.idPedido.value, this.usuario.id).subscribe((res: any) => {
      this.Eliminar.emit();
      this.dialogRef.close(true); // Cierra el diálogo y emite un resultado positivo
    })
  }
}
