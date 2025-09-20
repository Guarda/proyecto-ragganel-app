import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { PedidoService } from '../../../services/pedido.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { IngresarInventarioComponent } from '../ingresar-inventario/ingresar-inventario.component';

@Component({
    selector: 'app-avanzar-pedido',
    imports: [MatDialogClose, MatDialogActions, MatDialogModule, MatDialogContent],
    templateUrl: './avanzar-pedido.component.html',
    styleUrl: './avanzar-pedido.component.css'
})
export class AvanzarPedidoComponent implements OnInit {
  public OrderId: any;
  Avanzar = new EventEmitter();

  constructor(
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<AvanzarPedidoComponent>,
    public pedidoService: PedidoService,
    @Inject(MAT_DIALOG_DATA) public data: { value: string, codigoEstado: number }
  ) {}

  ngOnInit(): void {
    this.OrderId = this.data.value;
    console.log(`ID Pedido: ${this.data.value}, Estado: ${this.data.codigoEstado}`);
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
    this.pedidoService.avanzar(this.data.value).subscribe(() => {
      this.Avanzar.emit();
      this.dialogRef.close(); // Cierra el diálogo después de avanzar
    });
  }
}
