import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, inject, Output, signal, ViewChild } from '@angular/core';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule, NgFor } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
// import { PruebaComponent } from '../../prueba/prueba.component';
import { IndexListadoArticulosComponent } from '../listado-articulos/index-listado-articulos/index-listado-articulos.component';

import { CustomDateValidators } from '../../../utiles/customs/custom-date-validators';
import { PedidoFormGroup } from '../../interfaces/pedidoformgroup';
import { AbstractControl, ValidationErrors } from '@angular/forms';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { EstadoPedido } from '../../interfaces/estadopedido';
import { TipoPedido } from '../../interfaces/tipopedido';
import { SitioWeb } from '../../interfaces/sitioweb';

import { TipoPedidoService } from '../../../services/tipo-pedido.service';
import { EstadoPedidoService } from '../../../services/estado-pedido.service';
import { SitiowebPedidoService } from '../../../services/sitioweb-pedido.service';

import { SharedPedidoService } from '../../../services/shared-pedido.service';
import { PedidoService } from '../../../services/pedido.service';

import { ResultadoPedidoDialogComponent } from '../resultado-pedido-dialog/resultado-pedido-dialog.component';


@Component({
  selector: 'app-agregar-pedido',
  standalone: true,
  imports: [CommonModule, NgFor, ReactiveFormsModule, MatSelectModule, MatDialogModule, MatButtonModule,
    MatIcon, MatFormField, MatLabel, FormsModule, MatInputModule, MatFormFieldModule,
    MatChipsModule, MatDatepickerModule, MatNativeDateModule, MatHint, IndexListadoArticulosComponent, MatButton
  ],
  templateUrl: './agregar-pedido.component.html',
  styleUrl: './agregar-pedido.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]  // Add this line
})
export class AgregarPedidoComponent {
  @ViewChild(IndexListadoArticulosComponent, { static: false })
  listadoArticulos!: IndexListadoArticulosComponent; // Referencia al componente hijo

  readonly date = new FormControl(new Date());
  readonly serializedDate = new FormControl(new Date().toISOString());

  Agregado = new EventEmitter();
  pedidoForm!: FormGroup;
  totalPrecio1: number = 0;

  public ImagePath: any;

  selectedTipoPedido: TipoPedido[] = [];
  selectedEstadoPedido: EstadoPedido[] = [];
  selectedSitioWebPedido: SitioWeb[] = [];

  totalPedido: number = 0;

  constructor(
    private cdr: ChangeDetectorRef,
    private tipopedidos: TipoPedidoService,
    private estadopedidos: EstadoPedidoService,
    private sitioweb: SitiowebPedidoService,
    private router: Router,
    private fb: FormBuilder,
    private sharedPedidoService: SharedPedidoService,
    private pedidosService: PedidoService,
    private dialog: MatDialog
  ) {

  }

  ngOnInit(): void {

    this.pedidoForm = new FormGroup<PedidoFormGroup>({
      FechaCreacionPedido: new FormControl<Date | null>(new Date(), { nonNullable: true }),
      FechaArrivoUSA: new FormControl<Date | null>(null, { nonNullable: true }),
      FechaEstimadaRecepcion: new FormControl<Date | null>(null, { nonNullable: true }),
      NumeroTracking1: new FormControl<string | null>('', { nonNullable: true }),
      NumeroTracking2: new FormControl<string | null>(''),
      PesoPedido: new FormControl<number | null>(null),
      SitioWeb: new FormControl<string | null>('', { nonNullable: true }),
      ViaPedido: new FormControl<string | null>('', { nonNullable: true }),
      SubTotalArticulos: new FormControl<number | null>(null),
      ShippingUSA: new FormControl<number | null>(null),
      Impuestos: new FormControl<number | null>(null),
      ShippingNIC: new FormControl<number | null>(null),
      PrecioEstimadoDelPedido: new FormControl<number | null>(null),
      Estado: new FormControl<string | null>(''),
      Comentarios: new FormControl<string | null>('')
    }, {
      validators: CustomDateValidators.datesRelationship()
    }
    );
    this.ImagePath = this.getimagePath("");

    this.pedidoForm = this.fb.group({
      FechaCreacionPedido: [new Date()],
      FechaArrivoUSA: [null],
      FechaEstimadaRecepcion: [null],
      NumeroTracking1: [''],
      NumeroTracking2: [''],
      PesoPedido: [null],
      SitioWeb: [''],
      ViaPedido: [''],
      SubTotalArticulos: [0],
      ShippingUSA: [0],
      Impuestos: [0],
      ShippingNic: [0],
      PrecioEstimadoDelPedido: [{ value: 0, disabled: true }],
      Estado: [''],
      Comentarios: [''],
    });

    // Suscribirse a los cambios del formulario y actualizar el servicio
    this.pedidoForm.valueChanges.subscribe((values) => {
      this.sharedPedidoService.updateField('SubTotalArticulos', values.SubTotalArticulos);
      this.sharedPedidoService.updateField('Impuestos', values.Impuestos);
      this.sharedPedidoService.updateField('ShippingUSA', values.ShippingUSA);
      this.sharedPedidoService.updateField('ShippingNic', values.ShippingNic);
    });

    // Escuchar el total desde el servicio y actualizar el formulario
    this.pedidoForm.valueChanges.subscribe(() => {
      this.calcularTotalPedido();
    });

    // Suscríbete al servicio para obtener el subtotal
    this.sharedPedidoService.SubTotalArticulosPedido$.subscribe((total) => {
      this.totalPrecio1 = total;
      console.log("el subtotal es:", this.totalPrecio1);

      // Actualiza el valor del campo en el formulario
      this.pedidoForm.patchValue({ SubTotalArticulos: this.totalPrecio1 });
    });

    this.tipopedidos.getAll().subscribe((data: TipoPedido[]) => {
      //console.log(data);
      this.selectedTipoPedido = data;
    });

    // Establecer el estado inicial como "En espera" (Código 1)
    this.pedidoForm.get('Estado')?.setValue(1); // 1 corresponde a "En espera"


    this.estadopedidos.getAll().subscribe((data: EstadoPedido[]) => {
      //console.log(data);
      this.selectedEstadoPedido = data;
    });

    this.sitioweb.getAll().subscribe((data: SitioWeb[]) => {
      //console.log(data);
      this.selectedSitioWebPedido = data;
    });

  }

  ngAfterViewInit(): void {
    // Sincroniza el total de artículos en el formulario
    this.pedidoForm.setValidators(this.validarArticulos.bind(this));
  }

  validarArticulos(): { [key: string]: any } | null {
    const totalArticulos = this.listadoArticulos?.totalArticulos || 0;

    return totalArticulos > 0 ? null : { sinArticulos: 'Debe agregar al menos un artículo activo.' };
  }



  enforceTwoDecimals(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    const sanitizedValue = value.replace(/^0+(?!\.)/, '').match(/^\d*(\.\d{0,2})?/);
    input.value = sanitizedValue ? sanitizedValue[0] : '';
  }

  calcularTotalPedido(): void {
    const impuestos = this.pedidoForm.get('Impuestos')?.value || 0;
    const shippingUSA = this.pedidoForm.get('ShippingUSA')?.value || 0;
    const shippingNIC = this.pedidoForm.get('ShippingNic')?.value || 0;
    const subTotalArticulos = this.pedidoForm.get('SubTotalArticulos')?.value || 0;

    // Limitar cada campo a 2 decimales
    const impuestosRounded = parseFloat(impuestos.toFixed(2));
    const shippingUSARounded = parseFloat(shippingUSA.toFixed(2));
    const shippingNICRounded = parseFloat(shippingNIC.toFixed(2));

    // Recalcular el total
    const total = parseFloat((subTotalArticulos + impuestosRounded + shippingUSARounded + shippingNICRounded).toFixed(2));

    // Actualiza el total en el formulario
    this.pedidoForm.patchValue({ PrecioEstimadoDelPedido: total }, { emitEvent: false });
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
    // console.log(pedidoData)
    this.pedidosService.create(pedidoData).subscribe({
      next: (res: any) => {
        console.log('Respuesta del servicio:', res);

        // Datos para el diálogo
        const dialogData = {
          success: res.message ? true : false,
          message: res.message || 'Ocurrió un error al procesar el pedido.'
        };

        // Mostrar el diálogo con el resultado
        const dialogRef = this.dialog.open(ResultadoPedidoDialogComponent, {
          data: dialogData
        });
      },
      error: (err: any) => {
        console.error('Error en la creación del pedido:', err);
        const dialogData = {
          success: false,
          message: 'Ocurrió un error al crear el pedido. Por favor, inténtelo de nuevo.'
        };

        // Mostrar el diálogo en caso de error
        const dialogRef = this.dialog.open(ResultadoPedidoDialogComponent, {
          data: dialogData
        });
      },
      complete: () => {
        console.log('Creación del pedido completada.');
      }
    });

  }

}
