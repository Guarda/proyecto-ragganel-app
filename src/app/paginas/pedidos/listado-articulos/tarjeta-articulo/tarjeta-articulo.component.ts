import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Articulo } from '../../../interfaces/articulo-pedido';
import { MatIcon } from '@angular/material/icon';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatButton, MatIconButton } from '@angular/material/button';

@Component({
  selector: 'app-tarjeta-articulo',
  standalone: true,
  imports: [MatIcon, CurrencyPipe, CommonModule, MatButton, MatIconButton],
  templateUrl: './tarjeta-articulo.component.html',
  styleUrls: ['./tarjeta-articulo.component.css']
})
export class TarjetaArticuloComponent {
  @Input() articulo!: Articulo; // Recibir un artículo como entrada
  @Output() borrar = new EventEmitter<void>(); // Emitir un evento para borrar el artículo
  @Output() actualizarCantidad = new EventEmitter<number>(); // Emitir la nueva cantidad

  onEliminar() {
    this.borrar.emit();
  }

  increaseQuantity() {
    this.articulo.Cantidad++;
    this.actualizarCantidad.emit(this.articulo.Cantidad); // Emitir el nuevo valor de la cantidad
  }

  decreaseQuantity() {
    if (this.articulo.Cantidad > 1) {
      this.articulo.Cantidad--;
      this.actualizarCantidad.emit(this.articulo.Cantidad); // Emitir el nuevo valor de la cantidad
    }
  }
}
