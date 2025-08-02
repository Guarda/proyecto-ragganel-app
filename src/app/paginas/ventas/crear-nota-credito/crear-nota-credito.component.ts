import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { VentaCompleta } from '../../interfaces/ventacompleta';
import { DetalleVentaCompleta } from '../../interfaces/detalleventacompleta';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { VentasBaseService } from '../../../services/ventas-base.service'; // Importamos el servicio
import { MotivoNotaCredito } from '../../interfaces/motivonotacredito';
import { ItemDevolucion } from '../../interfaces/itemdevolucion';

@Component({
  selector: 'app-crear-nota-credito',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatDialogModule, MatButtonModule, MatFormFieldModule,
    MatSelectModule, MatInputModule, MatTableModule, MatIconModule, MatDividerModule,
    MatCheckboxModule, MatTooltipModule
  ],
  templateUrl: './crear-nota-credito.component.html',
  styleUrls: ['./crear-nota-credito.component.css']
})
export class CrearNotaCreditoComponent implements OnInit {

  motivos: MotivoNotaCredito[] = [];
  motivoSeleccionado: number | null = null;
  observaciones: string = ''; // Campo para el motivo detallado
  // ... (otras propiedades sin cambios)
  subtotalDevoluciones: number = 0;
  descuentoGeneralPorcentaje: number = 0;
  totalCredito: number = 0;
  itemsADevolver: ItemDevolucion[] = [];
  displayedColumns: string[] = ['nombreArticulo', 'cantidadOriginal', 'cantidadADevolver', 'subtotalDevolucion', 'reingresarAInventario'];
  anularFactura: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<CrearNotaCreditoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { venta: VentaCompleta, detalles: DetalleVentaCompleta[] },
    private ventasService: VentasBaseService // Inyectamos el servicio
  ) {}

  ngOnInit(): void {
    this.itemsADevolver = this.data.detalles.map(item => ({
      ...item,
      cantidadADevolver: 0,
      subtotalDevolucion: 0,
      reingresarAInventario: true
    }));
    // Llamamos al método para cargar los motivos
    this.cargarMotivos();
  }
  
  /**
   * Carga los motivos para el dropdown desde el servicio.
   */
  cargarMotivos(): void {
    this.ventasService.listarMotivosNotaCredito().subscribe(data => {
      this.motivos = data;
    });
  }

  // ... (resto de los métodos onCantidadChange, onSubtotalChange, recalcularTotalCredito, etc. sin cambios)
  onCantidadChange(item: ItemDevolucion): void {
    if (item.cantidadADevolver > item.Cantidad) { item.cantidadADevolver = item.Cantidad; }
    if (item.cantidadADevolver < 0 || !item.cantidadADevolver) { item.cantidadADevolver = 0; }
    const precioUnitario = item.SubtotalLinea / item.Cantidad;
    item.subtotalDevolucion = precioUnitario * item.cantidadADevolver;
    this.recalcularTotalCredito();
  }

  onSubtotalChange(item: ItemDevolucion): void {
    if (item.subtotalDevolucion < 0 || !item.subtotalDevolucion) { item.subtotalDevolucion = 0; }
    this.recalcularTotalCredito();
  }

   onMotivoChange(): void {
    if (this.esMotivoCancelacionCompleta()) {
      // Si el motivo es "Cancelación de factura completa", marca y bloquea el checkbox.
      this.anularFactura = true;
    } else {
      // Para cualquier otro motivo, deja que el usuario decida (no cambiamos el valor).
    }
  }

  esMotivoCancelacionCompleta(): boolean {
    const motivo = this.motivos.find(m => m.IdMotivoPK === this.motivoSeleccionado);
    return motivo?.Descripcion === 'Cancelación de factura completa';
  }


  recalcularTotalCredito(): void {
    this.subtotalDevoluciones = this.itemsADevolver.reduce((acc, item) => acc + item.subtotalDevolucion, 0);
    const montoDescuento = this.subtotalDevoluciones * (this.descuentoGeneralPorcentaje / 100);
    this.totalCredito = this.subtotalDevoluciones - montoDescuento;
  }

  onConfirmar(): void {
    if (!this.motivoSeleccionado) {
      alert('Por favor, seleccione un motivo para la nota de crédito.');
      return;
    }
    const itemsDevueltos = this.itemsADevolver.filter(item => item.cantidadADevolver > 0 || item.subtotalDevolucion > 0);
    if (itemsDevueltos.length === 0) {
      alert('Debe especificar una cantidad o monto a devolver para al menos un artículo.');
      return;
    }
    const resultado = {
      IdMotivoFK: this.motivoSeleccionado,
      Observaciones: this.observaciones, // Este es el campo 'Motivo' de la tabla
      TotalCredito: this.totalCredito,
      anularFactura: this.anularFactura,
      Detalles: itemsDevueltos.map(item => ({
        TipoArticulo: item.TipoArticulo,
        CodigoArticulo: item.CodigoArticulo,
        Cantidad: item.cantidadADevolver,
        PrecioUnitario: item.SubtotalLinea / item.Cantidad,
        Subtotal: item.subtotalDevolucion,
        ReingresarAInventario: item.reingresarAInventario
      }))
    };
    this.dialogRef.close(resultado);
  }

  onCancelar(): void {
    this.dialogRef.close();
  }
}