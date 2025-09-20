import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotasCreditoService } from '../../../services/notas-credito.service'; // Asegúrate que la ruta sea correcta

// Módulos de Angular Material para la vista
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EncabezadoNotaCredito } from '../../interfaces/encabezadonotacredito';
import { DetalleNotaCredito } from '../../interfaces/detallenotacredito';
import { BorrarNotaCreditoComponent } from '../borrar-nota-credito/borrar-nota-credito.component';
import { MatDialog } from '@angular/material/dialog';


import jsPDF from 'jspdf';
import 'jspdf-autotable'; // <-- CAMBIO IMPORTANTE AQUÍ

// Extiende la definición de tipo para que TypeScript reconozca autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (...args: any[]) => jsPDF;
  }
}

@Component({
    selector: 'app-ver-nota-credito',
    imports: [
        CommonModule,
        RouterModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatListModule,
        MatDividerModule,
        MatProgressSpinnerModule,
        MatTooltipModule
    ],
    templateUrl: './ver-nota-credito.component.html',
    styleUrls: ['./ver-nota-credito.component.css'] // No olvides crear este archivo
})
export class VerNotaCreditoComponent implements OnInit {

  // Propiedades para almacenar los datos
  encabezado: EncabezadoNotaCredito | null = null;
  detalles: DetalleNotaCredito[] = [];

  // Banderas para controlar el estado de la UI
  isLoading = true;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private notasCreditoService: NotasCreditoService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    // Obtenemos el ID de la nota de crédito desde los parámetros de la URL
    const idNotaCredito = this.route.snapshot.paramMap.get('id');

    if (idNotaCredito) {
      this.cargarDatosNotaCredito(+idNotaCredito);
    } else {
      this.isLoading = false;
      this.errorMessage = 'No se encontró un ID de nota de crédito en la URL.';
      this.router.navigate(['/home/notas-credito']); // Redirige a la lista
    }
  }

  /**
   * Llama al servicio para obtener los datos completos de la nota de crédito.
   * @param id El ID de la nota de crédito a consultar.
   */
  cargarDatosNotaCredito(id: number): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.notasCreditoService.getNotaCreditoById(id).subscribe({
      next: (response) => {
        this.encabezado = response.encabezado;
        this.detalles = response.detalles;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar datos de la nota de crédito:', err);
        this.isLoading = false;
        this.errorMessage = err.error?.mensaje || 'Ocurrió un error al buscar los datos. Por favor, intente de nuevo.';
      }
    });
  }

  /**
   * Placeholder para la funcionalidad de descarga de PDF.
   */
  descargarPDF(): void {
    if (!this.encabezado) {
      this.snackBar.open('No hay datos para generar el PDF.', 'Cerrar', { duration: 3000 });
      return;
    }

    const doc = new jsPDF();
    const margin = 15;
    const pageHeight = doc.internal.pageSize.height;
    let finalY = 0;

    // 1. Título del Documento
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(`Nota de Crédito #${this.encabezado.IdNotaCreditoPK}`, margin, 22);

    // 2. Información de la Empresa (puedes ajustar estos datos)
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('SIAGTEC - Taller de Reparaciones', doc.internal.pageSize.width - margin, 22, { align: 'right' });
    doc.text('Managua, Nicaragua', doc.internal.pageSize.width - margin, 28, { align: 'right' });

    // 3. Información del Cliente y de la Nota
    doc.setLineWidth(0.5);
    doc.line(margin, 35, doc.internal.pageSize.width - margin, 35);
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Cliente:', margin, 42);
    doc.setFont('helvetica', 'normal');
    doc.text(this.encabezado.NombreCliente, margin + 30, 42);

    doc.setFont('helvetica', 'bold');
    doc.text('Identificación:', margin, 48);
    doc.setFont('helvetica', 'normal');
    doc.text(this.encabezado.RUC || this.encabezado.DNI || 'N/A', margin + 30, 48);
    
    doc.setFont('helvetica', 'bold');
    doc.text('Fecha Emisión:', doc.internal.pageSize.width / 2, 42);
    doc.setFont('helvetica', 'normal');
    doc.text(new Date(this.encabezado.FechaEmision).toLocaleDateString('es-NI'), doc.internal.pageSize.width / 2 + 30, 42);
    
    doc.setFont('helvetica', 'bold');
    doc.text('Factura Original:', doc.internal.pageSize.width / 2, 48);
    doc.setFont('helvetica', 'normal');
    doc.text(this.encabezado.VentaOriginal, doc.internal.pageSize.width / 2 + 30, 48);

    // 4. Tabla de Artículos Devueltos
    const head = [['Cant.', 'Código', 'Tipo de Artículo', 'Precio Unit.', 'Subtotal']];
    const body = this.detalles.map(d => [
      d.Cantidad,
      d.CodigoArticulo,
      d.TipoArticulo,
      `$${d.PrecioUnitario.toFixed(2)}`,
      `$${d.Subtotal.toFixed(2)}`
    ]);

    doc.autoTable({
      head: head,
      body: body,
      startY: 60,
      headStyles: { fillColor: [63, 81, 181] }, // Azul Material
      styles: { fontSize: 9 },
      margin: { left: margin, right: margin }
    });

    // 5. Sección de Totales
    finalY = (doc as any).lastAutoTable.finalY; // Obtenemos la posición final de la tabla
    const total = this.encabezado.TotalCredito;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL CRÉDITO:', doc.internal.pageSize.width - margin - 50, finalY + 15, { align: 'left' });
    doc.text(`$${total.toFixed(2)}`, doc.internal.pageSize.width - margin, finalY + 15, { align: 'right' });

    // 6. Pie de Página
    finalY = pageHeight - 20;
    doc.setLineWidth(0.5);
    doc.line(margin, finalY, doc.internal.pageSize.width - margin, finalY);
    doc.setFontSize(8);
    doc.text('Gracias por su preferencia.', doc.internal.pageSize.width / 2, finalY + 8, { align: 'center' });
    
    // 7. Guardar el archivo
    doc.save(`Nota_Credito_${this.encabezado.IdNotaCreditoPK}.pdf`);
  }


  /**
   * Placeholder para la funcionalidad de anular la nota de crédito.
   */
  anularNotaCredito(): void {
        const dialogRef = this.dialog.open(BorrarNotaCreditoComponent, {
            width: '500px',
            data: { idNota: this.encabezado?.IdNotaCreditoPK }
        });

        dialogRef.afterClosed().subscribe(result => {
            // Si el diálogo devolvió 'true', significa que la anulación fue exitosa
            if (result === true) {
                // Recargamos los datos para ver el estado actualizado
                this.cargarDatosNotaCredito(this.encabezado!.IdNotaCreditoPK);
            }
        });
    }
}