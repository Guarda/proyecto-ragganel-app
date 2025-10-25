import { Component, EventEmitter, Inject, OnDestroy, OnInit } from '@angular/core';
import { PedidoService } from '../../../services/pedido.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { IngresarInventarioComponent } from '../ingresar-inventario/ingresar-inventario.component';
import { AuthService } from '../../../UI/session/auth.service';
import { Usuarios } from '../../interfaces/usuarios';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-avanzar-pedido',
    imports: [MatDialogClose, MatDialogActions, MatDialogModule, MatDialogContent],
    templateUrl: './avanzar-pedido.component.html',
    styleUrl: './avanzar-pedido.component.css'
})
export class AvanzarPedidoComponent implements OnInit, OnDestroy {
  public OrderId: any;
  Avanzar = new EventEmitter();
  usuario!: Usuarios;
  private subs = new Subscription();

  constructor(
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<AvanzarPedidoComponent>,
    public pedidoService: PedidoService,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: { value: string, codigoEstado: number }
  ) {}

  ngOnInit(): void {
    this.OrderId = this.data.value;
    console.log(`ID Pedido: ${this.data.value}, Estado: ${this.data.codigoEstado}`);
    this.subs.add(this.authService.getUser().subscribe(user => this.usuario = user as unknown as Usuarios));
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  onAvanzar() {
    if (this.data.codigoEstado >= 5) {
      // Si el estado es 5 o mayor, no se puede avanzar más.
      console.log('El pedido ya no puede avanzar más.');
      return;
    }

    if (this.data.codigoEstado === 4) {
      // Si el estado es 4, abrir el diálogo de `IngresarInventarioComponent`
      const dialogRef = this.dialog.open(IngresarInventarioComponent, {
        height: '150%',
        width: '50%',
        disableClose: true,
        data: { idPedido: this.data.value }
      });

      // Cuando se cierre el diálogo, avanzar el pedido a estado 5
      dialogRef.afterClosed().subscribe((result) => {
        if (result) { // Solo avanza si el usuario finalizó correctamente
          this.avanzarPedido();
        } else {
          console.log('Pedido cancelado, no se avanza de estado.');
        }
      });
    } else {
      // Avanzar normalmente en cualquier otro caso (1->2, 2->3, 3->4)
      this.avanzarPedido();
    }
  }


  private avanzarPedido() {
    if (!this.usuario) {
      console.error('Error: El usuario no ha sido cargado todavía.');
      return;
    }
    this.pedidoService.avanzar(this.data.value, this.usuario.id).subscribe(() => {
      this.Avanzar.emit();
      this.dialogRef.close(); // Cierra el diálogo después de avanzar
    });
  }
}
