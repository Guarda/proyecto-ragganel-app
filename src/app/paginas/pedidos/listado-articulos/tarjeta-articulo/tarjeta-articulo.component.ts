import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Articulo } from '../../../interfaces/articulo-pedido';
import { MatIcon } from '@angular/material/icon';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatButton, MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-tarjeta-articulo',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    MatIcon,
    MatButtonModule,
    MatTooltipModule
  ],
  templateUrl: './tarjeta-articulo.component.html',
  styleUrls: ['./tarjeta-articulo.component.css']
})
export class TarjetaArticuloComponent {
  @Input() articulo!: Articulo;
  @Output() borrar = new EventEmitter<void>();
  @Output() actualizarCantidad = new EventEmitter<number>();
  @Output() editar = new EventEmitter<void>(); // <-- NUEVO EVENTO

  onEliminar() {
    this.borrar.emit();
  }

  onEditar() {
    this.editar.emit(); // <-- EMITIR EL EVENTO DE EDICIÓN
  }

  increaseQuantity() {
    this.articulo.Cantidad++;
    this.actualizarCantidad.emit(this.articulo.Cantidad);
  }

  decreaseQuantity() {
    if (this.articulo.Cantidad > 1) {
      this.articulo.Cantidad--;
      this.actualizarCantidad.emit(this.articulo.Cantidad);
    }
  }
}