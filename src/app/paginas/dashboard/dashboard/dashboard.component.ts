import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { NgxChartsModule, Color, ScaleType, LegendPosition } from '@swimlane/ngx-charts';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // ⭐️ 1. IMPORTA FORMSMODULE

// ===== IMPORTACIONES NUEVAS =====
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AbcDetalleComponent } from '../abc-detalle/abc-detalle.component';
import { LoadingDialogComponent } from '../loading-dialog.component';
// ===== AÑADIR ESTOS IMPORTS =====
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input'; // Para el select
// ===== IMPORTACIONES NUEVAS =====
import { MatButtonToggleModule, MatButtonToggleChange } from '@angular/material/button-toggle';
import { MatTooltipModule } from '@angular/material/tooltip'; // ⭐️ 1. IMPORTA ESTO
// ===== IMPORTACIONES DE SERVICIO =====
// ===== AÑADIR SNACKBAR =====
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
// ⭐️ 1. IMPORTA LA NUEVA INTERFAZ 'ModeloPronostico' DESDE EL SERVICIO ⭐️
import { 
  DashboardService, 
  ModeloPronostico,
} from '../../../services/dashboard.service';
import { ReportePronosticoMasivoItem } from '../../interfaces/reportepronosticomasivoitem';
import { Top10Articulo } from '../../interfaces/top10articulo';
import { DashboardData } from '../../interfaces/dashboarddata';
import { ChartData } from '../../interfaces/chartdata'; // Asumo que tienes esta interfaz
import { PronosticoData } from '../../interfaces/pronosticodata';
import { PronosticoGraficoItem } from '../../interfaces/pronosticodatoitem';
// ⭐️ 1. IMPORTAR LA NUEVA INTERFAZ
import { PedidoDashboardItem } from '../../interfaces/pedidodashboarditem';
// ===== AÑADIR ESTAS INTERFACES (O IMPORTARLAS) =====
import { PronosticoResponse } from '../../interfaces/pronosticoresponse';

// ⭐️ 1. AÑADE ESTA IMPORTACIÓN
import * as XLSX from 'xlsx';
// ⭐️ 1. IMPORTA EL NUEVO PIPE (DEBES CREAR ESTE ARCHIVO)
import { CurrencyConverterPipe } from '../../pipes/currency-converter.pipe';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [
        CommonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule,
        MatButtonModule, NgxChartsModule, MatDividerModule,
        // ===== AÑADIR ESTE MÓDULO =====
        MatButtonToggleModule, 
        FormsModule, // ⭐️ 2. AÑÁDELO A LOS IMPORTS
        MatDialogModule,
        MatTooltipModule, // ⭐️ 2. AÑÁDELO A LOS IMPORTS
        // ===== AÑADIR ESTOS MÓDULOS =====
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        MatSnackBarModule, // <-- AÑADIR ESTE
        // ⭐️ 2. AÑADE EL NUEVO PIPE A LOS IMPORTS
        CurrencyConverterPipe
    ],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public dashboardData: DashboardData | null = null;
  public isLoading = true;
  public abcChartTotal: number = 0; // ⭐️ 1. AÑADE ESTA NUEVA PROPIEDAD
  public errorMessage: string | null = null;

  // ===== INICIO DE NUEVAS PROPIEDADES DE MONEDA =====
  public readonly EXCHANGE_RATE = 36.6243; // Tasa de cambio: 1 USD = 36.6243 NIO
  public selectedCurrency: 'USD' | 'NIO' = 'USD'; // Valor por defecto
  // ===== FIN DE NUEVAS PROPIEDADES DE MONEDA =====

  // ===== NUEVAS PROPIEDADES PARA EL GRÁFICO =====
  public ventasGraficoData: ChartData[] = [];
  public isChartLoading = true;
  public periodoSeleccionado: string = '30dias'; // Valor por defecto
  public tipoGraficoSeleccionado: string = 'bar'; // <-- 1. AÑADIR ESTA PROPIEDAD
  public tipoGraficoABC: string = 'pie'; // ⭐️ AÑADE ESTA PROPIEDAD

  // ⭐️ 2. NUEVAS PROPIEDADES PARA EL MINI-DASHBOARD DE PEDIDOS
  public pedidosData: PedidoDashboardItem[] = [];
  public isPedidosLoading = true;
  public pedidosError: string | null = null;
  private readonly DIAS_ALERTA_PEDIDOS = 7; // Alerta si > 7 días sin modificar

  // Propiedad para la posición de la leyenda del gráfico ABC
  public legendPosition: LegendPosition = LegendPosition.Right;

  // ===== INICIO DE NUEVAS PROPIEDADES PARA PRONÓSTICO =====
  // ⭐️ 2. CORRECCIÓN DE TIPO: 
  //    Debe ser un array de 'ModeloPronostico', no 'PronosticoResponse'.
  public modelosParaPronostico: ModeloPronostico[] = [];
  public modeloSeleccionado: string | null = null; // Usamos un string "tipo-id"
  public mesesHistorial: number = 6; // Valor por defecto
  public isPronosticoLoading = false;
  public pronosticoError: string | null = null;
  public pronosticoResumen: PronosticoData | null = null;
  public pronosticoGraficoData: PronosticoGraficoItem[] = [];

  // Esquema de color para el nuevo gráfico
  pronosticoColorScheme: Color = {
    name: 'pronostico',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#28a745', '#3F51B5'], // Demanda (Verde), Pronóstico (Azul)
  };
  // ===== FIN DE NUEVAS PROPIEDADES =====

  // Opciones para los gráficos
  colorScheme: Color = {
    name: 'vivid',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#3F51B5', '#28a745', '#ffc107', '#dc3545', '#17a2b8', '#6610f2'],
  };

  constructor(
    private dashboardService: DashboardService,
    private router: Router, // <--- AÑADIR ESTO
    public dialog: MatDialog, // <--- AÑADIR ESTO
    private snackBar: MatSnackBar // <-- INYECTAR SNACKBAR
  ) { }

  ngOnInit(): void {
    // 1. Carga los KPIs, listas, etc.
    this.cargarDashboard();
    
    // 2. Carga el gráfico (con el valor por defecto de '30dias')
    this.cargarGraficoVentas(this.periodoSeleccionado);

    // ⭐️ 3. CARGAR LOS DATOS DEL NUEVO MINI-DASHBOARD
    this.cargarPedidos();

    // 4. ===== NUEVA LLAMADA =====
    // Carga la lista de modelos para el dropdown de pronóstico
    this.cargarModelosParaPronostico();
  }

  // Esta función AHORA solo carga los KPIs y listas
  cargarDashboard(): void {
    this.isLoading = true;
    this.errorMessage = null;
    
    this.dashboardService.getDashboardData().subscribe({
      next: (response) => {
        if (response.success) {
          // 'ventas30Dias' ya no viene aquí
          this.dashboardData = response.data;
          
          // ⭐️ 2. LLAMA A LA NUEVA FUNCIÓN AQUÍ
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

  // ⭐️ 3. AÑADE ESTA NUEVA FUNCIÓN COMPLETA
  /**
   * Calcula el valor total del gráfico ABC sumando todas sus categorías.
   */
  private calcularTotalABC(): void {
    if (this.dashboardData && this.dashboardData.valorInventarioABC) {
      this.abcChartTotal = this.dashboardData.valorInventarioABC
                           .reduce((sum, item) => sum + item.value, 0);
    } else {
      this.abcChartTotal = 0;
    }
  }


  // ===== NUEVA FUNCIÓN =====
  /**
   * Carga los datos del gráfico de ventas llamando al nuevo endpoint.
   * @param periodo '7dias', '30dias', '90dias'
   */
  cargarGraficoVentas(periodo: string): void {
    this.isChartLoading = true;
    
    // 1. Calcular las fechas
    const { inicio, fin } = this.calcularFechas(periodo);

    // 2. Llamar al NUEVO método en tu servicio
    this.dashboardService.getVentasGrafico(inicio, fin).subscribe({
      next: (data) => {
        this.ventasGraficoData = data;
        this.isChartLoading = false;
      },
      error: (err) => {
        console.error("Error al cargar gráfico:", err);
        this.isChartLoading = false;
        // Aquí podrías mostrar un error en el gráfico mismo
      }
    });
  }

  // ⭐️ 4. NUEVA FUNCIÓN PARA CARGAR LOS PEDIDOS
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


  // ===== NUEVA FUNCIÓN (HELPER) =====
  /**
   * Calcula las fechas de inicio y fin y las formatea como 'YYYY-MM-DD'.
   */
  private calcularFechas(periodo: string): { inicio: string, fin: string } {
    const fin = new Date();
    let inicio = new Date();

    switch (periodo) {
      case '7dias':
        inicio.setDate(fin.getDate() - 6); // -6 para incluir hoy (total 7 días)
        break;
      case '90dias':
        inicio.setDate(fin.getDate() - 89);
        break;
      case '30dias':
      default:
        inicio.setDate(fin.getDate() - 29);
        break;
    }

    // Formatear a 'YYYY-MM-DD' que es amigable con SQL
    const formatDate = (date: Date): string => date.toISOString().split('T')[0];

    return {
      inicio: formatDate(inicio),
      fin: formatDate(fin)
    };
  }

  // ===== NUEVA FUNCIÓN (MANEJADOR DE EVENTO) =====
  /**
   * Se dispara cuando el usuario cambia el grupo de botones.
   */
  public onPeriodoChange(event: MatButtonToggleChange): void {
    this.periodoSeleccionado = event.value;
    this.cargarGraficoVentas(this.periodoSeleccionado);
  }

  // ===== 2. AÑADIR ESTA NUEVA FUNCIÓN =====
  public onTipoGraficoChange(event: MatButtonToggleChange): void {
    this.tipoGraficoSeleccionado = event.value;
  }

  // ===== FUNCIÓN NUEVA =====
  /**
   * Navega al listado de ventas y pasa un parámetro 'filtro'
   * en la URL (ej. /listado-ventas?filtro=hoy)
   * @param filtro El token del filtro ('hoy', 'semana', 'mes')
   */
  public irAVentasFiltradas(filtro: string): void {
    this.router.navigate(['/home/listado-ventas'], {
      queryParams: { filtro: filtro }
    });
  }

  // ===== FUNCIÓN NUEVA =====
  /**
   * Navega al listado de inventario en garantía.
   */
  public irAInventarioGarantia(): void {
    this.router.navigate(['/home/inventario-garantia']);
  }

  // ===== FUNCIÓN NUEVA =====
  /**
   * Navega al inventario general y aplica un filtro de texto.
   * @param filtro El texto a filtrar (ej. 'A reparar')
   */
  public irAInventarioGeneral(valor: string, tipo: 'nombre' | 'estado'): void {
    // Creamos un prefijo para que el listado sepa qué columna filtrar
    // ej: "estado:A reparar" o "nombre:Mica 2DS"
    const filtroParam = `${tipo}:${valor}`; 

    this.router.navigate(['/home/inventario-general'], {
      queryParams: { filtro: filtroParam } 
    });
  }

  /**
   * Navega al listado de ventas y aplica un filtro
   * basado en el período seleccionado en el gráfico.
   */
  public irAListadoVentasPorPeriodo(): void {
    // Usamos la variable que ya se actualiza con los botones toggle
    const filtro = this.periodoSeleccionado; // '7dias', '30dias', o '90dias'
    
    this.router.navigate(['/home/listado-ventas'], {
      queryParams: { filtro: filtro } 
    });
  }

  // ⭐️ 5. NUEVA FUNCIÓN DE NAVEGACIÓN PARA PEDIDOS
  /**
   * Navega a la página de detalles de un pedido específico.
   * @param codigoPedido El código del pedido (ej. 'P-15112025-1')
   */
  public irAPedido(codigoPedido: string): void {
    // CORREGIDO: Añadido '/view' al final de la ruta
    this.router.navigate(['/home/listado-pedidos/ver-pedido', codigoPedido, 'view']);
  }

  /**
   * ⭐️ NUEVA FUNCIÓN
   * Navega a la página de detalles de un insumo específico.
   * @param codigoInsumo El código del insumo (ej. 'PICO-3')
   */
  public irAInsumo(codigoInsumo: string): void {
    if (!codigoInsumo) {
      console.error('No se puede navegar: CodigoInsumo está vacío o nulo.');
      return;
    }
    // Navega usando la ruta que especificaste
    this.router.navigate(['/home/listado-insumos/ver-insumo', codigoInsumo, 'view']);
  }

  /**
   * ⭐️ NUEVA FUNCIÓN
   * Navega a la página de detalles de una factura (venta).
   * @param idVenta El ID de la venta (ej. 4)
   */
  public irAFactura(idVenta: number): void {
    if (!idVenta) {
      console.error('No se puede navegar: IdVenta está vacío o nulo.');
      return;
    }
    // Navega usando la ruta que especificaste
    this.router.navigate(['/home/listado-ventas/ver-factura', idVenta, 'view']);
  }

  /**
   * ⭐️ NUEVA FUNCIÓN
   * Prepara y descarga la lista de últimas ventas como un archivo Excel.
   */
  public descargarUltimasVentasExcel(): void {
    if (!this.dashboardData || this.dashboardData.ultimasVentas.length === 0) {
      console.log("No hay datos de últimas ventas para exportar.");
      return;
    }

    // 1. Preparamos los datos para el Excel
    const datosParaExportar = this.dashboardData.ultimasVentas.map(venta => ({
      'ID Factura': venta.IdVentaPK,
      'Cliente': venta.NombreCliente,
      'Fecha': new Date(venta.FechaCreacion).toLocaleString('es-NI', { dateStyle: 'short', timeStyle: 'short' }), // Formato: 01/01/25, 10:30 a. m.
      'Vendedor': venta.NombreVendedor,
      'Total (USD)': venta.TotalVenta,
      'Artículos': venta.ArticulosVendidos.replace(/\n/g, ', ') // Reemplaza saltos de línea por comas
    }));

    // 2. Creamos la "hoja de trabajo" (WorkSheet)
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(datosParaExportar);

    // 3. (Opcional) Ajustar el ancho de las columnas
    ws['!cols'] = [ { wch: 10 }, { wch: 30 }, { wch: 20 }, { wch: 25 }, { wch: 15 }, { wch: 60 } ];

    // 4. Creamos el "libro" (WorkBook)
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'UltimasVentas'); // Nombre de la pestaña

    // 5. Generamos el archivo Excel y disparamos la descarga
    const nombreArchivo = 'Ultimas_Ventas.xlsx';
    XLSX.writeFile(wb, nombreArchivo);
  }

  /**
   * ⭐️ FUNCIÓN ACTUALIZADA
   * Prepara y descarga la lista de stock bajo como un archivo Excel.
   * Utiliza la biblioteca 'xlsx' (SheetJS).
   */
  public descargarStockBajoExcel(): void {
    if (!this.dashboardData || this.dashboardData.stockBajo.length === 0) {
      console.log("No hay datos de stock bajo para exportar.");
      return;
    }

    // 1. Preparamos los datos para el Excel (opcional pero recomendado)
    // Esto nos permite definir cabeceras amigables.
    const datosParaExportar = this.dashboardData.stockBajo.map(item => ({
      'Código': item.CodigoInsumo,
      'Descripción': item.DescripcionInsumo,
      'Cantidad Actual': item.Cantidad,
      'Stock Mínimo': item.StockMinimo
    }));

    // 2. Creamos la "hoja de trabajo" (WorkSheet) desde nuestro array de datos
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(datosParaExportar);

    // 3. (Opcional) Ajustar el ancho de las columnas
    // Definimos los anchos (wch = "width in characters")
    const columnWidths = [
      { wch: 20 }, // Código
      { wch: 50 }, // Descripción
      { wch: 15 }, // Cantidad Actual
      { wch: 15 }  // Stock Mínimo
    ];
    ws['!cols'] = columnWidths;

    // 4. Creamos el "libro" (WorkBook) y le añadimos la hoja
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'StockBajo'); // 'StockBajo' será el nombre de la pestaña

    // 5. Generamos el archivo Excel y disparamos la descarga
    const nombreArchivo = 'Alertas_Stock_Bajo.xlsx';
    XLSX.writeFile(wb, nombreArchivo);
  }

  /**
   * Se dispara al hacer clic en una barra del gráfico de ventas.
   * Navega al listado de ventas filtrado por ESE DÍA.
   * @param data El objeto de datos de la barra (ej. {name: '2025-11-10', value: 150})
   */
  // public onBarClick(data: { name: string, value: number }): void {
  //   // data.name es la fecha que viene del SP (ej. '2025-11-10')
  //   const fecha = data.name; 
    
  //   this.router.navigate(['/home/listado-ventas'], {
  //     queryParams: { fecha: fecha } // Pasamos el nuevo parámetro 'fecha'
  //   });
  // }

  public onAbcChartClick(event: { name: string, value: number }): void {

    // 1. Obtenemos el título completo (ej: "A (Productos) (28 arts.)")
    const fullTitle = event.name; 

    // 2. ===== ¡ESTA ES LA LÍNEA CORREGIDA! =====
    //    ANTES: const categoriaKey = fullTitle.trim().charAt(0); <-- ESTE ERA EL ERROR
    //
    //    AHORA: Cortamos la cadena para obtener "A (Productos)"
    const categoriaKey = fullTitle.split(' (')[0]; 

    // 3. Verificamos en la consola (AHORA DEBE DECIR "A (Productos)")
    console.log(
      `%c[Debug ABC] Clic detectado. Enviando clave LIMPIA:`, 
      'color: #007bff; font-weight: bold;', 
      categoriaKey // <-- Ahora mostrará "A (Productos)"
    );

    // 4. Abrir el diálogo de carga...
    const loadingDialog = this.dialog.open(LoadingDialogComponent, {
      disableClose: true,
    });

    // 5. Llamar al servicio CON LA CLAVE CORRECTA
    this.dashboardService.getTop10ArticulosABC(categoriaKey).subscribe({
      next: (top10Items: Top10Articulo[]) => {
        loadingDialog.close(); // Cerrar el spinner

        // AHORA ESTO DEBERÍA MOSTRAR TUS 10 FILAS
        console.log(
          `%c[Debug ABC] Respuesta recibida del servicio:`, 
          'color: #28a745; font-weight: bold;', 
          top10Items
        );
        if (top10Items.length > 0) {
          console.table(top10Items); // <-- ¡Verás tus Gamecubes aquí!
        }

        // 6. Abrir el modal de detalles
        this.dialog.open(AbcDetalleComponent, {
          width: '700px', 
          data: {
            title: fullTitle,    // Usamos el título completo para el encabezado
            items: top10Items  // Pasamos los items (¡que ahora sí deberían llegar!)
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
  // ===== MEJORA AÑADIDA =====
  // Formatea las fechas del eje X en el gráfico de barras para que sean más cortas
  public dateTickFormatting(val: string): string {
    const date = new Date(val);
    // Formato: "Jul 23"
    return date.toLocaleDateString('es-NI', { month: 'short', day: 'numeric', timeZone: 'UTC' });
  }

  // ⭐️ 5. ACTUALIZA EL abcLabelFormatting (Asegúrate de que no use el pipe original de Angular)
  /**
   * Formatea las etiquetas del gráfico ABC para mostrar el valor en formato de moneda.
   */
  public abcLabelFormatting(data: any): string {
    const value = data.value;
    const currencyPipe = new CurrencyConverterPipe();
    
    // Aquí el pipe hace el trabajo de conversión y formato
    return currencyPipe.transform(value, 'USD', this.selectedCurrency, this.EXCHANGE_RATE, 0);
  }

  // ⭐️ 6. ACTUALIZA EL abcTooltipFormatting (Asegúrate de que no use el pipe original de Angular)
  /**
   * Formatea el texto del tooltip (hover) para el gráfico ABC.
   * @param data El objeto de datos de la porción del gráfico.
   */
  public abcTooltipFormatting(data: any): string {
    // 'data' es un objeto con { name: "...", value: ... }
    const name = data.name;
    const value = data.value;
    const currencyPipe = new CurrencyConverterPipe();
    
    // Aquí el pipe hace el trabajo de conversión y formato
    const formattedValue = currencyPipe.transform(value, 'USD', this.selectedCurrency, this.EXCHANGE_RATE, 0);

    return `${name}: ${formattedValue}`;
  }

  // ⭐️ 7. ACTUALIZA EL getPedidoTooltip PARA USAR EL PIPE CONSTRUCTOR
  public getPedidoTooltip(pedido: PedidoDashboardItem): string {
    const currencyPipe = new CurrencyConverterPipe();
    const totalFormatted = currencyPipe.transform(pedido.TotalPedido, 'USD', this.selectedCurrency, this.EXCHANGE_RATE);

    let tooltip = `Ir al pedido ${pedido.CodigoPedido}\nEstado: ${pedido.EstadoPedido}\nTotal: ${totalFormatted}`;
    
    // ⭐️ AÑADIDO: Muestra la fecha estimada si existe
    if (pedido.FechaEstimadaRecepcion) {
      const fechaEst = new Date(pedido.FechaEstimadaRecepcion).toLocaleDateString('es-NI', {day: '2-digit', month: 'short', year: 'numeric'});
      tooltip += `\nEst. Recepción: ${fechaEst}`;
    }

    // Texto para la alerta
    if (pedido.AlertaAntiguedad === 1) {
      tooltip += `\n¡ATENCIÓN! Última modificación hace ${pedido.DiasDesdeModificacion} días.`;
    } 
    // Texto para "Modificado hoy"
    else if (pedido.DiasDesdeModificacion === 0) {
      tooltip += `\nÚltima modificación: hoy.`;
    } 
    // Texto para "Modificado hace X días"
    else {
      const diasTexto = pedido.DiasDesdeModificacion === 1 ? '1 día' : `${pedido.DiasDesdeModificacion} días`;
      tooltip += `\nÚltima modificación: hace ${diasTexto}.`;
    }
    return tooltip;
  }

  // ⭐️ 3. NUEVA FUNCIÓN PARA ALTERNAR LA MONEDA
  public toggleCurrency(): void {
    this.selectedCurrency = this.selectedCurrency === 'USD' ? 'NIO' : 'USD';
  }

  // ⭐️ 4. FUNCIÓN PARA FORMATEAR EL VALOR TOTAL ABC (DEBE USAR EL PIPE)
  public getAbcTotalFormatted(): string {
    // Usamos el pipe para hacer la conversión aquí también, ya que se usa fuera del template.
    // Creamos una instancia del pipe para usarlo en el componente.
    const currencyPipe = new CurrencyConverterPipe();
    return currencyPipe.transform(this.abcChartTotal, 'USD', this.selectedCurrency, this.EXCHANGE_RATE);
  }
  

  // ===== INICIO DE NUEVOS MÉTODOS =====

  /**
   * Carga la lista de todos los modelos (supercategorías)
   * para poblar el dropdown de pronóstico.
   */
  cargarModelosParaPronostico(): void {
    this.dashboardService.getModelosParaPronostico().subscribe({
      // ⭐️ 3. CORRECCIÓN DE TIPO (ANY):
      //    Añadimos tipos explícitos a 'data' y 'err'.
      next: (data: ModeloPronostico[]) => {
        this.modelosParaPronostico = data;
      },
      error: (err: any) => {
        console.error("Error al cargar la lista de modelos para pronóstico:", err);
      }
    });
  }

  /**
   * Se dispara al hacer clic en "Generar Pronóstico".
   * Llama al servicio con los valores seleccionados.
   */
  generarPronostico(): void {
    if (!this.modeloSeleccionado) {
      this.pronosticoError = "Por favor, seleccione un modelo para analizar.";
      return;
    }

    this.isPronosticoLoading = true;
    this.pronosticoError = null;
    this.pronosticoResumen = null;
    this.pronosticoGraficoData = [];

    // El valor de 'modeloSeleccionado' es un string "tipo-id", ej: "1-5"
    const [tipo, id] = this.modeloSeleccionado.split('-').map(Number);
    
    this.dashboardService.getPronosticoPorModelo(id, tipo, this.mesesHistorial).subscribe({
      next: (response: PronosticoResponse) => { // El tipo 'PronosticoResponse' aquí está bien
        this.pronosticoResumen = response.resumen;
        
        // Formateamos los datos del gráfico para ngx-charts
        this.pronosticoGraficoData = [
          {
            name: 'Demanda (Y)',
            series: response.grafico.filter(d => d.seriesName === 'Demanda (Y)')
          },
          {
            name: 'Pronóstico (Y\')',
            series: response.grafico.filter(d => d.seriesName === 'Pronóstico (Y\')')
          }
        ] as any; // Usamos 'as any' para ngx-charts

        this.isPronosticoLoading = false;
      },
      error: (err: any) => { // Añadimos tipo 'any' a 'err'
        console.error("Error al generar el pronóstico:", err);
        this.pronosticoError = "No se pudo generar el pronóstico. Revise la consola.";
        this.isPronosticoLoading = false;
      }
    });
  }

  // ===== INICIO DEL NUEVO MÉTODO DE DESCARGA =====

  /**
   * Llama al servicio para generar el reporte masivo y lo descarga como Excel.
   */
  descargarReportePronostico(): void {
    // 1. Mostrar notificación de carga
    const loadingSnackbar = this.snackBar.open('Generando reporte masivo de pronóstico... Esto puede tardar un momento.', 'Cerrar');
    this.isPronosticoLoading = true; // Reutilizamos el spinner de la tarjeta

    // 2. Llamar al servicio con los meses del input
    this.dashboardService.getReportePronosticoMasivo(this.mesesHistorial).subscribe({
      next: (data: ReportePronosticoMasivoItem[]) => {
        loadingSnackbar.dismiss();
        this.isPronosticoLoading = false;

        if (data.length === 0) {
          this.snackBar.open('No se generaron datos para el reporte.', 'Cerrar', { duration: 3000 });
          return;
        }

        // 3. Preparar y descargar el Excel
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
        
        // Ajustar anchos de columna
        ws['!cols'] = [
          { wch: 60 }, // NombreModelo
          { wch: 15 }, // StockActual
          { wch: 20 }, // DemandaPronosticada
          { wch: 40 }, // Recomendacion
          { wch: 15 }  // MesesAnalizados
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
  // ===== FIN DEL NUEVO MÉTODO DE DESCARGA =====
  // ===== FIN DE NUEVOS MÉTODOS =====
}