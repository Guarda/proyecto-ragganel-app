import { ActivatedRoute, RouterModule } from '@angular/router';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, inject, Output, signal, ViewChild } from '@angular/core';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { AbstractControl, FormBuilder, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule, MatOption, MatOptionModule } from '@angular/material/core';

import { SuccessdialogComponent } from '../../../UI/alerts/successdialog/successdialog.component';


import { Pedido } from '../../interfaces/pedido';
import { PedidoService } from '../../../services/pedido.service';

import { TipoPedido } from '../../interfaces/tipopedido';
import { TipoPedidoService } from '../../../services/tipo-pedido.service';

import { SitioWeb } from '../../interfaces/sitioweb';
import { SitiowebPedidoService } from '../../../services/sitioweb-pedido.service';

import { EstadoPedido } from '../../interfaces/estadopedido';
import { EstadoPedidoService } from '../../../services/estado-pedido.service';
import { MatDatepickerModule, MatDateSelectionModel } from '@angular/material/datepicker';
import { IndexListadoArticulosComponent } from '../listado-articulos/index-listado-articulos/index-listado-articulos.component';
import { Articulo } from '../../interfaces/articulo-pedido';
import { SharedPedidoService } from '../../../services/shared-pedido.service';



@Component({
  selector: 'app-ver-pedido',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, FormsModule, MatFormField, MatLabel, NgFor, NgIf, MatOption, MatInputModule, MatOptionModule
    , MatSelectModule, MatButtonModule, MatIcon, FormsModule, MatFormFieldModule, MatChipsModule, MatDatepickerModule, MatNativeDateModule, 
    MatButton, IndexListadoArticulosComponent, SuccessdialogComponent, MatDialogModule],
  templateUrl: './ver-pedido.component.html',
  styleUrl: './ver-pedido.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]  // Add this line
})
export class VerPedidoComponent {
  @ViewChild(IndexListadoArticulosComponent) listadoArticulos!: IndexListadoArticulosComponent;
  pedido!: Pedido;
  pedidoForm!: FormGroup;

  public ImagePath: any;
  public articulos: Articulo[] = [];

  id!: any;

  public OrderId: any;
  public OrderCreationDate: any;
  public USAArrivalDate: any;
  public NICArrivalDate: any;
  public TrackingNumber1: any;
  public TrackingNumber2: any;
  public Website: any;
  public OrderType: any;
  public OrderState: any;
  public OrderTotalAmount: any;
  public Comments: any;
  public Weight: any;
  public OrderSubtotalAmount: any;
  public Taxes: any;
  public ShippingUSA: any;
  public ShippingNIC: any;
  public Active: any;

  selectedEstadoPedido: EstadoPedido[] = [];
  selectedTipoPedido: TipoPedido[] = [];
  selectedSitioWeb: SitioWeb[] = [];

  constructor(
    public pedidoService: PedidoService,
    public tipoPedidoService: TipoPedidoService,
    public sitiowebService: SitiowebPedidoService,
    public estadopedidoService: EstadoPedidoService,
    public sharedpedidoService: SharedPedidoService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    public dialog: MatDialog) {

  }

  ngOnInit(): void {
  this.id = this.route.snapshot.params['CodigoPedido'];
  this.OrderId = this.id;

  this.pedidoService.find(this.id).subscribe((data) => {
    this.pedido = data[0];
    console.log(data);
    this.OrderId = this.id;

    // ===== CORRECCIÓN 1: Manejo seguro de fechas nulas =====
    this.OrderCreationDate = this.pedido.FechaCreacionPedido ? this.parseDate(this.pedido.FechaCreacionPedido.toString()) : null;
    this.USAArrivalDate = this.pedido.FechaArriboUSA ? this.parseDate(this.pedido.FechaArriboUSA.toString()) : null;
    this.NICArrivalDate = this.pedido.FechaEstimadaRecepcion ? this.parseDate(this.pedido.FechaEstimadaRecepcion.toString()) : null;
    // =========================================================

    this.TrackingNumber1 = this.pedido.NumeroTracking1;
    this.TrackingNumber2 = this.pedido.NumeroTracking2;
    this.Website = this.pedido.SitioWeb;
    this.OrderType = this.pedido.ViaPedido;
    this.OrderState = this.pedido.Estado;
    this.OrderTotalAmount = this.pedido.PrecioEstimadoDelPedido;
    this.Comments = this.pedido.Comentarios;
    this.Weight = this.pedido.PesoPedido;
    this.OrderSubtotalAmount = this.pedido.SubTotalArticulos;
    this.Taxes = this.pedido.Impuestos;
    this.ShippingUSA = this.pedido.ShippingUSA;
    this.ShippingNIC = this.pedido.ShippingNIC;
    this.Active = this.pedido.Activo;

    this.estadopedidoService.getAll().subscribe((data: EstadoPedido[]) => {
      this.selectedEstadoPedido = data;
    });

    this.tipoPedidoService.getAll().subscribe((data: TipoPedido[]) => {
      this.selectedTipoPedido = data;
    });

    this.sitiowebService.getAll().subscribe((data: SitioWeb[]) => {
      this.selectedSitioWeb = data;
    });

    this.sharedpedidoService.SubTotalArticulosPedido$.subscribe((total) => {
      this.OrderSubtotalAmount = total;
      this.pedidoForm.patchValue({ SubTotalArticulos: this.OrderSubtotalAmount });
    });

    this.pedidoService.getArticlesbyOrderId(this.id).subscribe((data: Articulo[]) => {
      this.articulos = data;
      this.updateSubTotalArticulos();
    });

    // Inicializamos el formulario CON los datos del pedido
    this.pedidoForm = this.fb.group({
      CodigoPedido: [this.OrderId],
      FechaCreacionPedido: [this.OrderCreationDate, Validators.required],
      FechaArrivoUSA: [this.USAArrivalDate, Validators.required],
      FechaEstimadaRecepcion: [this.NICArrivalDate, Validators.required],
      NumeroTracking1: [this.TrackingNumber1],
      NumeroTracking2: [this.TrackingNumber2],
      PesoPedido: [this.Weight],
      SitioWeb: [this.Website],
      ViaPedido: [this.OrderType],
      SubTotalArticulos: [this.OrderSubtotalAmount],
      ShippingUSA: [this.ShippingUSA],
      Impuestos: [this.Taxes],
      ShippingNic: [this.ShippingNIC],
      PrecioEstimadoDelPedido: [this.OrderTotalAmount],
      Estado: [this.OrderState],
      Comentarios: [this.Comments],
      Activo: [this.Active]
    });

    this.pedidoForm.valueChanges.subscribe((values) => {
      this.sharedpedidoService.updateField('SubTotalArticulos', values.SubTotalArticulos);
      this.sharedpedidoService.updateField('Impuestos', values.Impuestos);
      this.sharedpedidoService.updateField('ShippingUSA', values.ShippingUSA);
      this.sharedpedidoService.updateField('ShippingNic', values.ShippingNic);
      this.calcularTotalPedido();
    });

  });

  this.ImagePath = this.getimagePath("");

  // ===== CORRECCIÓN 2: ELIMINAR ESTE BLOQUE COMPLETO =====
  // Se elimina la segunda inicialización del formulario que borraba los datos.
  // ========================================================
  
  this.cdr.detectChanges();
}
  ngAfterViewInit(): void {
    // Sincroniza el total de artículos en el formulario
    this.pedidoForm.setValidators(this.validarArticulos.bind(this));
    this.calcularTotalPedido();
    this.cdr.detectChanges();
  }

  private parseDate(input: string): Date {
    const [day, month, year] = input.split('/').map(Number); // Divide y convierte a números
    return new Date(year, month - 1, day); // Los meses son base 0 en JavaScript
  }

  validarArticulos(): { [key: string]: any } | null {
    const totalArticulos = this.listadoArticulos?.totalArticulos || 0;
    return totalArticulos > 0 ? null : { sinArticulos: 'Debe agregar al menos un artículo.' };
  }


  updateSubTotalArticulos(): void {
    this.OrderSubtotalAmount = this.articulos.reduce((total, articulo) => {
      return total + (articulo.Precio * articulo.Cantidad);
    }, 0);
    // Actualizar el valor en el formulario
    this.pedidoForm.patchValue({
      SubTotalArticulos: this.OrderSubtotalAmount
    });

    // Ahora recalculamos el total del pedido
    // this.calcularTotalPedido();
  }


  calcularTotalPedido(): void {
    console.log('AAAAAAAAAAAAA')
    const impuestos = this.pedidoForm.get('Impuestos')?.value || 0;
    const shippingUSA = this.pedidoForm.get('ShippingUSA')?.value || 0;
    const shippingNIC = this.pedidoForm.get('ShippingNic')?.value || 0;
    const subTotalArticulos = this.pedidoForm.get('SubTotalArticulos')?.value || 0;

    // Limitar cada campo a 2 decimales
    const impuestosRounded = parseFloat(impuestos.toFixed(2));
    const shippingUSARounded = parseFloat(shippingUSA.toFixed(2));
    const shippingNICRounded = parseFloat(shippingNIC.toFixed(2));

    // Recalcular el total
    this.OrderTotalAmount = parseFloat((subTotalArticulos + impuestosRounded + shippingUSARounded + shippingNICRounded).toFixed(2));

    // Actualiza el total en el formulario
    console.log("total del pedido: ", this.OrderTotalAmount)
    this.pedidoForm.patchValue({ PrecioEstimadoDelPedido: this.OrderTotalAmount }, { emitEvent: false });
  }

  adjustTextareaHeight(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto'; // Resetea la altura para recalcular
    textarea.style.height = `${textarea.scrollHeight}px`; // Ajusta a la altura del contenido
    // Seleccionamos el mat-form-field que envuelve al textarea
    const matFormField = textarea.closest('.mat-form-field') as HTMLElement | null;

    if (matFormField) {
      // Obtenemos el mat-hint dentro del mat-form-field
      const matHint = matFormField.querySelector('.mat-hint') as HTMLElement | null;

      // Restablecemos la altura del textarea para recalcularla
      textarea.style.height = 'auto';

      // Calculamos la altura máxima disponible para el textarea, restando la altura del mat-hint
      const matHintHeight = matHint ? matHint.offsetHeight : 0; // Altura del contador de caracteres
      const availableHeight = matFormField.offsetHeight - matHintHeight - 20; // Resta un margen de seguridad

      // Ajustamos la altura del textarea según su contenido pero respetando la altura máxima disponible
      const newHeight = Math.min(textarea.scrollHeight, availableHeight);
      textarea.style.height = `${newHeight}px`;
    }
  }

  enforceTwoDecimals(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    const sanitizedValue = value.replace(/^0+(?!\.)/, '').match(/^\d*(\.\d{0,2})?/);
    input.value = sanitizedValue ? sanitizedValue[0] : '';
  }
  // Custom filter to disable dates that are not allowed
  dateFilter = (date: Date | null): boolean => {
    const fechaCreacionPedido = this.pedidoForm.get('FechaCreacionPedido')?.value;

    if (!fechaCreacionPedido || !date) return true; // Allow all dates before FechaCreacionPedido is set

    // Disable dates before FechaCreacionPedido
    return date >= fechaCreacionPedido;
  };

  getimagePath(l: string | null) {
    const baseUrl = 'http://localhost:3000'; // Updated to match the Express server port

    if (l == null || l === '') {
      return `${baseUrl}/img-accesorios/GameCube_controller-1731775589376.png`;//agregar imagen del tipo de pedido
    } else {
      return `${baseUrl}/img-accesorios/${l}`;
    }
  }

  fechaValidator(control: AbstractControl): ValidationErrors | null {
    const fechaCreacionPedido = control.get('FechaCreacionPedido')?.value;
    const fechaArrivoUSA = control.get('FechaArrivoUSA')?.value;
    const fechaEstimadaRecepcion = control.get('FechaEstimadaRecepcion')?.value;

    // Ensure FechaArrivoUSA is not before FechaCreacionPedido
    if (fechaArrivoUSA && fechaCreacionPedido && fechaArrivoUSA < fechaCreacionPedido) {
      return { invalidFechaArrivoUSA: 'Fecha Arrivo USA no puede ser antes de Fecha Creación Pedido' };
    }

    // Ensure FechaEstimadaRecepcion is not before FechaCreacionPedido or FechaArrivoUSA
    if (
      fechaEstimadaRecepcion &&
      (fechaEstimadaRecepcion < fechaCreacionPedido || fechaEstimadaRecepcion < fechaArrivoUSA)
    ) {
      return { invalidFechaEstimadaRecepcion: 'Fecha Estimada Recepción no puede ser antes de Fecha Arrivo USA o Fecha Creación Pedido' };
    }

    return null; // No errors
  }


  onCancel(): void {
    // Navega de regreso al listado de pedidos
    this.router.navigate(['listado-pedidos']);
  }
  onSubmit() {
    const fechaCreacionPedido = this.pedidoForm.get('FechaCreacionPedido')?.value;
    const fechaArrivoUSA = this.pedidoForm.get('FechaArrivoUSA')?.value;
    const fechaEstimadaRecepcion = this.pedidoForm.get('FechaEstimadaRecepcion')?.value;
  
    // Validation checks
    if (fechaArrivoUSA && fechaCreacionPedido && fechaArrivoUSA < fechaCreacionPedido) {
      alert('Fecha Arrivo USA cannot be before Fecha Creacion Pedido');
      return;
    }
  
    if (fechaEstimadaRecepcion && fechaCreacionPedido && fechaArrivoUSA &&
      fechaEstimadaRecepcion < fechaArrivoUSA) {
      alert('Fecha Estimada Recepcion cannot be before Fecha Arrivo USA');
      return;
    }
  
    if (fechaEstimadaRecepcion && fechaCreacionPedido && fechaEstimadaRecepcion < fechaCreacionPedido) {
      alert('Fecha Estimada Recepcion cannot be before Fecha Creacion Pedido');
      return;
    }
  
    const pedidoData = this.pedidoForm.getRawValue();
    console.log('pedidoData:', pedidoData);
  
    const pedidoData1 = {
      ...this.pedidoForm.getRawValue(),
      articulos: this.listadoArticulos.dataToDisplay,
    };
  
    const fechaCreacionPedidoFormatted = new Date(pedidoData.FechaCreacionPedido).toISOString().split('T')[0];
    const fechaArrivoUSAFormatted = new Date(pedidoData.FechaArrivoUSA).toISOString().split('T')[0];
    const fechaEstimadaRecepcionFormatted = new Date(pedidoData.FechaEstimadaRecepcion).toISOString().split('T')[0];
  
    pedidoData.FechaCreacionPedido = fechaCreacionPedidoFormatted;
    pedidoData.FechaArrivoUSA = fechaArrivoUSAFormatted;
    pedidoData.FechaEstimadaRecepcion = fechaEstimadaRecepcionFormatted;
  
    const articulos = this.articulos;
    if (articulos && articulos.length > 0) {
      pedidoData.articulos = articulos;
    } else {
      console.log("No articles to update");
    }
  
    this.pedidoService.update(pedidoData).subscribe({
      next: (res: any) => {
        console.log('Respuesta del servicio:', res);
        if (res.message) {
          this.dialog.open(SuccessdialogComponent); // Mostrar el diálogo de éxito
        }
      },
      error: (err: any) => {
        console.error('Error en la creación del pedido:', err);
        alert('Ocurrió un error al crear el pedido. Por favor, inténtelo de nuevo.');
      },
      complete: () => {
        console.log('Creación del pedido completada.');
      }
    });
  
    if (pedidoData1 && pedidoData1.articulos.length > 0) {
      console.log("Actualizando artículos: ", pedidoData1);
      this.pedidoService.updateArticulos(pedidoData1).subscribe({
        next: (res: any) => {
          console.log('Respuesta de la actualización de artículos:', res);
        },
        error: (err: any) => {
          console.error('Error al actualizar los artículos:', err);
          alert('Ocurrió un error al actualizar los artículos. Por favor, inténtelo de nuevo.');
        }
      });
    }
  }
  

}
