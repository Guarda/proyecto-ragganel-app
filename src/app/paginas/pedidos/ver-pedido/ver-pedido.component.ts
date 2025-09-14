import { ActivatedRoute, RouterModule } from '@angular/router';
import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, ViewChild } from '@angular/core';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { MatFormField, MatFormFieldModule, MatHint, MatLabel } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule, MatOption, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { merge, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

// --- Componentes y Servicios ---
import { SuccessdialogComponent } from '../../../UI/alerts/successdialog/successdialog.component';
import { DescargarExcelDialogComponent } from '../../../utiles/reportes/descargar-excel-dialog/descargar-excel-dialog.component';
import { IndexListadoArticulosComponent } from '../listado-articulos/index-listado-articulos/index-listado-articulos.component';
import { PedidoService } from '../../../services/pedido.service';
import { TipoPedidoService } from '../../../services/tipo-pedido.service';
import { SitiowebPedidoService } from '../../../services/sitioweb-pedido.service';
import { EstadoPedidoService } from '../../../services/estado-pedido.service';

// --- Interfaces ---
import { Pedido } from '../../interfaces/pedido';
import { Articulo } from '../../interfaces/articulo-pedido';
import { EstadoPedido } from '../../interfaces/estadopedido';
import { TipoPedido } from '../../interfaces/tipopedido';
import { SitioWeb } from '../../interfaces/sitioweb';


@Component({
  selector: 'app-ver-pedido',
  standalone: true,
  imports: [
    CommonModule, RouterModule, ReactiveFormsModule, FormsModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatButtonModule, MatIcon, MatChipsModule, MatDatepickerModule, MatNativeDateModule, MatDialogModule,
    IndexListadoArticulosComponent, SuccessdialogComponent, DescargarExcelDialogComponent
  ],
  templateUrl: './ver-pedido.component.html',
  styleUrl: './ver-pedido.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class VerPedidoComponent implements OnInit {
  @ViewChild(IndexListadoArticulosComponent) listadoArticulos!: IndexListadoArticulosComponent;

  pedidoForm!: FormGroup;
  articulos: Articulo[] = [];
  OrderId!: string;
  ImagePath: string;
  isLoading = true; // Para saber cuándo mostrar los datos

  selectedEstadoPedido: EstadoPedido[] = [];
  selectedTipoPedido: TipoPedido[] = [];
  selectedSitioWeb: SitioWeb[] = [];

  private formChangesSubscription!: Subscription;

  constructor(
    private pedidoService: PedidoService,
    private tipoPedidoService: TipoPedidoService,
    private sitiowebService: SitiowebPedidoService,
    private estadopedidoService: EstadoPedidoService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.ImagePath = this.getimagePath(null);
  }

  ngOnInit(): void {
    this.initForm(); // Inicializa el form vacío
    this.OrderId = this.route.snapshot.params['CodigoPedido'];

    // Carga los datos de los dropdowns
    this.loadSelectData();

    // Carga los datos principales del pedido
    this.loadPedidoData();
  }

  private initForm(): void {
    this.pedidoForm = this.fb.group({
      CodigoPedido: [''],
      FechaCreacionPedido: [null, Validators.required],
      FechaArriboUSA: [null, Validators.required],
      FechaEstimadaRecepcion: [null, Validators.required],
      NumeroTracking1: [''],
      NumeroTracking2: [''],
      PesoPedido: [null],
      SitioWeb: ['', Validators.required],
      // Deshabilitamos campos que no deberían cambiar en la vista de "ver/editar"
      ViaPedido: [{ value: '', disabled: true }, Validators.required],
      Estado: [{ value: '', disabled: true }, Validators.required],
      Comentarios: ['', Validators.maxLength(2000)],
      // Campos de costos
      SubTotalArticulos: [{ value: 0, disabled: true }],
      Impuestos: [0],
      ShippingUSA: [0],
      ShippingNic: [0],
      PrecioEstimadoDelPedido: [{ value: 0, disabled: true }],
      Activo: [1]
    });
  }

  private parseDDMMYYYY(dateString: string): Date | null {
    if (!dateString || typeof dateString !== 'string') {
      return null;
    }
    const parts = dateString.split('/');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // El mes en JS es 0-indexado
      const year = parseInt(parts[2], 10);
      // Validar que los componentes son números válidos
      if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
        return new Date(year, month, day);
      }
    }
    return null; // Retorna null si el formato es incorrecto
  }

  private loadPedidoData(): void {
    this.pedidoService.find(this.OrderId).subscribe((data: Pedido[]) => {
      const pedido = data[0];
      if (!pedido) {
        // Manejar el caso de que el pedido no se encuentre
        this.router.navigate(['/home/listado-pedidos']);
        return;
      }

      // ===== CORRECCIÓN AQUÍ: Usamos un patchValue explícito y el parser de fechas =====
      this.pedidoForm.patchValue({
        CodigoPedido: pedido.CodigoPedido,
        FechaCreacionPedido: typeof pedido.FechaCreacionPedido === 'string' ? this.parseDDMMYYYY(pedido.FechaCreacionPedido) : null,
        FechaArriboUSA: typeof pedido.FechaArriboUSA === 'string' ? this.parseDDMMYYYY(pedido.FechaArriboUSA) : null,
        FechaEstimadaRecepcion: typeof pedido.FechaEstimadaRecepcion === 'string' ? this.parseDDMMYYYY(pedido.FechaEstimadaRecepcion) : null,
        NumeroTracking1: pedido.NumeroTracking1,
        NumeroTracking2: pedido.NumeroTracking2,
        PesoPedido: pedido.PesoPedido,
        SitioWeb: pedido.SitioWeb,
        ViaPedido: pedido.ViaPedido,
        Estado: pedido.Estado,
        Comentarios: pedido.Comentarios,
        SubTotalArticulos: pedido.SubTotalArticulos,
        Impuestos: pedido.Impuestos,
        ShippingUSA: pedido.ShippingUSA,
        ShippingNic: pedido.ShippingNIC, // Mapeo explícito desde la llave del JSON
        PrecioEstimadoDelPedido: pedido.PrecioEstimadoDelPedido,
        Activo: pedido.Activo
      });

      // Cargar artículos asociados al pedido
      this.pedidoService.getArticlesbyOrderId(this.OrderId).subscribe((articulosData: Articulo[]) => {
        this.articulos = articulosData;
        this.updateSubTotalArticulos(); // Esto recalculará el subtotal y el total general
      });

      // Una vez que el formulario está poblado, escucha los cambios para recalcular el total
      this.subscribeToFormChanges();

      this.isLoading = false; // Datos cargados, se puede mostrar el form
    });
  }

  private loadSelectData(): void {
    this.tipoPedidoService.getAll().subscribe(data => this.selectedTipoPedido = data);
    this.estadopedidoService.getAll().subscribe(data => this.selectedEstadoPedido = data);
    this.sitiowebService.getAll().subscribe(data => this.selectedSitioWeb = data);
  }

  private subscribeToFormChanges(): void {
    const impuestos$ = this.pedidoForm.get('Impuestos')!.valueChanges;
    const shippingUSA$ = this.pedidoForm.get('ShippingUSA')!.valueChanges;
    const shippingNic$ = this.pedidoForm.get('ShippingNic')!.valueChanges;

    this.formChangesSubscription = merge(impuestos$, shippingUSA$, shippingNic$)
      .pipe(debounceTime(400))
      .subscribe(() => {
        this.calcularTotalPedido();
      });
  }

  // NUEVO: Este método será llamado por el evento en el HTML
  public actualizarSubtotalDesdeHijo(nuevoSubtotal: number): void {
    // 1. Asigna el valor recibido al campo del formulario
    this.pedidoForm.patchValue({ SubTotalArticulos: nuevoSubtotal });
    
    // 2. Llama a la función que calcula el total general del pedido
    this.calcularTotalPedido();

    // 3. Se marca el formulario como 'dirty' manualmente para habilitar el botón de guardar.
    this.pedidoForm.markAsDirty();
  }

  // Este método que ya tenías ahora no es llamado directamente desde el HTML, sino por el de arriba
  updateSubTotalArticulos(): void {
    const subtotal = this.articulos.reduce((total, articulo) => {
      return total + (articulo.Activo === 1 ? (articulo.Precio * articulo.Cantidad) : 0);
    }, 0);
    
    this.pedidoForm.patchValue({ SubTotalArticulos: subtotal });
    this.calcularTotalPedido();
  }

  calcularTotalPedido(): void {
    const formValues = this.pedidoForm.getRawValue();

    const subtotal = parseFloat(formValues.SubTotalArticulos) || 0;
    const impuestos = parseFloat(formValues.Impuestos) || 0;
    const shippingUSA = parseFloat(formValues.ShippingUSA) || 0;
    const shippingNic = parseFloat(formValues.ShippingNic) || 0;

    const total = subtotal + impuestos + shippingUSA + shippingNic;

    this.pedidoForm.patchValue({
      PrecioEstimadoDelPedido: total.toFixed(2)
    }, { emitEvent: false }); // Evita un bucle infinito de re-cálculo
  }

  // ... (El resto de tus métodos como enforceTwoDecimals, adjustTextareaHeight, dateFilter, etc. van aquí sin cambios)

  enforceTwoDecimals(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;
    value = value.replace(/[^0-9.]/g, '');
    const parts = value.split('.');
    if (parts.length > 2) {
      value = parts[0] + '.' + parts.slice(1).join('');
    }
    if (parts[1] && parts[1].length > 2) {
      value = parts[0] + '.' + parts[1].substring(0, 2);
    }
    input.value = value;
  }

  adjustTextareaHeight(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

  dateFilter = (d: Date | null): boolean => {
    const date = d || new Date();
    const fechaCreacion = this.pedidoForm.get('FechaCreacionPedido')?.value;
    if (!fechaCreacion) return true;
    return date.getTime() >= new Date(fechaCreacion).getTime();
  };

  getimagePath(l: string | null): string {
    const baseUrl = 'http://localhost:3000';
    return l ? `${baseUrl}/img-accesorios/${l}` : `${baseUrl}/img-accesorios/GameCube_controller-1731775589376.png`;
  }

  onCancel(): void {
    this.router.navigate(['/home/listado-pedidos']);
  }

  onSubmit(): void {
    if (this.pedidoForm.invalid) {
      this.pedidoForm.markAllAsTouched();
      return;
    }

    // getRawValue() obtiene todos los valores, incluidos los deshabilitados
    const pedidoData = this.pedidoForm.getRawValue();

    // Formatear fechas
    pedidoData.FechaCreacionPedido = new Date(pedidoData.FechaCreacionPedido).toISOString().split('T')[0];
    pedidoData.FechaArriboUSA = new Date(pedidoData.FechaArriboUSA).toISOString().split('T')[0];
    pedidoData.FechaEstimadaRecepcion = new Date(pedidoData.FechaEstimadaRecepcion).toISOString().split('T')[0];

    // Adjuntar la lista de artículos actualizados del componente hijo
    pedidoData.articulos = this.listadoArticulos.dataToDisplay;

    // Llamada unificada al servicio de actualización
    this.pedidoService.update(pedidoData).subscribe({
      next: (res: any) => {
        if (res.message) {
          this.dialog.open(SuccessdialogComponent);
          this.pedidoForm.markAsPristine(); // Marcar como no modificado después de guardar
        }
      },
      error: (err: any) => {
        console.error('Error en la actualización del pedido:', err);
        alert('Ocurrió un error al actualizar el pedido.');
      }
    });
  }

  descargarReporte(): void {
    // Asumimos que tienes un método en tu servicio para llamar al nuevo endpoint.
    // Si no, deberías añadirlo: getReporteIngreso(id: string): Observable<any>
    this.pedidoService.getReporteIngreso(this.OrderId).subscribe({
        next: (response) => {
            console.log("Respuesta del reporte:", response);
            if (response && response.length > 0 && response[0].Resultado) {
                let resultadoData;
                try {
                    resultadoData = JSON.parse(response[0].Resultado);
                } catch (e) {
                    console.error("Error al parsear JSON del reporte", e);
                    resultadoData = response[0].Resultado; // Fallback
                }

                if (resultadoData && resultadoData.codigosIngresados) {
                    this.dialog.open(DescargarExcelDialogComponent, {
                        width: '450px',
                        data: {
                            codigosGenerados: resultadoData.codigosIngresados,
                            cantidades: resultadoData.cantidades,
                            orderId: this.OrderId
                        }
                    });
                } else {
                    alert('No se encontraron datos de códigos para generar el reporte.');
                }
            } else {
                alert('No se pudo generar el reporte para este pedido.');
            }
        },
        error: (err) => {
            console.error("Error al descargar el reporte:", err);
            alert('Ocurrió un error al intentar generar el reporte.');
        }
    });
  }

  ngOnDestroy(): void {
    if (this.formChangesSubscription) {
      this.formChangesSubscription.unsubscribe();
    }
  }
}