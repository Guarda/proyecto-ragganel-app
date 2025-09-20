import { Component, Inject } from '@angular/core';
import { ArticuloVenta } from '../../interfaces/articuloventa';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { CarritoService } from '../../../services/carrito.service';

@Component({
    selector: 'app-listado-articulos-dialog',
    imports: [MatDialogContent, MatDialogModule, MatDialogActions, CommonModule, MatIcon, MatTooltipModule, MatButtonModule, MatDialogClose],
    templateUrl: './listado-articulos-dialog.component.html',
    styleUrl: './listado-articulos-dialog.component.css'
})
export class ListadoArticulosDialogComponent {

  hoveredIndex: number = -1;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { nombre: string; articulos: ArticuloVenta[] },
    public carritoService: CarritoService,
    public dialogRef: MatDialogRef<ListadoArticulosDialogComponent>
  ) { }

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

  seleccionarArticuloParaCarrito(index: number): void { // Cambia el nombre para claridad
    const articuloSeleccionado = this.data.articulos[index];
    // No modifiques 'articuloSeleccionado.Cantidad' aquí directamente ni llames a carritoService
    // Simplemente cierra el diálogo y pasa el artículo que el usuario eligió.
    this.dialogRef.close(articuloSeleccionado);
  }

}
