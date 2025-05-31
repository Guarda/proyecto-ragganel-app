import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticuloVenta } from '../../interfaces/articuloventa';
import { ListadoArticulosDialogComponent } from '../listado-articulos-dialog/listado-articulos-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-tarjeta-de-articulos',
  standalone: true,
  imports: [CommonModule, ListadoArticulosDialogComponent],
  templateUrl: './tarjeta-de-articulos.component.html',
  styleUrl: './tarjeta-de-articulos.component.css'
})
export class TarjetaDeArticulosComponent {
  @Input() articulos: ArticuloVenta[] = [];
  @Input() imagenUrl!: string;
  @Output() articuloParaAgregarAlCarrito = new EventEmitter<ArticuloVenta>(); // Nuevo Output
  constructor(private dialog: MatDialog) { }

  getNombreEstado(estado: number): string {
    const estados: { [key: number]: string } = {
      1: 'Nuevo',
      2: 'Usado',
      3: 'Para piezas',
      4: 'Personalizado',
      5: 'Reparado',
      6: 'A reparar'
    };
    return estados[estado] || 'Desconocido';
  }

  getTipoClase(tipo: string): string {
    return 'tarjeta ' + tipo.toLowerCase(); // Ej: 'producto', 'insumo'
  }

  abrirDialogo(): void {
    if (this.articulos.length === 0) {
      return;
    }

    const dialogRef = this.dialog.open(ListadoArticulosDialogComponent, {
      maxWidth: '100vw',
      width: '45vw',
      data: {
        nombre: this.articulos[0].NombreArticulo,
        // Pasa una copia para que el diálogo no modifique directamente tus datos si decides no cerrar al seleccionar
        articulos: JSON.parse(JSON.stringify(this.articulos.filter(a => (a.Cantidad ?? 0) > 0)))
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) { // 'result' es el 'articuloSeleccionado' del diálogo
        this.articuloParaAgregarAlCarrito.emit(result);
      }
    });
  }

}



