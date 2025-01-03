import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Articulo } from '../../../interfaces/articulo-pedido';
import { MatIcon } from '@angular/material/icon';
import { CommonModule, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-tarjeta-articulo',
  standalone: true,
  imports: [MatIcon, CurrencyPipe, CommonModule],
  templateUrl: './tarjeta-articulo.component.html',
  styleUrl: './tarjeta-articulo.component.css'
})
export class TarjetaArticuloComponent {
  @Input() articulo!: Articulo; // Recibir un artículo como entrada
  @Output() borrar = new EventEmitter<void>(); // Emitir un evento para borrar el artículo

  onEliminar() {
    this.borrar.emit();
  }
}
