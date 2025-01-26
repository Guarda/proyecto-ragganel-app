import { ActivatedRoute, RouterModule } from '@angular/router';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, inject, Output, signal, ViewChild } from '@angular/core';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
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
    , MatSelectModule, MatButtonModule, MatIcon, FormsModule, MatFormFieldModule, MatChipsModule, MatDatepickerModule, MatNativeDateModule, MatButton, IndexListadoArticulosComponent],
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
    private fb: FormBuilder) {

  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['CodigoPedido'];
    this.OrderId = this.id;

    this.pedidoService.find(this.id).subscribe((data) => {
      this.pedido = data[0];
      console.log(data)
      this.OrderId = this.id;
      // Convertir fechas al formato correcto
      this.OrderCreationDate = this.parseDate(this.pedido.FechaCreacionPedido.toString());
      this.USAArrivalDate = this.parseDate(this.pedido.FechaArriboUSA.toString());
      this.NICArrivalDate = this.parseDate(this.pedido.FechaEstimadaRecepcion.toString());
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

      this.estadopedidoService.getAll().subscribe((data: EstadoPedido[]) => {
        this.selectedEstadoPedido = data;
      });

      this.tipoPedidoService.getAll().subscribe((data: TipoPedido[]) => {
        this.selectedTipoPedido = data;
      });

      this.sitiowebService.getAll().subscribe((data: SitioWeb[]) => {
        this.selectedSitioWeb = data;
      });

      // Suscríbete al servicio para obtener el subtotal
      this.sharedpedidoService.SubTotalArticulosPedido$.subscribe((total) => {
        this.OrderSubtotalAmount = total;
        // console.log(total);

        // Actualiza el valor del campo en el formulario
        this.pedidoForm.patchValue({ SubTotalArticulos: this.OrderSubtotalAmount });
      });


      // Obtener artículos y calcular el subtotal
      this.pedidoService.getArticlesbyOrderId(this.id).subscribe((data: Articulo[]) => {
        this.articulos = data;
        // console.log("Artículos del pedido:", this.articulos);

        // Calcular el subtotal de los artículos
        this.updateSubTotalArticulos();
      });

      //Initialize the form with the product data
      this.pedidoForm = this.fb.group({
        FechaCreacionPedido: [this.OrderCreationDate, Validators.required],
        FechaArrivoUSA: [this.USAArrivalDate, Validators.required],
        FechaEstimadaRecepcion: [this.NICArrivalDate, Validators.required],
        NumeroTracking1: [this.TrackingNumber1],
        NumeroTracking2: [this.TrackingNumber2],
        PesoPedido: [this.Weight],
        SitioWeb: [this.Website],
        // Moneda: [this.consoleCurrency]
        ViaPedido: [this.OrderType],
        SubTotalArticulos: [this.OrderSubtotalAmount],
        ShippingUSA: [this.ShippingUSA],
        Impuestos: [this.Taxes], // Add the parsed array here
        ShippingNic: [this.ShippingNIC],
        PrecioEstimadoDelPedido: [this.OrderTotalAmount],
        Estado: [this.OrderState],
        Comentarios: [this.Comments]
      });

      // Suscribirse a los cambios del formulario y actualizar el servicio
      this.pedidoForm.valueChanges.subscribe((values) => {
        this.sharedpedidoService.updateField('SubTotalArticulos', values.SubTotalArticulos);
        this.sharedpedidoService.updateField('Impuestos', values.Impuestos);
        this.sharedpedidoService.updateField('ShippingUSA', values.ShippingUSA);
        this.sharedpedidoService.updateField('ShippingNic', values.ShippingNic);
        this.calcularTotalPedido();
      });

    });



    this.ImagePath = this.getimagePath("");

    this.pedidoForm = this.fb.group({
      FechaCreacionPedido: new FormControl('', Validators.required),
      FechaArrivoUSA: new FormControl('', Validators.required),
      FechaEstimadaRecepcion: new FormControl('', Validators.required),
      NumeroTracking1: new FormControl('', Validators.required),
      NumeroTracking2: new FormControl(''),
      PesoPedido: new FormControl('', Validators.required),
      SitioWeb: new FormControl('', Validators.required),
      ViaPedido: new FormControl('', Validators.required),
      SubTotalArticulos: new FormControl(''),
      ShippingUSA: new FormControl(''),
      Impuestos: new FormControl(''),
      ShippingNic: new FormControl(''),
      PrecioEstimadoDelPedido: new FormControl(''),
      Estado: new FormControl(''),
      Comentarios: new FormControl(''),
    });


  }
  ngAfterViewInit(): void {
    // Sincroniza el total de artículos en el formulario
    this.pedidoForm.setValidators(this.validarArticulos.bind(this));
    this.calcularTotalPedido();
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
  onSubmit() {    // TODO: Use EventEmitter with form value 

    // Get values of the dates
    const fechaCreacionPedido = this.pedidoForm.get('FechaCreacionPedido')?.value;
    const fechaArrivoUSA = this.pedidoForm.get('FechaArrivoUSA')?.value;
    const fechaEstimadaRecepcion = this.pedidoForm.get('FechaEstimadaRecepcion')?.value;

    // Validation check: Ensure FechaArrivoUSA is not before FechaCreacionPedido
    if (fechaArrivoUSA && fechaCreacionPedido && fechaArrivoUSA < fechaCreacionPedido) {
      alert('Fecha Arrivo USA cannot be before Fecha Creacion Pedido');
      return;
    }

    // Validation check: Ensure FechaEstimadaRecepcion is not before FechaArrivoUSA or FechaCreacionPedido
    if (fechaEstimadaRecepcion && fechaCreacionPedido && fechaArrivoUSA &&
      fechaEstimadaRecepcion < fechaArrivoUSA) {
      alert('Fecha Estimada Recepcion cannot be before Fecha Arrivo USA');
      return;
    }

    // Validation check: Ensure FechaEstimadaRecepcion is not before FechaCreacionPedido
    if (fechaEstimadaRecepcion && fechaCreacionPedido && fechaEstimadaRecepcion < fechaCreacionPedido) {
      alert('Fecha Estimada Recepcion cannot be before Fecha Creacion Pedido');
      return;
    }



    const pedidoData = {
      ...this.pedidoForm.getRawValue(),
      articulos: this.listadoArticulos.dataToDisplay, // Aquí agregarías la lista de artículos.
    };

    // Convierte las fechas en formato ISO 8601 (con hora y zona horaria) a solo fecha
    const fechaCreacionPedidoFormatted = new Date(pedidoData.FechaCreacionPedido).toISOString().split('T')[0];
    const fechaArrivoUSAFormatted = new Date(pedidoData.FechaArrivoUSA).toISOString().split('T')[0];
    const fechaEstimadaRecepcionFormatted = new Date(pedidoData.FechaEstimadaRecepcion).toISOString().split('T')[0];

    // Actualiza los valores de las fechas en el objeto pedidoData
    pedidoData.FechaCreacionPedido = fechaCreacionPedidoFormatted;
    pedidoData.FechaArrivoUSA = fechaArrivoUSAFormatted;
    pedidoData.FechaEstimadaRecepcion = fechaEstimadaRecepcionFormatted;

    // Ahora envías los datos formateados al servicio
    console.log(pedidoData)
      // this.pedidoService.create(pedidoData).subscribe({


      //   next: (res: any) => {
      //     console.log('Respuesta del servicio:', res);
      //     // Manejar la respuesta, como mostrar un mensaje de éxito
      //     if (res.message) {
      //       alert(res.message);
      //     }
      //     // Emitir evento o navegar
      //     // this.Agregado.emit();
      //     // this.router.navigateByUrl('listado-accesorios');
      //   },
      //   error: (err: any) => {
      //     console.error('Error en la creación del pedido:', err);
      //     // Manejar el error, como mostrar un mensaje al usuario
      //     alert('Ocurrió un error al crear el pedido. Por favor, inténtelo de nuevo.');
      //   },
      //   complete: () => {
      //     console.log('Creación del pedido completada.');
      //   }
      // });

  }

}
