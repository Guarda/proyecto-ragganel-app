import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatButton, MatIconButton } from '@angular/material/button';

import { InsumosBase } from '../../interfaces/insumosbase';

@Component({
    selector: 'app-tarjeta-insumo',
    imports: [MatIcon, CurrencyPipe, CommonModule, MatButton, MatIconButton],
    templateUrl: './tarjeta-insumo.component.html',
    styleUrl: './tarjeta-insumo.component.css'
})
export class TarjetaInsumoComponent {
  @Input() image!: string;
  @Input() insumo!: InsumosBase; // Recibir un artículo como entrada
  @Output() borrar = new EventEmitter<InsumosBase>(); // Emitir un evento para borrar el artículo
  @Output() actualizarCantidad = new EventEmitter<number>(); // Emitir la nueva cantidad

  onEliminar() {
    console.log('Tarjeta: Emitiendo eliminar insumo:', this.insumo);
    if (this.insumo && this.insumo.CodigoInsumo) {
      this.borrar.emit(this.insumo);
    } else {
      console.warn('Tarjeta: Insumo inválido al intentar eliminar');
    }
  }

  increaseQuantity() {
    this.insumo.Cantidad++;
    this.actualizarCantidad.emit(this.insumo.Cantidad); // Emitir el nuevo valor de la cantidad
  }

  decreaseQuantity() {
    if (this.insumo.Cantidad > 1) {
      this.insumo.Cantidad--;
      this.actualizarCantidad.emit(this.insumo.Cantidad); // Emitir el nuevo valor de la cantidad
    }
  }
} 
