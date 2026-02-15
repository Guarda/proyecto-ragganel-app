import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { NgxChartsModule, Color, ScaleType, LegendPosition } from '@swimlane/ngx-charts';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AbcDetalleComponent } from '../abc-detalle/abc-detalle.component';
import { LoadingDialogComponent } from '../loading-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonToggleModule, MatButtonToggleChange } from '@angular/material/button-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { 
  DashboardService, 
  ModeloPronostico,
} from '../../../services/dashboard.service';
import { ReportePronosticoMasivoItem } from '../../interfaces/reportepronosticomasivoitem';
import { Top10Articulo } from '../../interfaces/top10articulo';
import { DashboardData } from '../../interfaces/dashboarddata';
import { ChartData } from '../../interfaces/chartdata';
import { PronosticoData } from '../../interfaces/pronosticodata';
import { PronosticoGraficoItem } from '../../interfaces/pronosticodatoitem';
import { PedidoDashboardItem } from '../../interfaces/pedidodashboarditem';
import { PronosticoResponse } from '../../interfaces/pronosticoresponse';

import * as XLSX from 'xlsx';
import { CurrencyConverterPipe } from '../../pipes/currency-converter.pipe';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [
        CommonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule,
        MatButtonModule, NgxChartsModule, MatDividerModule,
        MatButtonToggleModule, 
        FormsModule,
        MatDialogModule,
        MatTooltipModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        MatSnackBarModule,
        CurrencyConverterPipe
    ],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public dashboardData: DashboardData | null = null;
  public isLoading = true;
  public abcChartTotal: number = 0;
  public errorMessage: string | null = null;

  public readonly EXCHANGE_RATE = 36.6243;
  public selectedCurrency: 'USD' | 'NIO' = 'USD';

  public ventasGraficoData: ChartData[] = [];
  public isChartLoading = true;
  public periodoSeleccionado: string = '30dias';
  public tipoGraficoSeleccionado: string = 'bar';
  public tipoGraficoABC: string = 'pie';

  public pedidosData: PedidoDashboardItem[] = [];
  public isPedidosLoading = true;
  public pedidosError: string | null = null;
  private readonly DIAS_ALERTA_PEDIDOS = 7;

  public legendPosition: LegendPosition = LegendPosition.Right;

  public modelosParaPronostico: ModeloPronostico[] = [];
  public modeloSeleccionado: string | null = null;
  public mesesHistorial: number = 6;
  public isPronosticoLoading = false;
  public pronosticoError: string | null = null;
  public pronosticoResumen: PronosticoData | null = null;
  public pronosticoGraficoData: PronosticoGraficoItem[] = [];

  pronosticoColorScheme: Color = {
    name: 'pronostico',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#28a745', '#3F51B5'],
  };

  colorScheme: Color = {
    name: 'vivid',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#3F51B5', '#28a745', '#ffc107', '#dc3545', '#17a2b8', '#6610f2'],
  };

  constructor(
    private dashboardService: DashboardService,
    private router: Router,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.cargarDashboard();
    
    this.cargarGraficoVentas(this.periodoSeleccionado);

    this.cargarPedidos();

    this.cargarModelosParaPronostico();
  }

  cargarDashboard(): void {
    this.isLoading = true;
    this.errorMessage = null;
    
    this.dashboardService.getDashboardData().subscribe({
      next: (response) => {
        if (response.success) {
          this.dashboardData = response.data;
          
          this.calcularTotalABC(); 
        } else {
          this.errorMessage = 'Los datos recibidos no son válidos.';
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'No se pudo cargar la información principal del dashboard. Intente de nuevo.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  private calcularTotalABC(): void {
    if (this.dashboardData && this.dashboardData.valorInventarioABC) {
      this.abcChartTotal = this.dashboardData.valorInventarioABC
                           .reduce((sum, item) => sum + item.value, 0);
    } else {
      this.abcChartTotal = 0;
    }
  }


  cargarGraficoVentas(periodo: string): void {
    this.isChartLoading = true;
    
    const { inicio, fin } = this.calcularFechas(periodo);

    this.dashboardService.getVentasGrafico(inicio, fin).subscribe({
      next: (data) => {
        this.ventasGraficoData = data;
        this.isChartLoading = false;
      },
      error: (err) => {
        console.error("Error al cargar gráfico:", err);
        this.isChartLoading = false;
      }
    });
  }

  cargarPedidos(): void {
    this.isPedidosLoading = true;
    this.pedidosError = null;

    this.dashboardService.getPedidosDashboard(this.DIAS_ALERTA_PEDIDOS).subscribe({
      next: (data) => {
        this.pedidosData = data;
        this.isPedidosLoading = false;
      },
      error: (err) => {
        console.error("Error al cargar datos de pedidos:", err);
        this.pedidosError = "No se pudo cargar el resumen de pedidos.";
        this.isPedidosLoading = false;
      }
    });
  }


  private calcularFechas(periodo: string): { inicio: string, fin: string } {
    const fin = new Date();
    let inicio = new Date();

    switch (periodo) {
      case '7dias':
        inicio.setDate(fin.getDate() - 6);
        break;
      case '90dias':
        inicio.setDate(fin.getDate() - 89);
        break;
      case '30dias':
      default:
        inicio.setDate(fin.getDate() - 29);
        break;
    }

    const formatDate = (date: Date): string => date.toISOString().split('T')[0];

    return {
      inicio: formatDate(inicio),
      fin: formatDate(fin)
    };
  }

  public onPeriodoChange(event: MatButtonToggleChange): void {
    this.periodoSeleccionado = event.value;
    this.cargarGraficoVentas(this.periodoSeleccionado);
  }

  public onTipoGraficoChange(event: MatButtonToggleChange): void {
    this.tipoGraficoSeleccionado = event.value;
  }

  public irAVentasFiltradas(filtro: string): void {
    this.router.navigate(['/home/listado-ventas'], {
      queryParams: { filtro: filtro }
    });
  }

  public irAInventarioGarantia(): void {
    this.router.navigate(['/home/inventario-garantia']);
  }

  public irAInventarioGeneral(valor: string, tipo: 'nombre' | 'estado'): void {
    const filtroParam = `${tipo}:${valor}`; 

    this.router.navigate(['/home/inventario-general'], {
      queryParams: { filtro: filtroParam } 
    });
  }

  public irAListadoVentasPorPeriodo(): void {
    const filtro = this.periodoSeleccionado;
    
    this.router.navigate(['/home/listado-ventas'], {
      queryParams: { filtro: filtro } 
    });
  }

  public irAPedido(codigoPedido: string): void {
    this.router.navigate(['/home/listado-pedidos/ver-pedido', codigoPedido, 'view']);
  }

  public irAInsumo(codigoInsumo: string): void {
    if (!codigoInsumo) {
      console.error('No se puede navegar: CodigoInsumo está vacío o nulo.');
      return;
    }
    this.router.navigate(['/home/listado-insumos/ver-insumo', codigoInsumo, 'view']);
  }

  public irAFactura(idVenta: number): void {
    if (!idVenta) {
      console.error('No se puede navegar: IdVenta está vacío o nulo.');
      return;
    }
    this.router.navigate(['/home/listado-ventas/ver-factura', idVenta, 'view']);
  }

  public descargarUltimasVentasExcel(): void {
    if (!this.dashboardData || this.dashboardData.ultimasVentas.length === 0) {
      console.log("No hay datos de últimas ventas para exportar.");
      return;
    }

    const datosParaExportar = this.dashboardData.ultimasVentas.map(venta => ({
      'ID Factura': venta.IdVentaPK,
      'Cliente': venta.NombreCliente,
      'Fecha': new Date(venta.FechaCreacion).toLocaleString('es-NI', { dateStyle: 'short', timeStyle: 'short' }),
      'Vendedor': venta.NombreVendedor,
      'Total (USD)': venta.TotalVenta,
      'Artículos': venta.ArticulosVendidos.replace(/\n/g, ', ')
    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(datosParaExportar);

    ws['!cols'] = [ { wch: 10 }, { wch: 30 }, { wch: 20 }, { wch: 25 }, { wch: 15 }, { wch: 60 } ];

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'UltimasVentas');

    const nombreArchivo = 'Ultimas_Ventas.xlsx';
    XLSX.writeFile(wb, nombreArchivo);
  }

  public descargarStockBajoExcel(): void {
    if (!this.dashboardData || this.dashboardData.stockBajo.length === 0) {
      console.log("No hay datos de stock bajo para exportar.");
      return;
    }

    const datosParaExportar = this.dashboardData.stockBajo.map(item => ({
      'Código': item.CodigoInsumo,
      'Descripción': item.DescripcionInsumo,
      'Cantidad Actual': item.Cantidad,
      'Stock Mínimo': item.StockMinimo
    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(datosParaExportar);

    const columnWidths = [
      { wch: 20 },
      { wch: 50 },
      { wch: 15 },
      { wch: 15 }
    ];
    ws['!cols'] = columnWidths;

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'StockBajo');

    const nombreArchivo = 'Alertas_Stock_Bajo.xlsx';
    XLSX.writeFile(wb, nombreArchivo);
  }

  public onAbcChartClick(event: { name: string, value: number }): void {

    const fullTitle = event.name; 

    const categoriaKey = fullTitle.split(' (')[0]; 

    console.log(
      `%c[Debug ABC] Clic detectado. Enviando clave LIMPIA:`, 
      'color: #007bff; font-weight: bold;', 
      categoriaKey
    );

    const loadingDialog = this.dialog.open(LoadingDialogComponent, {
      disableClose: true,
    });

    this.dashboardService.getTop10ArticulosABC(categoriaKey).subscribe({
      next: (top10Items: Top10Articulo[]) => {
        loadingDialog.close();

        console.log(
          `%c[Debug ABC] Respuesta recibida del servicio:`, 
          'color: #28a745; font-weight: bold;', 
          top10Items
        );
        if (top10Items.length > 0) {
          console.table(top10Items);
        }

        this.dialog.open(AbcDetalleComponent, {
          width: '700px', 
          data: {
            title: fullTitle,
            items: top10Items
          }
        });
      },
      error: (err) => {
        loadingDialog.close(); 
        console.error(
          `%c[Debug ABC] Error al llamar el servicio:`, 
          'color: #dc3545; font-weight: bold;', 
          err
        );
      }
    });
  }

  public dateTickFormatting(val: string): string {
    const date = new Date(val);
    return date.toLocaleDateString('es-NI', { month: 'short', day: 'numeric', timeZone: 'UTC' });
  }

  public abcLabelFormatting(data: any): string {
    const value = data.value;
    const currencyPipe = new CurrencyConverterPipe();
    
    return currencyPipe.transform(value, 'USD', this.selectedCurrency, this.EXCHANGE_RATE, 0);
  }

  public abcTooltipFormatting(data: any): string {
    const name = data.name;
    const value = data.value;
    const currencyPipe = new CurrencyConverterPipe();
    
    const formattedValue = currencyPipe.transform(value, 'USD', this.selectedCurrency, this.EXCHANGE_RATE, 0);

    return `${name}: ${formattedValue}`;
  }

  public getPedidoTooltip(pedido: PedidoDashboardItem): string {
    const currencyPipe = new CurrencyConverterPipe();
    const totalFormatted = currencyPipe.transform(pedido.TotalPedido, 'USD', this.selectedCurrency, this.EXCHANGE_RATE);

    let tooltip = `Ir al pedido ${pedido.CodigoPedido}\nEstado: ${pedido.EstadoPedido}\nTotal: ${totalFormatted}`;
    
    if (pedido.FechaEstimadaRecepcion) {
      const fechaEst = new Date(pedido.FechaEstimadaRecepcion).toLocaleDateString('es-NI', {day: '2-digit', month: 'short', year: 'numeric'});
      tooltip += `\nEst. Recepción: ${fechaEst}`;
    }

    if (pedido.AlertaAntiguedad === 1) {
      tooltip += `\n¡ATENCIÓN! Última modificación hace ${pedido.DiasDesdeModificacion} días.`;
    } 
    else if (pedido.DiasDesdeModificacion === 0) {
      tooltip += `\nÚltima modificación: hoy.`;
    } 
    else {
      const diasTexto = pedido.DiasDesdeModificacion === 1 ? '1 día' : `${pedido.DiasDesdeModificacion} días`;
      tooltip += `\nÚltima modificación: hace ${diasTexto}.`;
    }
    return tooltip;
  }

  public toggleCurrency(): void {
    this.selectedCurrency = this.selectedCurrency === 'USD' ? 'NIO' : 'USD';
  }

  public getAbcTotalFormatted(): string {
    const currencyPipe = new CurrencyConverterPipe();
    return currencyPipe.transform(this.abcChartTotal, 'USD', this.selectedCurrency, this.EXCHANGE_RATE);
  }
  

  cargarModelosParaPronostico(): void {
    this.dashboardService.getModelosParaPronostico().subscribe({
      next: (data: ModeloPronostico[]) => {
        this.modelosParaPronostico = data;
      },
      error: (err: any) => {
        console.error("Error al cargar la lista de modelos para pronóstico:", err);
      }
    });
  }

  generarPronostico(): void {
    if (!this.modeloSeleccionado) {
      this.pronosticoError = "Por favor, seleccione un modelo para analizar.";
      return;
    }

    this.isPronosticoLoading = true;
    this.pronosticoError = null;
    this.pronosticoResumen = null;
    this.pronosticoGraficoData = [];

    const [tipo, id] = this.modeloSeleccionado.split('-').map(Number);
    
    this.dashboardService.getPronosticoPorModelo(id, tipo, this.mesesHistorial).subscribe({
      next: (response: PronosticoResponse) => {
        this.pronosticoResumen = response.resumen;
        
        this.pronosticoGraficoData = [
          {
            name: 'Demanda (Y)',
            series: response.grafico.filter(d => d.seriesName === 'Demanda (Y)')
          },
          {
            name: 'Pronóstico (Y\')',
            series: response.grafico.filter(d => d.seriesName === 'Pronóstico (Y\')')
          }
        ] as any;

        this.isPronosticoLoading = false;
      },
      error: (err: any) => {
        console.error("Error al generar el pronóstico:", err);
        this.pronosticoError = "No se pudo generar el pronóstico. Revise la consola.";
        this.isPronosticoLoading = false;
      }
    });
  }

  descargarReportePronostico(): void {
    const loadingSnackbar = this.snackBar.open('Generando reporte masivo de pronóstico... Esto puede tardar un momento.', 'Cerrar');
    this.isPronosticoLoading = true;

    this.dashboardService.getReportePronosticoMasivo(this.mesesHistorial).subscribe({
      next: (data: ReportePronosticoMasivoItem[]) => {
        loadingSnackbar.dismiss();
        this.isPronosticoLoading = false;

        if (data.length === 0) {
          this.snackBar.open('No se generaron datos para el reporte.', 'Cerrar', { duration: 3000 });
          return;
        }

        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
        
        ws['!cols'] = [
          { wch: 60 },
          { wch: 15 },
          { wch: 20 },
          { wch: 40 },
          { wch: 15 }
        ];

        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'PronosticoMasivo');
        XLSX.writeFile(wb, `Reporte_Pronostico_Reabastecimiento_${new Date().toISOString().split('T')[0]}.xlsx`);
        
        this.snackBar.open('Reporte generado y descargado.', 'OK', { duration: 3000 });
      },
      error: (err: any) => {
        loadingSnackbar.dismiss();
        this.isPronosticoLoading = false;
        console.error("Error al generar el reporte masivo:", err);
        this.snackBar.open('Error al generar el reporte. Revise la consola.', 'Cerrar', { duration: 5000 });
      }
    });
  }
}