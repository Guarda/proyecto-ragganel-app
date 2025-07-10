import { AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { VentasBaseService } from '../../../services/ventas-base.service';
import { Usuarios } from '../../interfaces/usuarios'; // Ajusta la ruta a tu interfaz
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Ventas } from '../../interfaces/ventas';
import { AuthService } from '../../../UI/session/auth.service';
import { RouterModule } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { DialogDescargarPdfProformaComponent } from '../dialog-descargar-pdf-proforma/dialog-descargar-pdf-proforma.component';
import { MatDialog } from '@angular/material/dialog';

import { MatSnackBar } from '@angular/material/snack-bar';
import jsPDF from 'jspdf';
import { VentaCompleta } from '../../interfaces/ventacompleta';
import { DetalleVentaCompleta } from '../../interfaces/detalleventacompleta';

@Component({
  selector: 'app-listado-ventas',
  templateUrl: './listado-ventas.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatTableModule, MatLabel, MatFormField, MatInputModule,
    MatSortModule, MatPaginatorModule, MatIcon, MatButtonModule,  // --- AGREGA ESTOS DOS ---
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'es-NI' }],
  styleUrls: ['./listado-ventas.component.css']
})
export class ListadoVentasComponent implements OnInit, AfterViewInit {
  ventas: Ventas[] = [];
  myArray: any[] = [];
  displayedColumns: string[] = ['Numero_Venta', 'Fecha_Creacion', 'TipoDocumento', 'NumeroDocumento', 'Subtotal', 'Iva', 'TotalVenta', 'Cliente', 'Usuario', 'Action'];
  //dataSource = ELEMENT_DATA;
  dataSource = new MatTableDataSource<Ventas>;
  usuario!: Usuarios; // o usuario: Usuarios | null = null;

  fechaInicio: string = '';
  fechaFin: string = '';


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  // --- AGREGA ESTA LÍNEA ---
  // Captura la referencia #input del HTML
  @ViewChild('input') inputBusqueda!: ElementRef<HTMLInputElement>;
  @Output() select = new EventEmitter<string>();

  constructor(private ventasService: VentasBaseService,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.cargarVentas();
  }

  cargarVentas(): void {
    this.authService.getUser().subscribe((usuariok: any) => {
      this.usuario = usuariok;
      console.log('Usuario autenticado:', usuariok);
      // Si necesitas convertirlo a tu tipo Usuarios, hazlo aquí manualmente
      // this.usuario = usuario ? [usuario as Usuarios] : [];
    });

    if (this.usuario) {
      this.ventasService.listarVentasPorUsuario(this.usuario).subscribe(
        (data: Ventas[]) => {
          this.ventas = data;
          console.log('Ventas cargadas:', this.ventas);
          this.dataSource.data = this.ventas;
        },
        (error) => {
          console.error('Error al cargar las ventas:', error);
        }
      );
    } else {
      console.error('Usuario no encontrado');
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  aplicarFiltros(): void {
    // --- POR ESTA LÍNEA CORRECTA ---
    const texto = this.inputBusqueda.nativeElement.value;
    // Pasamos un objeto JSON como string para manejar ambos filtros a la vez
    const filterValue = JSON.stringify({ texto: texto });
    this.dataSource.filter = filterValue;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // --- LÓGICA DE FILTRADO COMBINADA Y MEJORADA ---
  setupFilterPredicate(): void {
    this.dataSource.filterPredicate = (data: Ventas, filter: string): boolean => {
      const searchString = JSON.parse(filter);

      // Normalizar las fechas a medianoche para evitar problemas con la hora
      const fechaVenta = new Date(data.FechaCreacion);
      fechaVenta.setHours(0, 0, 0, 0);

      const inicio = this.fechaInicio ? new Date(this.fechaInicio) : null;
      if (inicio) inicio.setHours(0, 0, 0, 0);

      const fin = this.fechaFin ? new Date(this.fechaFin) : null;
      if (fin) fin.setHours(0, 0, 0, 0);

      // Comprobación de fechas
      const fechaValida = (!inicio || fechaVenta >= inicio) && (!fin || fechaVenta <= fin);

      // Comprobación de texto de búsqueda
      const textoBusqueda = searchString.texto.trim().toLowerCase();
      if (!textoBusqueda) {
        return fechaValida;
      }

      const ventaString = `${data.IdVentaPK} ${data.TipoDocumento} ${data.NumeroDocumento} ${data.Cliente} ${data.Usuario}`.toLowerCase();
      const textoValido = ventaString.includes(textoBusqueda);

      return fechaValida && textoValido;
    };
  }


  applyFilter(event: Event) {
    this.aplicarFiltros();
  }

  // 3. Añade el método para abrir el diálogo
  abrirDialogoDescargar(venta: Ventas): void {
    const dialogRef = this.dialog.open(DialogDescargarPdfProformaComponent, {
      width: '450px',
      // Opcional: puedes pasar datos al diálogo si lo necesitas
      // data: { nombreCliente: venta.Cliente, numeroDocumento: venta.NumeroDocumento }
    });

    dialogRef.afterClosed().subscribe(result => {
      // El 'result' será `true` si el usuario hizo clic en "Sí, Descargar"
      // y `false` o `undefined` si hizo clic en "Cancelar" o cerró el diálogo.
      if (result === true) {
        console.log(`Iniciando descarga para la proforma ID: ${venta.IdVentaPK}`);
        this.procederConDescargaPDF(venta.IdVentaPK);
      } else {
        console.log('Descarga cancelada por el usuario.');
      }
    });
  }

  procederConDescargaPDF(idVenta: number): void {
    this.snackBar.open('Generando PDF, por favor espera...', undefined, { duration: 2000 });

    this.ventasService.getVentaCompleta(idVenta).subscribe({
      next: (response) => {
        if (response.success) {
          // Si la respuesta es exitosa, llama al método que construye el PDF
          this.generarProformaPDF(response.data);
        } else {
          this.snackBar.open('Error: No se pudieron obtener los datos de la proforma.', 'Cerrar', { duration: 4000 });
        }
      },
      error: (err) => {
        console.error('Error al obtener los datos de la venta:', err);
        this.snackBar.open('Error de comunicación al obtener los datos de la proforma.', 'Cerrar', { duration: 4000 });
      }
    });
  }

  /**
   * Construye y descarga el documento PDF usando los datos del servicio.
   */
  generarProformaPDF(data: { venta: VentaCompleta, detalles: DetalleVentaCompleta[] }): void {
    const { venta, detalles } = data;
    const doc = new jsPDF();
    const fecha = new Date(venta.FechaCreacion).toLocaleDateString('es-NI', { timeZone: 'UTC' });

    // --- ENCABEZADO DEL DOCUMENTO ---
    doc.setFontSize(18);
    doc.text('PROFORMA DE VENTA', 105, 20, { align: 'center' });
    doc.setFontSize(10);
    doc.text('Ragganel Tech S.A.', 20, 30);
    doc.text('Colonia 14 de septiembre, Managua', 20, 35);
    doc.text('RUC: J0000000000000', 20, 40);
    doc.text('Teléfono: +505 8643 9865', 20, 45);
    doc.text(`Fecha: ${fecha}`, 150, 30);
    doc.text(`Proforma #: ${venta.NumeroDocumento}`, 150, 35);

    // --- INFORMACIÓN DEL CLIENTE Y VENDEDOR ---
    doc.setFontSize(12);
    doc.text('Cliente:', 20, 60);
    doc.setFontSize(10);
    doc.text(`Nombre: ${venta.NombreCliente || 'N/A'}`, 20, 67);
    doc.text(`Identificación: ${venta.RUC || venta.DNI || 'N/A'}`, 20, 72);
    doc.text(`Tipo de Precio: ${venta.NombreMargen || 'N/A'}`, 20, 77);
    doc.text(`Vendedor: ${venta.NombreUsuario || 'N/A'}`, 20, 82);
    doc.text(`Código vendedor: ${venta.IdUsuario || 'N/A'}`, 20, 87);
    // --- TABLA DE ARTÍCULOS ---
    const head = [['Cant.', 'Código', 'Artículo', 'P. Unit.', 'Desc. %', 'P. c/Desc.', 'Subtotal']];
    const body = detalles.map(item => {
      const precioConDescuento = item.SubtotalLinea / item.Cantidad;
      return [
        item.Cantidad.toString(),
        item.CodigoArticulo,
        item.NombreArticulo,
        item.PrecioUnitario.toFixed(2),
        item.DescuentoPorcentaje.toFixed(2),
        precioConDescuento.toFixed(2),
        item.SubtotalLinea.toFixed(2)
      ];
    });

    (doc as any).autoTable({
      startY: 90,
      head,
      body,
      theme: 'striped',
      headStyles: { fillColor: [22, 160, 133] }, // Verde para proformas
    });

    // --- SECCIÓN DE TOTALES ---
    let finalY = (doc as any).lastAutoTable.finalY + 10;
    if (finalY > 260) { doc.addPage(); finalY = 20; }

    // Calcula los totales que no vienen directamente de la tabla principal
    const totalDescuentos = detalles.reduce((acc, item) => acc + (item.PrecioUnitario * item.Cantidad - item.SubtotalLinea), 0);
    const subtotalBruto = venta.SubtotalVenta + totalDescuentos;

    const xAlignRight = 190;
    doc.setFontSize(10);
    doc.text('Subtotal Bruto:', 140, finalY, { align: 'right' });
    doc.text(`${subtotalBruto.toFixed(2)} USD`, xAlignRight, finalY, { align: 'right' });
    finalY += 7;

    doc.text('Total Descuentos:', 140, finalY, { align: 'right' });
    doc.text(`-${totalDescuentos.toFixed(2)} USD`, xAlignRight, finalY, { align: 'right' });
    finalY += 7;

    doc.text('Subtotal Neto (s/IVA):', 140, finalY, { align: 'right' });
    doc.text(`${venta.SubtotalVenta.toFixed(2)} USD`, xAlignRight, finalY, { align: 'right' });
    finalY += 7;

    doc.text('IVA (15%):', 140, finalY, { align: 'right' });
    doc.text(`${venta.IVA.toFixed(2)} USD`, xAlignRight, finalY, { align: 'right' });
    finalY += 7;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL A PAGAR:', 140, finalY, { align: 'right' });
    doc.text(`${venta.TotalVenta.toFixed(2)} USD`, xAlignRight, finalY, { align: 'right' });

    // --- PIE DE PÁGINA ---
    finalY += 15;
    if (finalY > 270) { doc.addPage(); finalY = 20; }
    doc.setFontSize(8);
    doc.text('Esta proforma es válida por 15 días. Precios y disponibilidad sujetos a cambio.', 20, finalY);

    // --- GUARDAR EL DOCUMENTO ---
    const nombreArchivo = `Proforma-${venta.NumeroDocumento}-${venta.NombreCliente?.replace(/\s/g, '_') || 'Cliente'}.pdf`;
    doc.save(nombreArchivo);
    this.snackBar.open(`PDF "${nombreArchivo}" generado.`, 'OK', { duration: 3000 });
  }

}