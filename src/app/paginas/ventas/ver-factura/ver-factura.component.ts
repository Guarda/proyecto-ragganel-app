import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { VentasBaseService } from '../../../services/ventas-base.service'; // Ajusta la ruta si es necesario
import { VentaCompleta } from '../../interfaces/ventacompleta';
import { DetalleVentaCompleta } from '../../interfaces/detalleventacompleta';
import { MatSnackBar } from '@angular/material/snack-bar';

// Módulos de Angular Material para la vista
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-ver-factura',
  standalone: true,
  // Asegúrate de importar todos los módulos necesarios
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatDividerModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './ver-factura.component.html',
  styleUrls: ['./ver-factura.component.css']
})
export class VerFacturaComponent implements OnInit {

  // Propiedades para almacenar los datos de la factura
  venta: VentaCompleta | null = null;
  detalles: DetalleVentaCompleta[] = [];

  subtotalBruto = 0;
  totalDescuentos = 0;

  // Banderas para controlar el estado de la carga
  isLoading = true;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ventasService: VentasBaseService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    // Obtenemos el ID de la factura desde los parámetros de la URL
    const idVenta = this.route.snapshot.paramMap.get('CodigoVenta');

    if (idVenta) {
      this.cargarDatosFactura(+idVenta);
    } else {
      this.isLoading = false;
      this.errorMessage = 'No se encontró un ID de factura en la URL.';
      this.router.navigate(['/home/listado-ventas']);
    }
  }

  /**
   * Llama al servicio para obtener los datos completos de la venta.
   * @param id El ID de la venta a consultar.
   */
  cargarDatosFactura(id: number): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.ventasService.getVentaCompleta(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.venta = response.data.venta;
          this.detalles = response.data.detalles;

          // --- INICIO DE LA LÓGICA DE CÁLCULO ---
          // Se calcula el descuento total sumando la diferencia entre el precio original y el subtotal de cada línea.
          this.totalDescuentos = this.detalles.reduce((acc, item) =>
            acc + (item.PrecioUnitario * item.Cantidad - item.SubtotalLinea), 0);

          // El subtotal bruto es el subtotal neto (el que viene de la BD) más los descuentos aplicados.
          this.subtotalBruto = (this.venta?.SubtotalVenta || 0) + this.totalDescuentos;
          // --- FIN DE LA LÓGICA DE CÁLCULO ---

        } else {
          this.errorMessage = 'No se pudieron cargar los datos de la factura.';
        }
        this.isLoading = false;
      },
      error: (err) => {
        // ... (código de error sin cambios)
      }
    });
  }

  /**
   * Placeholder para la funcionalidad de la nota de crédito.
   */
  abrirDialogoNotaCredito(): void {
    // Aquí irá la lógica para abrir un diálogo y crear la nota de crédito.
    console.log('Abriendo diálogo para crear Nota de Crédito para la venta ID:', this.venta?.IdVentaPK);
    this.snackBar.open('Funcionalidad de Nota de Crédito en desarrollo.', 'Cerrar', { duration: 3000 });
  }
}